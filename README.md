# Drupal 8 Guru Theme

Guru is a Drupal 8 base theme with kss styleguide. 

It's not a ready made out of the box theme you just need to enable, but a a gulp based theme workflow to enable _in browser_ style _guide driven_ and mobile first theme development.

### Target audience

Target audience for the guru theme are frontend developers want to use [SMACSS](https://smacss.com/) to structure SCSS and [KSS](http://warpspire.com/kss/) to document the SCSS code.

The focus of Guru theme is fastest possible compilation of SCSS and a documentation of code.

By rendering a living styleguide out of the SCSS comments section (think of it as PHP doc for SCSS) you gonna have great reference for your Co-workers, PM's and Designers. It will help you to avoid CSS bloat because you and your team will know what you already have implemented and enable you a high level of code reuse.   

The look and feel of the theme is entirely in your own hands. You will have a bunch of features enhancing development speed and tons of examples rendering into a full styleguide. The styleguide comes with a template and can be adapted to your requirements very easily.
 
 
### Workflow Features

- **libsass** for fast scss compilation
- Live Editing of scss in site and styleguide using **browserSync** for an amazing developing and testing experience
- **singularity.gs** css grid system (but you may use you own favorite grid system)
- **KSS-Node** to create stylesheets and maintain your style library
- The styleguide enables you **prototyping in SCSS** with custom HTML in the comments section
- **SCSS linting** to drupal SCSS standards while live editing, to enforce clean readable code
- **sourcemaps** - See where your SASS code is located in browser inspections.
- **autoprefixer** - Don't care about vendor prefixes anymore, they'll be done for you
- **gulp** as a build tool
- SVGgo and inline SVG to easily use inline SVG images.
- Automated **documentation of SASS mixins** in the styleguide to focus on code reuse
- Fully **variableized** SCSS code. E.g. change colors in only one place.
- KSS **Styleguide Template** integrated and ready to modify within the workflow
- Automated minifying of JS and CSS code
- Compatibility ie 9+ (like drupal core)
- Drush based subtheme generation
- Compatible with Docker environements and Vagrant (Drupal VDD) 


### Design features

Design features are not considered as the main focus of this theme, but there are some. You may use or decide to do your own. 

- No-JS burger menu for the primary menu
- Full width backgrounds for sections
- Tons of KSS example code to structure the styleguide and give you a fast start with typography on the SCSS base layer
- Browser indicator to show your window with and breakpoints and check if the size of you links fit tab standards.
- Based on drupal core classy theme, giving you well known css class names
- Layout examples for the Grid system
- Tons of Styleguide-ready SCSS comments rendering into a styleguide structured by SMACSS principles  



### Dependencies

**Drupal Modules**

You  **need the drupal module link_css** to make browserSync working!

[link_css](https://www.drupal.org/project/link_css)

Here is the reason:
https://github.com/BrowserSync/browser-sync/issues/10



**Other dependencies**


- [libsass](http://sass-lang.com/libsass) - a c-based sass compiler
- npm, bower - frontend tooling. 
-  ~~Ruby~~ Just for the second scss-lint option now. But sass-lint will be ready soon to fully replace scss-lint, providing about double speed. 


## Getting started

**Create a subtheme**
You should create a subtheme with drush.
Lullabot tells you [how to use multiple drush versions](https://www.lullabot.com/articles/switching-drush-versions).
 

In order to create a subtheme with drush, guru theme needs to be installed and set as default!

```
cd [www-data-folder]
drush pm-enable guru
drush config-set system.theme default guru
drush guru "My Theme"
```


**Guru theme setup**

1) You should have node, npm and sassc available in your command line.

```
node -v
 v6.2.0
 
npm -v
 3.8.9

sassc -v
 sassc: 3.3.6-8-g1949
 libsass: 3.3.6-70-g4acba
 sass2scss: 1.0.6
 sass: 3.4 
```

You may use [homebrew](http://brew.sh/) on a Mac or check out "Getting started in Drupal's Vagrant VM" below for an Ubuntu example. Windows users may look at [VDD](https://www.drupal.org/project/vdd) too or struggle their own way and commit back the lessons learned ;).

2) Install node dependencies

```
npm install -g npm-run
cd [theme folder]
npm install 
```

3) Install singularity (Currently 1.7.0) and compass-sass-mixins
```
cd [theme folder]
npm-run bower install
```

4) **Change your domain and theme url** in
```
[theme folder]/gulp.config.js
```

5) Run gulp in theme folder
```
cd [theme folder]
npm-run gulp
```

6) Enable theme in Drupal
and check the styleguide in /themes/[theme folder]/styleguide/


## More readings about the theme

Introduction and howto video on Youtube
https://www.youtube.com/watch?v=EcyXh4REaQk
Complementary slides.
http://slides.com/digitaldonkey/drupal-8-guru-theme-intro

