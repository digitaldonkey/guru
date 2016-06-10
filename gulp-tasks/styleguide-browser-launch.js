/* jshint node: true */
"use strict";

/**
 * Open KSS-Styleguide url in default browser.
 *
 * Taskname: styleguide-browser-launch
 */
module.exports = {
  dep: [],
  help: 'Opens KSS-Styleguide url in default browser.',
  fn: function (gulp, conf, plug, callback) {

    // Open KSS Styleguide.
    if (conf.styleguide.isEnabled) {

      var uri = 'http://localhost:3000/' + conf.themePath + '/styleguide/index.html';

      // There MUST be a valid file sourced (__file)
      // See: https://github.com/stevelacy/gulp-open/issues/15.
      gulp.src(__filename, {read: false})
        .pipe(plug.open({uri: uri}));
    }
    callback();
  }
};
