import fileInclude from "gulp-file-include";
import { Transform } from "stream";
import { minify } from "html-minifier-terser";
import imageCreator from "../../src/js/modules/imageCreator.js";
import { renderProjectsItem } from "../../src/js/modules/renderProjectsItem.js";
import { store } from "../store.js";

function renderSkillsItem({ name, img, imgWEBP }) {

	const fallback = `skills/${img}`;

	const imgOrPicture = imgWEBP
		? imageCreator.newWebpPic("external", `skills/${imgWEBP}`, fallback, name)
		: imageCreator.newImg("external", fallback, name);

	return `
		<article class="skills__item">
			${imgOrPicture}
			<h4>${name}</h4>
		</article>
	`;
}

function renderReviewsSlide({ name, grade, text, date, link, linkText }) {
	
	grade = +grade;

    const gradeColor =
        grade < 5 ? "#fa1111" : // red
        grade < 7 ? "#fab43c" : // orange
        "#2CB67D"; // green
    
    return `
        <div class="reviews__slide swiper-slide">
            <div class="reviews__slide-top">
                ${imageCreator.newImg("local", `reviews/user-avatar.svg`, "Avatar")}
                <h5>${name}</h5>
                <h4 style="color: ${gradeColor};">
                    <span>${grade}/10</span>
					<svg><use href="#icon-star" /></svg>
                </h4>
            </div>
            <p>${text}</p>
            <div class="reviews__slide-bottom">
                <span>${date}</span>
                <a
					href="${link}"
					target="_blank"
					title="Go to source"
					data-umami-event="review-source-link-click"
					data-umami-event-url="${link}"
				>
					${linkText}
				</a>
            </div>
        </div>
    `;
}

function renderContactsItem({ link, title, img, imgWEBP }) {

	const fallback = `contacts/${img}`;

	const imgOrPicture = imgWEBP
		? imageCreator.newWebpPic("external", `contacts/${imgWEBP}`, fallback, title)
		: imageCreator.newImg("external", fallback, title);
		
	return `
		<a
			class="contacts__item"
			href="${link}"
			target="_blank"
			title="${title}"
			data-umami-event="contacts-link-click"
			data-umami-event-title="${title}"
		>
			${imgOrPicture}
		</a>
	`;
}

export const html = () => {

	const { projects, skills, reviews, contacts } = store;

	return app.gulp.src(app.path.src.html)
		.pipe(app.plugins.plumber())
		.pipe(fileInclude({
			context: {
				projectCount: projects.length,
				projectItems: projects.slice(0, 4).map(renderProjectsItem).join(""),
				skillItems: skills.map(renderSkillsItem).join(""),
				reviewSlides:
					reviews
						.toSorted((a, b) => -(a.text.length - b.text.length))
						.map(renderReviewsSlide)
						.join(""),
				contactItems: contacts.map(renderContactsItem).join(""),
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