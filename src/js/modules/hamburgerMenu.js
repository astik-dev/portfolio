import { track } from "../analytics/umami.js";
import { dqs } from "./utils.js";


const HAMBURGER_OPEN_CLASS = "hamburger_open";

const hamburgerEl = dqs(".hamburger");

/**
 * @returns {boolean}
 */
export function isHamburgerMenuOpen() {
	return hamburgerEl.classList.contains(HAMBURGER_OPEN_CLASS);
}

export function toggleHamburgerMenu(shouldTrackCloseEvent = true) {

	const isOpen = hamburgerEl.classList.toggle(HAMBURGER_OPEN_CLASS);
	dqs(".header").classList.toggle("header_open", isOpen);

	if (isOpen) {
		document.body.style.overflowY = "hidden";
		track("hamburger-menu-open");
	} else {
		document.body.style.overflowY = "";
		shouldTrackCloseEvent && track("hamburger-menu-close");
	}
}
