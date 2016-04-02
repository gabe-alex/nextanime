'use strict';

var gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cleanCSS = require('gulp-clean-css'),
  server = require( 'gulp-develop-server' );


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
        config.bowerDir + '/bootstrap-sass/assets/stylesheets'
      ]
    }))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(gulp.dest(config.assetsDir+'/css'));
});

gulp.task('js', function(){
  return gulp.src([
    config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap.min.js',
    config.bowerDir + '/jquery/dist/jquery.min.js'
  ])
    .pipe(gulp.dest(config.assetsDir+'/js'))
});

gulp.task('watch', function() {
  gulp.watch(config.sassPath + '/**/*.scss', ['css']);
  gulp.watch( [ './app/**/*.js' ], server.restart );
});

gulp.task( 'server:start', function() {
  server.listen({
    path: './server.js',
    execArgv: ['--harmony_proxies']
  });
});


gulp.task('build', ['css', 'js']);
gulp.task('start:dev', ['build', 'server:start', 'watch']);
gulp.task('default', ['start:dev']);
