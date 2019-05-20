var gulp = require('gulp');
var livereload = require('gulp-livereload');
var uglify = require('gulp-uglifyjs');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');





gulp.task('imagemin', function () {
    return gulp.src('./images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./images'));
        
});


gulp.task('sass', function (done) {
  gulp.src('./sass/**/*.scss')
    .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./css'));
    done();
});


gulp.task('uglify', function(done) {
  gulp.src('./lib/*.js')
    .pipe(uglify('main.js'))
    .pipe(gulp.dest('./js'))
    done();
    
});

gulp.task('watch', function(done){
    
    
    
    livereload.listen();
    gulp.watch('./sass/**/*.scss', gulp.series('sass'));
    gulp.watch('./lib/*.js', gulp.series('uglify'));
    
    gulp.watch(['./css/style.css', './**/*.html.twig', './js/*.js'], function (files){
        livereload.changed(files)
        console.log("Richtig so!");
       



        
    });
    
    
    
    done();
    
});