import { doc, dqs } from "./modules/utils.js";
import {
	isHamburgerMenuOpen,
	toggleHamburgerMenu
} from "./modules/hamburgerMenu.js";
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

	const hamburger = e.target.closest(".hamburger"),
		  projectItem = e.target.closest(".projects__item"),
		  loadMoreButton = e.target.closest(".projects__btn-load-more"),
		  projectPopupSlideLink = e.target.closest(".project-popup__image-slide a"),
		  closeBtnProjectPopup = e.target.closest(".project-popup__close"),
		  projectPopupFullscreenBtn = e.target.closest(".project-popup__fullscreen-btn");

	if (
		hamburger ||
		// click on backdrop
		(isHamburgerMenuOpen() && e.target.classList.contains("header__container"))
	) {
		toggleHamburgerMenu();
	}

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

	else if (projectPopupFullscreenBtn)
		dqs(".project-popup__image-swiper .swiper-slide-active a").click();

	else if (e.target.matches('.header__menu a[href*="#"]')) {
		if (isHamburgerMenuOpen()) toggleHamburgerMenu(false);
		track("header-nav-link-click", { href: e.target.getAttribute("href") });
	}
});
