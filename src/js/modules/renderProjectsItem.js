const IMG_SIZES = [ 400, 600, 800, 1000, 1200, 1400 ];

const sizesAttrValue =
	"(max-width: 575.5px) min(400px, calc(100vw - 40px))," +
	"(max-width: 767.5px) calc((100vw - (20px + 20px + 15px)) / 2)," +
	"(max-width: 860px) calc((100vw - (20px + 20px + 20px)) / 2)," +
	"400px";

const handleImageLoad =
	"this.closest('.projects__item').classList.remove('projects__item_shimmer')";

function buildImgUrl(projectId, size, ext) {
	if (!IMG_SIZES.includes(size)) {
		throw new Error(
			`Invalid size "${size}". Allowed sizes: ${IMG_SIZES.join(", ")}`
		);
	}
	return (
		"https://astik-dev.github.io/portfolio-images/projects/" +
		`${projectId}/thumbnail/${size}.${ext}`
	);
}

function buildImgSrcset(projectId, ext) {
	return IMG_SIZES
		.map(size => `${buildImgUrl(projectId, size, ext)} ${size}w`)
		.join();
};

export function renderProjectsItem({ folder, title }, index, isHidden) {
	return `
		<article
			class="
				projects__item
				${isHidden ? "projects__item_hidden" : ""}
				projects__item_shimmer
			"
			data-project-index="${index}"
		>
			<picture>
				<source
					type="image/avif"
					srcset="${buildImgSrcset(folder, "avif")}"
					sizes="${sizesAttrValue}"
				>
				<source
					type="image/webp"
					srcset="${buildImgSrcset(folder, "webp")}"
					sizes="${sizesAttrValue}"
				>
				<img
					srcset="${buildImgSrcset(folder, "jpg")}"
					sizes="${sizesAttrValue}"
					src="${buildImgUrl(folder, 1000, "jpg")}"
					alt="${title} thumbnail"
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
