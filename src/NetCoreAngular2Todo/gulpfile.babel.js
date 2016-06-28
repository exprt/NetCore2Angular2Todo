import Gulp from 'gulp';
import Gutil from 'gulp-util';
import Less from 'gulp-less';
import Browserify from 'browserify';
import Source from 'vinyl-source-stream';
import Tsify from 'tsify';

Gulp.task('Browserify', () => {
	return Browserify({
		entries: 'Source/bootstrap.ts',
		debug: true
	})
		.plugin(Tsify, {
			target: 'es5',
			experimentalDecorators: true
		})
		.bundle()
		.on('error', function(err){
			Gutil.log(Gutil.colors.red.bold('[Browserify error]'));
			Gutil.log(err.message);
			this.emit('end');
		})
		.pipe(Source('bundle.js'))
		.pipe(Gulp.dest('./wwwroot/dist'));
});

Gulp.task('Less', function () {
	return Gulp.src('./Source/Less/styles.Less')
		.pipe(Less())
		.on('error', function(err) {
			// Handle Less errors, but do not stop watch task
			Gutil.log(Gutil.colors.red.bold('[Less error]'));
			Gutil.log(Gutil.colors.bgRed('filename:') + ' ' + err.filename);
			Gutil.log(Gutil.colors.bgRed('lineNumber:') + ' ' + err.lineNumber);
			Gutil.log(Gutil.colors.bgRed('extract:') + ' ' + err.extract.join(' '));
			this.emit('end');
		})
		.pipe(Gulp.dest('./wwwroot/dist/css'));
});

Gulp.task('watch', () => {
	Gulp.watch('./Source/**/*.ts', ['Browserify']);
Gulp.watch('./Source/Less/*.Less', ['Less']);
});

Gulp.task('build', ['Browserify', 'Less']);
Gulp.task('default', ['build', 'watch']);
