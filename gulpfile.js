'use strict';

var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var sass = require('gulp-sass');
var reactify = require('reactify');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var series = require('run-sequence');

function scripts(watch, production) {
    if (production) {
        process.env.NODE_ENV = 'production';
    }

    var bundler, rebundle;
        bundler = browserify('./src/js/index.js', {
            basedir: __dirname, 
            debug: !production, 
            cache: {}, // required for watchify
            packageCache: {}, // required for watchify
            fullPaths: watch // required to be true only for watchify
        });
    if (watch) {
        bundler = watchify(bundler) 
    }
    bundler.on('log', function(msg) { console.log(msg); });

    // gutil.log.bind(gutil, 'Browserify Error')
    bundler.transform('babelify', {presets: ['es2015', 'react']});
    bundler.transform(reactify);

    rebundle = function() {
        var stream = bundler.bundle().on('error', function(err) { console.log(err.message) });
            stream = stream.pipe(source('index.js'));
        if (production) {
            stream = stream.pipe(buffer());
            stream = stream.pipe(uglify());
        }
        return stream.pipe(gulp.dest('./app/scripts'));
    };

    bundler.on('update', rebundle);
    return rebundle();
}

gulp.task('js', function() {
  return scripts(false);
});

gulp.task('js:build', function() {
  return scripts(false, true);
});

gulp.task('js:watch', function(done) {
  return scripts(true);
});

gulp.task('sass', function() {
    return gulp.src('./src/sass/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./app/styles'));
});

gulp.task('sass:build', function () {
    return gulp.src('./app/styles/*.css')
        .pipe(postcss([
            autoprefixer({browsers: ['last 1 version']}),
            cssnano(),
        ]))
        .pipe(gulp.dest('./app/styles'));
});

gulp.task('sass:watch', function (done) {
    gulp.watch('./src/sass/**/*.scss', ['sass']);
});

gulp.task('default', ['js:watch', 'sass', 'sass:watch']);
gulp.task('build', function(done) {
    series('sass', 'sass:build', 'js:build', done);
});


