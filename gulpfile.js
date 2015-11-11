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


  switch (config.server.linter.default) {
    case 'sass-lint':
      var sassLint = require('gulp-sass-lint');
      break;
    case 'scss-lint':
      var scssLint = require('gulp-scss-lint');
      break;
  }


  /**
   * Serve Task.
   *
   * Compiles everything in the current environment, starts up a dev server and
   * launches browser windows for site and styleguide.
   *
   */
  gulp.task('serve', function() {
    gutil.log('Current environment: ' + gutil.colors.red((production() ? 'production' : 'development')));

    // Add close-tab on gulp-exit functionality.
    browserSync.use({
      plugin: function () { /* noop */ },
      hooks: {
        'client:js': require("fs").readFileSync('./browsersync-client-events.js', 'utf-8')
      }
    });
    // Static Server init.
    browserSync.init({
      proxy: {
        target: config.server.ip,
        reqHeaders: function () {
          return {
            host: config.server.domain
          };
        }
      }
    }, function(){
      gutil.log('Finished browserSync init');
      gulp.start('styleguide_browser');
    });

    // Initialize watch task for sass.
    var sass_watcher = gulp.watch('scss/**/*.scss', runSequence(['sass', 'styleguide'], 'scss-lint'));

    // Todo: Missing regenerate on Section Changes:
    // On add/edit section generated CSS code, you need to reload the Styleguide
    // manually in Browser or run the styleguide_dev task.
    sass_watcher.on('change', function(event) {
      gutil.log('File ' + event.path + ' was ' + event.type);
    });

    var scripts_watcher = gulp.watch('js/*.js', ['scripts']);

    scripts_watcher.on('change', function(event) {
      gutil.log('File ' + event.path + ' was ' + event.type);
    });

    // Initialize watch task for Styleguide template files.
    var styleguide_watcher = gulp.watch(
      [
        'styleguide-template/**/index.html',
        'styleguide-template/**/template_config.js',
        'styleguide-template/guru-handlebars/template/public/kss.scss'
      ],
      ['styleguide_dev']);
    styleguide_watcher.on('change', function(event) {
      gutil.log('File ' + event.path + ' was ' + event.type);
    });

  });


  /**
   * Compile SASS to css Task.
   *
   */
  gulp.task('sass',['abstract'], function () {

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
      .pipe(browserSync.stream());
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
      .pipe(browserSync.stream());
  });


  /**
   * Build KSS-Styleguide and reload browser at end.
   *
   */
  gulp.task('styleguide_dev', ['styleguide-sass'],  function(callback) {
    return runSequence('styleguide', 'styleguide_browser_reload', callback);
  });


  /**
   * Only build KSS-Styleguide Task.
   *
   */
  gulp.task('styleguide',['abstract'], shell.task([
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
  gulp.task('styleguide_browser_reload', function(){
    browserSync.reload(["*.html", "kss.css"]);
  });


  /**
   * Open KSS-Styleguide url in default browser.
   *
   */
  gulp.task('styleguide_browser', function(){
    // Open KSS Styleguide.
    // There MUST be a valid file sourced. What is not important.
    // See: https://github.com/stevelacy/gulp-open/issues/15.
    gulp.src('./package.json')
      .pipe(open(config.server.styleguide));
  });


  /**
   * SCSS-lint task.
   *
   * This will use the config stored in ./scsslint-drupal.yml or scsslint-drupal.yml
   * https://github.com/brigade/scss-lint
   */
  gulp.task('scss-lint',['sass'], function() {

    switch (config.server.linter.default) {

      case 'sass-lint':

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

        break;

      case 'scss-lint':

      // Using scss-lint there is "disabling by comment" enabled.
      // e.g: // scss-lint disable single-line-per-selector
      // See: https://github.com/brigade/scss-lint#disabling-linters-via-source

      // This is the code for scss lint.
      return gulp.src('scss/**/*.scss')
        .pipe(scssLint({
          'config': 'scsslint-drupal.yml'
        }));

       break;

      default:
        gutil.log(gutil.colors.red('Scss linting is disabled!'));
        return;
    }

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
  gulp.task('docs', function() {
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
    var destination_dir = "./scss/base/",
      gulp_template = '_abstract-to-concrete.generated.scss',
      gulp_template_dir = './gulp-templates/';

    return gulp.src(gulp_template_dir + gulp_template)
      .pipe(template({
        filename: destination_dir + gulp_template,
        abstracts: all_abstracts
      }))
      .pipe(gulp.dest(destination_dir));
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
    return gulp.src(['scss/**/*.scss', '!**/*.generated.scss']).pipe(filter);
  });


  /**
   * Default Task.
   *
   * This task is run if you type "gulp".
   * Default environment is "development".
   * gulp --env production
   */
  gulp.task('default', ['serve']);

}());
