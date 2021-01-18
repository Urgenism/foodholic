//oad plugins
const gulp = require("gulp");

// import tasks
const copy = require("./gulp/copy");
const clean = require("./gulp/clean");
const css = require("./gulp/styles");
const server = require("./gulp/browserSync");
const images = require("./gulp/images");
const js = require("./gulp/scripts");

// Watch files
function watchFiles() {
    gulp.watch("./src/assets/scss/**/*", css.buildCss);
    gulp.watch("./src/assets/js/**/*", scripts);
    gulp.watch("./src/assets/img/**/*", images.optimizeImages);
    gulp.watch("./src/*.html", copy.copyHtml);
    gulp.watch("./src/assets/fonts/**/*", copy.copyFonts);
}

// define complex tasks
const scripts = gulp.series(js.lint, js.build);
const watch = gulp.parallel(watchFiles, server.init, server.reload);
const build = gulp.series(
    clean.all,
    gulp.parallel(copy.copyHtml, copy.copyFonts, css.buildCss, css.minifyCSS, images.optimizeImages, scripts)
);

// expose tasks to CLI
exports.build = build;
exports.watch = watch;
exports.default = build;
