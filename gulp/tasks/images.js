export const images = () => {
	return app.gulp.src(app.path.src.images, { encoding: false })
		.pipe(app.plugins.plumber())
		.pipe(app.plugins.newer(app.path.build.images))
		.pipe(app.gulp.dest(app.path.build.images))
		.pipe(app.plugins.browsersync.stream());
}