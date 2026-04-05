export const fonts = () => {
	return app.gulp.src(
		"./node_modules/@fontsource-variable/roboto/files/**/*",
		{ encoding: false }
	).pipe(app.gulp.dest(app.path.build.fonts));
}
