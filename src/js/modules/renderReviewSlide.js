export function renderReviewSlide({ name, grade, text, date, link }) {
	
	grade = +grade;

    const gradeColor =
        grade < 5 ? "#fa1111" : // red
        grade < 7 ? "#fab43c" : // orange
        "#2CB67D"; // green
    
	const { hostname } = new URL(link);
    
    const siteName = hostname[0].toUpperCase() + hostname.split(".")[0].slice(1);

	if (hostname === "freelancehunt.com") {
		link += "#freelancer-review";
	}

    return `
        <div class="reviews__slide swiper-slide">
            <div class="reviews__slide-top">
				<svg><use href="#icon-avatar" /></svg>
                <h5>${name}</h5>
                <h4 style="color: ${gradeColor};">
                    <span>${grade}/10</span>
					<svg><use href="#icon-star" /></svg>
                </h4>
            </div>
            <p>${text}</p>
            <div class="reviews__slide-bottom">
                <span>${date}</span>
                <a
					href="${link}"
					target="_blank"
                    rel="nofollow"
					title="View on ${siteName}"
					data-umami-event="review-source-link-click"
					data-umami-event-url="${link}"
				>
					${hostname}
				</a>
            </div>
        </div>
    `;
}
