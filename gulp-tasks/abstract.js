/* jshint node: true */
"use strict";

/**
 * Generate sass include file.
 *
 * Experimental SCSS-Abstract preprocessor.
 *
 *
 * This should generate a additional SCSS file "_abstract-to-concrete.generated.scss"
 * including all Extends used in the project like the following example:
 *
 * .abstract-class {
 *   @extend abstract-class;
 * }
 *
 * This enables you to include Abstractions and Variables section everywhere,
 * without generating any output in abstractions section. But you will have a list
 * of your abstracts available in the styleguide and can use each abstract as css-class
 * without manually extending them.
 *
 * Task: abstract
 */
module.exports = {
  dep: ['abstract-filter'],
  help:  'Generates file "scss/base/_abstract-to-concrete.generated.scss".',
  fn: function (gulp, conf, plug, cb) {

    var destination_dir = "./scss/base/",
      gulp_template = '_abstract-to-concrete.generated.scss',
      gulp_template_dir = './gulp-templates/';

    return gulp.src(gulp_template_dir + gulp_template)
      .pipe(plug.template({
        filename: destination_dir + gulp_template,
        abstracts: conf.abstracts_list
      }))
      .pipe(gulp.dest(destination_dir));
  }
};
