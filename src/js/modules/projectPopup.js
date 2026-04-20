import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { doc, dqs, dqsa } from "./utils.js";
import imageCreator from "./imageCreator.js";
import { track } from "../analytics/umami.js";
import { setQueryParam, deleteQueryParam, getQueryParam } from "./queryParams.js";
import projects from "../../../temp/projects.json";


const INITIAL_HISTORY_LENGTH = window.history.length;
const PROJECT_PARAM = "project";
const POPUP_TRANSITION_DURATION = 300;
let projectPopupInTransition = false;


const projectPopup = {

	setTitle(title) {
		dqs(".project-popup__container h3").textContent = title;
	},

	setDescription(descriptionText) {
		const descriptionElem = dqs(".project-popup__container p");
		descriptionElem.textContent = descriptionText;	
		descriptionElem.scrollTop = 0;
	},

	setLinkButtons(repositoryLink, demoLink, projectFolder) {
		const linkButtons = [repositoryLink, demoLink];

		linkButtons.forEach((link, index) => {
			const btn = dqs(`.project-popup__btn:nth-child(${index + 1})`);
			const isLinkEmpty = link == "";

			btn.classList.toggle("project-popup__btn_disabled", isLinkEmpty);

			if (isLinkEmpty) {
				btn.removeAttribute("href");
			} else {
				btn.href = link;
				btn.dataset.umamiEventProject = projectFolder;
			}
		});

		dqs(".project-popup__btns").classList.toggle(
			"project-popup__btns_disabled",
			linkButtons.every(link => link == "")
		);
	},
}

function setScrollWidthCssVar() {
	const scrollWidth = window.innerWidth - doc.documentElement.clientWidth;
	doc.documentElement.style.setProperty('--scroll-width', `${scrollWidth}px`);
}

function imageSlideHTML(projectFolder, index) {
	const imagePathWithoutExt = `projects/${projectFolder}/full-size/${index}`;
	return `
		<div class="project-popup__image-slide swiper-slide">
			<div class="project-popup__image-slide-loader"></div>
			<a
				style="display: none"
				href="screenshot.html?project=${projectFolder}&index=${index}"
				target="_blank"
				data-project="${projectFolder}"
				data-screenshot-index="${index}"
			>
				${imageCreator.newWebpPic(
					"external",
					imagePathWithoutExt + ".webp",
					imagePathWithoutExt + ".jpeg",
					`Project screenshot ${index}`,
					"data-src"
				)}
			</a>
		</div>
	`;
}

/**
 * @param {HTMLAnchorElement} slideLinkEl 
 */
export function handleSlideLinkClick(slideLinkEl) {
	track("project-popup-screenshot-click", buildUmamiEventProps(slideLinkEl));
}

/**
 * @param {HTMLAnchorElement} slideLinkEl 
 */
function buildUmamiEventProps(slideLinkEl) {
	const { project, screenshotIndex } = slideLinkEl.dataset;
	return {
		project: project,
		"screenshot-index": Number(screenshotIndex),
		screenshot: project + "_" + screenshotIndex,
	}
}

/**
 * @param {HTMLPictureElement} picture 
 * @param {() => void} [onImageDisplay] 
 * @returns {void}
 */
function addSlidePictureLoadHandler(picture, onImageDisplay) {
	window.requestAnimationFrame(async () => {
		try {
			await picture.querySelector("img").decode();
		} catch (error) {
			console.error(error);
		}
		window.requestAnimationFrame(() => {
			picture.parentElement.style.display = "";
			window.requestAnimationFrame(() => {
				const slideEl = picture.closest(".project-popup__image-slide");
				slideEl.classList.add("project-popup__image-slide_img-loaded");
				const loaderEl =
					slideEl.querySelector(".project-popup__image-slide-loader");
				loaderEl.addEventListener("transitionend", loaderEl.remove);
				onImageDisplay?.();
			});
		});
	});
}

function imageSlideScrollEvent(event) {
	const linkEl = event.target.querySelector("a");
	track("project-popup-screenshot-scroll", buildUmamiEventProps(linkEl));
}

function addScrollEventToImageSlides() {
	const swiperSlideElems = dqsa(".project-popup__image-swiper-wrapper .swiper-slide");
	swiperSlideElems.forEach(slide => {
		slide.addEventListener('scroll', imageSlideScrollEvent, { once: true });
	});
}

function showScrollAnimation(image) {
	setTimeout(() => {
		if (image.scrollHeight > dqs(".project-popup__image").clientHeight) {
			dqs(".project-popup__image-scroll").classList.add(
				"project-popup__image-scroll_animation"
			);
		}
	}, 500);
}

