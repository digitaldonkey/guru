/* jshint node: true */
"use strict";

/**
 * BrowserSync Task
 *
 * Starts browserSync and initialize watching files.
 *
 */
module.exports = {
  dep: [],
  help: 'Starts up browser sync server and start watching for changes.',
  fn: function (gulp, conf, plug, callback) {

    // Add close-tab on gulp-exit functionality.
    plug.bs.use({
      plugin: function () { /* noop */ },
      hooks: {
        'client:js': require("fs").readFileSync('./browsersync-client-events.js', 'utf-8')
      }
    });

    // Static Server init.
    // Make sure Drupal will not send compressed stuff to browserSync.
    plug.bs.init({
      //reloadDelay: 600,
      //reloadDebounce: 1100,
      proxy: {
        target: conf.ip,
        reqHeaders: function () {
          return {
            host: conf.domain,
            "accept-encoding": "identity"
          };
        }
      }
    }, function(){
      gulp.start('watch');
      callback();
    });


  }
};
