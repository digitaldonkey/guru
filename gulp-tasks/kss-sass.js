/* jshint node: true */
"use strict";

/**
 * Compile KSS-Styleguide SCSS.
 *
 */
module.exports = {
  dep: [],
  help: 'Compile scss files located in conf.styleguide.assets.',
  fn: function (gulp, conf, plug, callback) {

    gulp.src(conf.styleguide.assets + '/*.scss')
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
      .pipe(plug.sourcemaps.write({includeContent: false}))
      .pipe(plug.sourcemaps.init({loadMaps: true}))
      .pipe(plug.postcss(conf.postcssProcessors))
      .pipe(plug.environments.development(plug.sourcemaps.write('.')))
      .pipe(gulp.dest(conf.styleguide.assets))
      .pipe(plug.bs.stream());

    callback();
  }
};
