import { Transform } from "stream";
import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";

const inlineAssets = () => {

	return new Transform({

		objectMode: true,

		transform(file, _, callback) {

			if (file.isNull()) return callback(null, file);

			const $ = cheerio.load(file.contents.toString());

			$("link[rel='stylesheet'][data-gulp-inline='true']").each((_, el) => {
				const $el = $(el);
				const href = $el.attr("href");
				const filePath = path.resolve(path.dirname(file.path), href);
				const css = fs.readFileSync(filePath, "utf8");
				$el.replaceWith(`<style>${css}</style>`);
			});

			$("script[src][data-gulp-inline='true']").each((_, el) => {
				const $el = $(el);
				const src = $el.attr("src");
				const filePath = path.resolve(path.dirname(file.path), src);
				const js = fs.readFileSync(filePath, "utf8");
				$el.replaceWith(`<script>${js}</script>`);
			});

			file.contents = Buffer.from($.html());
			callback(null, file);
		}
	});
};

export const inline = () => {
	return app.gulp.src(app.path.build.html + "screenshot.html")
		.pipe(inlineAssets())
		.pipe(app.gulp.dest(app.path.build.html));
};
