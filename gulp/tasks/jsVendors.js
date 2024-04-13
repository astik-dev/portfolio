export const jsVendors = () => {
	return app.gulp.src(app.path.src.jsVendors)
		.pipe(app.gulp.dest(app.path.build.jsVendors))
		.pipe(app.plugins.browsersync.stream());
}
