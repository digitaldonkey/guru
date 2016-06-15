/* jshint node: true */
"use strict";

/**
 * SCSS-lint task.
 *
 * This will use the conf stored in ./scsslint-drupal.yml or scsslint-drupal.yml
 * https://github.com/brigade/scss-lint
 */
module.exports = {
  dep: [],
  help: 'Run the linter defined in conf.',
  fn: function (gulp, conf, plug, callback) {

    // Enable commandline args:
    // --no-linter / --linter='scss-lint' / --linter='sass-lint'
    if (conf.argv.linter !== undefined) {
      conf.linter.default = conf.argv.linter;
    }

    switch (conf.linter.default) {

      case 'sass-lint':

        // Using sass-lint there is "disabling by comment" is not available.
        // https://github.com/sasstools/sass-lint/issues/70

        // The exclude is required fo fix a bug. See:
        // https://github.com/juanfran/gulp-scss-lint/issues/36#issuecomment-113196295

        return gulp.src([
            'scss/**/*.scss',
            '!**/*_scsslint_tmp*.scss',
            // Exclude reset.
            '!scss/base/__reset.scss'
          ])
          .pipe(plug.sassLint({
            conf: './sass-lint-drupal.yml'
          }))
          .pipe(plug.sassLint.format())
          .pipe(plug.sassLint.failOnError());

      case 'scss-lint':

        // Using scss-lint there is "disabling by comment" enabled.
        // e.g: // scss-lint disable single-line-per-selector
        // See: https://github.com/brigade/scss-lint#disabling-linters-via-source

        // This is the code for scss lint.
        return gulp.src('scss/**/*.scss')
          .pipe(plug.scssLint({
            'conf': 'scsslint-drupal.yml'
          }));

      default:
        plug.gutil.log(plug.gutil.colors.red('Scss linting is disabled!'));
        return;
    }
  }
};
