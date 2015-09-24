/*global require*/
var gulp = require('gulp'),
    include = require('gulp-include'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename"),
    uglify_js = require("uglify-js");

gulp.task('scripts', function () {
    console.log('-- gulp is running task: scripts');

    gulp.src('resources/assets/search_box/jquery.searchBox.js')
        .pipe(include())
        .pipe(gulp.dest('assets/js'))
        .pipe(uglify())
        .pipe(rename({
            dirname: '',
            prefix: 'jquery.',
            basename: 'searchBox',
            suffix: '.min',
            extname: '.js'
        }))
         .pipe(gulp.dest('assets/js'))
        ;
//            .on('error', console.log)
});

gulp.task('default', ['scripts']);