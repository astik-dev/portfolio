import * as nodePath from "path";
const rootFolder = nodePath.basename(nodePath.resolve());

const
	buildFolder = "./dist",
	srcFolder = "./src";

export const path = {
	build: {
		js: `${buildFolder}/js/`,
		jsVendors: `${buildFolder}/js/vendors/`,
		css: `${buildFolder}/css/`,
		html: `${buildFolder}/`,
		images: `${buildFolder}/img/`,
		CNAME: `${buildFolder}/`,
	},
	src: {
		js: `${srcFolder}/js/*.js`,
		jsVendors: `${srcFolder}/js/vendors/**/*.js`,
		images: `${srcFolder}/img/**/*.*`,
		css: `${srcFolder}/css/**/*.css`,
		scss: `${srcFolder}/scss/style.scss`,
		html: `${srcFolder}/html/*.html`,
		CNAME: `${srcFolder}/CNAME`,
	},
	watch: {
		js: `${srcFolder}/js/**/*.js`,
		jsVendors: `${srcFolder}/js/vendors/**/*.js`,
		css: `${srcFolder}/css/**/*.css`,
		scss: `${srcFolder}/scss/**/*.scss`,
		html: `${srcFolder}/html/**/*.html`,
		images: `${srcFolder}/img/**/*.*`,
	},
	buildFolder: buildFolder,
	srcFolder: srcFolder,
	rootFolder: rootFolder,
};