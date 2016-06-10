/* jshint node: true */
"use strict";

/**
 * Build KSS-Styleguide Task.
 *
 * KSS renders Comments in the scss files into a set of HTML pages.
 * The results you should finf in the folder "styleguide".
 *
 * There are a lot of examples within the SCSS files.
 *
 * Documentation:
 * https://github.com/kss-node/kss/blob/spec/SPEC.md
 *
 * Inititalisation
 * See: https://github.com/kss-node/kss-node/issues/161
 */
module.exports = {
  dep: [],
  help: 'Render KSS styleguide.',
  taskOptions: {
    aliases: ['kss', 'k']
  },
  fn: function (gulp, conf, plug, cb) {

    plug.kss({
      source: 'scss',
      destination: conf.styleguide.destination,
      builder: conf.styleguide.template,
      homepage: conf.styleguide.homepage,
      css: [
        '../css/main.css',
        'kss-assets/kss-inline-svg.generated.css'
      ]
    });
    cb();
  }
};
