import { dqs, dqsa } from "./utils.js";
import projects from "../../../temp/projects.json";
import { renderProjectsItem } from "./renderProjectsItem.js";


const PROJECTS_PER_LOAD = 4;

export const getLoadedProjectsCount = () => dqsa(".projects__item").length;

export function loadMoreProjects() {

	const projectsItemsElem = dqs(".projects__items");
	const loadedProjectsCount = getLoadedProjectsCount();

	for (
		let index = loadedProjectsCount;
		index < Math.min(loadedProjectsCount + PROJECTS_PER_LOAD, projects.length);
		index++
	) {
		projectsItemsElem.insertAdjacentHTML(
			"beforeend",
			renderProjectsItem(projects[index], index, true)
		);
	}
	const addedElements = dqsa(".projects__item_hidden");
	window.requestAnimationFrame(() => {
		window.requestAnimationFrame(() => {
			addedElements.forEach(el =>
				el.classList.remove("projects__item_hidden")
			);
		});
	});
}
