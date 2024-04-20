import { doc } from "./utils.js";


export function loadGoogleAnalytics4 () {
	
    // Google Tag Manager
	(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
	new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
	j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
	'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
	})(window,document,'script','dataLayer','GTM-5LL8BFL');


	// Google tag (gtag.js)
	doc.head.insertAdjacentHTML("beforeend", `<script async src="https://www.googletagmanager.com/gtag/js?id=G-B8B6TJH9GG"></script>`);

	window.dataLayer = window.dataLayer || [];
	function gtag(){dataLayer.push(arguments);}
	gtag('js', new Date());
	gtag('config', 'G-B8B6TJH9GG');


	// Google Tag Manager (noscript)
	doc.body.insertAdjacentHTML('afterbegin', `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5LL8BFL" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`);
}

export function gtmEvent(object) {
	if (typeof dataLayer !== "undefined" && Array.isArray(dataLayer)) {
		dataLayer.push(object);
	}
}
