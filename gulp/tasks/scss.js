import dartSass from "sass";
import gulpSass from "gulp-sass";
import rename from "gulp-rename";
import cleanCss from "gulp-clean-css";
import autoprefixer from "gulp-autoprefixer";
import groupCssMediaQueries from "gulp-group-css-media-queries";

const sass = gulpSass(dartSass);

export const scss = () => {
	return app.gulp.src(app.path.src.scss, { sourcemaps: app.isDev })
		.pipe(app.plugins.plumber({
			errorHandler: function(error) {
				console.log(error.message);
				this.emit('end');
			}
		}))
		.pipe(sass({
			outputStyle: "expanded",
		}))
		.pipe(groupCssMediaQueries())
		.pipe(autoprefixer({
			grid: true,
			overrideBrowserslist: ["last 3 versions"],
		}))
		.pipe(
			app.plugins.if(app.isBuild,
				app.gulp.dest(app.path.build.css) // non-minified CSS
			)
		)
		.pipe(
			app.plugins.if(app.isBuild,
				cleanCss()
			)
		)
		.pipe(rename({
			extname: ".min.css",
		}))
		.pipe(app.gulp.dest(app.path.build.css))
		.pipe(app.plugins.browsersync.stream());
}