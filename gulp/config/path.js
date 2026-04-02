import * as nodePath from "path";
const rootFolder = nodePath.basename(nodePath.resolve());

const
	buildFolder = "./dist",
	srcFolder = "./src";

export const path = {
	build: {
		js: `${buildFolder}/js/`,
		css: `${buildFolder}/css/`,
		html: `${buildFolder}/`,
		images: `${buildFolder}/img/`,
		CNAME: `${buildFolder}/`,
	},
	src: {
		js: `${srcFolder}/js/*.js`,
		images: `${srcFolder}/img/**/*.*`,
		scss: `${srcFolder}/scss/style.scss`,
		html: `${srcFolder}/pages/**/*.html`,
		CNAME: `${srcFolder}/CNAME`,
	},
	watch: {
		js: `${srcFolder}/js/**/*.js`,
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