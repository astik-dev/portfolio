import { doc } from "./modules/utils.js";
import spreadsheets from "./modules/spreadsheets.js";
import { toggleBurgerMenu } from "./modules/burgerMenu.js";
import { smoothScroll } from "./modules/smoothScroll.js";
import { openCloseProjectPopup } from "./modules/projectPopup.js";
import { setProjects } from "./modules/data/projects.js";

import { loadSkills } from "./modules/dataLoaders/loadSkills.js";
import { loadReviews } from "./modules/dataLoaders/loadReviews.js";
import { loadContacts } from "./modules/dataLoaders/loadContacts.js";
import { loadProjects } from "./modules/dataLoaders/loadProjects.js";


spreadsheets.fetchJSON("projects").then(data => {setProjects(data); loadProjects()});
spreadsheets.fetchJSON("skills").then(data => loadSkills(data));
spreadsheets.fetchJSON("reviews").then(data => loadReviews(data));
spreadsheets.fetchJSON("contacts").then(data => loadContacts(data));


doc.addEventListener("click", e => {

	const burger = e.target.closest(".header__burger"),
		  projectItem = e.target.closest(".projects__item"),
		  closeProjectPopup = e.target.closest(".project-popup__close");

	if (burger)
		toggleBurgerMenu();

	else if (projectItem || closeProjectPopup)
		openCloseProjectPopup(projectItem || closeProjectPopup);

	else if (e.target.classList.contains("project-popup")) // click outside the popup
		openCloseProjectPopup();

	else if (e.target.matches('.header__menu a[href*="#"]')) {
		e.preventDefault();
		smoothScroll(e.target.getAttribute('href'));
	}
});
