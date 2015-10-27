
# Gulp based Drupal 8 theme base with kss styleguide
 
Project page:
https://www.drupal.org/sandbox/digitaldonkey/2599668


This is an example Theme named "digitaldonkey". 

It demonstrate the use of

<ul>
  <li>gulp as a build tool</li>
  <li>libsass for fast scss compilation</li>
  <li>browserSync for an amazing developing and testing experience</li>
  <li>singularity css grid system</li>
  <li>KSS-Node to create stylesheets and maintain your style library</li>
  <li>sourcemaps</li>
  <li>autoprefixer</li>
</ul>


Checkout presentation at Drupalcamp Essen 2015
http://drupalcamp-essen.de/15/session/creating-a-gulp-based-d8-theme-with-browsersync

See the slides
http://slides.com/digitaldonkey/create-a-drupal8-theme

Please use drupal issue tracker to provide feedback and share improvements. 
https://www.drupal.org/project/issues/search/2599668


## Getting started

1) You should have bower and npm available in your command line.
If your grid system choice will be singularity you need bower.

```
npm -v
2.14.4
```

```
bower -v
1.4.1
```

2) Install node dependencies

```
cd [theme folder] (Out of the box the theme name is digitaldonkey)
npm install --global gulp bower browser-sync
npm install 
```

3) Install singularity

```
cd [theme folder]
bower install --save singularity
```

4) Adapt your domain name in the gulpfile to make 
Edit sites/all/themes/_custom/digitaldonkey/gulpfile.js (or where ever you installed the theme)
and change the domain "drupaleight.local" to your domain.

5) Run gulp in theme folder
```
cd [theme folder]
gulp
```

6) Enable theme in Drupal
and check the styleguide in /sites/all/themes/_custom/digitaldonkey/styleguide/


### browser sync
You need the drupal module link_css to make browserSync working.
https://www.drupal.org/project/link_css
Here is the reason:
https://github.com/BrowserSync/browser-sync/issues/10

### KSS-Node
Look into the scss files for examples. See: 
https://github.com/kss-node/kss-node/wiki/Quick-Start-Guide
https://www.npmjs.com/package/kss
https://github.com/kss-node/kss/blob/spec/SPEC.md

You can access the styleguide in:
/sites/all/themes/_custom/digitaldonkey/styleguide/

### Libsass
http://sass-lang.com/libsass

**Installing libsass with homebrew**
```
brew install libsass
```

There are some differences betwenn compass-sass and lib-sass left.
For details read here:
http://www.sitepoint.com/switching-ruby-sass-libsass/

Spriting with libsass is not working yet.
But maybe this https://github.com/wellington/wellington


### Singularity
You may know singularity from Omega4 theme.
Known Issue: With lib-sass the background grids are not working (yet).
http://singularity.gs/
https://github.com/at-import/Singularity/wiki/Spanning-The-Grid

### More info about the used gulp dependencies
www.npmjs.com/package/[package-name]
e.g: https://www.npmjs.com/package/gulp-watch

