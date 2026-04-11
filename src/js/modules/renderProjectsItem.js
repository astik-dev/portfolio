import imageCreator from "./imageCreator.js";

export function renderProjectsItem({ folder, title }, index) {
	
	const img800 = "projects/" + folder + "/800";
	const webp = img800 + ".webp";
	const fallback = img800 + ".jpeg";
		
	const webpPicElem =
		imageCreator.newWebpPic("external", webp, fallback, title, false, "high");
	
	return `
		<article class="projects__item" data-project-index="${index}">
			${webpPicElem}
			<div class="projects__item-title">
				<svg><use href="#icon-eye" /></svg>
				<h5>${title}</h5>
			</div>
		</article>
	`;
}
