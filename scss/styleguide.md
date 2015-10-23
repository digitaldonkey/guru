# KSS Node/PHP boilerplate

Boilerplate for reuse on [Chrometoaster](http://www.chrometoaster.com)'s PHP-based client projects.

##Credits

* Thanks to Kyle Neath ([kneath](https://github.com/kneath/)) for inventing KSS.
* Thanks to Hugh Kennedy ([hughsk](https://github.com/hughsk/)) for his work on getting kss-node up and running.
* Thanks to my employer [Chrometoaster](http://www.chrometoaster.com), for allowing me time to work on this boilerplate,
and their interest in new technologies such as KSS.

## What is KSS?

KSS is an acronym which stands for 'Knyle Style Sheets'. 'Knyle' is a combination of 'Kyle' + 'Neath'.
Kyle Neath is the Design Director at Github.
Read [Kyle's introduction to Knyle Style Sheets](http://warpspire.com/posts/kss/).

KSS involves adding structured comments to CSS files to generate a **Living Styleguide**.
These comments create an easily navigable index,
live HTML/CSS demos which demonstrate the available style variants,
and a place to store any notes which would be useful to the client or fellow developers.

KSS Node was created by Kyle Neath ([kneath](https://github.com/kneath/))
and is maintained on [Github](https://github.com/kneath/kss).

## What is KSS Node?

KSS Node is a NodeJS implementation of KSS.

KSS Node was created by Hugh Kennedy ([hughsk](https://github.com/hughsk/))
and is maintained in [Github](https://github.com/hughsk/kss-node).

## What's different in this fork?

Our fork of [kss-node](https://github.com/hughsk/kss-node) has been tweaked to suit our workflow
at [Chrometoaster](http://www.chrometoaster.com), and includes:

* Some minor bug fixes which allow Subversion to be used for version control, rather than Git
* A bundled OS X app for regenerating styleguides without using the command line,
plus XML configuration files to allow easy switching between projects
* A boilerplate for integration into PHP-based CMSes (Content Management Systems)
* A front-end layout which maximises the available screen real estate
* Use of vanilla CSS rather than LESS

This fork was created by Dan Smith ([dotherightthing](https://github.com/dotherightthing/))
and is maintained in [Github](https://github.com/dotherightthing/kss-node).

***

###What the fork?###

[Forking](https://help.github.com/articles/fork-a-repo) allows a developer to contribute to another
developer's Github project, or grab their code as the starting point for their own Github project.

Forking a Github project creates a copy of the project on the Github server.
This is a snapshot of the project at the time the fork was created.

The fork is not automatically updated with any changes to the original repository,
and, conversely, any changes or improvments will not automatically make their way back into the original repository.

More information about forking is available on
[stackoverflow.com](http://stackoverflow.com/questions/6286571/git-fork-is-git-clone).

## Benefits of using KSS

### Clarity:

* provides an overview of complex stylesheets suitable for clients and other developers
* provides a reference for developers returning to a project after a long break

### Efficiency:

* visualising stylesheets allows developers to see at a glance whether a style already exists,
before authoring new styles
* exposing modifiers encourages development of reusable components that can be skinned
* reused and resuable code = less code to download, less code to maintain
* ensure that styles render in full in MSIE6-9 by avoiding the
[4095x selector limit in MSIE6-9](http://blogs.msdn.com/b/ieinternals/archive/2011/05/14/internet-explorer-stylesheet-rule-selector-import-sheet-limit-maximum.aspx)
* automatic styleguide generation is many times more efficient than manually building a PDF or HTML styleguide,
and being responsible for its maintenance

### Completeness:

* visual documention provides an easy way to check that there are no bugs, oversights, or redundant rules in the CSS

### Integration:

* HTML demos assist back-end developers and other front-end developers in troubleshooting integration issues,
and identifying what is in 'the box of bits'
* Removes the risk of capturing in appropriate (eg JS-injected) markup when ripping HTML via eg Firebug

## Setup and usage instructions for developers

### A) Getting started

When first using KSS-Node, it's necessary to ensure that some technologies are installed on your computer.

#### Step 1: Install a LAMP stack

[LAMP](http://en.wikipedia.org/wiki/LAMP_(software_bundle)) is an acronym which stands for
'Linux, Apache, MySQL, PHP' - a popular open-source combination for web development.
Some common LAMP stacks are
[WAMP](http://www.wampserver.com) (Windows, Apache, MySQL, PHP) and
[MAMP](http://www.mamp.info) (Mac, Apache, MySQL, PHP).

While KSS Node runs on [node.js](http://nodejs.org), this fork is designed for use with PHP-based sites,
such as those running on
[Drupal](http://drupal.org),
[Silverstripe](http://www.silverstripe.com), or
[Wordpress](http://wordpress.org).

The intention is that the KSS Styleguide becomes a 'living' part of the site,
integrated into the stylesheets and the CMS front-end, so that the Styleguide stays up to date
as your site changes and grows.

As your site should already be running on a PHP CMS, installation of a LAMP stack is not covered in this documentation.

#### Step 2: Install Node

node.js aka 'Node' is a platform built on Chrome's JavaScript runtime, for easily building fast,
scalable network applications, that run in the backend, outside a browser.

Node installers are available for Windows, Mac, Linux and SunOS.

[Download and install Node](http://nodejs.org/download/).

#### Step 3: Install a Git client

KSS-node is hosted on [Github](https://github.com/).
Originally developed to simplify sharing code, GitHub has grown into the largest code host in the world.
At the heart of GitHub is an open source version control system
(VCS) called [Git](http://git-scm.com/book/en/Getting-Started-Git-Basics).

It's important that you stay up-to-date with any changes to our fork of the KSS-node code repository.

The easiest way to do this is to install a Git client.

Download and install the GitHub client for [Mac](http://mac.github.com/) or [Windows](http://windows.github.com/).

#### Step 4: Download a copy of our code

1. Launch the Github client application
1. If using Windows, click 'tools' > 'options' to see where your 'default storage directory' is, or to change this
1. Sign in to Github (create an account if haven't done so already).
You must be signed in, in order to complete the cloning step.
1. Navigate to our kss-node project homepage:
<https://github.com/dotherightthing/kss-node/>
1. Clone our fork of kss-node by clicking the 'Clone in Windows' or 'Clone in Mac' button, as appropriate.
[Cloning](http://gitref.org/creating/#clone) allows you to grab a copy of a project,
so you can look at it or use the code.
1. `dotherightthing/kss-node` will be added to your local repositories
1. Close the Github client application

#### Step 4a: Update your copy of our code

1. Launch the Github client application
1. In the list of cloned 'Repositories', double-click the `dotherightthing/kss-node` item
1. Click the `Sync Branch` button, in the top right-hand corner of the Github client application

Note: After updating, you should regenerate any Styleguides that you are maintaining,
so that the changes are pulled through to your respective projects.

#### Step 5: Install the KSS binary

1. Open Terminal (OS X) or a Command Prompt (Windows: `Start > Run > `cmd` > Enter`)
1. Type `sudo npm install -g kss` (OS X) or `npm install -g kss` (OS X) and press `Enter`
1. This will tell NPM (the Node Package Manager, installed with NodeJS) to install the KSS binary
1. Leave Terminal (OS X) or the Command Prompt (Windows) open for Step 6

#### Step 6: Install the KSS-Node dependencies

1. Navigate to your local kss-node directory using Terminal or a Command Prompt:
1. Type `cd` ('Change Directory') followed by a space and then the path to the location you
downloaded our code to, eg `cd /Users/Dan/github/kss-node/` (OS X) or `cd ﻿C:\Files\Websites\GitHub\kss-node` (Windows)
1. Type `sudo npm install -g` (OS X) or `npm install -g` (Windows) and press `Enter`
`. This will tell NPM (the Node Package Manager, installed with NodeJS) to install the kss-node dependencies. The
`-g` ('global') flag tells OS X to copy the files to `/usr/local/lib/node_modules/kss/

### B) Per-project set-up

Please ensure that you have completed (A) 'Getting started', before starting your project set-up.

When setting up a new website, or adding a styleguide to an existing site, there are a few
set-up tasks that you need to perform.

#### Step 1: Set up the Styleguide structure

1. Move your site stylesheets to a separate folder if they are not already in one, eg: `/path/to/resources/styles`
1. Create a 'styleguide' folder within your project.
Typically this would be a sibling of the folder which contains your site stylesheets,
eg: `/path/to/resources/styleguide`
1. Create a dynamic project template page, that will pull in the external styleguide 'template'.
This file should be similar to your existing site templates, in that it should include all project assets such as
CSS, JS etc, and use the same structural markup.
Boilerplate files are available at <https://github.com/dotherightthing/kss-node/blob/master/demo-dotherightthing/public/styleguide>

#### Step 2: Create a configuration file

I've created a small Automator application (OS X only) which handles population of the Styleguide folder,
including regeneration of the styleguide.

If you're using Windows (as some of our contractors are),
you'll need to ask someone on a Mac to complete this step for you.

The first time you use the application with any project, you will need to create a configuration file:

1. Create a configuration file for the application by making a copy of the [config-demo.plist](https://github.com/dotherightthing/kss-node/blob/master/demo-dotherightthing/private/styleguide/user/config-demo.plist) file,
renaming this so that you remember which project it is for (as you could end up having different configuration
files for different projects). Configuration files live in the kss-node repository that you cloned from GitHub
to your local machine, eg: `/Users/Foo/kss-node/demo-dotherightthing/private/styleguide/user/`.
1. Open up your configuration file in a text editor. The file uses an XML structure and is commented to indicate
the `<string>` value that is expected for each configuration option.
1. Update the various `<string>` values to suit your project.
1. Save and close the configuration file

### C) Using the generator to create or recreate a Styleguide

#### Step 1: Set up a toolbar shortcut to the run the generator (OS X only)

1. Install [aLaunch](http://mactips-lib.net/m/software/alaunch/en/main.html)
1. On the top toolbar click on the pencil icon and select *Preferences*
1. Select *Item list*
1. In the left hand pane, select the Group named *Fast launch*
1. In the right hand pane, click the `+` icon
1. Browse to the `regenerate-styleguide.app` that lives in the kss-node repository that you cloned from GitHub
to your local machine, eg: `/Users/Foo/kss-node/demo-dotherightthing/private/styleguide/update/regenerate-styleguide.app`
1. Click *OK*
1. In  the 'General' tag, check 'Auto Launch at Startup'

#### Step 2a: Run the generator from the toolbar shortcut

1. Click the pencil icon and select *regenerate styleguide*
1. OS X: The generator will open a Finder window in the background
1. OS X: Press `Command+Tab` to tab to the Finder icon, then release so that the window moves to the foreground
1. The application has opened the directory containing your configuration files
1. Double-click a configuration file to use those options

#### Step 2b: Run the generator without the toolbar shortcut

1. Browse to the `regenerate-styleguide.app` that lives in the kss-node repository that you cloned from GitHub
to your local machine, eg: `/Users/Foo/kss-node/demo-dotherightthing/private/styleguide/update/regenerate-styleguide.app`
1. Double-click on the app to run it
1. OS X: The generator will open a Finder window in the background
1. OS X: Press `Command+Tab` to tab to the Finder icon, then release so that the window moves to the foreground
1. The application has opened the directory containing your configuration files
1. Double-click a configuration file to use those options

#### Step 3: View the generated styleguide

1. When the generator has finished running, you will have the option to close the application
or open the styleguide in a web browser

#### Step 4: Debugging common problems

1. Some modifiers are not output in the styleguide
  1. Check that the modifier is followed by a description: `.mymodifier - my description`
  1. Remove any empty lines from the KSS code
1. The Styleguide is generated but the Styleguide page is blank
  1. Navigate to the Styleguide homepage then select the desired page from the dropdown,
this will eliminate the possibility that the desired index comment has been removed from the stylesheets
  1. Remove any empty lines from the end of the stylesheet files
1. There are duplicate entries in the styleguide
  1. Check that an SVN update has not created multiple copies of a conflicted file/stylesheet
1. The second dropdown menu is not populated
  1. Sections should be named as: `Styleguide 7` (not `Styleguide 7.`)
  1. Sub-sections should be named as: `Styleguide 7.1` (not `Styleguide 7.1.` or `Styleguide 7.1.0`
which registers as a sub-sub-section)
  1. Sub-sub-sections should be named as: `Styleguide 7.1.1` (not `Styleguide 7.1.1.`)
1. Only the styleguide index page generates
  1. If retrofitting an older project that makes extensive use of `@import "foo.css";` in 'importer' stylesheets,
you may need to target the `imported` folder, instead of the parent `styles`/`css` folder

#####Error: Cannot call method 'match' of undefined

This was caused by this malformed KSS comment:

    /*
    Markup:
    <section class="build-block-header">
        <div class="image"><!-- full-width background image --></div>
        <div class="container"><!-- fixed width wrapper --></div>
    </section>
    */

### D) Authoring KSS

#### Create a Styleguide section

Sections are created with the text: `Styleguide N`, where 'N' is the number of the section.

This creates an entry in the topmost dropdown menu in your styleguide.

If your site can dynamically merge stylesheets, it's a good idea to have a separate stylesheet for each section of
the Styleguide. This makes it easy to find styles when viewing a Styleguide,
and gives you a good structure for the Styleguide.

For example:

* typography.css = "Typography": `Styleguide 1`
* scaffolding.css = "Scaffolding": `Styleguide 2`
* forms.css = "Forms": `Styleguide 3`

Note that `Styleguide 0` is reserved for use by the Styleguide 'splash' page and should not be used.

##### Example:

The example below demonstrates the code that should appear at the top of your stylesheet.

Please note that, within the KSS comment:

* multiline comment syntax is used
* the code is not indented
* the text after the opening comment will appear in the menu
* we include the name of the source file for easy debugging
* there is a short description
* there is no Markup block (we'll see this later)
* we finish with the TOC (Table of Contents) index, with no trailing period

```css
/*
Typography

src: typography.css

Text styles.

Styleguide  1
*/
```

#### Create a Styleguide sub-section

Sub-sections are created with the text: `Styleguide N.n`,
where 'N' is the number of the section, and 'n' is the number of the sub-section.

This creates an entry in the dropdown *below* the topmost dropdown menu in your styleguide.

Sub sections are useful for documenting components.

For example:

* forms.css - Styleguide 3
   * "Forms - Textareas" - `Styleguide 3.1`
   * "Forms - Text fields" - `Styleguide 3.2`
   * "Forms - Select menus" - `Styleguide 3.3`

##### Example:

The example code below demonstrates the code that you could use to document a component.

Please note that, within the KSS comment:

* multiline comment syntax is used
* the code is not indented, except for the Markup HTML, which is indented using **spaces** (rather than tabs)
* the text after the opening comment will appear in the menu
* there is a short description
* `Markup:` appears on its own line
* the HTML markup
   * is optional, but is best included, otherwise the Styleguide could make false assumptions
about how widely styles are supported
   * has been wrapped in `<div class="content"></div>` because this is the way the styles have been defined
   * the HTML comments `<!-- START EXAMPLE -->` and `<!-- END EXAMPLE -->` demarcate the portion of the code
that should be copied when integrating the code (ie `<div class="content"></div>` must wrap the example
markup, but does not need to be included with every component.
   * can span multiple lines
   * cannot contain any blank lines
   * should include **one** instance of `class="{$modifiers}"`, meaning that your code should be able to be altered at a single point
   * will be displayed in the Styleguide both as source code and as rendered HTML
* the list of classes ('modifiers')
   * are preceded and followed by a blank line
   * each start with a period and are followed by space-dash-space then a short description of what the modifier does
   * will each be displayed in the Styleguide as an additional block of rendered HTML, for visual comparison
   * can string together multiple classes, but this does not mean that your CSS rules need to target all of these classes
* the actual CSS rules:
   * will only be included in the Styleguide if they were mentioned in the modifiers list
      * the `.crazy` pink/orange class will not appear in the Styleguide, as it was not included in the modifier list
      * the first, classless `input` **will** appear in the Styleguide, as the 'Default' layout
* we finish with the TOC (Table of Contents) index, with no trailing period
* the KSS comments *will* make your stylesheet larger, but you should be using either manual or automated
minification as part of your development flow, which means that these comments will be stripped from your
production stylesheets
* the KSS comment precedes the code that it described; the generator does not actually mind where the KSS comment is,
but for readability by developers, it is best to keep it close to the CSS source

```css
/*
Forms - Textfield

A textbox for data entry.

Markup:
<div class="content">
  <!-- START EXAMPLE -->
  <div class="input-text">
    <input type="text" size="20" value="Textfield" class="{$modifiers}" />
  </div>
  <!-- END EXAMPLE -->
</div>

.focus - indicates that the element has been focussed by the user
.invalid - indicates that the data entered into the input is invalid
.disabled - indicates that the textfield cannot be edited

Styleguide 3.1
*/

	.content .input-text input {
		color: black;
		padding: 5px;
		border: 1px solid black;
	}
	.content .input-text input.focus {
		border-color: yellow;
	}
	.content .input-text input.invalid {
		color: red;
		border-color: red;
	}
	.content .input-text input.disabled {
		color: grey;
		border-color: grey;
	}
	.content .input-text input.crazy {
		color: pink;
		border-color: orange;
	}
```

#### Create a Styleguide sub-sub-section

Deeper sections can be created using the same approach as above, but using an additional period and numeral
in the Styleguide index comment.

#### Create a Styleguide placeholder

Placeholder styles can easily be created as follows. This allows styles to be filled in gradually,
while understanding what is left to do.

Note that modifiers cannot be combined, in this scenario.

```css
/*
Buttons (TODO)

Links, buttons etc

Markup:
<div class="styleguide-placeholder">
  <img src="/sites/all/themes/mysite/images/ui/placeholders/{$modifiers}.png" alt="{$modifiers}" title="{$modifiers}" />
  <div class="styleguide-overlay"></div>
</div>

.button-green - Green button
.button-purple - Purple button

Styleguide 9.9.
*/
```

#### Helper styles that are available

There are a handful of `styleguide-` name-spaced classes available for use when authoring your styleguide:

1. `.styleguide-reveal` - adds a light grey background color and an 8px bottom margin, can be nested
1. `.styleguide-reveal-bottomless` - as above, without the bottom margin
1. `.styleguide-reveal-light` - alternative with a lighter background colour
1. `.styleguide-block-20` - forces display block and a height of 20 pixels
1. `.styleguide-block-50` - forces display block and a height of 50 pixels
1. `.styleguide-clear` - clears preceding floats
1. `.styleguide-divider` - break an example in two, useful for explanatory headings
1. `.styleguide-nofloat` - disables floating on the element
1. `.styleguide-hidden` - hides the element

## TODO

This boilerplate is a work-in-progress.

As time allows I'd like to address the following:

1. This documentation - Add some way to check that the correct version of Node is installed
1. This documentation - Add some way to check that the correct version of the Github client is installed
1. This documentation - Add some way to check that the correct version of the KSS binary is installed
1. This documentation - Add some information on keeping the KSS binary up to date
1. This documentation - Add some information on keeping the KSS Node dependencies up to date
1. This documentation - Add a diagram explaining how the system works, so that the role of the generator,
KSS template and PHP boilerplate are clarified
1. This documentation - Screencast summary
1. This documentation - Revise the demo to match the examples in the documentation, and link to this
from the documentation
1. Generator - create a .bat (batch) file, or Adobe Air app to allow project setup via Windows
1. Generator - test what happens when this is run on `.scss` files
1. Generator - test what happens when this is run on `.less` files
1. Boilerplate - add boilerplate file for Wordpress
1. Boilerplate - rename the project directory from `demo-dotherightthing` to `php-boilerplate`, or something similar
1. Configuration file - Add an option to include jQuery, in case it is not available in the parent project
1. Github - apply to merge changes with the original kss-node project, if appropriate
1. Generator - doesn't work when the config file contains paths with spaces, even when these are escaped or quoted
1. Generator - prevent other Terminal windows (like SASS compiler) from being closed when the Generator is closed

