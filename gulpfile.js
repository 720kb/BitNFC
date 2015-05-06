/*global require console process*/
(function onNodeExec(require, console, process) {
  'use strict';

  var gulp = require('gulp')
    , gutil = require('gulp-util')
    , bower = require('bower')
    , sass = require('gulp-sass')
    , minifyCss = require('gulp-minify-css')
    , rename = require('gulp-rename')
    , sh = require('shelljs')
    , eslint = require('gulp-eslint')
    , paths = {
        'sass': ['./scss/**/*.scss']
      };

  gulp.task('default', ['sass']);

  gulp.task('lint', function onLint() {
      return gulp.src([
        'gulpfile.js',
        'www/js/**/*.js'])
      .pipe(eslint({
        'configFile': '.eslintrc'
      }))
      .pipe(eslint.format())
      .pipe(eslint.failOnError());
  });

  gulp.task('sass', function onSass(done) {
    gulp.src('./scss/ionic.app.scss')
      .pipe(sass({
        'errLogToConsole': true
      }))
      .pipe(gulp.dest('./www/css/'))
      .pipe(minifyCss({
        'keepSpecialComments': 0
      }))
      .pipe(rename({
        'extname': '.min.css'
      }))
      .pipe(gulp.dest('./www/css/'))
      .on('end', done);
  });

  gulp.task('watch', function onWatch() {
    gulp.watch(paths.sass, ['sass']);
  });

  gulp.task('install', ['git-check'], function onInstall() {
    return bower.commands.install()
      .on('log', function onLog(data) {
        gutil.log('bower', gutil.colors.cyan(data.id), data.message);
      });
  });

  gulp.task('git-check', function onGitCheck(done) {
    if (!sh.which('git')) {
      /*eslint-disable no-console*/
      console.log(
        '  ' + gutil.colors.red('Git is not installed.'),
        '\n  Git, the version control system, is required to download Ionic.',
        '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
        '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
      );
      /*eslint-enable no-console*/
      /*eslint-disable no-process-exit*/
      process.exit(1);
      /*eslint-enable no-process-exit*/
    }
    done();
  });
}(require, console, process));
