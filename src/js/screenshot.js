import projectsById from "../../temp/projectsById.json";
import { getQueryParam } from "./modules/queryParams.js";

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

	const imgUrlWithoutExt =
		"https://astik-dev.github.io/portfolio-images/projects/" +
		`${projectId}/screenshots/${screenshotIndex}/1920`

	document.body.innerHTML = `
		<picture>
			<source type="image/avif" srcset="${imgUrlWithoutExt}.avif">
			<source type="image/webp" srcset="${imgUrlWithoutExt}.webp">
			<img
				src="${imgUrlWithoutExt}.jpg"
				alt="${project.title} screenshot ${screenshotIndex}"
			>
		</picture>
	`;
}
