var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var uglify = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate');   

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass','parsejs']);

////////////////////
// sass
////////////////////
gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

////////////////////
// js-hint
////////////////////
gulp.task('js-hint', function() {
  return gulp.src(['./www/js/app.js', './www/js/**/*.js', '!./www/js/**/*.min.js'])
    .pipe(plumber())
    .pipe($.cached('jshint'))
    .pipe($.jshint())
    .pipe(jshintNotify())
    .pipe($.jshint.reporter('jshint-stylish'));
});


////////////////////
// js-app
////////////////////
gulp.task('js-app', function(){
  return gulp.src(['./www/js/app.js'])
      .pipe(concat('app.min.js'))
      .pipe(ngAnnotate())
      //.pipe(uglify()) // hide this one when you are developing because this task takes too much time
      .pipe(gulp.dest('./www/js/'));
});

////////////////////
// js-controllers
////////////////////
gulp.task('js-controllers', function(){
  return gulp.src([ './www/js/controllers/*.js'])
      .pipe(concat('controllers.min.js'))
      .pipe(ngAnnotate())
      //.pipe(uglify()) // hide this one when you are developing because this task takes too much time
      .pipe(gulp.dest('./www/js/'));
});

////////////////////
// js-directives
////////////////////
gulp.task('js-directives', function(){
  return gulp.src([ './www/js/directives/*.js'])
      .pipe(concat('directives.min.js'))
      .pipe(ngAnnotate())
      //.pipe(uglify()) // hide this one when you are developing because this task takes too much time
      .pipe(gulp.dest('./www/js/'));
});

////////////////////
// js-services
////////////////////
gulp.task('js-services', function(){
  return gulp.src([ './www/js/services/*.js'])
      .pipe(concat('services.min.js'))
      .pipe(ngAnnotate())
      //.pipe(uglify()) // hide this one when you are developing because this task takes too much time
      .pipe(gulp.dest('./www/js/'));
});

////////////////////
// parsejs
////////////////////
gulp.task('parsejs', ['js-hint','js-app', 'js-controllers', 'js-services', 'js-directives']);


////////////////////
// watch
////////////////////
gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(['./www/js/**/*.js', '!./www/js/**/*.min.js'], ['parsejs']);
});

////////////////////
// install
////////////////////
gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

////////////////////
// git-check
////////////////////
gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});


////////////////////
// utils
////////////////////
function plumber() {
  return $.plumber({errorHandler: $.notify.onError()});
}

function jshintNotify() {
  return $.notify(function(file) {
    if (file.jshint.success) {
      return false;
    }

    var errors = file.jshint.results.map(function (data) {
      return data.error ? '(' + data.error.line + ':' + data.error.character + ') ' + data.error.reason : '';
    }).join('\n');

    return file.relative + ' (' + file.jshint.results.length + ' errors)\n' + errors;
  });
}
