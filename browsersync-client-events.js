/**
 * Reload plugin example
 */
(function ($window, $document, bs) {

  var socket = bs.socket;

  socket.on("connect", function (client) {
    document.body.classList.add('is-browsersync');
  });

  socket.on("disconnect", function (client) {
    window.close();
  });

})(window, document, ___browserSync___);
