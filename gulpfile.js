var gulp = require('gulp');
var jshint = require('gulp-jshint');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var es = require('event-stream');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');
var runSequence = require('run-sequence');
var rename = require('gulp-rename');

gulp.task('clean', function () {
	return gulp.src('dist/') //deleta essa pasta no início
	.pipe(clean());
});

gulp.task('jshint', function () {
	return gulp.src('js/**/*.js') //return deixa o código assíncrono
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
});

gulp.task('uglify', function () {
	return es.merge([ //junta código de vários diretórios
		gulp.src(['bower_components/angular/angular.min.js', 'bower_components/angular-route/angular-route.min.js', 'bower_components/angular-messages/angular-messages.min.js']),
		gulp.src(['lib/**/*.js', 'js/**/*.js']).pipe(concat('scripts.js')).pipe(uglify())
	])
	.pipe(concat('all.min.js')) //concatena todos os arquivos js num só
	.pipe(gulp.dest('dist/js')); // grava aqui
});

gulp.task('htmlmin', function () { //minifica os html
	return gulp.src('view/*.html') //pega tudo daqui
	.pipe(htmlmin({collapseWhitespace: true})) //tira os espaços
	.pipe(gulp.dest('dist/view')) //grava aqui depois
});

gulp.task('cssmin', function () { //minifica os Css
	return gulp.src(['bower_components/bootstrap/dist/css/bootstrap.css', 'css/**/*.css'])
	.pipe(cleanCSS())
	.pipe(concat('styles.min.css'))
	.pipe(gulp.dest('dist/css'));
});

gulp.task('copy', function () { //renomeia o index e copia em outro diretório
	return gulp.src('index-prod.html') //copia
	.pipe(rename('index.html'))//troca de nome
	.pipe(gulp.dest('dist/')); // cola aqui
});

gulp.task('default', function (cb) { //permite apurar o tempo total.. cb que ajuda a ter o encerramento
	return runSequence('clean', ['jshint', 'uglify', 'htmlmin', 'cssmin', 'copy'], cb) //roda em paralelo, mas antes so roda o clean
});
