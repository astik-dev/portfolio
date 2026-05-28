import fileInclude from "gulp-file-include";
import { Transform } from "stream";
import { minify } from "html-minifier-terser";
import { renderProjectsItem } from "../../src/js/modules/renderProjectsItem.js";
import { renderReviewSlide } from "../../src/js/modules/renderReviewSlide.js";
import { store } from "../store.js";

function renderSkillsItem({ icon, label }) {
	return `
		<li>
			<svg><use href="#icon-${icon}" /></svg>
			${label}
		</li>
	`;
}

function renderContactLink({ title, icon, url }) {
	return `
		<a
			class="contact__link"
			href="${url}"
			target="_blank"
			title="${title}"
			data-umami-event="contact-link-click"
			data-umami-event-title="${title}"
		>
			<svg><use href="#icon-${icon}" /></svg>
		</a>
	`;
}

export const html = () => {

	const { projects, skills, reviews, contactLinks } = store;

	return app.gulp.src(app.path.src.html)
		.pipe(app.plugins.plumber())
		.pipe(fileInclude({
			context: {
				projectCount: projects.length,
				reviewSlideCount: reviews.length,
				projectItems:
					projects
						.slice(0, 4)
						.map((p, i) => renderProjectsItem(p, i, false))
						.join(""),
				skillItems: skills.map(renderSkillsItem).join(""),
				firstReviewSlide: renderReviewSlide(reviews[0]),
				contactLinks: contactLinks.map(renderContactLink).join(""),
				currentYear: new Date().getFullYear(),
			}
		}))
		.pipe( // html-minifier-terser
			app.plugins.if(app.isBuild, new Transform({
				objectMode: true,
				transform: async (file, _, cb) => {
					if (file.isNull()) return cb(null, file);
					try {
						const minified = await minify(file.contents.toString(), {
							collapseWhitespace: true,
							removeComments: true,
						});
						file.contents = Buffer.from(minified);
						cb(null, file);
					} catch (err) {
						cb(err);
					}
				}
			}))
		)
		.pipe(app.gulp.dest(app.path.build.html))
		.pipe(app.plugins.browsersync.stream());
}