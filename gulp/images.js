// packages
const gulp = require("gulp");
const newer = require("gulp-newer");
const imagemin = require("gulp-imagemin");
const plumber = require("gulp-plumber");


// Optimize Images
function optimizeImages() {
    return gulp
        .src("src/assets/img/**/*")
        .pipe(plumber())
        .pipe(newer("dist/img"))
        .pipe(
            imagemin([
                imagemin.gifsicle({
                    interlaced: true
                }),
                imagemin.jpegtran({
                    progressive: true
                }),
                imagemin.optipng({
                    optimizationLevel: 5
                }),
                imagemin.svgo({
                    plugins: [{
                        removeViewBox: false,
                        collapseGroups: true
                    }]
                })
            ])
        )
        .pipe(gulp.dest("dist/assets/img"));
}

// exports
module.exports = {
    optimizeImages: optimizeImages
  };
  