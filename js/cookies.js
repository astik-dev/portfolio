const cookiesPopupHTML =   `<div class="cookies-popup cookies-popup_close">
								<div class="cookies-popup__text">
									<p>🍪 Cookie Usage Notice</p>
									<p>We use cookies to enhance your browsing experience and gain insights into how our website is used. These cookies help us understand user behavior and analyze traffic patterns, all while respecting your privacy. To learn more about how we use cookies and your data, please review our <a href="privacy.html">Privacy Policy</a>.</p>
								</div>
								<div class="cookies-popup__btns">
									<button onClick="cookiesDecline();">Reject</button>
									<button onClick="cookiesAccept();">Accept</button>
								</div>
							</div>`;



function getCookie(cookieName) {
  	const name = cookieName + "=";
  	const decodedCookie = decodeURIComponent(document.cookie);
  	const cookieArray = decodedCookie.split(';');

  	for (let i = 0; i < cookieArray.length; i++) {
    	let cookie = cookieArray[i].trim();
    	if (cookie.indexOf(name) === 0) {
      		return cookie.substring(name.length, cookie.length);
    	}
  	}

  	return null;
}

function toggleCloseStyleCookiesPopup () {
	dqs(".cookies-popup").classList.toggle("cookies-popup_close");
}

function addCookiesPopup () {
	dqs(".wrapper").insertAdjacentHTML("afterbegin", cookiesPopupHTML);
	setTimeout(() => {
		toggleCloseStyleCookiesPopup();
	}, 100);
}

function removeCookiesPopup () {
	toggleCloseStyleCookiesPopup();
	setTimeout(() => {
		dqs(".cookies-popup").remove();
	}, 300);
}

function cookiesAccept() {
	removeCookiesPopup();
	setCookieConsent("accepted");
	loadGoogleAnalytics4();
}

function cookiesDecline() {
	removeCookiesPopup();
	setCookieConsent("declined");
}

function setCookieConsent (value) {
	let sixMonthsInSeconds = 6 * 30 * 24 * 60 * 60;
	document.cookie = `consent=${value}; max-age=${sixMonthsInSeconds}`;
}

function loadGoogleAnalytics4 () {

	// Google Tag Manager
	(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
	new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
	j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
	'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
	})(window,document,'script','dataLayer','GTM-5LL8BFL');


	// Google tag (gtag.js)
	document.head.insertAdjacentHTML("beforeend", `<script async src="https://www.googletagmanager.com/gtag/js?id=G-B8B6TJH9GG"></script>`);

	window.dataLayer = window.dataLayer || [];
	function gtag(){dataLayer.push(arguments);}
	gtag('js', new Date());
	gtag('config', 'G-B8B6TJH9GG');


	// Google Tag Manager (noscript)
	document.body.insertAdjacentHTML('afterbegin', `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5LL8BFL" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`);
}


document.addEventListener('DOMContentLoaded', function() {
	
	if (navigator.cookieEnabled) {

		let currentCookieValue = getCookie("consent");

		if (currentCookieValue) {

			if (currentCookieValue == "accepted") {
				loadGoogleAnalytics4();
			}

		} else {

			// Excluding the display of the popup on the Privacy Policy
			// page based on the presence of the .privacy element.
			if (!dqs(".privacy")) {
				addCookiesPopup();
			}
		}
	}
});
