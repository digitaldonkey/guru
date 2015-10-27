////////////////////////
// Required
////////////////////////

var gulp = require('gulp'),
		// sassc/libsass implementation.
		sass = require('gulp-sass'),
		sourcemaps = require('gulp-sourcemaps'),
		autoprefixer = require('gulp-autoprefixer'),
		plumber = require('gulp-plumber'),
		rename = require('gulp-rename'),

		// Reload Browser sync.
		// See: http://www.browsersync.io/docs/options/
		browserSync = require('browser-sync').create(),

		// Javascript:
		uglify = require('gulp-uglify'),

		// Debugging: gutil.log(err)
		gutil = require('gulp-util'),

		// Gulp-shell is required to use kss-node.
		shell  = require('gulp-shell');


////////////////////////
// Serve Task
////////////////////////
gulp.task('serve', ['sass', 'styleguide'], function() {
	// Static Server init.
	browserSync.init({
		proxy: 'http://drupaleight.local.dev'
	});
	// Initialize watch task.
	gulp.watch('scss/**/*.scss', ['sass', 'styleguide']);
});


////////////////////////
// SASS Task
////////////////////////
gulp.task('sass', function () {
	return gulp.src('scss/*.scss')
		.pipe(plumber())
		.pipe(sass({
			//outputStyle: 'compressed',
			outputStyle: 'nested',
			precision: 10,
			onError: function (err) {
				gutil.log(err);
				}
		  }))
			.on('end', function(){
				gutil.log('Just an example for the end event :D');
		})
		.pipe(sourcemaps.init({
      debug: true
    }))
		//.pipe(autoprefixer({
		//	browsers: [
		//		'last 2 versions',
		//		'safari 5',
		//		'ie 9',
		//		'opera 12.1',
		//		'ios 6',
		//		'android 4'
		//	],
		//	cascade: true
		//}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('css'))
		.pipe(browserSync.stream());
});


////////////////////////
// Script Task
////////////////////////
gulp.task('scripts', function() {

// Get all JS files in folder, exclude minified ones.
	gulp.src(['js/**/*.js', '!js/**/*.min.js'])

		// Rename th output files.
		.pipe(rename({suffix: '.min'}))

		// Minify using gulp-uglify.
		.pipe(uglify())

		// Save output files.
		.pipe(gulp.dest('js'))

		// Tell browser sync to reload.
		.pipe(browserSync.stream());
});


////////////////////////
// Build Styleguide.
////////////////////////
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


////////////////////////
// Browser-Sync Tasks
////////////////////////
// Notes: ".local" domains are very slow.
// See: http://stackoverflow.com/questions/24807786/browsersync-extremely-slow
// So we Exclude the DNS requests DNS.
// See: http://stackoverflow.com/questions/31143913/browsersync-proxy-to-homestead-really-slow
gulp.task('browser-sync', function() {
	browserSync.init({
    proxy: {
      target: '127.0.0.1',
      reqHeaders: function (config) {
       return {
          host: 'drupaleight.local'
        };
      }
    }
	});
});


////////////////////////
// Default Task
////////////////////////
gulp.task('default', ['serve']);


////////////////////////
// TODO
////////////////////////

// Fix sourcemaps which are currently not working.
// They won't work together with autoprefixer in this way.
// See: https://github.com/floridoo/gulp-sourcemaps/issues/60
// AND https://github.com/postcss/autoprefixer/issues/368

// Remove comments in rendered CSS, Minify CSS.

// scss-lint
// https://github.com/brigade/scss-lint

// Improve Non-Globbing aggregation
// https://www.npmjs.com/package/gulp-cssimport

// improve Error handling?!
// https://gist.github.com/floatdrop/8269868
