/* jshint node: true */
"use strict";

/**
 * Generate Readme's.
 *
 * This task ist just for deployment.
 *
 * Converts "README.md" into "Readme.txt" and "Readme.html".
 * Requires pandoc installed on the locally.
 * See: https://github.com/jgm/pandoc/releases/latest
 */
module.exports = {
  dep: [],
  help: false,
  fn: function (gulp, conf, plug, callback) {

    plug.del(['./Readme.txt', './Readme.html']);
    // Create Drupal Readme.
    gulp.src('./Readme.md')
      .pipe(plug.pandoc({
        from: 'markdown',
        to: 'rst',
        ext: '.txt',
        args: ['--columns=80', '--smart', '--tab-stop=2', '--normalize']
      }))
      .pipe(plug.replace(/\n\s.*::\n/g, '\n'))
      .pipe(gulp.dest('.'));

    // Create HTML Version (for Drupal.org)
    gulp.src('./Readme.md')
      .pipe(plug.pandoc({
        from: 'markdown',
        to: 'html5+lhs',
        ext: '.html',
        args: ['--smart']
      }))
      .pipe(gulp.dest('.'));

    callback();
  }
};
