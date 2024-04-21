import { dqs } from "./utils.js";
import { gtmEvent } from "./googleAnalytics4.js";


export function toggleBurgerMenu() {
	const
		headerCont = dqs(".header__container"),
		openCssClass = "header__container_open-burger";

	if (!headerCont.classList.contains(openCssClass)) {
        gtmEvent({'event': 'open_burgerMenu'});
    }

	headerCont.classList.toggle(openCssClass);
}
