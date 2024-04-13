export const cname = () => {
	return app.gulp.src(app.path.src.CNAME)
		.pipe(app.gulp.dest(app.path.build.CNAME));
}
