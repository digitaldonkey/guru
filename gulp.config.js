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

  //  KSS-Styleguide
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

  // SCSS-Linting
  //
  // There are two options how to use SCSS-lint
  // In sass-lint "disabling by comment" wont work yet,
  // but the compile time is about half compared with scss-lint (ruby):
  //
  //   sass-lint: 578ms vs scss-lint: 1.28s
  //
  linter: {

    // By default linting is disabled.
    default: false

    // In sass-lint "disabling by comment" wont work yet. See:
    // https://github.com/sasstools/sass-lint/pull/677
    // See: https://github.com/sasstools/sass-lint

    // default: 'sass-lint'

    // Using scss-lint there is "disabling by comment" enabled.
    // e.g: // scss-lint disable single-line-per-selector
    //
    // See: https://github.com/brigade/scss-lint

    // default: 'scss-lint'

  },

  //  Autoprefixer
  // For configuration see: https://github.com/postcss/autoprefixer
  autoprefixer: {
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
