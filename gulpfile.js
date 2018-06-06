var gulp = require('gulp');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var rename = require('gulp-rename');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var runner = require('run-sequence');
var del = require('del');

gulp.task('css', function() {
    return gulp.src(['css/*.css'])
        .pipe(csso())
        .pipe(rev())
        .pipe(gulp.dest('dist/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('tmp/rev/css'));
});

gulp.task('cssad', function() {
    return gulp.src(['addrbook/**/*.css'])
        .pipe(csso())
        .pipe(rev())
        .pipe(gulp.dest('dist/addrbook'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('tmp/rev/addrbook/css'));
});

gulp.task('csscf', function() {
    return gulp.src(['conference/**/*.css'])
        .pipe(csso())
        .pipe(rev())
        .pipe(gulp.dest('dist/conference'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('tmp/rev/conference/css'));
});

gulp.task('cssnt', function() {
    return gulp.src(['notice/**/*.css'])
        .pipe(csso())
        .pipe(rev())
        .pipe(gulp.dest('dist/notice'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('tmp/rev/notice/css'));
});

gulp.task('js', function() {
    return gulp.src(['js/*.js'])
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('dist/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('tmp/rev/js'));
});

gulp.task('jsad', function() {
    return gulp.src(['addrbook/**/*.js'])
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('dist/addrbook'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('tmp/rev/addrbook/js'));
});

gulp.task('jscf', function() {
    return gulp.src(['conference/**/*.js'])
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('dist/conference'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('tmp/rev/conference/js'));
});

gulp.task('jsnt', function() {
    return gulp.src(['notice/**/*.js'])
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('dist/notice'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('tmp/rev/notice/js'));
});

gulp.task('rev', function() {
    return gulp.src([
      'tmp/rev/**/*.json',
      './**/*.html',
      '!node_modules/**/*.html'
      ])
        .pipe(revCollector())
        .pipe(gulp.dest('dist/'));
});

gulp.task('prepare', function() {
  return del([
    './dist'
  ]);
});

gulp.task('clean', function() {
  return del([
    './tmp'
  ]);
});

gulp.task('default', function(callback) {
  runner(
    'prepare',
     ['css','cssad','csscf','cssnt','js','jsad','jscf','jsnt'],
    'rev',
    'clean',
    callback);
});
