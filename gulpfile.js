var gulp = require('gulp');
var jscs = require("gulp-jscs");
var jshint = require("gulp-jshint");
var uglify = require('gulp-uglify');

gulp.task('check', function() {
	// Minify and copy all JavaScript (except vendor scripts)
	// with sourcemaps all the way down
	return gulp.src('app/sandbox/hello/*.js')
		.pipe(jscs())
		.pipe(jscs.reporter())
		.pipe(jshint())
		.pipe(jshint.reporter("default"))
		.pipe(jshint.reporter("fail"))
		//.pipe(uglify())
		.pipe(gulp.dest('./dist'));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
	gulp.watch('app/sandbox/hello/*.js', ['check']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'check']);

