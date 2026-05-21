import Swiper from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { doc, dqs, dqsa } from "./utils.js";
import { track } from "../analytics/umami.js";
import { setQueryParam, deleteQueryParam, getQueryParam } from "./queryParams.js";
import projects from "../../../temp/projects.json";
import { renderResponsiveImage } from "./responsiveImage.js";


const INITIAL_HISTORY_LENGTH = window.history.length;
const PROJECT_PARAM = "project";


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

function imageSlideHTML(projectFolder, index) {

	function buildImgUrl(size, ext) {
		return (
			"https://astik-dev.github.io/portfolio-images/projects/" +
			`${projectFolder}/screenshots/${index}/${size}.${ext}`
		);
	}

	const imgSizes = /** @type {const} */ (
	 // [ 620, 620 * 1.25, 620 * 1.5, 620 * 1.75, 620 * 2, 1420, 1920 ]
		[ 620, 775, 930, 1085, 1240, 1420, 1920 ]
	);
	
	const fallbackImgSize = imgSizes[3];

	const imgSizesAttrValue =
		"(max-width: 575.5px) min(465px, calc(100vw - (8px * 2)))," +
		"(max-width: 767.5px) calc(100vw - (20px * 2) - (20px * 2) - (40px * 2))," +
		"min(620px, calc(100vw - (20px * 2) - (50px * 2) - (40px * 2)))";

	return `
		<div class="project-popup__image-slide swiper-slide">
			<div class="project-popup__image-slide-loader"></div>
			<a
				href="screenshot.html?project=${projectFolder}&index=${index}"
				target="_blank"
				data-project="${projectFolder}"
				data-screenshot-index="${index}"
			>
				${renderResponsiveImage(
					buildImgUrl,
					imgSizes,
					fallbackImgSize,
					imgSizesAttrValue,
					`alt="Project screenshot ${index}"`,
					index === 1 ? "fetchpriority='high'" : "loading='lazy'"
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

	const imgEl = picture.querySelector("img");

	async function onLoad() {
		try {
			await imgEl.decode();
		} catch (error) {
			console.error(error);
		}
		window.requestAnimationFrame(() => {
			window.requestAnimationFrame(() => {
				const slideEl = picture.closest(".project-popup__image-slide");
				slideEl.classList.add("project-popup__image-slide_img-loaded");
				const loaderEl =
					slideEl.querySelector(".project-popup__image-slide-loader");
				loaderEl.addEventListener("transitionend", loaderEl.remove);
				onImageDisplay?.();
			});
		});
	}

	if (imgEl.complete) {
		onLoad();
	} else {
		imgEl.addEventListener("load", onLoad, { once: true });
	}
}

function addPictureLoadHandlerToAllSlides() {
	dqsa(".project-popup__image-slide picture").forEach((slidePicture, index) => {
		addSlidePictureLoadHandler(
			slidePicture,
			index === 0
				? () => scheduleScrollHintIfImageIsScrollable(slidePicture.querySelector("img"))
				: undefined
		);
	});
}

function imageSlideScrollEvent(event) {
	track("project-popup-screenshot-scroll", buildUmamiEventProps(event.target));
}

function addScrollEventToImageSlides() {
	const slideLinkEls = dqsa(".project-popup__image .swiper-slide a");
	slideLinkEls.forEach(linkEl => {
		linkEl.addEventListener("scroll", imageSlideScrollEvent, { once: true });
	});
}

function scheduleScrollHintIfImageIsScrollable(image) {
	setTimeout(() => {
		if (image.scrollHeight > dqs(".project-popup__image").clientHeight) {
			dqs(".project-popup__image-scroll-hint").classList.add(
				"project-popup__image-scroll-hint_animation"
			);
		}
	}, 500);
}

export function openProjectPopup(project, shouldPushState = true) {

	if (shouldPushState) {
		setQueryParam(PROJECT_PARAM, project.folder);
	}

	projectPopup.setTitle(project.title);
	projectPopup.setDescription(project.description);
	projectPopup
		.setLinkButtons(project.repository, project.demo, project.folder);

	let imageSlideElems = ``;
	for (let index = 1; index <= project.screenshots; index++) {
		imageSlideElems += imageSlideHTML(project.folder, index);
	}
	dqs(".project-popup__image .swiper-wrapper").innerHTML = imageSlideElems;
	if (projectPopupSwiper.activeIndex !== 0) isProgrammaticSlideChange = true;
	projectPopupSwiper.update();
	projectPopupSwiper.slideTo(0, 1, false);
	addScrollEventToImageSlides();

	dqs(".project-popup").addEventListener(
		"transitionend",
		addPictureLoadHandlerToAllSlides,
		{ once: true }
	);

	document.body.style.overflowY = "hidden";
	dqs(".project-popup").classList.add("project-popup_open");
}

/**
 * @param {"button" | "backdrop" | "esc" | "back"} method 
 * @returns {void}
 */
export function closeProjectPopup(method) {

	dqs(".project-popup")
		.removeEventListener("transitionend", addPictureLoadHandlerToAllSlides);

	document.body.style.overflowY = "";
	dqs(".project-popup").classList.remove("project-popup_open");

	if (method !== "back") {
		if (INITIAL_HISTORY_LENGTH === window.history.length) {
			deleteQueryParam(PROJECT_PARAM, { replace: true });
		} else {
			window.history.back();
		}
	}
	
	track("project-popup-close", { method });
}


let isProgrammaticSlideChange = false;
const projectPopupSwiper = new Swiper('.project-popup__image-swiper', {

	modules: [ Navigation, Pagination ],

	navigation: {
	    nextEl: '.project-popup__image .swiper-nav_right',
	    prevEl: '.project-popup__image .swiper-nav_left',
	},

	pagination: {
	    el: '.project-popup__swiper-pagination',
	    type: 'fraction',
	},

	simulateTouch: false,

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
