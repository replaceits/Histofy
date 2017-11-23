function saveOptions(e) {
	e.preventDefault();
	
	if (e.target.type == 'checkbox') {
		let keys = {};
		keys[e.target.name] = e.target.checked;
  	browser.storage.local.set(keys);
	}
}

function restoreOptions() {
	// Default dates, Must be in 'YYYY-MM-DD' format
	let currentDate = new Date();
	currentDate = currentDate.getFullYear() + '-' + 
			(currentDate.getMonth() < 10 ? '0' : '') + currentDate.getMonth() + '-' + 
			(currentDate.getDate() < 10 ? '0' : '') + currentDate.getDate();

	let monthAgo = new Date();
	monthAgo.setMonth(monthAgo.getMonth() - 1);
	monthAgo = monthAgo.getFullYear() + '-' + 
			(monthAgo.getMonth() < 10 ? '0' : '') + monthAgo.getMonth() + '-' + 
			(monthAgo.getDate() < 10 ? '0' : '') + monthAgo.getDate();

	// Restore standard inputs
	browser.storage.local.get({
		startDate: monthAgo,
		endDate: currentDate
	}, (items) => {
		for (const item in items) {
			document.querySelector('#' + item).value = items[item];
		}
	});
	
	// Restore checkboxes
	browser.storage.local.get({
		// Types
		typeSocialMedia: true,
		typeShopping: true,
		typeBanking: true,
		typeGaming: true,
		typeFood: true,
		typeAutomobiles: true,
		typeMusic: true,
		// Misc
		clearExistingHistory: false
	}, (items) => {
		for (const item in items) {
			document.querySelector('#' + item).checked = items[item];
		}
	});
}

document.addEventListener('DOMContentLoaded', () => {
	restoreOptions();

	document.querySelectorAll('input').forEach((elem) => {
		elem.addEventListener('change', saveOptions);
	});

	document.querySelector('form').addEventListener('submit', saveOptions);
});
