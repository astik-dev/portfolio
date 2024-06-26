import { dqs } from "../utils.js";
import { removeEmptyItems } from "./removeEmptyItems.js";
import imageCreator from "../imageCreator.js";
import { getProjects } from "../data/projects.js";


const projectsPerLoad = 4;
let loadedProjectsCount = 0;


const btnLoadMore = {
	cssClass: "projects__btn-load-more",
	create: function () {
		dqs(".projects__container").insertAdjacentHTML(
			"beforeend",
			`<button class="${this.cssClass}">Load More</button>`
		);
		this.elem = dqs(`.${this.cssClass}`);
		this.elem.addEventListener("click", loadProjects);
	},
}

function projectsItemHTML({folder, title}, index) {
	
	const img800 = "projects/" + folder + "/800";
	const webp = img800 + ".webp";
	const fallback = img800 + ".jpeg";
		
	const webpPicElem = imageCreator.newWebpPic("external", webp, fallback, title, "lazy");
	
	return `
		<article class="projects__item" data-project-index="${index}">
			${webpPicElem}
			<div class="projects__item-title">
				<h5>${title}</h5>
			</div>
		</article>
	`;
}

function addLazyLoadingToPicture(pictureSelector) {

	const observer = new IntersectionObserver(
		entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					imageCreator.loadPictureSources(entry.target);
				}
			});
		},
		{ rootMargin: "200px 0px 200px 0px" },
	);

	observer.observe(dqs(pictureSelector));
}

export function loadProjects() {

	const projects = getProjects();

	const projectsItemsElem = dqs(".projects__items");

	const unloadedProjectsCount = projects.length - loadedProjectsCount;

	const loadFromIndex = projects.length - unloadedProjectsCount;
	const loadToIndex = Math.min(projectsPerLoad + loadFromIndex, projects.length);

	if (loadedProjectsCount == 0) {
		removeEmptyItems(".projects__item_empty", projectsItemsElem);
	}

	for (let i = loadFromIndex; i < loadToIndex; i++) {
		projectsItemsElem.insertAdjacentHTML(
			"beforeend",
			projectsItemHTML(projects[i], i)
		);
		addLazyLoadingToPicture(".projects__item:last-child picture");
	}

	if (loadFromIndex == 0 && projects.length > loadToIndex) {
		btnLoadMore.create();
	} else if (btnLoadMore.elem && unloadedProjectsCount <= projectsPerLoad) {
		btnLoadMore.elem.remove();
	}

	loadedProjectsCount = loadToIndex;
}
