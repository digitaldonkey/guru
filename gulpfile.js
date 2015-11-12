(function () {
  /*jslint node: true */
  'use strict';

  ////////////////////////
  // Required
  ////////////////////////

  /**
   * config.
   */
  var config = require('./gulp.config.js'),

    /**
     * Gulp dependencies.
     *
     */
    gulp = require('gulp'),

  // libsass/sassc implementation:
    environments = require('gulp-environments'),
    sass = require('gulp-sass'),

  // Enable @import 'components/*' with libsass.
    sassGlob = require('gulp-sass-glob'),

  // How to use sourcemaps:
  // Watch: https://www.youtube.com/watch?v=-ZJeOJGazgE
    sourcemaps = require('gulp-sourcemaps'),

  // Autoprefixer
  // See: https://github.com/postcss/autoprefixer
    autoprefixer_cnf = require('./gulp.autoprefixer.config.js'),
    autoprefixer = require('gulp-autoprefixer'),

    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),

  // Reload BrowserSync.
  // See: http://www.browsersync.io/docs/options/
    browserSync = require('browser-sync').create(),

  // Javascript minification and comment removal.
  // Only used in environment production. Usage:
  //    gulp --env production
  // or compile only with:
  //    gulp production
    uglify = require('gulp-uglify'),

  // Logging/debug Helper gutil.
  // e.g.
  // gutil.log('My message ' + gutil.colors.red('is partly red'));
    gutil = require('gulp-util'),

  // Styleguide (kss-node) requires gulp-shell to be run.
    shell  = require('gulp-shell'),

  // Enable opening of KSS-Styleguide in browser.
    open = require('gulp-open'),

  // Required in order to have a KSS-Finished callback to reload Styleguide.html.
  // Without gulp works asynchronous!
    runSequence = require('run-sequence').use(gulp),

  // This is just required for deployment. It has a dependency on pandoc.
    pandoc = require('gulp-pandoc'),

  // Required Abstract-to-real-CSS Task: abstract
    del = require('del'),

  // Filtering for Abstracts.
    gulpFilter = require('gulp-filter'),
    replace = require('gulp-replace'),

  // Enables rewriting templets. See: /gulp-templates/...
    template = require('gulp-template'),
    path = require('path'),

  // debug = require('gulp-debug'),

    /**
     *   Environments
     *  With this we can use e.g.:
     *    .pipe(development(sourcemaps.init()))
     * or
     *    .pipe(production(uglify()))
     * var development = environments.development,
     *    production = environments.production;
     */

    development = environments.development,
    production = environments.production;

  /**
   * Serve Task.
   *
   * Compiles everything in the current environment, starts up a dev server and
   * launches browser windows for site and styleguide.
   *
   */
  gulp.task('serve', ['sass','scripts'], function() {

    // Close-tab on gulp-exit with a client side script.
    browserSync.use({
      plugin: function () { /* noop */ },
      hooks: {
        'client:js': require("fs").readFileSync('./browsersync-client-events.js', 'utf-8')
      }
    });

    // Static Server init.
    browserSync.init({
      proxy: {
        target: config.current.ip,
        reqHeaders: function () {
          return {
            host: config.current.domain,
            // Make sure Drupal will not send compressed stuff to browserSync.
            "accept-encoding": "identity"
          };
        }
      }
    },
    function(){

      // Finished init. Now start Browser and linter.
      gulp.start('styleguide-browser','linter');

      // Lint after serving to browser.
      browserSync.emitter.on("stream:changed", function () {
        gulp.start('linter');
      });

      /*
       * Watcher.
       */

      // Initialize watch task for sass.
      var sass_watcher = gulp.watch([
        'scss/**/*.scss',
        '!scss/**/scsslint_tmp*',
        '!scss/**/*generated.scss'
      ], ['sass']);

      // Todo: Missing regenerate on Section Changes:
      // On add/edit section generated CSS code, you need to reload the Styleguide
      // manually in Browser or run the styleguide-template task.
      sass_watcher.on('change', function(event) {
        gutil.log('File ' + event.path + ' was ' + event.type);
      });

      // Initialize watch task for javascript files.
      var scripts_watcher = gulp.watch([
        'js/*.js',
        '!js/*.min.js'
      ], ['scripts']);

      scripts_watcher.on('change', function(event) {
        gutil.log('scripts_watcher: File ' + event.path + ' was ' + event.type);
      });

      // Initialize watch task for Styleguide template files.
      var styleguide_watcher = gulp.watch(
        [
          'styleguide-template/**/index.html',
          'styleguide-template/**/template_config.js',
          'styleguide-template/guru-handlebars/template/public/kss.scss'
        ],
        ['styleguide-template']);

      styleguide_watcher.on('change', function(event) {
        gutil.log('styleguide_watcher: File ' + event.path + ' was ' + event.type);
      });


    });
  });


  /**
   * Meta SASS Task.
   *
   * Required to get everything run in the right sequence.
   * The task abstract generates scss files to be processed later.
   */
  gulp.task('sass',['abstract'], function () {
    runSequence('styleguide', 'sass-compile');
  });

  /**
   * Compile SASS to css Task.
   *
   */
  gulp.task('sass-compile', function () {

    return gulp.src('scss/main.scss')
      .pipe(plumber())
      .pipe(sassGlob())
      .pipe(development(sourcemaps.init()))
      .pipe(sass({
        // Remove comments and minify CSS.
        outputStyle: (production() ? 'compressed': 'expanded'),
        sourcemap: true,
        precision: 10,
        onError: function (err) {
          gutil.log(err);
        }
      }))
      .on('end', function(){
        // gutil.log('Just an example for the end event :D');
      })

      // Workaround for Sourcemaps.
      // See: https://github.com/floridoo/gulp-sourcemaps/issues/60
      .pipe(development(sourcemaps.write({includeContent: false})))
      .pipe(development(sourcemaps.init({loadMaps: true})))

      .pipe(sourcemaps.write({includeContent: false}))
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(autoprefixer({
        browsers: autoprefixer_cnf.browsers,
        cascade: true
      }))
      .pipe(development(sourcemaps.write('.')))
      .pipe(gulp.dest('css'))
      .pipe(browserSync.stream({match: "**/css/main.css"}));

  });


  /**
   * Script Task.
   *
   */
  gulp.task('scripts', function() {

    // Get all JS files in folder, exclude minified ones.
    gulp.src(['js/**/*.js', '!js/**/*.min.js'])

      // Rename th output files.
      .pipe(rename({suffix: '.min'}))

      // Minify using gulp-uglify.
      .pipe(production(uglify()))

      // Save output files.
      .pipe(gulp.dest('js'))

      // Tell browser sync to reload.
      .pipe(browserSync.stream({match: "**/js/*min.js"}));
  });


  /**
   * Build KSS-Styleguide and reload browser at end.
   *
   */
  gulp.task('styleguide-template', ['styleguide-sass'],  function(callback) {
    return runSequence('styleguide', 'styleguide-browser-reload', callback);
  });


  /**
   * Only build KSS-Styleguide Task.
   *
   */
  gulp.task('styleguide', shell.task([
      // kss-node [source folder of files to parse] [destination folder] --template [location of template files]
      'kss-node <%= source %> <%= destination %> --template <%= template %>'
    ], {
      templateData: {
        source:       'scss',
        destination:  'styleguide',
        template: 'styleguide-template/guru-handlebars/template'
        // Alternative:
        // See: https://github.com/htanjo/kss-node-template
        // template:     'kss-node-template/template'
      }
    }
  ));


  /**
   * Compile SASS to css Task.
   *
   * Recompiling the templates stylesheet.
   */
  gulp.task('styleguide-sass', function () {
    return gulp.src('styleguide-template/guru-handlebars/template/public/kss.scss')
      .pipe(plumber())
      .pipe(sassGlob())
      .pipe(development(sourcemaps.init()))
      .pipe(sass({
        // Remove comments and minify CSS.
        outputStyle: 'expanded',
        sourcemap: true,
        precision: 10,
        onError: function (err) {
          gutil.log(err);
        }
      }))

      // Workaround for Sourcemaps.
      .pipe(development(sourcemaps.write({includeContent: false})))
      .pipe(development(sourcemaps.init({loadMaps: true})))

      .pipe(sourcemaps.write({includeContent: false}))
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(autoprefixer({
        browsers: autoprefixer_cnf.browsers,
        cascade: true
      }))
      .pipe(development(sourcemaps.write('styleguide-template/guru-handlebars/template/public')))
      .pipe(gulp.dest('styleguide-template/guru-handlebars/template/public'))
      .pipe(browserSync.stream());
  });

  /**
   * KSS-Styleguide browser reload.
   *
   */
  gulp.task('styleguide-browser-reload', function(){
    browserSync.reload(["**/*.html", "**/kss.css"]);
  });


  /**
   * Open KSS-Styleguide url in default browser.
   *
   */
  gulp.task('styleguide-browser', function(){
    // Open KSS Styleguide.
    // There MUST be a valid file sourced. What is not important.
    // See: https://github.com/stevelacy/gulp-open/issues/15.
    gulp.src('./package.json')
      .pipe(open(config.current.styleguide));
  });



  /**
   * linter SCSS-lint tasks.
   *
   *
   * https://github.com/brigade/scss-lint
   */
  var linter = config.current.linter.default;

  switch (linter) {

    case 'sass-lint':
      // Config in scsslint-drupal.yml.
      var sassLint = require('gulp-sass-lint');
      break;

    case 'scss-lint':
      // Config in  ./scsslint-drupal.yml.
      var scssLint = require('gulp-scss-lint');
      break;

    default:
      gutil.log(gutil.colors.red('Scss linting is disabled!'));
  }

  /*
   * Linter wrapper task.
   */
  gulp.task('linter', function() {
    if (typeof linter === 'string' && linter !== 'none') {
      gulp.start(linter);
    }
  });

  /*
   * sass-lint task.
   */
  gulp.task('sass-lint', function() {

    // Using sass-lint there is "disabling by comment" is not available.
    // https://github.com/sasstools/sass-lint/issues/70

    // The exclude is required fo fix a bug. See:
    // https://github.com/juanfran/gulp-scss-lint/issues/36#issuecomment-113196295

    return gulp.src([
      'scss/**/*.scss',
      '!**/*_scsslint_tmp*.scss',
      // Exclude reset.
      '!scss/base/__reset.scss'
    ])
      .pipe(sassLint({
        config: './sass-lint-drupal.yml'
      }))
      .pipe(sassLint.format())
      .pipe(sassLint.failOnError());

  });

  /*
   * scss-lint task.
   */
  gulp.task('scss-lint', function() {

    // Using scss-lint there is "disabling by comment" enabled.
    // e.g: // scss-lint disable single-line-per-selector
    // See: https://github.com/brigade/scss-lint#disabling-linters-via-source

    // This is the code for scss lint.
    return gulp.src([
      'scss/**/*.scss',
      // Excludes.
      '!**/*_scsslint_tmp*.scss',
      '!**/*.generated.scss'
    ])
    .pipe(scssLint({
      'config': 'scsslint-drupal.yml'
    }));
  });



  /**
   * Experimental SCSS-Abstract preprocessor.
   *
   * This should generate a additional SCSS file including all Extends used in
   * the project like the following example:
   *
   * .abstract-class {
   *   @extend abstract-class;
   * }
   *
   * This enables you to include Abstractions and Variables section everywhere,
   * without generating any output.
   */
  var all_abstracts = [];

  gulp.task('abstract', ['abstract-filter'],  function(callback) {

    return gulp.src(config.current.abstract.gulp_template_dir + config.current.abstract.gulp_template)
      .pipe(template({
        filename: config.current.abstract.destination_dir + config.current.abstract.gulp_template,
        abstracts: all_abstracts
      }))
      .pipe(gulp.dest(config.current.abstract.destination_dir));

  });

  // Filter all scss files for abstracts.
  gulp.task('abstract-filter', function(){

    // Filter out all abstract classes.
    // Names only for now.
    // https://regex101.com/r/lG4eG8/4
    // If someone writes a better regex we might include the mixing itself
    // in the Styleguide.
    var filter = gulpFilter(function(file) {

      var reg = /%([a-zA-Z-_]*)\s?\{[\s,]*\n(?=.*|\n\s)(?!\n}\s+\n)/gmi,
        item,
        text;

      if (file.contents.length) {
        text = file.contents.toString();
        while ((item = reg.exec(text)) !== null) {
          all_abstracts.push({
            id: item[1],
            path: path.relative('.', file.path)
          });
        }
      }
    });
    return gulp.src(['scss/**/*.scss', '!**/*.generated.scss', '!**/*_node_scsslint_tmp*']).pipe(filter);

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
  gulp.task('production', function(){
    environments.current(production);
    gulp.start(['sass', 'styleguide', 'scripts']);
  });


  /**
   * Generate Readme's.
   *
   * This task ist just for deployment.
   */
  gulp.task('readme', function() {
    del(['./Readme.txt', './Readme.html']);
    // Create Drupal Readme.
    gulp.src('./Readme.md')
      .pipe(pandoc({
        from: 'markdown',
        to: 'rst',
        ext: '.txt',
        args: ['--columns=80', '--smart', '--tab-stop=2', '--normalize']
      }))
      .pipe(replace(/\n\s.*::\n/g, '\n'))
      .pipe(gulp.dest('.'));

    // Create HTML Version (for Drupal.org)
    gulp.src('./Readme.md')
      .pipe(pandoc({
        from: 'markdown',
        to: 'html5+lhs',
        ext: '.html',
        args: ['--smart']
      }))
      .pipe(gulp.dest('.'));
  });


  /**
   * Default Task.
   *
   * This task is run if you type "gulp".
   * Default environment is "development".
   * gulp --env production
   */
  gulp.task('default', function(){
    gutil.log('Current environment: ' + gutil.colors.red((production() ? 'production' : 'development')));
    gulp.start(['serve']);
  });

}());
