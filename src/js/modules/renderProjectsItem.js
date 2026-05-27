import { renderResponsiveImage } from "./responsiveImage.js";

const imgSizes = /** @type {const} */ ([ 400, 600, 800, 1000, 1200, 1400 ]);

const fallbackImgSize = imgSizes[3];

export function renderProjectsItem({ folder, title }, index, isHidden) {

	function buildImgUrl(size, ext) {
		return (
			"https://astik-dev.github.io/portfolio-images/projects/" +
			`${folder}/thumbnail/${size}.${ext}`
		);
	}

	const imgSizesAttrValue =
		"(max-width: 575.5px) min(400px, calc(100vw - 40px))," +
		"(max-width: 767.5px) calc((100vw - (20px + 20px + 15px)) / 2)," +
		"(max-width: 860px) calc((100vw - (20px + 20px + 20px)) / 2)," +
		"400px";

	const handleImgLoad =
		"this.closest('.projects__item').classList.remove('projects__item_shimmer')";

	return `
		<article
			class="
				projects__item
				${isHidden ? "projects__item_hidden" : ""}
				projects__item_shimmer
			"
			data-project-index="${index}"
		>
			${renderResponsiveImage(
				buildImgUrl,
				imgSizes,
				fallbackImgSize,
				imgSizesAttrValue,
				`alt="${title} thumbnail"`,
				"fetchpriority='high'",
				`onload="${handleImgLoad}"`
			)}
			<div class="projects__item-title">
				<svg><use href="#icon-eye" /></svg>
				<h3>${title}</h3>
			</div>
		</article>
	`;
}
