import projectsById from "../../temp/projectsById.json";
import { getQueryParam } from "./modules/queryParams.js";
import imageCreator from "./modules/imageCreator.js";

const projectId = getQueryParam("project");
const screenshotIndex = +getQueryParam("index");

const project = projectsById[projectId];

if (
	!screenshotIndex ||
	!project ||
	project.screenshotCount < screenshotIndex ||
	screenshotIndex < 0
) {
	window.location.replace("/");
} else {
	document.title = `${project.title} | Screenshot ${screenshotIndex} | ASTIK`;
	
	const imagePathWithoutExt = `projects/${projectId}/full-size/${screenshotIndex}`;
	document.body.innerHTML = imageCreator.newWebpPic(
		"external",
		imagePathWithoutExt + ".webp",
		imagePathWithoutExt + ".jpeg",
		`${project.title} screenshot ${screenshotIndex}`
	);
}
