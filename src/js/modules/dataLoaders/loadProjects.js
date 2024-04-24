import { dqs, dqsa } from "../utils.js";
import { removeEmptyItems } from "./removeEmptyItems.js";
import imageCreator from "../imageCreator.js";


const btnLoadMore = {
	cssClass: "projects__btn-load-more",
	create: function (projects) {
		dqs(".projects__container").insertAdjacentHTML("beforeend", `<button class="${this.cssClass}">Load More</button>`);
		this.elem = dqs(`.${this.cssClass}`);
		this.elem.addEventListener("click", () => {
            loadProjects(projects, 'load more');
        });
	},
}

// mode: "start", "load more"
export function loadProjects(projects, mode) {

	const projectsItems = dqs(".projects__items");

	let generationSize = 4;
	let startIndex;

	if (mode == "start") {
		startIndex = 0;
		removeEmptyItems(".projects__item_empty", projectsItems);
	} else if (mode == "load more") {

		let loadedProjects = dqsa(".projects__item").length;

		let difference = projects.length - loadedProjects;

		if (difference > generationSize) {
			startIndex = projects.length - difference;
			generationSize += startIndex;
		} else {
			startIndex = projects.length - difference;
			generationSize = projects.length;
			btnLoadMore.elem.remove();
		}
	}

	for (let i = startIndex; i < generationSize; i++) {

		const img800 = "projects/" + projects[i].folder + "/800";
		const webp = img800 + ".webp", fallback = img800 + ".jpeg", alt = projects[i].title;
		
		const webpPicElem = imageCreator.newWebpPic("external", webp, fallback, alt, "lazy");

		let projectItem = `<article class="projects__item">
								${webpPicElem}
								<div class="projects__item-title">
									<h5>${projects[i].title}</h5>
								</div>
							</article>`

		projectsItems.insertAdjacentHTML("beforeend", projectItem);



		// Lazy loading for preview image
		let newLazyImg = projectsItems.querySelector(".projects__item:last-child picture");

		const newObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						imageCreator.loadPictureSources(entry.target);
					}
				});
			},
			{
				rootMargin: "200px 0px 200px 0px",
			},
		);

		newObserver.observe(newLazyImg);
	}

	if (mode == "start" && projects.length > generationSize) btnLoadMore.create(projects);
}
