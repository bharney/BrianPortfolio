/// <reference path="views/shared/_layout.cshtml" />
/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/
'use strict';

var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    bower = require('gulp-bower'),
    jshint = require('gulp-jshint'),
    eslint = require('gulp-eslint'),
    autoprefixer = require('gulp-autoprefixer'),
    clean = require('del'),
    uglify = require('gulp-uglify'),
    minify = require('gulp-csso'),
    filter = require('gulp-filter'),
    wiredep = require('wiredep').stream,
    inject = require('gulp-inject'),
    imagemin = require('gulp-imagemin'),
    useref = require('gulp-useref'),
    rename = require('gulp-rename'),
    lazypipe = require('lazypipe'),
    gulpif = require('gulp-if'),
    gzip = require('gulp-gzip');

var paths = {
    webroot: "./wwwroot/"
};

paths.js = paths.webroot + "**/*.js";
paths.minJs = paths.webroot + "**/*.min.js";
paths.css = paths.webroot + "**/*.css";
paths.scss = paths.webroot + "**/*.scss";
paths.minCss = paths.webroot + "**/*.min.css";
paths.concatJsDest = paths.webroot + "js/**/*.js";
paths.concatCssDest = paths.webroot + "css/**/*.css";
paths.bower = paths.webroot + "lib/";
paths.node = "/node_modules/";
paths.index = './Views/Shared/_LayoutDev.cshtml';
paths.shared = './Views/Shared/';


gulp.task('bower', function () {
    return bower()
        .pipe(gulp.dest(paths.bower))
});


gulp.task('vet', function () {
    gulp.src([paths.webroot + 'js/**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish', { verbose: true }));
});


//gulp.task("clean:js", function (cb) {
//    clean(paths.webroot + 'js/**/*.js', '!node_modules/**');
//});

gulp.task("clean:css", function () {
    clean(paths.webroot + 'css/**/*.css',
          paths.webroot + 'css/**/*.min.css')
});

gulp.task("clean:tmp", function () {
    clean('views/shared/~')
    clean('views/shared/*.gz')
});

gulp.task('images', function () {
    return gulp.src([paths.webroot + 'images/*', '!wwwroot/images/imagemin'])
            .pipe(imagemin({}))
            .pipe(gulp.dest(paths.webroot + 'images/'))
});

gulp.task("sass", function () {
    return sass(paths.webroot + 'css/site.scss', {
        sourcemap: false,
        style: 'compressed',
        loadPath: [
            paths.bower + '/fontawesome/scss',
            paths.webroot + '/css/site.scss',
        ]
    })
        .pipe(autoprefixer({ browsers: ['last 2 version', '>5%'] }))
        .pipe(gulp.dest(paths.webroot + 'css/'))
});

gulp.task('inject', function () {
    gulp.src(paths.index)
       .pipe(wiredep({
           directory: paths.bower,
           bowerJson: require('./bower.json'),
           ignorePath: '../../wwwroot/',
           fileTypes: {
               html: {
                   replace: {
                       js: '<script src="~/{{filePath}}"></script>',
                       css: '<link rel="stylesheet" href="~/{{filePath}}" />'
                        }
                    }
                }
            }))
            .pipe(inject(gulp.src(
                [paths.webroot + 'js/**/*.js'], { read: false }),
                    {  
                      transform: function (filePath, file, i, length) {
                          var newPath = filePath.replace('/wwwroot/', '');
                          return '<script src="~/' + newPath  + '"></script>';
                    }
                })
             )
             .pipe(inject(gulp.src(
                [paths.webroot + 'css/**/*.css'], { read: false }),
                    {  
                        transform: function (filePath, file, i, length) {
                            var newPath =
                                filePath.replace('/wwwroot/', '');
                            return '<link rel="stylesheet" href="~/' + newPath  + '" />';
                        }
                    })
             )
            .pipe(gulp.dest(paths.shared));
});

gulp.task('optimize', function () {
    return gulp.src(paths.index)
           .pipe(useref({
               transformPath: function (filePath) {
                   return filePath.replace('~', '')
               }
           }))
           .pipe(gulpif('*.js', uglify()))
           .pipe(gulpif('*.css', minify()))
           //.pipe(gzip())
           .pipe(gulp.dest(paths.shared))
});

gulp.task('copyJs', ['optimize'], function () {
    return gulp.src('views/shared/~/js/*.gz')
        .pipe(gulp.dest(paths.webroot + 'js/'));
});

gulp.task('copyCss', ['optimize'], function () {
    return gulp.src('views/shared/~/css/*.gz')
        .pipe(gulp.dest(paths.webroot + 'css/'));
});

gulp.task('watch', function () {
    gulp.watch(paths.scss, ['sass']);
});

gulp.task("clean", ["clean:js", "clean:css"]);
