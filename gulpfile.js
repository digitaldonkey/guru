(function () {
  /*jslint node: true */
  'use strict';

  // Configuration file.
  var conf = require('./gulp.config.js');

  // Dependencies
  // will be loaded from package.json.
  // See: https://www.npmjs.com/package/gulp-load-plugins
  var plug = require('gulp-load-plugins')({
    DEBUG: false,
    pattern: [
      // The glob(s) to search for:
      'gulp-*', 'gulp.*',
      // Add non-prefixed plugins:
      'kss', 'del', 'recursive-readdir', 'yargs', 'run-sequence', 'path'
    ],
    rename: {
      'gulp-util': 'gutil'
    }
  });

  // Init gulp with gulp-help.
  var gulp = plug.help(require('gulp'));

  // Initialize variables.
  init(gulp, conf, plug);


  /**
   * Default Task.
   *
   * This task is run if you type "gulp".
   * Default environment is "development".
   * gulp --env production
  */
  gulp.task('default', 'The default task is run if you just type "gulp"', [], function (cb) {
    return plug.sequence('help', 'serve', cb);
  });


  /**
   * Serve Task - This is the default task.
   *
   * This task is executed when you just type gulp in the theme directory.
   *
   * Compiles everything in the current environment, starts up a dev server and
   * launches browser windows for site and styleguide.
   */
  gulp.task('serve', '♥♥♥ Build, start browserSync, init watching and launch browser.', function(cb) {
    // Initialize watch task and launch a window with styleguide.
    return plug.sequence(
      ['build'],
      ['browser-sync-init'],
      ['styleguide-browser-launch']
    );
  }, {
    aliases: ['s', 'server']
  });



  /**
   * Default Task for Production.
   *
   * This task will compile everything with the environment set to "production".
   *
   * Alternatively you could run the browserSync server with environment set to
   * production, by starting gulp with:
   * gulp --env production
   *
   */
  gulp.task('production', '♥ Runs all tasks once in production mode. JS/CSS minification will take place.', function(cb){
    plug.environments.current(plug.environments.production);
    return plug.sequence('build', cb);
    },
    // Options for gulp-help.
    {
    aliases: ['p', 'prod']
  });



  /**
   * Build.
   *
   * This task will compile everything.
   *
   */
  gulp.task('build', 'Runs all build tasks once. This task is called by serve and production tasks --> the parameters can be used with all other tasks.', function(cb){
    plug.sequence(
      ['svg-generate-abstract'],
      ['scripts', 'kss-sass', 'styleguide-and-sass'],
      cb
    );
  }, {
    // Options for gulp-help.
    options: {
      'env=development (default)': 'Run all tasks in development mode. Sourcemaps, no minification.',
      'env=production': 'Alternatively you can run all tasks in production mode.',
      'no-styleguide': 'Disable styleguide rendering.',
      'no-linter': 'Disable current linter.'
    }
  });



  /**
   * Watch Task - Initializing watch-tasks.
   *
   */
  gulp.task('watch', 'Watch all tasks. Implied by serve task, but can be run independently. E.g: Running browsersync in a docker environment.', function(cb) {

    plug.gutil.log('Current environment: ' + plug.gutil.colors.red((plug.environments.production() ? 'production' : 'development')));

    //
    // SASS watcher:
    //
    gulp.watch(['scss/**/*.scss', '!**/*.generated.scss'], ['styleguide-and-sass'])
      .on('change', function(event, y) {
        plug.gutil.log('File ' + event.path + ' was ' + event.type);
      });

    //
    // JAVASCRIPT watcher
    //
    gulp.watch(['js/**/*.js', '!js/**/*.min.js'], ['scripts'])
      .on('change', function(event) {

        plug.gutil.log('File ' + event.path + ' was ' + event.type);

        var filename = event.path.replace(/^.*[\\\/]/, '').replace('.js', '.min.js');

        plug.gutil.log('#javascript watcher: filename: ' + filename);

        // Tell browser sync to reload.
        plug.bs.reload('**/' + filename, {stream: true});

      });

    //
    // SVG watcher
    //
    gulp.watch('svg/**/*.svg', ['svg'])
      .on('change', function(event) {
        plug.gutil.log('File ' + event.path + ' was ' + event.type);
      });

    //
    // STYLEGUIDE TEMPLATE watcher
    //
    gulp.watch(
      [
        conf.styleguide.template + '/**/*.hbs',
        conf.styleguide.template + '/**/*.js',
        conf.styleguide.template + '/**/*.scss'
      ],
      ['kss-template']
    )
    .on('change', function(event) {
      plug.gutil.log('File ' + event.path + ' was ' + event.type);
    });


    //
    // STYLEGUIDE_HTML reload watcher
    //
    gulp.watch(['css/**/*.css'])
      .on('change', function(event) {

        plug.gutil.log('#css_watcher ' + event.path + ' was ' + event.type);

        var filename = event.path.replace(/^.*[\\\/]/, '');

        plug.gutil.log('#css_watcher: filename: ' + filename);

        plug.bs.reload('**/' + filename);
    });

    //
    // STYLEGUIDE_HTML reload watcher
    //
    gulp.watch(conf.styleguide.destination + '/**/*.html')
        .on('change', function(event) {

          //plug.gutil.log('#styleguide watcher  ' + event.path + ' was ' + event.type);

          var filename = event.path.replace(/^.*[\\\/]/, '');

          // BrowserSync will trigger full reload if anything but css is changed.
          gulp.src(event.path)
            .pipe(plug.cached(event.path, {optimizeMemory: true}))
            // .pipe(plug.debug({title: 'Change detected at ' + filename}))
            .pipe(plug.bs.reload({stream: true}));
        });

    cb();
  }); // END watch.



  /**
   * Build Styleguide and Sass.
   *
  */
  gulp.task('styleguide-and-sass', 'Default rendering wrapper task.', ['abstract'], function(cb){

    // Enable commandline arg --no-styleguide.
    if (conf.argv.styleguide !== undefined) {
      conf.styleguide.isEnabled = conf.argv.styleguide;
    }

    if (conf.styleguide.isEnabled) {
      plug.sequence(['styleguide', 'sass']);
    }
    else {
      return plug.sequence(['sass']);
    }

    if (conf.linter.default) {
      plug.sequence(['scss-lint']);
    }
    cb();
  });


  /**
   * Inline SVG abstracts.
   *
   * Avoiding long SCSS compile times by generating extends for each file in /svg directory.
   *
   * Basically we will create a css file "kss-inline-svg.generated.css" containing:
   *
   *  .svg-<filename>{ background url(background: url("data:image/svg+xml;charset=utf-8,....")}
   *
   * for each <file>.svg found in /svg and subfolders
   * and scss file "abstractions/_inline-svg.generated.scss" containing
   *
   * %svg-<filename> {background: url("data:image/svg+xml;charset=utf-8,....")}
   *
   * Checkout gulp-tasks/svg-generate-abstract.js for details and templates in "gulp-templates".
  */
  gulp.task('svg', 'Generates inline-svg extends ("abstractions/_inline-svg.generated.scss" and "kss-inline-svg.generated.css").', ['svg-generate-abstract'], function(cb){
    return plug.sequence(
      ['sass'],
      ['styleguide'],
      ['styleguide-browser-reload']
    );
  });


  /**
   * Build KSS-Styleguide and reload browser at end.
   *
  */
  gulp.task('kss-template', 'Rerender Styleguide template.', ['kss-sass'],  function(cb) {
    return plug.sequence('styleguide-and-sass', cb);
  });


  /**
  * Inistialize variables.
  *
  */
  function init(gulp, conf, plug) {

    // Initialize BrowserSync.
    // See: http://www.browsersync.io/docs/options/
    plug.bs = require('browser-sync').create();

    // Required to run tasks in series. By default gulp runs asynchronously.
    plug.sequence = plug.runSequence.use(gulp);

    // Add command line arguments to conf.
    conf.argv = plug.yargs.argv;

    // Initialize abstract array.
    conf.abstracts_list = [];

    // Initialize default postcss processors.
    // See: https://github.com/postcss/gulp-postcss
    conf.postcssProcessors = [
      require('autoprefixer')(conf.autoprefixer)
    ];

    // Autoload Tasks:
    //
    // All not-meta tasks are located in the directory:
    //
    //   ./gulp-tasks/<taskname>.js
    //
    // https://github.com/digitaldonkey/gulp-require-tasks
    // Forked gulp-require-tasks to support gulp help!
    //
    // Concept based on:
    // http://macr.ae/article/splitting-gulpfile-multiple-files.html#approach-two
    //
    plug.requireTasks({
      path:  __dirname + '/gulp-tasks',
      arguments: [conf, plug],
      gulp: gulp
    });
  }

}());


