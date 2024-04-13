import webpack from "webpack-stream";
import named from "vinyl-named";

export const js = () => {
	return app.gulp.src(app.path.src.js, { sourcemaps: app.isDev })
		.pipe(app.plugins.plumber())
		.pipe(named())
		.pipe(webpack({
			mode: app.isBuild ? "production" : "development",
			output: {
				filename: "[name].bundle.js",
			},
			devtool: app.isDev ? "eval-cheap-module-source-map" : false,
		}))
		.pipe(app.gulp.dest(app.path.build.js))
		.pipe(app.plugins.browsersync.stream());
}