let gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    cleanCss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    browserSync = require('browser-sync').create();

const paths = {
    scss: {
        src: './app/scss/style.scss',
        dest: './app/css',
        watch: './app/scss/**/*.scss'
    },
    html: {
        index: './app/index.html',
        pages: './app/pages/**.*'
    }
};

// Compile sass into CSS & auto-inject into browsers
function styles() {
    return gulp.src([paths.scss.src])
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([autoprefixer({
            browsers: [
                'Chrome >= 35',
                'Firefox >= 38',
                'Edge >= 12',
                'Explorer >= 10',
                'iOS >= 8',
                'Safari >= 8',
                'Android 2.3',
                'Android >= 4',
                'Opera >= 12']
        })]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.scss.dest))
        .pipe(cleanCss())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.scss.dest))
        .pipe(browserSync.stream())
}


// Static Server + watching scss/html files
function serve() {
    browserSync.init({
        server: {
            baseDir: './app/'
        }
    });

    gulp.watch([paths.html.index, paths.html.pages, paths.scss.watch], styles).on('change', browserSync.reload)
}

const build = gulp.series(styles, gulp.parallel(serve));

exports.styles = styles;

exports.serve = serve;

exports.default = build;
