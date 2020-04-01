(function() {
  var iframe;
  var iframeWindow;

  const targetiFrameUrl = 'https://{{COMPANY}}.static-iteratehq.com';

  // Show the iframe, and position it in one of the four corners of the screen
  function show(data) {
    iframe.style.display = 'block';
    iframe.style.position = 'fixed';
    iframe.style.top = data.top !== undefined ? data.top : 'auto';
    iframe.style.bottom = data.bottom !== undefined ? data.bottom : 'auto';
    iframe.style.left = data.left !== undefined ? data.left : 'auto';
    iframe.style.right = data.right !== undefined ? data.right : 'auto';
  }

  function hide() {
    iframe.style.display = 'none';
  }

  // Resize the iframe (after an optional delay to allow for transition animations to finish)
  function resize(data) {
    setTimeout(function() {
      iframe.style.height = data.height !== undefined ? data.height : iframe.style.height;
      iframe.style.width = data.width !== undefined ? data.width : iframe.style.width;
    }, data.delay || 0);
  }

  function onInitContainerLoaded() {
    // Forward any pending commands from the queue into the iframe and replace the queue
    // with a function that forwards commands directly into the frame.
    // We wait until the INIT_CONTAINER_LOADED event has fired so we know that the
    // command center within embed is ready for commands.
    window.Iterate.queue.forEach(function(command) {
      sendCommand(command);
    });
    window.Iterate = function() {
      sendCommand(arguments);
    };

    // Set the current URL (used for URL based targeting)
    Iterate('url', window.location.href);

    // Now that all commands have been processed, we can call 'install'
    // which will request a survey (the initial requiest for a survey is delayed
    // since we set installOnLoad to false within the iframe to give us time to
    // execute any pending commands).
    window.Iterate('install');
  }

  // Forward an Iterate(...) command into the iframe to be executed
  function sendCommand(args) {
    var args = Array.prototype.slice.call(args);
    iframeWindow.postMessage(
      {
        type: 'COMMAND',
        arguments: args,
      },
      targetiFrameUrl
    );
  }

  function receiveMessage(event) {
    if (event.origin !== targetiFrameUrl) {
      return;
    }

    if (event === undefined || event === null || typeof event.data !== 'object' || event.data === null) {
      return;
    }

    var data = event.data.data;

    switch (event.data.type) {
      case 'HIDE_IFRAME':
        hide();
        break;
      case 'SHOW_IFRAME':
        show(data);
        break;
      case 'RESIZE_IFRAME':
        resize(data);
        break;
      case 'INIT_CONTAINER_LOADED':
        onInitContainerLoaded();
        break;
      default:
        return;
    }
  }

  function init() {
    iframe = window.document.getElementById('iterate-iframe');
    if (iframe == null) {
      return;
    }

    iframeWindow = iframe.contentWindow;
    if (iframeWindow == null) {
      return;
    }

    window.addEventListener('message', receiveMessage, false);
  }

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

  // Wait until the page has loaded before initializing, to ensure that the iframe is on the page
  if (window.document.readyState === 'complete') {
    init();
  } else if (window.attachEvent) {
    window.attachEvent('onload', init);
  } else {
    window.addEventListener('load', init, false);
  }
})();
