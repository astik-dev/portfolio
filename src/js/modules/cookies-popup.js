import { dqs, dqsa } from "./utils.js";
import { setCookie } from "./cookies.js";
import { loadGoogleAnalytics4 } from "./googleAnalytics4.js";


const cookiesPopupHTML = `
    <div class="cookies-popup cookies-popup_close">
        <div class="cookies-popup__text">
            <p>🍪 Cookie Usage Notice</p>
            <p>We use cookies to enhance your browsing experience and gain insights into how our website is used. These cookies help us understand user behavior and analyze traffic patterns, all while respecting your privacy. To learn more about how we use cookies and your data, please review our <a href="privacy.html">Privacy Policy</a>.</p>
        </div>
        <div class="cookies-popup__btns">
            <button>Reject</button>
            <button>Accept</button>
        </div>
    </div>
`;


export function addCookiesPopup() {
	dqs(".wrapper").insertAdjacentHTML("afterbegin", cookiesPopupHTML);
    const cookiesPopupBtns = dqsa(".cookies-popup__btns button");
	cookiesPopupBtns[0].addEventListener("click", cookiesDecline);
	cookiesPopupBtns[1].addEventListener("click", cookiesAccept);
	setTimeout(() => {
		dqs(".cookies-popup").classList.remove("cookies-popup_close");
	}, 100);
}

function removeCookiesPopup() {
	dqs(".cookies-popup").classList.add("cookies-popup_close");
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

function setCookieConsent(value) {
    setCookie("consent", value, 180);
}
