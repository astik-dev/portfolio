const spreadsheets = {
	id: "1K842-NO5cQoYdsCjDdWzTbxwYfTmaysR4V8oSBI0qMo",
	
	get link() {return `https://opensheet.elk.sh/${this.id}/`},
		
	fetchJSON: function(sheet, retries = 3) {
		return fetch(this.link + sheet)
			.then(response => {
				if (!response.ok) throw new Error('Response was not ok');
				return response.json();
			})
			.catch(error => {
				console.error("Error fetching JSON:", error);
				if (retries <= 0) throw new Error('Max retries exceeded');
				return new Promise(resolve => {
					setTimeout(() => {
						resolve(this.fetchJSON(sheet, retries - 1));
					}, 1500);
				});
			});
	},
}

export default spreadsheets;
