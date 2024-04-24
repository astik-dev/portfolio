import { dqs } from "../utils.js";
import { removeEmptyItems } from "./removeEmptyItems.js";
import imageCreator from "../imageCreator.js";


export function loadSkills(skills) {
	const skillsItems = dqs(".skills__items");

	removeEmptyItems(".skills__item_empty", skillsItems);

	skills.forEach((skill) => {

		const fallback = `skills/${skill.img}`;
        const alt = skill.name;

		const imgElem = skill.imgWEBP ?
			imageCreator.newWebpPic("external", `skills/${skill.imgWEBP}`, fallback, alt) :
			imageCreator.newImg("external", fallback, alt);

		let currentSkill = `<article class="skills__item">
								${imgElem}
								<h4>${skill.name}</h4>
							</article>`;

		skillsItems.insertAdjacentHTML("beforeend", currentSkill);
	});
}
