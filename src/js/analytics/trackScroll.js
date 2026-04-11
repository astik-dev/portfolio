import { track } from "./umami.js";

window.addEventListener("scroll", () => track("scroll"), { once: true });
