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
        <article class="reviews__slide swiper-slide">
            <header>
				<svg><use href="#icon-avatar" /></svg>
                <p class="reviews__slide-author">${name}</p>
                <div class="reviews__slide-rating" style="color: ${gradeColor};">
                    <p>${grade}/10</p>
					<svg><use href="#icon-star" /></svg>
                </div>
            </header>
            <p>${text}</p>
            <footer>
                <time datetime="${date.split(".").toReversed().join("-")}">
                    ${date}
                </time>
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
            </footer>
        </article>
    `;
}
