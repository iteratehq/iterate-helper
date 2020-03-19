(function() {
  console.log(document);
  const iframe = window.document.getElementById("iterate-iframe");
  console.log(iframe);
  if (iframe == null) {
    return;
  }

  const iframeWindow = iframe.contentWindow;
  if (iframeWindow == null) {
    return;
  }

  //const window = console.log("hey");
})();
