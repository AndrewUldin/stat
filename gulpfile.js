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

var env = (process.env.NODE_ENV === 'production' ? 'production' : 'development');

// add custom browserify options here
if (env == 'development') {
    var customOpts = {
        entries: ['./src/js/index.js'],
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true // Requirement of watchify
    };
} else {
    var customOpts = {
        entries: ['./src/js/index.js'],
        debug: false,
        cache: {},
        packageCache: {},
        fullPaths: false
    };
}
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts))
.transform('babelify', {presets: ['es2015', 'react']})
.transform('reactify');

gulp.task('js', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
    return b.bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('index.js'))
        if (env == 'development') {
            b.pipe(sourcemaps.init({
                loadMaps: true
            }))
            .pipe(sourcemaps.write('./')) // writes .map file
        } else {
            b.pipe(buffer());
            b.pipe(uglify());
        }
        b.pipe(gulp.dest('./app/scripts'));
}

gulp.task('sass', function() {
    return gulp.src('./src/sass/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./app/styles'));
});

gulp.task('sass:min', function () {
    var processors = [
        autoprefixer({browsers: ['last 1 version']}),
        cssnano(),
    ];
    return gulp.src('./app/styles/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('./app/styles'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./src/sass/**/*.scss', ['sass']);
});

gulp.task('default', ['js', 'sass:watch']);