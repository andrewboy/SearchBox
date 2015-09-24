/*global require*/
var gulp = require('gulp'),
    include = require('gulp-include');

gulp.task('scripts', function () {
    console.log('-- gulp is running task: scripts');

    gulp.src('resources/assets/search_box/jquery.searchBox.js')
        .pipe(include())
            .on('error', console.log)
        .pipe(gulp.dest('assets/js'));
});

gulp.task('default', ['scripts']);