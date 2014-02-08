var gulp = require("gulp");
var markdown = require("gulp-markdown");
var jade = require("gulp-jade");
var less = require("gulp-less");
var clean = require("gulp-clean");

var jadeBlog = require("./gulp-jadeblog");

var outPath = "out";

gulp.task("test-jade", function () {
  gulp.src("src/layouts/example.jade")
    .pipe(jade({
      pretty : true
    }))
    .pipe(gulp.dest(outPath));
});

gulp.task("posts", function () {
  gulp.src("src/documents/**/*.md")
    .pipe(jadeBlog())
    .pipe(jade({
      basedir : __dirname,
      pretty : true
    }))
    .pipe(gulp.dest(outPath));
});

gulp.task("static", function () {
  gulp.src("src/files/**/*").pipe(gulp.dest(outPath))
});

gulp.task("less", function () {
  gulp.src("src/documents/assets/styles/main.less")
    .pipe(less())
    .pipe(gulp.dest(outPath + "/assets/styles"));
});

gulp.task("clean", function () {
  return gulp.src(outPath, {read : false}).pipe(clean());
});

gulp.task("build", ["static", "less", "posts"]);

gulp.task("default", ["clean"], function () {
  gulp.start("build");
});