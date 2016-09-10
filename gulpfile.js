'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');
var server = require('gulp-develop-server');


var config = {
  bowerDir: './bower_components',
  sassPath: './resources/sass',
  assetsDir: './public'
};

gulp.task('css', function () {
  return gulp.src(config.sassPath + '/style.scss')
    .pipe(sass({
      precision: 8,
      includePaths: [
        config.sassPath,
        config.bowerDir + '/bootstrap-sass/assets/stylesheets',
        config.bowerDir + '/bootstrap-social',
        config.bowerDir + '/font-awesome/scss'
      ]
    }))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(gulp.dest(config.assetsDir+'/css'));
});

gulp.task('js', function(){
  return gulp.src([
    config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap.min.js',
    config.bowerDir + '/jquery/dist/jquery.min.js',
    config.bowerDir + '/typeahead.js/dist/typeahead.bundle.min.js'
  ])
    .pipe(gulp.dest(config.assetsDir+'/js'))
});

gulp.task('fonts-bootstrap', function(){
  return gulp.src(config.bowerDir + '/bootstrap-sass/assets/fonts/bootstrap/*')
    .pipe(gulp.dest(config.assetsDir+'/fonts/bootstrap'));
});
gulp.task('fonts-awesome', function(){
  return gulp.src(config.bowerDir + '/font-awesome/fonts/*')
    .pipe(gulp.dest(config.assetsDir+'/fonts'));
});
gulp.task('fonts', ['fonts-bootstrap', 'fonts-awesome']);

gulp.task('watch', function() {
  gulp.watch(config.sassPath + '/**/*.scss', ['css']);
  gulp.watch( [ './app/**/*.js', './bootstrap/**/*.js', './config/**/*.js', './providers/**/*.js'  ], server.restart );
});

gulp.task( 'server:start', function() {
  server.listen({
    path: './server.js',
    execArgv: ['--harmony_proxies']
  });
});

gulp.task('build', ['css', 'js', 'fonts']);
gulp.task('start:dev', ['build', 'server:start', 'watch']);
gulp.task('default', ['start:dev']);
