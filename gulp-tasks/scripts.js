/* jshint node: true */
"use strict";

/**
 * Script Task.
 *
 * Minify all JS files in js folder to corresponding .min.js files.
 */
module.exports = {
  dep: [],
  help: 'Minify all JS files in js folder to corresponding .min.js files,',
  fn: function (gulp, conf, plug, cb) {
     // Get all JS files in folder, exclude minified ones.
    gulp.src(['js/**/*.js', '!js/**/*.min.js'])

      // Rename th output files.
      .pipe(plug.rename({suffix: '.min'}))

      // Minify using gulp-uglify.
      .pipe(plug.environments.production(plug.uglify()))

      // Save output files.
      .pipe(gulp.dest('js'));

    cb();
  }
};
