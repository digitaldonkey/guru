Drupal 8 Guru Theme
===================

Guru is Drupal 8 theme base with kss styleguide.

It’s not a ready made out of the box theme you just need to enable, but a a gulp
based theme workflow to enable *in browser* style *guide driven* theme
development.

Target audience
~~~~~~~~~~~~~~~

Target audience for the guru theme are frontend developers want to use
`SMACSS <https://smacss.com/>`__ to structure SCSS and
`KSS <http://warpspire.com/kss/>`__ to document the SCSS code.

The focus of Guru theme is fastest possible compillation of SCSS and a
documentation of code.

By rendering a living styleguide out of the SCSS comments section (think of it
as PHP doc for SCSS) you gonna have great reference for your Co-workers, PM’s
and Designers. It will help you to avoid CSS bloat because you and your team
will know what you allready have implemented and enable you a high level of code
reuse.

The look and feel of the theme is entirely in your own hands, but you gonna have
a bunch of features enabeling high development speed:

Workflow Features
~~~~~~~~~~~~~~~~~

-  **libsass** for fast scss compilation
-  Live Editing of scss in site and styleguide using **browserSync** for an
   amazing developing and testing experience
-  **singularity.gs** css grid system (but you may use you own favorite grid
   system)
-  **KSS-Node** to create stylesheets and maintain your style library
-  The styleguide enables you **prototyping in SCSS** with custom HTML in the
   comments section
-  **SCSS linting** to drupal SCSS standards while live editing, to enforce
   clean readable code
-  **sourcemaps** - See where your SASS code is located in browser inspections.
-  **autoprefixer** - Don’t care about vendor prefixes anymore, they’ll be done
   for you
-  **gulp** as a build tool
-  SVGgo and inline SVG to easily use inline SVG images.
-  Automated **documentation of SASS mixins** in the styleguide to focus on code
   reuse
-  Filly **variableized** SCSS code. E.g. change colors in only one place.
-  KSS **Styleguide Template** integrated and ready to modify within the
   workflow
-  Automated minifying of JS and CSS code
-  Compatibility ie 9+ (like drupal core)
-  Drush based subtheme generation
-  Compatible with docker environements and vagrant (Drupal vdd)

Design features
~~~~~~~~~~~~~~~

Design features are not considered as the main focus of this theme, but there
are some. You may use or decide to do your own.

-  No-JS burger menu for the primary menu
-  Full width backgrounds for sections
-  Tons of KSS example code to structure the styleguide and give you a fast
   start with typography on the SCSS base layer
-  Browser indicator to show your window with and breakpoints and check if the
   size of you links fit tab standards.
-  Based on drupal core classy theme, giving you well known css class names
-  Layout examples for the Grid system

Dependencies
~~~~~~~~~~~~

**Drupal Modules**

You **need the drupal module link\_css** to make browserSync working!

`link\_css <https://www.drupal.org/project/link_css>`__

Here is the reason: https://github.com/BrowserSync/browser-sync/issues/10

**Other dependencies**

-  libsass - a c-based sass compiler
-  npm, bower - frontend tooling.
-  [STRIKEOUT:Ruby] Just for the second scss-lint option now. But sass-lint will
   be ready soon to fully replace scss-lint, providing about double speed.

Getting started
---------------

**Create a subtheme** You may rename the theme according to your needs or create
a subtheme with drush. Make sure using drush8. Lullabot tells you `how to use
multiple drush
versions <https://www.lullabot.com/articles/switching-drush-versions>`__.

  drush guru "My Subtheme" 

**Guru theme setup**

1) You should have bower and npm available in your command line. If your grid
   system choice will be singularity you need bower.

     node -v
     v6.2.0
     npm -v
     3.8.9
     bower -v
     1.6.5

2) Install node dependencies

     cd [theme folder]
     npm install 

3) Install singularity (Currently 1.7.0) and compass-sass-mixins

     cd [theme folder]
     bower install

4) **Change your domain and theme url** in

     [theme folder]/gulp.config.js

5) Run gulp in theme folder

     cd [theme folder]
     gulp

6) Enable theme in Drupal and check the styleguide in /themes/custom/[theme
   folder]/styleguide/

More readings about the theme
-----------------------------

Checkout presentation at Drupalcamp Essen 2015
http://drupalcamp-essen.de/15/session/creating-a-gulp-based-d8-theme-with-browsersync

See the slides http://slides.com/digitaldonkey/create-a-drupal8-theme

Please use drupal issue tracker to provide feedback and share improvements.
https://www.drupal.org/project/issues/search/2599668

Theme component overview
------------------------

Theme components explained in more detail. This should explain why which
componnents are chosen for the Guru theme workflow.

KSS-Node
~~~~~~~~

Is a amazing tool to create living styleguides.

Look into the scss files for examples.

The styleguide is generated into /themes/custom/[your theme]/styleguide/ and
should open on the browser using the gulp default task.

In order to only compile the styleguide use ``gulp styleguide``

You may change the templates in /themes/custom/[your theme]/styleguide-template/

For more information:
https://github.com/kss-node/kss-node/wiki/Quick-Start-Guide
https://www.npmjs.com/package/kss
https://github.com/kss-node/kss/blob/spec/SPEC.md

