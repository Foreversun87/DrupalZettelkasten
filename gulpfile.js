var gulp          = require('gulp'),
    sass          = require('gulp-sass')
    cleanCSS      = require('gulp-clean-css'), //Minifizierte CSS-Datei
    autoprefixer  = require('gulp-autoprefixer'),
    rename        = require('gulp-rename'),
    inject        = require('gulp-inject'),
    uglify        = require('gulp-uglify'), //JS-Min-Datei erstellen
    concat        = require('gulp-concat'), //Verbindet mehrere JS Dateien
    plumber       = require('gulp-plumber'), //Überspringt Syntaxfehler
    babel         = require('gulp-babel'),
    browserify    = require('gulp-browserify'), //Scripte können importiert werden
    clean         = require('gulp-clean'), //Löscht die angegebene Source
    sourcemaps    = require('gulp-sourcemaps'), //Zeigt wo die jeweiligen Befehle im Inspector-Modus herkommen
    htmlmin       = require('gulp-html-minifier'),
    browserSync   = require('browser-sync'); //AutoReload

var src           = "./src/",
    dist          = "./dist/",
    path = 'http://blog2.dd:8083/';

// ##################################################
// MINIFY HTML
gulp.task('html', function(){
    gulp.src(dist + '*.html',{force: true})
        .pipe(clean());
    gulp.src(src + '*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(dist))
        .pipe(browserSync.stream());
});

// ##################################################
// MINIFY SASS
gulp.task('sass', function(){
    gulp.src(src + 'assets/sass/*.scss')
        .pipe(sourcemaps.init())
            .pipe(plumber())
            .pipe(sass())
            .pipe(autoprefixer())
            .pipe(rename({ basename: 'style'}))
            .pipe(cleanCSS())
            .pipe(rename({ suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dist + 'assets/css'))
        .pipe(browserSync.stream());
});

// ##################################################
// MINIFY JS
gulp.task('js', function(){
    gulp.src(src + 'assets/js/*.js')
        .pipe(sourcemaps.init())
            .pipe(plumber())
            .pipe(concat('global.js'))
            .pipe(babel({
                presets: ['es2015'] }))
            .pipe(browserify({
                insertGlobals: true,
                debug: !gulp.env.production }))
            .pipe(uglify())
            .pipe(rename({ suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dist + 'assets/js'))
        .pipe(browserSync.stream());
});

// ##################################################
// WATCH
gulp.task('default', function(){

    browserSync.init({
        proxy:  path       
    });

    gulp.watch([src + '*.html'],['html']);
    gulp.watch([src + 'assets/sass/*.scss'],['sass']);
    gulp.watch([src + 'assets/js/*.js'],['js']);
    gulp.watch("templates/**/*.html.twig").on('change', browserSync.reload);
    
});