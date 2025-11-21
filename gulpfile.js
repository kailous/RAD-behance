var gulp     = require('gulp'),
    header   = require('gulp-header'),
    uglify   = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    rename   = require('gulp-rename'),
    pkg      = require('./package.json'),
    banner;

banner = [
  '/*! ',
    '<%= package.name %> ',
    'v<%= package.version %> | ',
    '(c) ' + new Date().getFullYear() + ' <%= package.author %>',
    '<% if (package.homepage) { %> | <%= package.homepage %><% } %>',
  ' */',
  '\n'
].join('');

var paths = {
  js: ['src/js/*.js'],
  css: 'src/css/style.css',
  dest: {
    js: 'public/js',
    css: 'public/css'
  }
};

function compressJs() {
  return gulp.src(paths.js)
    .pipe(uglify())
    .pipe(header(banner, { package : pkg }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.dest.js));
}

function compressCss() {
  return gulp.src(paths.css)
    .pipe(cleanCSS())
    .pipe(header(banner, { package : pkg }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.dest.css));
}

function watchFiles() {
    gulp.watch(paths.js, compressJs);
    gulp.watch(paths.css, compressCss);
}

var build = gulp.parallel(compressJs, compressCss);

gulp.task('compress:js', compressJs);
gulp.task('compress:css', compressCss);
gulp.task('watch', watchFiles);
gulp.task('default', build);
