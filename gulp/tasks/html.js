import fileInclude from "gulp-file-include";
import webHtmlNosvg from "gulp-webp-html-nosvg";
import versionNumber from "gulp-version-number";

export const html = () => {
	return app.gulp.src(app.path.src.html)
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "HTML",
				message: "Error: <%= error.massage %>"
			}))
		)
		.pipe(fileInclude())
		.pipe(app.plugins.replace(/@img\//g, '../images/'))
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
				webHtmlNosvg()
			)
		)
		.pipe(
			app.plugins.if(
				app.isBuild,
				versionNumber({
					'value': '%DT%',
					'append': {
						'key': '_v',
						'cover': 0,
						'to': [
							'css',
							'js'
						]
					},
					'output': {
						'file': 'gulp/version.json'
					}
				}))
		)
		.pipe(app.gulp.dest(app.path.build.html))
		.pipe(app.plugins.browserSync.stream());
} 