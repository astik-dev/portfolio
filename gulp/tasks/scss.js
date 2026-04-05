import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import rename from "gulp-rename";
import postcss from "gulp-postcss";
import cssnano from "cssnano";
import autoprefixer from "autoprefixer";

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
			style: "expanded",
			importers: [ new dartSass.NodePackageImporter() ],
		}))
		.pipe(postcss([
			autoprefixer(),
			...(app.isBuild ? [ cssnano() ] : [])
		]))
		.pipe(rename({ extname: ".min.css" }))
		.pipe(app.gulp.dest(app.path.build.css, { sourcemaps: app.isDev && "." }))
		.pipe(app.plugins.browsersync.stream());
}