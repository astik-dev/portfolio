const getFileExtension = filePath => filePath.split('.').pop();

const imageCreator = {

	imgBasePath: {
		local: "img/",
		external: "https://raw.githubusercontent.com/astik-dev/portfolio/content/images/",
	},

	px1: `img/1x1.png`,

	fullPath: function (source, path) {return this.imgBasePath[source] + path},

	newWebpPic: function (source, webpPath, fallbackPath, alt, lazy) {
		const types = {
			jpg: "jpeg",
		}

		const src = lazy ? "data-src" : "srcset";
		
		const fallbackExt = getFileExtension(fallbackPath);
		const fallbackType = types[fallbackExt] || fallbackExt;
		
		return `<picture>
					<source type="image/webp" ${src}="${this.fullPath(source, webpPath)}">
					<source type="image/${fallbackType}" ${src}="${this.fullPath(source, fallbackPath)}">
					${this.newImg(source, fallbackPath, alt, lazy)}
				</picture>`;
	},

	newImg: function (source, path, alt, lazy) {
		const fullPath = this.fullPath(source, path);
		const src = lazy ? `"${this.px1}" data-src="${fullPath}"` : `"${fullPath}"`;
		return `<img src=${src} alt="${alt}">`;
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
