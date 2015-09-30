////////////////////////
// Required
////////////////////////
// var gulp = require('gulp'),
//     sourcemaps = require('gulp-sourcemaps'),
//     sass = require('gulp-sass'),
//     filter = require('gulp-filter'),  
// //    autoprefixer = require('gulp-autoprefixer'),      
//     browserSync = require('browser-sync');

////////////////////////
// Required
////////////////////////
var gulp = require('gulp'),
		sass = require('gulp-sass'),
		browserSync = require('browser-sync'),
		// Add Autoloading from packages.json dependencies.
		// See: http://andy-carter.com/blog/automatically-load-gulp-plugins-with-gulp-load-plugins
		gulpLoadPlugins = require('gulp-load-plugins'),
		plugins = gulpLoadPlugins();    
    
    

gulp.task('sass', function () { 
	return gulp.src('scss/**/*.scss')
		.pipe(plugins.sourcemaps.init())
		.pipe(sass({ 
			//outputStyle: 'compressed',
			outputStyle: 'nested',
			precision: 10,
			onError: function (err) {
				notify().write(err); 
				} 
			}))
			.pipe(plugins.autoprefixer(['> 5%', 'last 2 versions']))
			.pipe(plugins.sourcemaps.write())
			.pipe(gulp.dest('css'))
			.pipe(plugins.filter('scss**/*.css'))
			.pipe(browserSync.reload({stream:true}));
});


////////////////////////
// Default Task
////////////////////////
gulp.task('default', ['sass']);