/**
 *  Environments
 *  With this we can use e.g.:
 *    .pipe(plug.environments.development(plug.sourcemaps.init()))
 * or
 *    .pipe(production(plug.uglify()))
 * var development = environments.development,
 *    production = environments.production;
 */

//changedInPlace = require('gulp-changed-in-place');


// environments = require('gulp-environments'),
// development = plug.environments.development,
// production = plug.environments.production,

// Logging/debug Helper plug.gutil. Usage:
// plug.gutil.log('My message ' + plug.gutil.colors.red('is partly red'));
//gutil = require('gulp-util');
// Helpers.
// recursiveReaddir = require('recursive-readdir'),
// path = require('path'), --> ???
//del = require('del'),
// kss = require('kss'),
// postcss = require('gulp-postcss'),
//plumber = require('gulp-plumber'),
//rename = require('gulp-rename'),
// Filtering for Abstracts.
// filter = require('gulp-filter'),
// replace = require('gulp-replace'),
// Enables rewriting templets. See: /gulp-templates/...
// template = require('gulp-template'),
// Javascript minification and comment removal.
// Only used in environment production. Usage:
//    gulp --env production
// or compile only with:
//    gulp production
// uglify = require('gulp-uglify'),
// Enable opening of KSS-Styleguide in browser.
// open = require('gulp-open'),
// libsass/sassc implementation:
// sass = require('gulp-sass'),
// Enable @import 'components/*' with libsass.
// sassGlob = require('gulp-sass-glob')
// How to use sourcemaps:
// Watch: https://www.youtube.com/watch?v=-ZJeOJGazgE
// sourcemaps = require('gulp-sourcemaps'),
// This is required for README generation for developers.




