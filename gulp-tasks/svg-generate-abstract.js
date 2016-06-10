/* jshint node: true */
"use strict";

/**
 * Inline SVG abstracts.
 *
 * Avoiding long SCSS compile times by generating extends for each file in /svg directory
 */
module.exports = {
  dep: [],
  help: false,
  fn: function (gulp, conf, plug, callback) {

    var destination_dir_abstract = "./scss/abstractions/",
      destination_dir_kss = "./styleguide-template/guru-handlebars/kss-assets/",
      gulp_sass_template = '_inline-svg.generated.scss',
      gulp_css_template = 'kss-inline-svg.generated.css',
      gulp_template_dir = './gulp-templates/',
      svgs =  [];

    // Ignore files not svg: ['!*.svg']
    plug.recursiveReaddir('svg', ['!*.svg'], function (err, files) {
      var prefix = 'svg/'.length;
      files.map(function(f, i){
        svgs[i] = {
          path: f,
          relPath: f.substr(prefix),
          // Remove ".svg" and replace "/" with "--" to create CSS-id.
          id: 'svg-' + f.substr(prefix, f.substr(prefix).length - 4).replace('/','--')
        };
      });
    });

    // Generating css include for styleguide
    gulp.src(gulp_template_dir + gulp_css_template)
      .pipe(plug.template({
        filename: destination_dir_kss + gulp_css_template,
        svgs: svgs
      }))
      .pipe(plug.postcss([
        require('postcss-inline-svg')({path: 'svg/'}),
        require('postcss-svgo')
      ]))
      .pipe(gulp.dest(destination_dir_kss));

    // Generating abstract include for main.scss.
    gulp.src(gulp_template_dir + gulp_sass_template)
      .pipe(plug.template({
        filename: destination_dir_abstract + gulp_sass_template,
        svgs: svgs
      }))
      .pipe(plug.postcss([
        require('postcss-inline-svg')({path: 'svg/'}),
        require('postcss-svgo')
      ]))
      .pipe(gulp.dest(destination_dir_abstract));

    callback();
  }
};
