/*jslint node: true */

module.exports.server = {

  // Your domain. Set to "" in order to use default domain
  domain: 'drupaleight.local',

  // Using IP for browserSync to skip DNS resolve time.
  // Change only if you know why you should. You may change browserSync.init()
  // in gulpfile.js for other options.
  ip: '127.0.0.1',

  // This url will be valid with the browserSync Server.
  // Replace "digitaldonkey" with your subtheme name!
  styleguide: {
    uri: 'http://localhost:3000/sites/all/themes/_custom/digitaldonkey/styleguide/index.html'
  }
};
