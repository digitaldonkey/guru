/*jslint node: true */

module.exports.current = {

  // Your domain. Set to "" in order to use default domain
  domain: 'drupaleight.local',

  // Using IP for browserSync to skip DNS resolve time.
  // Change only if you know why you should. You may change browserSync.init()
  // in gulpfile.js for other options.
  ip: '127.0.0.1',

  // This url will be valid with the browserSync Server.
  // Replace "guru" with your subtheme name!
  styleguide: {
    uri: 'http://localhost:3000/themes/guru/styleguide/index.html'
  },
  linter: {
    //
    // There are two options how to use SCSS-lint
    //
    // In sass-lint "disabling by comment" wont work yet. See:
    // https://github.com/sasstools/sass-lint/issues/70
    //default: 'sass-lint'

    // Using scss-lint there is "disabling by comment" enabled.
    // e.g: // scss-lint disable single-line-per-selector
    // See readme for more Info.
     default: 'scss-lint'

    // You can disable Linter completly.
    // default: 'none'
  },
  abstract: {
    //
    // The abstract Task
    //
    // will search in all SCSS files for abstracts like
    // %my-cool-name{ ... } and generate a SCSS file, with
    // concrete (.my-cool-name{ @extends %my-cool-name; })
    // CSS classes.
    gulp_template_dir: './gulp-templates/',
    // Make sure the name contains ".generated.scss"!
    gulp_template: '_abstract-to-concrete.generated.scss',
    destination_dir: "./scss/base/"
  }
};