8.1.x Version

Checkout presentation at Drupalcamp Essen 2015
http://drupalcamp-essen.de/15/session/creating-a-gulp-based-d8-theme-with-browsersync

See the slides
http://slides.com/digitaldonkey/create-a-drupal8-theme

Please use drupal issue tracker to provide feedback and share improvements. 
https://www.drupal.org/project/issues/search/2599668


## Theme component overview

Theme components explained in more detail. This should explain why which componnents
are chosen for the Guru theme workflow.


### KSS-Node
Is a amazing tool to create living styleguides.

Look into the scss files for examples. 

The styleguide is generated into 
/themes/custom/[your theme]/styleguide/
and should open on the browser using the gulp default task.

In order to only compile the styleguide use `gulp styleguide`

You may change the templates in 
/themes/custom/[your theme]/styleguide-template/

For more information: 
https://github.com/kss-node/kss-node/wiki/Quick-Start-Guide
https://www.npmjs.com/package/kss
https://github.com/kss-node/kss/blob/spec/SPEC.md

Listen to [John Albin Wilkins at Drupalcon LA 2015](https://www.youtube.com/watch?v=y5coJloNutU) in order to learn why you want this. 

### Libsass
is a much faster implementation compared to the slow ruby SASS.
http://sass-lang.com/libsass

**Installing libsass with homebrew**
```
brew install libsass
```

There are some differences between compass-sass and lib-sass left.
For details read here:
http://www.sitepoint.com/switching-ruby-sass-libsass/


### Singularity
You may know singularity from Omega4 theme.  

Read the [introduction](https://github.com/at-import/Singularity) or the extensive [docs](https://github.com/at-import/Singularity) 

### SASS Linting

Linters for SCSS files help you to write cleaner code. Errors are logged to the console id a linter is enabled. There are two linters available: the ruby based scss-lint and the much faster sass-lint. The first will be dropped as soon ad the functionality to [disable a linter by comment](https://github.com/sasstools/sass-lint/issues/70) is finally implemented. 


**disabled (default)**

No Linting. You may change settings in gulp.config.js in order to use the following options.

**sass-lint**
Does the same, but much faster. In sass-lint it is currently not possible to [disabling linters by comment](https://github.com/sasstools/sass-lint/issues/70). As soon as https://github.com/sasstools/sass-lint/pull/677 is committed to sass-lint I will drop scss-lint support.  

The sass-lint configuration is in sasslint-drupal.yml 

**scss-lint**
https://github.com/brigade/scss-lint

This sadly now depends on ruby. 

```
gem install scss_lint
```
The linter's configuration is in scsslint-drupal.yml 

Using scss-lint there is "disabling by comment" enabled.

```
// scss-lint:disable ImportantRule
```

[Scss-lint linters documentation](https://github.com/brigade/scss-lint/blob/master/lib/scss_lint/linter/README.md)

The sass-lint configuration is in scsslint-drupal.yml 


### Sourcemaps
"[Source maps create a map from these compressed asset files back to the source files](https://blog.logentries.com/2014/12/what-are-javascript-source-maps/)".

This means practically you can look in the browser console, in which sass file the inspected style was defined. In order to use sourcemaps you need to enable them in the browser:
 
* https://developer.mozilla.org/en-US/docs/Tools/Debugger/How_to/Use_a_source_map
* https://developer.chrome.com/devtools/docs/javascript-debugging#using-source maps
* A introduction by Chris Eppstein: https://www.youtube.com/watch?v=-ZJeOJGazgE

### Responsive Menu 

The primary menu is designed as a non-js Burger menu.
If you don't like it just remove templates/region/region--primary-menu.html.twig and scss/components/header/_region-primary-menu.scss

### Inline SVG

You may use inline svg's optimized by [svgo](https://github.com/TrySound/postcss-inline-svg) and inlined as mixins using [postcss-inline-svg](https://github.com/TrySound/postcss-inline-svg).
The SVG Code is only includes in main.css if you actually use a svg-background graphic by extending the generated extends.
e.g:

```
a[href^="#"]::after {

  @extend %svg-chevron;
    
  // Give it some width and height!
  height: 1em;
  width: 1em;
   
  background-repeat: no-repeat;
  background-size: contain;
  
  /* more styles */
}

```

We'are using extends, that the svg code is not included multiple times, when you want to use the svg-background in different placesBe aware: The SVG code can bloat your CSS!  


### gulp
    
[Gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) is [well documented](https://github.com/gulpjs/gulp/blob/master/docs/API.md) javascript build tool - or "task runner". 

By default it is run from the command line. Just type gulp to run the default task.

```
cd [theme folder]
gulp
```

The default task will run the following tasks: help, build and serve. 
In order to get production ready you should run

```
cd [theme folder]
gulp production
```

and all build tasks will be run in production mode.

**Environments**

There are two environments defined: _development_ (default) and _production_.
You may run any task in production environement. e.g:

```
cd [theme folder]
gulp serve --env=production
```

**Inline your styleguide**

There is a very simple drupal module you may use to include the Stylguide in the frontend of your site.
But this module is more diy than productione ready. https://www.drupal.org/sandbox/digitaldonkey/2655300.
    
### Digging deeper

In order to understand the underlying gulp processesing you should have a look in the gulpfile.js. There you find all gulp tasks and can figure out what they do.

Check out package.json and bower.json if you want to know more about about all packages involved. 

Guru is using drupal default css classes provided by core classy theme. 
You can change this by changing the "base theme" variable in theme.info.yml
At [lulabot](https://www.lullabot.com/articles/a-tale-of-two-base-themes-in-drupal-8-core) you can read about Drupal 8 base themes.


## HOWTO: Getting started in Drupal's Vagrant VM (Debian/Ubuntu) 

*Testet with the [Vagrant Drupal Development](https://www.drupal.org/node/2008792) Virtual machine.*

Get Drupal 8 running and drush8 running all together the most easy way is using a virtual machine created with [Vagrant Drupal Development](https://www.drupal.org/node/2008792). 

I will assume you are running drupal in vdd machine and want to install frontend compiling within the VM as a reference, but generally I recommend to compile your sass locally, which is much faster. In this case npm and sassc should be installed on you local machine not in the VM.

But for this tutorial I will assume we install everything within the VM. 

**Install the latest node-js in Ubuntu**

Do you have node installed? 

```
npm -v
3.8.9
```


If npm is not available:

```
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
sudo apt-get install -y nodejs
```


**check for libsass (sassc)**


```
sassc -v
```

If you don't have sassc you need to install it.
I ended up installing it from source as discribed [here](http://askubuntu.com/a/785324/555592), because the  [debian package](https://tracker.debian.org/pkg/libsass) is in unstable and 3.3.4 instead of 3.3.6.


**BrowserSync in a virtual machine**

Browsersync basically starts up a local webserver to enable live reloading.
Running the gulp task on you local machine and your Drupal site will be available trough browserSync at localhost:3000.

In order to run gulp in the VM and reach browserSync instance from outside the Virtual machine you need to forward ports to the host system. You can do this by changing the VDD Vagrantfile.

Change the _forwarded_ports_ array in _**vdd/config.json**_ file to add the ports **3000** and **3001**.
 
``` 
"forwarded_ports": [
  {
    "guest_port": 3000,
    "host_port": 3300,
    "protocol": "tcp"
  },
  {
    "guest_port": 3001,
    "host_port": 3301,
    "protocol": "tcp"
  }
]
``` 

After you require to reload vagrant

```
vagrant reload
```


**Create Subtheme**

In order to create a subtheme guru theme needs to be installed and set as default!

```
cd [www-data-folder]
drush pm-enable guru -y
drush config-set system.theme default guru -y
drush guru "My Theme"
```

**Install node and bower modules**

I try to keep all node modules locally but on global we will need: 

```
sudo npm install -g npm-run
```

If you can't install as root, [there is a workaround](http://stackoverflow.com/a/21712034/308533).

```
cd [theme folder]
npm install 
npm-run bower install
```

**Adapt your config** in
 
```
gulp.config.js
```

In this specific case with VDD and the default ip you will need to change`only the string:

`themes/guru -> themes/my_theme


**Don't forget to install link_css module**

```
drush en link_css -y
```

The link_css module does nothing but converting drupals @import(file.css) to &lt;link rel="stylesheet" href="stylesheet.css"&gt; while JS/CSS aggregation is _disabled_. 
Make sure you **deactivate aggregation in order to work woth browserSync**.

```
drush config-set system.performance css.preprocess 0 -y
drush config-set system.performance js.preprocess 0 -y
```


Enable the new Theme in Drupal UI or with Drush:

```
drush pm-enable my_theme -y
drush config-set system.theme default my_theme -y
```


**Run gulp and open up a browser**
 
```
cd [theme folder]
npm-run gulp
```

On a local machine your default browser will launch your Drupal site at http://localhost:3000 and a second tab with the styleguide at http://localhost:3000/themes/yourtheme/styleguide/index.html.

In the virtual machine you should reach you website at the ip you find at the end of the startup script ("Proxying: http://192.168.44.44")

Sou your local browser should show your drupal site at http://192.168.44.44:3000 and the browserSync UI at  http://192.168.44.44:3000 and the stylguide at http://192.168.44.44:3000/themes/my_theme/styleguide/index.html (Dont miss the index.html or drupal will deny access).
