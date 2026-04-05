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
                <h4 class="reviews__slide-grade">
                    <span style="color: ${gradeColor};">${grade}/10</span>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"viewBox="0 0 47.94 47.94" xml:space="preserve"> <path fill="${gradeColor}" d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757 c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042 c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685 c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528 c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956 C22.602,0.567,25.338,0.567,26.285,2.486z"/> </svg>
                </h4>
            </div>
            <p>${text}</p>
            <div class="reviews__slide-bottom">
                <span>${date}</span>
                <a href="${link}" target="_blank" title="Go to source">${linkText}</a>
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
		<a href="${link}" target="_blank" title="${title}" class="contacts__item">
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