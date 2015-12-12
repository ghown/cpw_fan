var gulp = require('gulp');
var jscs = require("gulp-jscs");
var jshint = require("gulp-jshint");
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

gulp.task('check', function() {
	// Minify and copy all JavaScript (except vendor scripts)
	// with sourcemaps all the way down
	return gulp.src('app/sandbox/hello/*.js')
		.pipe(jscs())
		.pipe(jscs.reporter())
		.pipe(jshint())
		.pipe(jshint.reporter("default"))
		.pipe(jshint.reporter("fail"))
});

gulp.task('uglify-hello', function() {
	return gulp.src(['bower_components/angular/angular.js', 'src/app/sandbox/hello/app.js'])
		.pipe(sourcemaps.init())
        .pipe(concat('concat.js'))
        .pipe(gulp.dest('build'))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('build'));
});

gulp.task('build', ['uglify-hello']);

// Rerun the task when a file changes
gulp.task('watch', function() {
	gulp.watch('app/sandbox/hello/*.js', ['check']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'check']);

