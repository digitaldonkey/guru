////////////////////////
// Required
////////////////////////
var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    filter = require('gulp-filter'),  
//    autoprefixer = require('gulp-autoprefixer'),      
    browserSync = require('browser-sync');



gulp.task('sass', function () { 
	return gulp.src('scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({ 
			//outputStyle: 'compressed',
			outputStyle: 'nested',
			precision: 10,
			onError: function (err) {
				notify().write(err); 
				} 
			}))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest('css'))
			.pipe(filter('scss**/*.css'))
			.pipe(browserSync.reload({stream:true}));
});


////////////////////////
// Default Task
////////////////////////
gulp.task('default', ['sass']);
