var gulp = require('gulp');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var notify = require('gulp-notify');


// Start browserSync server
gulp.task('browser-sync', function() {
  browserSync({
      server: {
        baseDir: 'public',
      },
      port: 3000,
      open: true,
      notify: false
  });
});

// Sass
gulp.task('sass', function () {
  gulp
    .src('src/assets/stylesheets/*.scss')
    .pipe(sourcemaps.init())
      // .pipe(sass({outputStyle: 'compressed'}))
    .pipe(sass())
    .on('error', notify.onError(function(err){
      return {
        title: 'Styles compilation error',
        message: err.message
      }
    }))
    .pipe(autoprefixer(['last 2 versions']))
    .pipe(sourcemaps.write('./stylemaps'))
    .pipe(gulp.dest('public/assets/stylesheets'))
    .pipe(browserSync.reload({stream: true}))
});

// pug
gulp.task('pug', function(){
  gulp
    .src('src/pages/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .on('error', notify.onError(function(err){
      return {
        title: 'pug compilation error',
        message: err.message
      }
    }))
    .pipe(gulp.dest('public/'))
    .pipe(browserSync.reload({stream: true}))
});

// Copy Fonts
gulp.task('copyFonts', function() {
    gulp
      .src('src/assets/fonts/**/*')
      .pipe(gulp.dest('public/assets/fonts/'));
});

// Copy Images
gulp.task('copyImages', function() {
    gulp
      .src(['./src/assets/images/**/*'])
      .pipe(gulp.dest('public/assets/images/'));
});

// Watch taskes
gulp.task('watch', ['sass', 'browser-sync'], function() {
  gulp.watch(['src/assets/stylesheets/*.scss',
              'src/assets/stylesheets/**/*.scss'], ['sass']);
  gulp.watch(['src/pages/*.pug',
              'src/pages/**/*.pug',
              'src/helpers/**/*.pug',
              'src/partials/**/*.pug'], ['pug']);
  gulp.watch(['src/assets/fonts/*.*', 'src/assets/fonts/**/*.*'], ['copyFonts']);
  gulp.watch(['src/assets/images/*.*', 'src/assets/images/**/*.*'], ['copyImages']);
});


gulp.task('default', function(callback) {
        runSequence(['sass',
                      'pug',
                      'copyFonts',
                      'copyImages',
                      'watch'],
                      callback);
});
