import svgSprite from "gulp-svg-sprite";

export const svgSprive = () => {
	return app.gulp.src(`${app.path.src.svgicons}`, {})
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "SVGSPRIVE",
				message: "Error: <%= error.massage %>"
			}))
		)
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: `../icons/icons.svg`,
					// Создаем страницу с перечнем иконок
					example: false
				}
			},

		}))
		.pipe(app.gulp.dest(`${app.path.build.images}`));
}