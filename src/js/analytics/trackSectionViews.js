import { dqsa } from "../modules/utils.js";
import { track } from "./umami.js";

const intersectionObserver = new IntersectionObserver(entries => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			const { classList } = entry.target;
			if (classList.contains("projects__item")) track("projects-view");
			else if (classList.contains("reviews__swiper")) track("reviews-view");
			else if (classList.contains("contact__links")) track("contact-view");
			else if (entry.target.closest(".skills")) track("skills-view");
			intersectionObserver.unobserve(entry.target);
    	}
	});
}, { threshold: 1 });

dqsa(
	".projects__item:last-child, " +
	".skills li:last-child, " +
	".reviews__swiper, " +
	".contact__links"
).forEach(el => intersectionObserver.observe(el));
