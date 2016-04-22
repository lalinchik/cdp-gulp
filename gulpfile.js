var gulp = require('gulp');
var bower = require('gulp-bower');
var less = require('gulp-less');
var del = require('del');
var util = require('gulp-util');
var cached = require('gulp-cached');
var remember = require('gulp-remember');
var autoprefixer = require('gulp-autoprefixer');
var csso = require('gulp-csso');
var concat = require('gulp-concat');
var gulpif = require('gulp-if');

var argv = require('minimist')(process.argv.slice(2), {
    string: 'env',
    default: { env: process.env.NODE_ENV || 'development' }
});

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

gulp.task('style', ['bower', 'clean'], function () {
    return gulp.src([bootstrap.less, conf.less])
        .pipe(less())
        .pipe(autoprefixer(['last 2 version']))
        .pipe(concat('cdp.css'))
        // Compress code only on production build
        .pipe(gulpif(argv.env === 'production', csso()))
        .pipe(gulp.dest(conf.build.css));
});

gulp.task('style-watch', function () {
    return gulp.src([bootstrap.less, conf.less])
        .pipe(cached())
        .pipe(less())
        .on('error', errorHandler)
        .pipe(autoprefixer(['last 2 version']))
        .pipe(concat('cdp.css'))
        .pipe(remember())
        .pipe(gulp.dest(conf.build.css))
});

gulp.task('images', ['clean'], function () {
   return gulp.src(conf.images)
        .pipe(gulp.dest(conf.build.images))
});

gulp.task('clean', function () {
    return del([conf.build.folder]);
});

gulp.task('build', ['style', 'images']);

gulp.task('watch', ['build'], function () {
    return gulp.watch(conf.less, ['style-watch']);
});

function errorHandler(error) {
    util.log(util.colors.red('Error'), error.message);

    this.end();
}
