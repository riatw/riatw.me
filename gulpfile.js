var gulp = require('gulp');
var $ = require("gulp-load-plugins")();
var connect = require('gulp-connect-php');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;

// Sass
gulp.task('sass', function () {
	gulp.src('static/assets/_scss/**/*.scss')
		.pipe($.plumber())
		.pipe($.sass({ errLogToConsole: true, style: 'expanded' }) )
		.pipe($.pleeease({
			autoprefixer: {
				browsers: ['last 2 versions']
			},
			minifier: false,
			opacity: true,
			filters: true
		}))
		.pipe($.csscomb())
		.pipe(gulp.dest('static/assets/css'))
		.pipe(reload({stream:true}));
});

// Static server
gulp.task('browser-sync', function() {
  connect.server({
    port:8001,
    base:'static/',
  }, function (){
    browserSync({
      proxy: 'localhost:8001'
    });
  });
	// Local Server
	// browserSync({
	// 	server: {
	// 		baseDir: "./static/"
	// 	}
	// });
});

// Reload all browsers
gulp.task('bs-reload', function () {
	browserSync.reload();
});

// Task for `gulp` command

gulp.task('default',['browser-sync'], function() {
	gulp.watch('static/assets/_scss/**/*.scss',['sass']);
	gulp.watch("static/**/*.html", ['bs-reload']);
});
