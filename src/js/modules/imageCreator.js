const getFileExtension = filePath => filePath.split('.').pop();

const imageCreator = {

	imgBasePath: {
		local: "img/",
		external: "https://raw.githubusercontent.com/astik-dev/portfolio/content/images/",
	},

	px1: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",

	fullPath: function (source, path) {return this.imgBasePath[source] + path},

	/**
	 * @param {"local" | "external"} source 
	 * @param {string} webpPath 
	 * @param {string} fallbackPath 
	 * @param {string} alt 
	 * @param {"browser" | "data-src"} [lazy] 
	 * @param {HTMLImageElement["fetchPriority"]} [fetchpriority] 
	 * @returns {string}
	 */
	newWebpPic(source, webpPath, fallbackPath, alt, lazy, fetchpriority) {
		const types = {
			jpg: "jpeg",
		}

		const src = lazy === "data-src" ? "data-src" : "srcset";
		
		const fallbackExt = getFileExtension(fallbackPath);
		const fallbackType = types[fallbackExt] || fallbackExt;
		
		return `<picture>
					<source type="image/webp" ${src}="${this.fullPath(source, webpPath)}">
					<source type="image/${fallbackType}" ${src}="${this.fullPath(source, fallbackPath)}">
					${this.newImg(source, fallbackPath, alt, lazy, fetchpriority)}
				</picture>`;
	},

	/**
	 * @param {"local" | "external"} source 
	 * @param {string} path 
	 * @param {string} alt 
	 * @param {"browser" | "data-src"} [lazy] 
	 * @param {HTMLImageElement["fetchPriority"]} [fetchpriority] 
	 * @returns {string}
	 */
	newImg(source, path, alt, lazy, fetchpriority) {
		const fullPath = this.fullPath(source, path);
		const src = lazy === "data-src"
			? `"${this.px1}" data-src="${fullPath}"`
			: `"${fullPath}"`;
		return `
			<img
				src=${src}
				alt="${alt}"
				${fetchpriority ? `fetchpriority="${fetchpriority}"` : ""}
				${lazy === "browser" ? "loading='lazy'" : ""}
			>
		`;
	},

    loadPictureSources: function (picture) {
        picture.querySelectorAll("source").forEach(source => {
            source.srcset = source.dataset.src;
        });
        const pictureImg = picture.querySelector("img");
        pictureImg.src = pictureImg.dataset.src;
    },
}

export default imageCreator;
