/*jslint node: true */

module.exports.server = {

  // Your domain. Set to "" in order to use default domain
  domain: 'drupal8.dev',

  // Using IP for browserSync to skip DNS resolve time.
  // Change only if you know why you should. You may change browserSync.init()
  // in gulpfile.js for other options.
  //ip: '127.0.0.1',
  ip: '192.168.44.44',

  styleguide: {

    // This url will be valid with the browserSync Server.
    // Replace "guru" with your subtheme name!
    uri: 'http://localhost:3000/themes/guru/styleguide/index.html',

    // Create your own styleguide template with kss:
    // kss --clone styleguide-template/your-handlebars-template
    // See: https://www.npmjs.com/package/kss.
    template: 'styleguide-template/guru-handlebars',

    // Index page of the styleguide is located in the scss folder.
    homepage: 'homepage.md',

    // SCSS to CSS for the styleguide CSS.
    scss: 'styleguide-template/guru-handlebars/kss-assets/kss.scss',
    destination: 'styleguide-template/guru-handlebars/kss-assets'
  },

  // There are two options how to use SCSS-lint
  linter: {
    // In sass-lint "disabling by comment" wont work yet. See:
    // https://github.com/sasstools/sass-lint/issues/70
    // default: 'sass-lint'

    // Using scss-lint there is "disabling by comment" enabled.
    // e.g: // scss-lint disable single-line-per-selector
    // See readme for more Info.
    // default: 'scss-lint'

    // You can disable Linter.
    default: 'none'
  }
};

