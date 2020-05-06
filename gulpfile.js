const { series, watch, src, dest, parallel } = require('gulp');
const clean = require('gulp-clean');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const image = require('gulp-image');

function cleanBuild() {
    return src('build', {allowEmpty: true})
        .pipe(clean({force: true}))
}

function js() {
    return src('src/js/*.js')
        .pipe(dest('build/js'));
}
function css() {
    return src('src/sass/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(
            postcss([
                autoprefixer({
                    overrideBrowserslist: ['last 2 versions']
                })
            ])
        )
        .pipe(dest('build/css'))
}
function html() {
    return src(['src/pug/*.jade', 'src/pug/*.pug'])
        .pipe(pug({
            pretty: true
        }))
        .pipe(dest('build/html'))
}
function img() {
    return src(['src/img/*', 'src/img/**/*', 'src/img/images/*'])
        .pipe(image())
        .pipe(dest('build/img'));
}

function watchFiles() {
    watch('src/js/*.js', js);
    watch(['src/sass/*.sass', 'src/sass/**/*.sass'], css);
    watch(['src/pug/blocks/*.pug', 'src/pug/*.pug'], html);
}

exports.cleanBuild = cleanBuild;
exports.js = js;
exports.css = css;
exports.html = html;
exports.img = img;

exports.build = series(cleanBuild, parallel(html, css, js, img));
exports.watch = parallel(html, css, js, img, watchFiles);
