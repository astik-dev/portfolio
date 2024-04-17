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
		html: `${srcFolder}/pages/**/*.html`,
		CNAME: `${srcFolder}/CNAME`,
	},
	watch: {
		js: `${srcFolder}/js/**/*.js`,
		jsVendors: `${srcFolder}/js/vendors/**/*.js`,
		css: `${srcFolder}/css/**/*.css`,
		scss: [
			`${srcFolder}/scss/**/*.scss`,
			`${srcFolder}/components/**/*.scss`,
		],
		html: [
			`${srcFolder}/pages/**/*.html`,
			`${srcFolder}/components/**/*.html`,
			`${srcFolder}/head/**/*.html`,
		],
		images: `${srcFolder}/img/**/*.*`,
	},
	buildFolder: buildFolder,
	srcFolder: srcFolder,
	rootFolder: rootFolder,
};