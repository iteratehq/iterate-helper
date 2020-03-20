(function() {
  var iframeWindow;

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
