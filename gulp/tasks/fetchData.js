import fs from "fs";
import { store } from "../store.js";

const API_BASE_URL =
	"https://opensheet.elk.sh/1K842-NO5cQoYdsCjDdWzTbxwYfTmaysR4V8oSBI0qMo/";

export const fetchData = () => {
	return Promise.all(
		["projects", "skills", "reviews", "contacts"].map(async sheetName => {
			
			const response = await fetch(API_BASE_URL + sheetName);
			if (!response.ok) {
				throw new Error(`Error ${response.status} - ${response.statusText}`);
			};
			const data = await response.json();
			store[sheetName] = data;
			
			if (sheetName === "projects") {
				fs.mkdirSync(app.path.tempFolder, { recursive: true });
				fs.writeFileSync(
					`${app.path.tempFolder}/projects.json`,
					JSON.stringify(data)
				);
				const projectsById = Object.fromEntries(data.map(p =>
					[ p.folder, { screenshotCount: +p.screenshots, title: p.title } ]
				));
				fs.writeFileSync(
					`${app.path.tempFolder}/projectsById.json`,
					JSON.stringify(projectsById)
				);
			}
		})
	);
};
