function saveOptions(e) {
	e.preventDefault();
	
	if (e.target.type == 'checkbox') {
  	browser.storage.local.set({
    	clearExistingHistory: document.querySelector("#" + e.target.name).checked
		});
	}
}

function restoreOptions() {
	browser.storage.local.get({
		clearExistingHistory: false
	}, (items) => {
		for (const item in items) {
			document.querySelector("#" + item).checked = items[item];
		}
	});
}

document.addEventListener("DOMContentLoaded", restoreOptions);

document.querySelectorAll("input").forEach((elem) => {
	elem.addEventListener("change", saveOptions);
});

document.querySelector("form").addEventListener("submit", saveOptions);
