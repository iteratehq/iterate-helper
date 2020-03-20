(function() {
  var iframeWindow;

  // Set the Iterate global object to a queue that collects commands until the
  // iframe loads and the commands are forwarded into it.
  var IterateCommandQueue = function() {
    IterateCommandQueue.appendCommand(arguments);
  };
  IterateCommandQueue.queue = [];
  IterateCommandQueue.appendCommand = function(args) {
    IterateCommandQueue.queue.push(args);
  };
  window.Iterate = IterateCommandQueue;

  function receiveMessage(event) {
    // TODO: uncomment this when we deploy the script
    // if (event.origin !== 'https://iteratehq.com') {
    //   return;
    // }

    if (event === undefined || event === null || typeof event.data !== 'object' || event.data === null) {
      return;
    }

    switch (event.data.type) {
      case 'RESIZE_IFRAME':
        console.log('Resize iframe');
        break;
      default:
        return;
    }
  }

  // Forward an Iterate(...) command into the iframe to be executed
  function sendCommand(args) {
    // TODO: Set the targetOrigin from * to the URL of the iframe and determine how to make this work in dev
    var args = Array.prototype.slice.call(args);
    iframeWindow.postMessage(
      {
        type: 'COMMAND',
        arguments: args,
      },
      '*'
    );
  }

  function init() {
    var iframe = window.document.getElementById('iterate-iframe');
    if (iframe == null) {
      return;
    }

    iframeWindow = iframe.contentWindow;
    if (iframeWindow == null) {
      return;
    }

    window.addEventListener('message', receiveMessage, false);

    // Forward any pending commands from the queue into the iframe and replace the queue
    // with a function that forwards commands directly into the frame
    window.Iterate.queue.forEach(function(command) {
      sendCommand(command);
    });
    window.Iterate = function() {
      sendCommand(arguments);
    };
  }

  // Wait until the page has loaded before initializing, to ensure that the iframe is on the page
  if (window.document.readyState === 'complete') {
    init();
  } else if (window.attachEvent) {
    window.attachEvent('onload', init);
  } else {
    window.addEventListener('load', init, false);
  }
})();