Listen to `John Albin Wilkins at Drupalcon LA
2015 <https://www.youtube.com/watch?v=y5coJloNutU>`__ in order to learn why you
want this.

Libsass
~~~~~~~

is a much faster implementation compared to the slow ruby SASS.
http://sass-lang.com/libsass

**Installing libsass with homebrew**

  brew install libsass

There are some differences between compass-sass and lib-sass left. For details
read here: http://www.sitepoint.com/switching-ruby-sass-libsass/

Spriting with libsass is not working yet. But maybe this
https://github.com/wellington/wellington

Singularity
~~~~~~~~~~~

You may know singularity from Omega4 theme.

Read the `introduction <https://github.com/at-import/Singularity>`__ or the
extensive `docs <https://github.com/at-import/Singularity>`__

SASS Linting
~~~~~~~~~~~~

Linters for SCSS files help you to write cleaner code. Errors are logged to the
console id a linter is enabled. There are two linters available: the ruby based
scss-lint and the much faster sass-lint. The first will be dropped as soon ad
the functionality to `disable a linter by
comment <https://github.com/sasstools/sass-lint/issues/70>`__ is finally
implemented.

**disabled (default)**

No Linting. You may change settings in gulp.config.js in order to use the
following options.

**sass-lint** Does the same, but much faster. In sass-lint it is currently not
possible to `disabling linters by
comment <https://github.com/sasstools/sass-lint/issues/70>`__. As soon as
https://github.com/sasstools/sass-lint/pull/677 is committed to sass-lint I will
drop scss-lint support.

The sass-lint configuration is in sasslint-drupal.yml

**scss-lint** https://github.com/brigade/scss-lint

This sadly now depends on ruby.

  gem install scss_lint

The linter’s configuration is in scsslint-drupal.yml

Using scss-lint there is “disabling by comment” enabled.

  // scss-lint:disable ImportantRule

`Scss-lint linters
documentation <https://github.com/brigade/scss-lint/blob/master/lib/scss_lint/linter/README.md>`__

The sass-lint configuration is in scsslint-drupal.yml

Sourcemaps
~~~~~~~~~~

“`Source maps create a map from these compressed asset files back to the source
files <https://blog.logentries.com/2014/12/what-are-javascript-source-maps/>`__”.

This means practically you can look in the browser console, in which sass file
the inspected style was defined. In order to use sourcemaps you need to enable
them in the browser:

-  https://developer.mozilla.org/en-US/docs/Tools/Debugger/How\_to/Use\_a\_source\_map
-  https://developer.chrome.com/devtools/docs/javascript-debugging#using-source
   maps
-  A introduction by Chris Eppstein: https://www.youtube.com/watch?v=-ZJeOJGazgE

Responsive Menu
~~~~~~~~~~~~~~~

The primary menu is designed as a non-js Burger menu. If you don’t like it just
remove templates/region/region–primary-menu.html.twig and
scss/components/header/\_region-primary-menu.scss

Inline SVG
~~~~~~~~~~

You may use inline svg’s optimized by
`svgo <https://github.com/TrySound/postcss-inline-svg>`__ and inlined as mixins
using `postcss-inline-svg <https://github.com/TrySound/postcss-inline-svg>`__.
The SVG Code is only includes in main.css if you actually use a svg-background
graphic by extending the generated extends. e.g:

  a[href^="#"]::after {

    @extend %svg-chevron;
      
    // Give it some width and height!
    height: 1em;
    width: 1em;
     
    background-repeat: no-repeat;
    background-size: contain;
    
    /* more styles */
  }

We’are using extends, that the svg code is not included multiple times, when you
want to use the svg-background in different placesBe aware: The SVG code can
bloat your CSS!

gulp
~~~~

`Gulp <https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md>`__ is
`well documented <https://github.com/gulpjs/gulp/blob/master/docs/API.md>`__
javascript build tool - or “task runner”.

By default it is run from the command line. Just type gulp to run the default
task.

  cd [theme folder]
  gulp

The default task will run the following tasks: help, build and serve. In order
to get production ready you should run

  cd [theme folder]
  gulp production

and all build tasks will be run in production mode.

**Environments**

There are two environments defined: *development* (default) and *production*.
You may run any task in production environement. e.g:

  cd [theme folder]
  gulp serve --env=production

Digging deeper
~~~~~~~~~~~~~~

In order to understand the underlying gulp processesing you should have a look
in the gulpfile.js. There you find all gulp tasks and can figure out what they
do.

Check out package.json and bower.json if you want to know more about about all
packages involved.

Guru is using drupal default css classes provided by core classy theme. You can
change this by changing the “base theme” variable in theme.info.yml At
`lulabot <https://www.lullabot.com/articles/a-tale-of-two-base-themes-in-drupal-8-core>`__
you can read about Drupal 8 base themes.

HOWTO: Getting started in Drupals Vagrant VM (Debian/Ubuntu)
------------------------------------------------------------

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

Enable the Theme in Drupal UI or with Drush

  drush pm-enable my_theme -y
  drush config-set system.theme default my_theme -y

**Run gulp and open up a browser**

  cd [theme folder]
  gulp

If you are on a remote/Vagrant computer browser want start up.

You can use the Urls provided in “External” you should find after browSersync
Init is finished.
