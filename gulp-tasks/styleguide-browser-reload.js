/* jshint node: true */
"use strict";

/**
 * Reload styeguide files with browserSync.
 *
 * Task: styleguide-browser-reload
 */
module.exports = {
  dep: [],
  help: 'Reloads everything in default browser.',
  fn: function (gulp, conf, plug, callback) {
    plug.bs.reload();
    callback();
  }
};
