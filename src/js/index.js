import { doc, dqsa } from "./modules/utils.js";
import { toggleBurgerMenu } from "./modules/burgerMenu.js";
import { smoothScroll } from "./modules/smoothScroll.js";
import { openProjectPopup, closeProjectPopup } from "./modules/projectPopup.js";
import { getLoadedProjectsCount, loadMoreProjects } from "./modules/loadMoreProjects.js";
import projects from "../../temp/projects.json";
import "./modules/initReviewsSwiper.js";
import { track } from "./modules/analytics.js";


doc.addEventListener("click", e => {

	const burger = e.target.closest(".header__burger"),
		  projectItem = e.target.closest(".projects__item"),
		  loadMoreButton = e.target.closest(".projects__btn-load-more"),
		  closeBtnProjectPopup = e.target.closest(".project-popup__close");

	if (burger)
		toggleBurgerMenu();

	else if (projectItem) {
		const projectIndex = projectItem.dataset.projectIndex;
		const project = projects[projectIndex];
		openProjectPopup(project);
		track("project-click", { project: project.folder });
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
		const href = e.target.getAttribute('href');
		smoothScroll(href);
		track("header-nav-link-click", { href });
	}
});

doc.addEventListener("keydown", event => {
	if (event.key == "Escape") closeProjectPopup();
});

window.addEventListener("scroll", () => track("scroll"), { once: true });

const intersectionObserver = new IntersectionObserver(entries => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			const { classList } = entry.target;
			if (classList.contains("projects__items")) track("projects-view");
			else if (classList.contains("skills__items")) track("skills-view");
			else if (classList.contains("reviews__swiper")) track("reviews-view");
			else if (classList.contains("contacts__items")) track("contacts-view");
			intersectionObserver.unobserve(entry.target);
    	}
	});
}, { threshold: 1 });
dqsa(".projects__items, .skills__items, .reviews__swiper, .contacts__items")
	.forEach(el => intersectionObserver.observe(el));
