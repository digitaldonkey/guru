/* jshint node: true */
"use strict";

/**
 * Compile SASS to css Task.
 *
 * Compile the main.css file from scss sources.
 */
module.exports = {
  dep: [],
  help: 'Compile scss to css.',
  fn: function (gulp, conf, plug, callback) {

    gulp.src(['scss/main.scss', 'scss/module/**/*.scss', '!**/_*.scss'])
      .pipe(plug.plumber())
      .pipe(plug.sassGlob())
      .pipe(plug.environments.development(plug.sourcemaps.init()))
      .pipe(plug.sass({
        // Remove comments and minify CSS.
        outputStyle: (plug.environments.production() ? 'compressed': 'expanded'),
        sourcemap: true,
        precision: 10
      }))
      .on('error', plug.sass.logError)

      // Workaround for Sourcemaps.
      // See: https://github.com/floridoo/gulp-sourcemaps/issues/60
      .pipe(plug.environments.development(plug.sourcemaps.write({includeContent: false})))
      .pipe(plug.environments.development(plug.sourcemaps.init({loadMaps: true})))

      .pipe(plug.sourcemaps.write({includeContent: false}))
      .pipe(plug.sourcemaps.init({loadMaps: true}))
      .pipe(plug.postcss(conf.postcssProcessors))
      .pipe(plug.environments.development(plug.sourcemaps.write('.')))
      .pipe(gulp.dest('css'));

    callback();
  }
};
