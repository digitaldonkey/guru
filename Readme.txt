Drupal 8 Guru Theme
~~~~~~~~~~~~~~~~~~~

Guru is a gulp based Drupal 8 theme base with kss styleguide

Features
~~~~~~~~

-  libsass for fast scss compilation
-  browserSync for an amazing developing and testing experience
-  singularity.gs css grid system (you may know from omega4)
-  KSS-Node to create stylesheets and maintain your style library
-  Live Editing of scss in site and styleguide
-  The styleguide enables you prototyping in SCSS with custom HTML in the
   comments section
-  SCSS linting to drupal SCSS standards while live editing
-  gulp as a build tool
-  sourcemaps
-  autoprefixer

Checkout presentation at Drupalcamp Essen 2015
http://drupalcamp-essen.de/15/session/creating-a-gulp-based-d8-theme-with-browsersync

See the slides http://slides.com/digitaldonkey/create-a-drupal8-theme

Please use drupal issue tracker to provide feedback and share improvements.
https://www.drupal.org/project/issues/search/2599668

Dependencies
~~~~~~~~~~~~

**Drupal Modules**

You **need the drupal module link\_css** to make browserSync working!

`link\_css <https://www.drupal.org/project/link_css>`__

Here is the reason: https://github.com/BrowserSync/browser-sync/issues/10

**Other dependencies**

-  npm
-  libsass
-  [STRIKEOUT:Ruby] Just for the second scss-lint option now.

Getting started
~~~~~~~~~~~~~~~

**Create a subtheme** You may rename the theme according to your needs or create
a subtheme with drush. Make sure using drush8. Lullabot tells you `how to use
multiple drush
versions <https://www.lullabot.com/articles/switching-drush-versions>`__.

  drush guru "My Subtheme" 

**Guru theme setup**

1) You should have bower and npm available in your command line. If your grid
   system choice will be singularity you need bower.

     npm -v
     3.3.9
     bower -v
     1.6.5

2) Install node dependencies

     cd [theme folder]
     npm install --global gulp bower browser-sync
     npm install 

3) Install singularity (Currently 1.6.2)

     cd [theme folder]
     bower install singularity

4) **Change your domain and styleguide url** in

     [theme folder]/gulp.config.js

5) Run gulp in theme folder

     cd [theme folder]
     gulp

6) Enable theme in Drupal and check the styleguide in /themes/custom/[theme
   folder]/styleguide/

Readme
~~~~~~

KSS-Node
''''''''

Is a amazing tool to create living styleguides.

Look into the scss files for examples.

The styleguide is generated into /themes/custom/[your theme]/styleguide/ and
should open on the browser using the gulp default task. You may change the
templates in /themes/custom/[your theme]/styleguide-template/

For more information:
https://github.com/kss-node/kss-node/wiki/Quick-Start-Guide
https://www.npmjs.com/package/kss
https://github.com/kss-node/kss/blob/spec/SPEC.md

Listen to `John Albin Wilkins at Drupalcon LA
2015 <https://www.youtube.com/watch?v=y5coJloNutU>`__ in order to learn why you
want this.

Libsass
^^^^^^^

is a much faster implementation compared to the slow ruby SASS.
http://sass-lang.com/libsass

**Installing libsass with homebrew**

  brew install libsass

There are some differences between compass-sass and lib-sass left. For details
read here: http://www.sitepoint.com/switching-ruby-sass-libsass/

Spriting with libsass is not working yet. But maybe this
https://github.com/wellington/wellington

Singularity
^^^^^^^^^^^

You may know singularity from Omega4 theme. Known Issue: With lib-sass the
background grids are not working (yet). http://singularity.gs/
https://github.com/at-import/Singularity/wiki/Spanning-The-Grid

SCSS-lint or sass-lint
^^^^^^^^^^^^^^^^^^^^^^

Tells you if you are in order with Drupals SCSS Coding standards while live
Editing your SCSS.

**sass-lint (default)** In sass-lint `disabling by
comment <https://github.com/sasstools/sass-lint/issues/70>`__ wont work yet. The
linter’s configuration is in sasslint-drupal.yml

