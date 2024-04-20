import { doc, dqs } from "./modules/utils.js";

import { getCookie } from "./modules/cookies.js";
import { addCookiesPopup } from "./modules/cookies-popup.js";
import { loadGoogleAnalytics4 } from "./modules/googleAnalytics4.js";


doc.addEventListener('DOMContentLoaded', function() {
	
	if (!navigator.cookieEnabled) return;

	const currentCookieValue = getCookie("consent");
	
	if (currentCookieValue) {
		if (currentCookieValue == "accepted") {
			loadGoogleAnalytics4();
		}
	} else {
		// Excluding the display of the popup on the Privacy Policy
		// page based on the presence of the .privacy element.
		if (!dqs(".privacy")) addCookiesPopup();
	}
});
