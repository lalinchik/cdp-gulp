var gulp = require('gulp');
var bower = require('gulp-bower');
var less = require('gulp-less');
var del = require('del');

var conf = {
    less: 'src/less/*.less',
    images: 'src/images/*.{png,svg}',
    build: {
        folder: 'build',
        css: 'build/css',
        images: 'build/images'
    }

};

var bootstrap = {
    less: 'bower_components/bootstrap/less/bootstrap.less'
};

gulp.task('bower', function () {
    return bower()
        .pipe(gulp.dest('bower_components'));
});

var compileStyles = function () {
    return gulp.src([conf.less, bootstrap.less])
        .pipe(less())
        .pipe(gulp.dest(conf.build.css))
};

gulp.task('style', ['bower', 'clean'], compileStyles);

gulp.task('style-watch', compileStyles);

gulp.task('images', ['clean'], function () {
   return gulp.src(conf.images)
        .pipe(gulp.dest(conf.build.images))
});

gulp.task('clean', function () {
    return del([conf.build.folder]);
});

gulp.task('build', ['style', 'images']);

gulp.task('watch', ['build'], function () {
    gulp.watch(conf.less, ['style-watch']);
});
