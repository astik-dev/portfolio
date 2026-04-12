import imageCreator from "./imageCreator.js";

export function renderProjectsItem({ folder, title }, index) {
	
	const img800 = "projects/" + folder + "/800";
	const webp = imageCreator.fullPath("external", img800 + ".webp");
	const jpeg = imageCreator.fullPath("external", img800 + ".jpeg");

	const handleImageLoad =
		"this.closest('.projects__item').classList.remove('shimmer')";

	return `
		<article
			class="projects__item shimmer"
			data-project-index="${index}"
		>
			<picture>
				<source type="image/webp" srcset="${webp}">
				<source type="image/jpeg" srcset="${jpeg}">
				<img
					src="${jpeg}"
					alt="${title}"
					fetchpriority="high"
					onload="${handleImageLoad}"
				>
			</picture>
			<div class="projects__item-title">
				<svg><use href="#icon-eye" /></svg>
				<h5>${title}</h5>
			</div>
		</article>
	`;
}
