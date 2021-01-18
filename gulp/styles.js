// packages
const gulp = require("gulp");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();
const notify =  require('gulp-notify');
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const plumber = require("gulp-plumber");

// CSS task
function buildCss() {
    return gulp
        .src("src/assets/scss/**/*.scss")
        .pipe(sourcemaps.init())
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(sass({
            outputStyle: "expanded"
        }).on("error", sass.logError))
        .pipe(postcss([autoprefixer({
            env: "production"
        })]))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("dist/assets/css"))
        .pipe(browserSync.stream({
            match: "**/*.css"
        }));
}

function minifyCSS() {
    return gulp.src("src/assets/scss/**/*.scss")
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(sass({
            outputStyle: "expanded"
        }).on("error", sass.logError))
        .pipe(postcss([autoprefixer({
            env: "production"
        })]))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(cleanCSS({
            compatibility: "ie8"
        }))
        .pipe(gulp.dest("dist/assets/css"));
}

// exports
module.exports = {
    buildCss: buildCss,
    minifyCSS: minifyCSS
};
