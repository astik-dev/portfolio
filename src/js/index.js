import { doc } from "./modules/utils.js";
import { toggleBurgerMenu } from "./modules/burgerMenu.js";
import { smoothScroll } from "./modules/smoothScroll.js";
import {
	openProjectPopup,
	closeProjectPopup,
	handleSlideLinkClick as handleProjectPopupSlideLinkClick
} from "./modules/projectPopup.js";
import { getLoadedProjectsCount, loadMoreProjects } from "./modules/loadMoreProjects.js";
import projects from "../../temp/projects.json";
import "./modules/initReviewsSwiper.js";
import { track } from "./analytics/umami.js";
import "./analytics/trackScroll.js";
import "./analytics/trackSectionViews.js";
import "./analytics/trackDeviceInfo.js";


doc.addEventListener("click", e => {

	const burger = e.target.closest(".header__burger"),
		  projectItem = e.target.closest(".projects__item"),
		  loadMoreButton = e.target.closest(".projects__btn-load-more"),
		  projectPopupSlideLink = e.target.closest(".project-popup__image-slide a"),
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

	else if (projectPopupSlideLink) {
		handleProjectPopupSlideLinkClick(projectPopupSlideLink);
	}
		
	else if (e.target.classList.contains("project-popup"))
		closeProjectPopup("backdrop");

	else if (closeBtnProjectPopup)
		closeProjectPopup("button");

	else if (e.target.matches('.header__menu a[href*="#"]')) {
		e.preventDefault();
		const href = e.target.getAttribute('href');
		smoothScroll(href);
		track("header-nav-link-click", { href });
	}
});
