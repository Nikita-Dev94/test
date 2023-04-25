import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';
import cleanCss from 'gulp-clean-css'; // Сжатие CSS файла
import webpcss from 'gulp-webpcss'; // Вывод Webp изображений
import autoprefixer from 'gulp-autoprefixer'; // Добавление вендерных префиксов
import groupCssMediaQueries from 'gulp-group-css-media-queries'; // Группировка медиазапросов
import sourcemaps from 'gulp-sourcemaps';
const sass = gulpSass(dartSass);


export const scss = () => {
	return app.gulp.src(app.path.src.scss)
		.pipe(sourcemaps.init()
		)
		.pipe(sass({
			outputStyle: 'compressed'
		}))
		.pipe(app.plugins.replace(/@img\//g, '../img/'))
		.pipe(
			app.plugins.if(app.isBuild, app.plugins.replace('.png', '.webp'))
		)

		.pipe(
			app.plugins.if(app.isBuild, app.plugins.replace('.jpg', '.webp'))
		)

		.pipe(
			app.plugins.if(app.isBuild, app.plugins.replace('.jpeg', '.webp'))
		)
		.pipe(
			app.plugins.if(
				app.isBuild,
				groupCssMediaQueries())
		)

		.pipe(
			app.plugins.if(
				app.isBuild,
				autoprefixer({
					grid: true,
					overrideBrowserslist: ["last 3 versions"],
					cascade: true
				}))
		)
		.pipe(
			app.plugins.if(
				app.isBuild,
				cleanCss())
		)
		.pipe(rename({
			extname: ".min.css"
		}))
		.pipe(sourcemaps.write())
		.pipe(app.gulp.dest(app.path.build.css))
		.pipe(app.plugins.browserSync.stream())
}