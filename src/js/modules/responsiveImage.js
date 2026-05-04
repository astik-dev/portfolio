/**
 * @param {number[]} sizes 
 * @param {(size: number, ext: string) => string} buildUrl 
 * @param {string} ext 
 * @returns {string}
 */
function buildSrcset(sizes, buildUrl, ext) {
	return sizes.map(size => `${buildUrl(size, ext)} ${size}w`).join();
};

/**
 * @template {number[]} T
 * @param {(size: number, ext: string) => string} buildUrl 
 * @param {T} sizes 
 * @param {T[number]} fallbackSize 
 * @param {string} sizesAttrValue 
 * @param {...string} imgAttrs 
 * @returns {string}
 */
export function renderResponsiveImage(
	buildUrl, sizes, fallbackSize, sizesAttrValue, ...imgAttrs
) {
	return `
		<picture>
			<source
				type="image/avif"
				srcset="${buildSrcset(sizes, buildUrl, "avif")}"
				sizes="${sizesAttrValue}"
			>
			<source
				type="image/webp"
				srcset="${buildSrcset(sizes, buildUrl, "webp")}"
				sizes="${sizesAttrValue}"
			>
			<img
				srcset="${buildSrcset(sizes, buildUrl, "jpg")}"
				sizes="${sizesAttrValue}"
				src="${buildUrl(fallbackSize, "jpg")}"
				${imgAttrs.join(" ")}
			>
		</picture>
	`;
}
