import { dqs, dqsa } from "./utils.js";
import projects from "../../../temp/projects.json";
import { renderProjectsItem } from "./renderProjectsItem.js";


const PROJECTS_PER_LOAD = 4;

export const getLoadedProjectsCount = () => dqsa(".projects__item").length;

export function loadMoreProjects() {

	const projectsItemsElem = dqs(".projects__items");
	const loadedProjectsCount = getLoadedProjectsCount();

	projects
		.slice(loadedProjectsCount, loadedProjectsCount + PROJECTS_PER_LOAD)
		.forEach((project, index) => {
			projectsItemsElem.insertAdjacentHTML(
				"beforeend",
				renderProjectsItem(project, index)
			);
		});
}
