(function () {
  /*jslint node: true */
  'use strict';

  ////////////////////////
  // Required
  ////////////////////////

  /**
   * Local_config.
   */
  var local_config = {
      server: {
        domain: 'drupaleight.local',
        ip: '127.0.0.1'
      },
      autoprefixer: {
        browsers: [
          'last 2 versions',
          'safari 5',
          'ie 9',
          'opera 12.1',
          'ios 6',
          'android 4'
        ]
      },
      styleguide: {
        uri: 'http://localhost:3000/sites/all/themes/_custom/digitaldonkey/styleguide/index.html'
      }
    },

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
  autoprefixer = require('gulp-autoprefixer'),
  scsslint = require('gulp-scss-lint'),
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
  runSequence = require('run-sequence'),

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
   */
  gulp.task('serve', ['scss-lint', 'sass', 'styleguide', 'scripts'], function() {
    gutil.log('Current environment: ' + gutil.colors.red((production() ? 'production' : 'development')));

    // Static Server init.
    browserSync.init({
      proxy: {
        target: local_config.server.ip,
        reqHeaders: function (config) {
          return {
            host: local_config.server.domain
          };
        }
      }
    }, function(){
      gutil.log('Finished browserSync init');
      gulp.start('stylguide_browser');
    });

    // Initialize watch task for sass.
    var sass_watcher = gulp.watch('scss/**/*.scss', ['sass', 'styleguide', 'scss-lint']);
    sass_watcher.on('change', function(event) {
      gutil.log('File ' + event.path + ' was ' + event.type);
    });

    // Initialize watch task for Styleguide template files.
    // Todo: Missing regenerate on Section Changes:
    // On add/edit section generated CSS code. Reload by default will be slower when working only on components.
    var stylguide_watcher = gulp.watch(
      ['styleguide-template/**/index.html','styleguide-template/**/template_config.js'],
      ['styleguide_dev']);
    stylguide_watcher.on('change', function(event) {
      gutil.log('File ' + event.path + ' was ' + event.type);
    });

  });


  /**
   * Compile SASS to css Task.
   *
   */
  gulp.task('sass', function () {
    return gulp.src('scss/main.scss')
      .pipe(plumber())
      //.pipe(sourcemaps.init())
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
          gutil.log('Just an example for the end event :D');
      })

      // Workaround for Sourcemaps.
      // See: https://github.com/floridoo/gulp-sourcemaps/issues/60
      // Todo Sometimes there's still strange behavior: Referencing wrong files.
      .pipe(development(sourcemaps.write({includeContent: false})))
      .pipe(development(sourcemaps.init({loadMaps: true})))

      //.pipe(sourcemaps.write({includeContent: false}))
      //.pipe(sourcemaps.init({loadMaps: true}))
      .pipe(autoprefixer({
        browsers: local_config.autoprefixer.browsers,
        cascade: true
      }))
      .pipe(development(sourcemaps.write('.')))
      //.pipe(sourcemaps.write('.'))
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
  gulp.task('styleguide_dev', function(callback) {
    return runSequence('styleguide', 'styleguide_browser_reload', callback);
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
        template: 'styleguide-template/handlebars/template'
        // Alternative:
        // See: https://github.com/htanjo/kss-node-template
        // template:     'kss-node-template/template'
      }
    }
  ));


  /**
   * KSS-Styleguide browser reload.
   *
   */
  gulp.task('styleguide_browser_reload', function(){
    browserSync.reload("*.html");
  });


  /**
   * Open KSS-Styleguide url in default browser.
   *
   */
  gulp.task('stylguide_browser', function(){
    // Open KSS Styleguide.
    var options = {
      uri: 'http://localhost:3000'
    };
    // There MUST be a valid file sourced. Whih is not important.
    // See: https://github.com/stevelacy/gulp-open/issues/15.
    gulp.src('./package.json')
      .pipe(open(local_config.styleguide));
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
   * SCSS-lint task.
   *
   * This will use the config stored in ./scsslint-drupal.yml
   * https://github.com/brigade/scss-lint
   */
  gulp.task('scss-lint', function() {
    return gulp.src('scss/**/*.scss')
      .pipe(scsslint({
        'config': 'scsslint-drupal.yml'
      }));
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

