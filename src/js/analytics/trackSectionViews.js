import { dqsa } from "../modules/utils.js";
import { track } from "./umami.js";

const intersectionObserver = new IntersectionObserver(entries => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			const { classList } = entry.target;
			if (classList.contains("projects__item")) track("projects-view");
			else if (classList.contains("skills__item")) track("skills-view");
			else if (classList.contains("reviews__swiper")) track("reviews-view");
			else if (classList.contains("contacts__items")) track("contacts-view");
			intersectionObserver.unobserve(entry.target);
    	}
	});
}, { threshold: 1 });

dqsa(
	".projects__item:last-child, " +
	".skills__item:last-child, " +
	".reviews__swiper, " +
	".contacts__items"
).forEach(el => intersectionObserver.observe(el));
