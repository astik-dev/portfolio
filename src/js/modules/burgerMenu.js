import { track } from "./analytics.js";
import { dqs } from "./utils.js";


export function toggleBurgerMenu() {
	const
		headerCont = dqs(".header__container"),
		openCssClass = "header__container_open-burger";

	if (headerCont.classList.contains(openCssClass)) {
		track("hamburger-menu-close");
    } else {
		track("hamburger-menu-open");
	}

	headerCont.classList.toggle(openCssClass);
}
