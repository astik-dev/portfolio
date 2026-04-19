import { getQueryParam } from "../modules/queryParams.js";

if (getQueryParam("dnt") === "1") {
	// https://docs.umami.is/docs/exclude-my-own-visits
	localStorage.setItem("umami.disabled", 1);
}