function withTransitionLock(actionFunction) {

	if (projectPopupInTransition) return;
	else projectPopupInTransition = true;

	actionFunction();

	setTimeout(() => {
		projectPopupInTransition = false;
	}, POPUP_TRANSITION_DURATION);
}

export function openProjectPopup(project, shouldPushState = true) {
	withTransitionLock(() => {

		if (shouldPushState) {
			setQueryParam(PROJECT_PARAM, project.folder);
		}

		setScrollWidthCssVar();

		projectPopup.setTitle(project.title);
		projectPopup.setDescription(project.description);
		projectPopup
			.setLinkButtons(project.repository, project.demo, project.folder);

		// image slides
		let imageSlideElems = ``;
		for (let index = 1; index <= project.screenshots; index++) {
			imageSlideElems += imageSlideHTML(project.folder, index);
		}
		dqs(".project-popup__image-swiper-wrapper").innerHTML = imageSlideElems;
		if (projectPopupSwiper.activeIndex !== 0) isProgrammaticSlideChange = true;
		projectPopupSwiper.update();
		projectPopupSwiper.slideTo(0, 1, false);
		addScrollEventToImageSlides();

		setTimeout(() => {
			// Load first two (if available) images
			dqsa(".project-popup__image-slide:nth-child(-n+2) picture").forEach((slidePic, index) => {
				imageCreator.loadPictureSources(slidePic);
				addSlidePictureLoadHandler(
					slidePic,
					index === 0
						? () => showScrollAnimation(slidePic.querySelector("img"))
						: undefined
				);
			});
		}, POPUP_TRANSITION_DURATION);

		dqs("body").classList.add("open-project-popup");
	});
}

/**
 * @param {"button" | "backdrop" | "esc" | "back"} method 
 * @returns {void}
 */
export function closeProjectPopup(method) {
	withTransitionLock(() => {
		dqs("body").classList.remove("open-project-popup");
		if (method !== "back") {
			if (INITIAL_HISTORY_LENGTH === window.history.length) {
				deleteQueryParam(PROJECT_PARAM, { replace: true });
			} else {
				window.history.back();
			}
		}
		track("project-popup-close", { method });
	});
}


let isProgrammaticSlideChange = false;
const projectPopupSwiper = new Swiper('.project-popup__image-swiper', {

	modules: [ Navigation, Pagination ],

	// Navigation arrows
	navigation: {
	    nextEl: '.project-popup__image .swiper-nav_right',
	    prevEl: '.project-popup__image .swiper-nav_left',
	},

	pagination: {
	    el: '.project-popup__swiper-pagination',
	    type: 'fraction',
	},

	simulateTouch: false,
	allowTouchMove: false,

	on: {
		slideChange: swiper => {

			if (!isProgrammaticSlideChange) {
				const linkEl = swiper.slides[swiper.activeIndex].querySelector("a");
				const umamiEventProps = buildUmamiEventProps(linkEl);
				track("project-popup-swiper-slide-change", {
					project: umamiEventProps.project,
					"to-index": umamiEventProps["screenshot-index"],
					"to-screenshot": umamiEventProps.screenshot,
					direction:
						swiper.previousIndex < swiper.activeIndex ? "next" : "prev",
				});
			}
			isProgrammaticSlideChange = false;

			// Loading next-next image
			const nextNextPic = dqs(".project-popup__image-slide.swiper-slide-next + .project-popup__image-slide picture");
			if (nextNextPic) {
				setTimeout(() => {
					const picImg = nextNextPic.querySelector("img");
					if (picImg.src === imageCreator.px1) {
						imageCreator.loadPictureSources(nextNextPic);
						addSlidePictureLoadHandler(nextNextPic);
					}
				}, 300); // 300 - Default duration of transition between slides (in ms)
			}
		},
	},
});

doc.addEventListener("keydown", event => {
	if (event.key == "Escape") closeProjectPopup("esc");
});

window.addEventListener("popstate", () => {
	const projectParamValue = getQueryParam(PROJECT_PARAM);
	if (projectParamValue) {
		const project = projects.find(p => p.folder === projectParamValue);
		openProjectPopup(project, false);
	} else {
		closeProjectPopup("back");
	}
});

const INITIAL_PROJECT_PARAM_VALUE = getQueryParam(PROJECT_PARAM);
if (INITIAL_PROJECT_PARAM_VALUE) {
	const project = projects.find(p => p.folder === INITIAL_PROJECT_PARAM_VALUE);
	if (project) {
		openProjectPopup(project, false);
	} else {
		deleteQueryParam(PROJECT_PARAM, { replace: true });
	}
}
