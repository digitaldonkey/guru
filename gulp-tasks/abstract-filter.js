/* jshint node: true */
"use strict";

/**
 * Filter all scss files for abstracts.
 *
 * Experimental SCSS-Abstract preprocessor.
 *
 * This should generate a additional SCSS file including all Extends used in
 * the project like the following example:
 *
 * .abstract-class {
 *   @extend abstract-class;
 * }
 *
 * This enables you to include Abstractions and Variables section everywhere,
 * without generating any output.
 *
 * Task: abstract-filter
 */

module.exports = {
  dep: [],
  help: false,
  fn: function (gulp, conf, plug, cb) {

    // Empty the list.
    conf.abstracts_list = [];

    // Filter out all abstract classes.
    // Names only for now.
    // https://regex101.com/r/lG4eG8/4
    // If someone writes a better regex we might include the mixing itself
    // in the Styleguide ;).


    var filter = plug.filter(function(file) {
      var reg = /%([a-zA-Z-_]*)\s?\{[\s,]*\n(?=.*|\n\s)(?!\n}\s+\n)/gmi,
        item,
        text;

      if (file.contents.length) {
        text = file.contents.toString();
        while ((item = reg.exec(text)) !== null) {
          conf.abstracts_list.push({
            id: item[1],
            path: plug.path.relative('.', file.path)
          });
        }
      }
    });

    gulp.src(['scss/**/*.scss', '!**/*.generated.scss']).pipe(filter);
    cb();
  }
};