**scss-lint** https://github.com/brigade/scss-lint This sadly now depends on
ruby. TODO: I plan to make ruby/SCSS-Lint optional (decide while creating a
subtheme).

  gem install scss_lint

The linter’s configuration is in scsslint-drupal.yml

Using scss-lint there is “disabling by comment” enabled.

  // scss-lint:disable ImportantRule

Digging deeper
~~~~~~~~~~~~~~

In order to see which tasks are available run:

  gulp help

Checkout the gulpfile.js
^^^^^^^^^^^^^^^^^^^^^^^^

It contains all the tasks, is heavily commented and will give you an overview,
whats actually happening.

You may get info about the used gulp dependencies at npmjs:
www.npmjs.com/package/[package-name] e.g:
https://www.npmjs.com/package/gulp-watch

You don’t like Drupals deault CSS classes?
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Guru is using drupal default css classes provided by core classy theme. You can
change this by changing the “base theme” variable in theme.info.yml

Developers: Update Gulp Sass-lint or other node modules
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

`Install ncu <https://www.npmjs.com/package/npm-check-updates>`__

  cd /themes/guru/node_modules/gulp-sass-lint
  ncu --upgradeAll

  The following dependencies are satisfied by their declared version range, but the installed versions are behind. You can install the latest versions without modifying your package file by using npm update. If you want to update the dependencies in your package file anyway, use --upgradeAll.

   gulp-util  ^3.0.6  →  ^3.0.7
   sass-lint  ^1.0.0  →  ^1.3.2

  Upgraded .... sites/all/themes/_custom/guru/node_modules/gulp-sass-lint/package.json

HOWTO: Getting started in Drupals Vagrant VM (Debian/Ubuntu)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

*Testet with the `Vagrant Drupal
Development <https://www.drupal.org/node/2008792>`__ Virtual machine.*

Get Drupal 8 running and drush8 running all together the most easy way is using
a virtual machine created with `Vagrant Drupal
Development <https://www.drupal.org/node/2008792>`__.

I will assume you have made it so far.

**Install the latest node-js in Ubuntu**

Do you have node installed?

  npm -v
  3.3.6

If not:

  curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
  sudo apt-get install -y nodejs

**Install global packages**

  npm install --global gulp
  npm install --global browser-sync
  npm install --global bower

I had to fix permission Problems, when trying to do npm install –global in the
vm. And `found a fix <http://stackoverflow.com/a/21712034/308533>`__:

  npm config set prefix '~/.npm-packages'

and add

  export PATH="$PATH:$HOME/.npm-packages/bin"

to the end of you ~/.bashrc

**Testing bower**

  bower -v
  1.6.5

**Libsass**

Is harder to get on Ubuntu. See:

http://askubuntu.com/questions/566675/how-to-install-node-sass-gulp-sass-on-ubuntu-14-04-or-linux-mint-17/566681#566681

**Create Subtheme**

  cd [www-data-folder]
  drush guru "My Theme"

**Local node modules:**

  cd [theme folder]
  npm install 
  bower install singularity

**Adapt your config** in

  gulp.config.js

In my VM I Ended up using:

  domain: 'drupal8.dev',

  styleguide: {
      uri: 'http://drupal8.dev:3000/themes/my_theme/styleguide/index.html'
    },

**Don’t forget to install link\_css module**

  drush dl
  drush en link_css -y

Link\_css requires scss cache to be off (for development).

  # Read
  drush8 config-get system.performance
  # Set
  drush8 config-set system.performance css.preprocess 0 -y
  drush8 config-set system.performance js.preprocess 0 -y
  drush8 config-set system.performance cache.page.max_age 0 -y

Enable the Theme in Drupal UI or with Drush

  drush pm-enable my_theme -y
  drush config-set system.theme default my_theme -y

**Run gulp and open up a browser**

  cd [theme folder]
  gulp

If you are on a remote/Vagrant computer browser want start up.

You can use the Urls provided in “External” you should find after browSersync
Init is finished.
