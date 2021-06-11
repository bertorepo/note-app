var htmlbeautify = require('gulp-html-beautify');

module.exports = (gulp, callback) => {
  const beautifyPagesTask = function () {
    return gulp
      .src('pages/**/*.html')
      .pipe(htmlbeautify({ indentSize: 2 }))
      .pipe(gulp.dest('./pages/'));
  };

  const beautifyIndexTask = function () {
    return gulp
      .src('*.html')
      .pipe(htmlbeautify({ indentSize: 2 }))
      .pipe(gulp.dest('.'));
  };


  // ---------------------------------------------------------------------------
  // Exports

  return {
    pages: beautifyPagesTask,
    index: beautifyIndexTask,
  };
};
