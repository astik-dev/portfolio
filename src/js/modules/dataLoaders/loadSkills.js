import { dqs } from "../utils.js";
import { removeEmptyItems } from "./removeEmptyItems.js";
import imageCreator from "../imageCreator.js";


function skillsItemHTML ({name, img, imgWEBP}) {
	
	const fallback = `skills/${img}`;

	const imgElem = imgWEBP
		? imageCreator.newWebpPic("external", `skills/${imgWEBP}`, fallback, name)
		: imageCreator.newImg("external", fallback, name);

	return `
		<article class="skills__item">
			${imgElem}
			<h4>${name}</h4>
		</article>
	`;
}

export function loadSkills(skills) {
	
	const skillsItems = dqs(".skills__items");

	removeEmptyItems(".skills__item_empty", skillsItems);

	skills.forEach((skill) => {
		skillsItems.insertAdjacentHTML(
			"beforeend",
			skillsItemHTML(skill)
		);
	});
}
