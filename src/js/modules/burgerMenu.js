import { track } from "../analytics/umami.js";
import { dqs } from "./utils.js";


const OPEN_BURGER_MENU_CLASS = "header__container_open-burger";

const headerContainerEl = dqs(".header__container");

/**
 * @returns {boolean}
 */
export function isBurgerMenuOpen() {
	return headerContainerEl.classList.contains(OPEN_BURGER_MENU_CLASS);
}

export function toggleBurgerMenu(shouldTrackCloseEvent = true) {

	if (isBurgerMenuOpen()) {
		shouldTrackCloseEvent && track("hamburger-menu-close");
    } else {
		track("hamburger-menu-open");
	}

	headerContainerEl.classList.toggle(OPEN_BURGER_MENU_CLASS);
}
