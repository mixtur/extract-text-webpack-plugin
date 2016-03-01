function forceRedraw(element) {
    var n = document.createTextNode(' ');
    var visibility = element.style.visibility; 
    element.appendChild(n);
    element.style.visibility = 'hidden';
    setTimeout(function(){
        element.style.visibility = visibility;
        n.parentNode.removeChild(n);
    }, 20);
}

var replaceStylesheet = debounce(function (styleSheet, url) {
  // Wait until the extract module is complete
  styleSheet.href = url;
  setTimeout(function() {
    console.log('[HMR]', 'Reload css: ', url);
    forceRedraw(document.body);
  }, 100);
}, 300);

function debounce(f, t) {
  var canCall = false;
  var timeout = null;
  return function () {
    var _this = this;
    var _args = arguments;

    timeout && clearTimeout(timeout);
    timeout = setTimeout(function () {
      f.apply(_this, _args);
      timeout = null;
    }, t);
  };
}

var url = require('url');
module.exports = function(compilationHash, port, publicPath, outputFilename) {
  if (document) {
    var styleSheets = document.getElementsByTagName('link');
    for (var i = 0; i < styleSheets.length; i++) {
      if (!styleSheets[i].href) continue;
      var hrefUrl = styleSheets[i].href.split('?');
      var href = hrefUrl[0];
      var hash = hrefUrl[1];

      var assetsHost = document.location.origin;
      if (port) {
        var parsedOrigin = url.parse(document.location.origin);
        var hostName = parsedOrigin.host.split(':')[0];
        parsedOrigin.host = hostName + ':' + port;

        assetsHost = url.format(parsedOrigin);
        if (assetsHost.slice(-1) === '/') {
          assetsHost = assetsHost.slice(0, -1);
        }
      }

      if (hash !== compilationHash && href === assetsHost + publicPath + outputFilename) {
        replaceStylesheet(styleSheets[i], href + '?' + compilationHash);
        break;
      }
    }
  }
};
