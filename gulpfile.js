'use strict';

var gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cleanCSS = require('gulp-clean-css'),
  server = require( 'gulp-develop-server' ),
  rename = require('gulp-rename'),
  bower = require('gulp-bower'),
  gulpif = require('gulp-if'),
  fs = require('fs');


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

gulp.task('fonts', function(){
  return gulp.src(config.bowerDir + '/bootstrap-sass/assets/fonts/bootstrap/*')
    .pipe(gulp.dest(config.assetsDir+'/fonts/bootstrap'));
});

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

function fileExists(file) {
  try {
    fs.statSync(file);
    return true;
  } catch(err) {
    return false;
  }
}

gulp.task('env-setup', function() {
  return gulp.src('./.env.example')
    .pipe(rename('.env'))
    .pipe(gulpif(function() {return !fileExists('.env') },gulp.dest('.')))
});

gulp.task('bower:install', function() {
  return bower({ cmd: 'install'});
});

gulp.task('build', ['bower:install', 'css', 'js', 'fonts']);
gulp.task('install', ['env-setup', 'bower:install']);
gulp.task('start:dev', ['build', 'server:start', 'watch']);
gulp.task('default', ['start:dev']);
