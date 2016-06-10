/*jslint node: true */

module.exports = {

  // Your domain. Set to "" in order to use default domain
  domain: 'drupal8.dev',

  // Using IP for browserSync to skip DNS resolve time.
  // Change only if you know why you should. You may change browserSync.init()
  // in gulpfile.js for other options.
  //ip: '127.0.0.1',
  ip: '192.168.44.44', // Drupal VDD default.

  // Change to match your them location.
  themePath: 'themes/guru', // No trailing slashes.

  //
  // You may change other options later, but only the above is required!
  //
  styleguide: {

    // Create your own styleguide template with kss:
    // kss --clone styleguide-template/your-handlebars-template
    // See: https://www.npmjs.com/package/kss.
    template: 'styleguide-template/guru-handlebars',

    // Index page of the styleguide is located in the scss folder.
    homepage: 'homepage.md',

    // SCSS to CSS for the styleguide CSS.
    assets: 'styleguide-template/guru-handlebars/kss-assets',
    destination: 'styleguide',
    isEnabled: true
  },

  // There are two options how to use SCSS-lint
  linter: {
    // In sass-lint "disabling by comment" wont work yet. See:
    // https://github.com/sasstools/sass-lint/pull/677

    // default: 'sass-lint' // Finished 'scss-lint' after 578 ms

    // Using scss-lint there is "disabling by comment" enabled.
    // e.g: // scss-lint disable single-line-per-selector
    // See readme for more Info.
    default: 'scss-lint' // Finished 'scss-lint' after 1.28 s.

    // You can disable Linter.
    //default: false
  },
  autoprefixer: {
    // For autoprefixer see: https://github.com/postcss/autoprefixer
    browsers: [
      'last 2 versions',
      'safari 5',
      'ie 9',
      'opera 12.1',
      'ios 6',
      'android 4'
    ]
  }
};

