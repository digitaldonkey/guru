// Singularity
// See: https://github.com/at-import/Singularity/wiki/Spanning-The-Grid

////////////////////////
// Required
////////////////////////

var gulp = require('gulp'),
		// sassc/libsass implementation.
		sass = require('gulp-sass'),
		sourcemaps = require('gulp-sourcemaps'),
		autoprefixer = require('gulp-autoprefixer'),
		filter = require('gulp-filter'),
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



// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'styleguide'], function() {

	browserSync.init({
		proxy: 'http://drupaleight.local.dev'
	});
	gulp.watch('scss/**/*.scss', ['sass', 'styleguide']);
});

// Compile sass into CSS & auto-inject into browsers
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
				gutil.log('Finished SASS compile.');
		})
		.pipe(sourcemaps.init())
		.pipe(autoprefixer({
			browsers: [
				'last 2 versions',
				'safari 5',
				'ie 8',
				'ie 9',
				'opera 12.1',
				'ios 6',
				'android 4'
			],
			cascade: true
		}))
			//.pipe(sourcemaps.write())
			.pipe(gulp.dest('css'))
			//.pipe(filter('css/*.css'))
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
// Watch Tasks
////////////////////////
gulp.task('watch', function() {
	gulp.watch('js/**/*.js', ['scripts']);
	gulp.watch('scss/**/*.scss', ['sass']);
	//gulp.watch('app/**/*.html', ['html']);
});


////////////////////////
// Browser-Sync Tasks
////////////////////////
// Notes: ".local" domains are very slow.
// See: http://stackoverflow.com/questions/24807786/browsersync-extremely-slow
// Sow we Exclude the DNS requests DNS?
// http://stackoverflow.com/questions/31143913/browsersync-proxy-to-homestead-really-slow
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
