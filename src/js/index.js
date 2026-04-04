import { doc } from "./modules/utils.js";
import { toggleBurgerMenu } from "./modules/burgerMenu.js";
import { smoothScroll } from "./modules/smoothScroll.js";
import { openProjectPopup, closeProjectPopup } from "./modules/projectPopup.js";
import { getLoadedProjectsCount, loadMoreProjects } from "./modules/loadMoreProjects.js";
import projects from "../../temp/projects.json";
import "./modules/initReviewsSwiper.js"; // Swiper


doc.addEventListener("click", e => {

	const burger = e.target.closest(".header__burger"),
		  projectItem = e.target.closest(".projects__item"),
		  loadMoreButton = e.target.closest(".projects__btn-load-more"),
		  closeBtnProjectPopup = e.target.closest(".project-popup__close");

	if (burger)
		toggleBurgerMenu();

	else if (projectItem) {
		openProjectPopup(projectItem);
	}

	else if (loadMoreButton) {
		loadMoreProjects();
		if (getLoadedProjectsCount() === projects.length) {
			loadMoreButton.remove();
		}
	}
		
	else if (e.target.classList.contains("project-popup") || closeBtnProjectPopup) // click outside the popup or close button
		closeProjectPopup();

	else if (e.target.matches('.header__menu a[href*="#"]')) {
		e.preventDefault();
		smoothScroll(e.target.getAttribute('href'));
	}
});

doc.addEventListener("keydown", event => {
	if (event.key == "Escape") closeProjectPopup();
});
