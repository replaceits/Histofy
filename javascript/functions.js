function saveOptions(e) {
	e.preventDefault();
	let keys = {};
	
	if (e.target.type == 'checkbox' || e.target.type == 'radio') {
		// If radio, save the status of related radios
		if (e.target.type == 'radio') {
			document.getElementsByName(e.target.name).forEach((radio) => {
				keys[radio.id] = radio.checked;
			});
		} else {
			keys[e.target.id] = e.target.checked;
		}

		browser.storage.local.set(keys);
	} else {
		if (e.target.type == 'number') {
			if (e.target.value < 0) {
				e.target.value = 0;
			}
		}

		keys[e.target.id] = e.target.value;
		browser.storage.local.set(keys);
	}
}

function restoreOptions() {
	// Default dates, Must be in 'YYYY-MM-DD' format
	let currentDate = new Date();
	currentDate = currentDate.getFullYear() + '-' + 
			(currentDate.getMonth() + 1 < 10 ? '0' : '') + (currentDate.getMonth() + 1) + '-' + 
			(currentDate.getDate() < 10 ? '0' : '') + currentDate.getDate();

	let monthAgo = new Date();
	monthAgo = monthAgo.getFullYear() + '-' + 
			(monthAgo.getMonth() < 10 ? '0' : '') + monthAgo.getMonth() + '-' + 
			(monthAgo.getDate() < 10 ? '0' : '') + monthAgo.getDate();

	// Restore standard inputs
	browser.storage.local.get({
		// Dynamic Data
		dynamicUserName: 'histofy',
		dynamicFirstName: 'James',
		dynamicLastName: 'Smith',
		// Misc
		startDate: monthAgo,
		endDate: currentDate,
		startTime: '07:30',
		endTime: '22:00',
		// Amount of history to generate
		amountNum: 100
	}, (items) => {
		for (const item in items) {
            let inputElement = document.querySelector('#' + item);
            if (inputElement !== null) {
                inputElement.value = items[item];
                saveOptions({
                    target: document.querySelector('#' + item),
                    preventDefault: () => {}
                });
            } else {
                const fakeElement = {
                    type: 'fake',
                    value: items[item],
                    id: item
                }
                saveOptions({
                    target: fakeElement,
                    preventDefault: () => {}
                });
            }
		}
	});

	// Restore checkboxes & radios
	browser.storage.local.get({
		// Dynamic Data
		useDynamicData: true,
		// Types
		typeSocialMedia: true,
		typeShopping: true,
		typeBanking: true,
		typeGaming: true,
		typeFood: true,
		typeAutomobiles: true,
		typeMusic: true,
		// Misc
		clearExistingHistory: false,
		// Amount of history to generate
		amountTotalRadio: true,
		amountPerDayRadio: false
	}, (items) => {
		for (const item in items) {
            let inputElement = document.querySelector('#' + item);
            if (inputElement !== null) {
                inputElement.checked = items[item];
                saveOptions({
                    target: document.querySelector('#' + item),
                    preventDefault: () => {}
                });
            } else {
                const fakeElement = {
                    type: 'checkbox',
                    value: items[item],
                    checked: items[item],
                    id: item
                }
                saveOptions({
                    target: fakeElement,
                    preventDefault: () => {}
                });
            }
		}
	});
}

function populateHistory(historyData, amountNum, startDate, endDate, startTime, endTime, amountTotalRadio) {
	function yyyyMMDDToDate(date) {
		const year = date.substring(0,4);
		const month = date.substring(5,7);
		const day = date.substring(8,10);
		
		return new Date(year, month-1, day);
    }

	let sDate = yyyyMMDDToDate(startDate);
	let eDate = yyyyMMDDToDate(endDate);
	const curDate = new Date(); 

	if (sDate > eDate) {
		const tmpDate = sDate;
		sDate = eDate;
		eDate = tmpDate;
    }
    
   

	let startHour = parseInt(startTime.substring(0, 2));
	let startMinutes = parseInt(startTime.substring(3, 5));

	let endHour = parseInt(endTime.substring(0, 2));
	let endMinutes = parseInt(endTime.substring(3, 5));

	if (startHour > endHour) {
		const tmpHour = startHour;
		startHour = endHour;
		endHour = startHour;
	}

	// Why is this one < instead of > like it should be?
	// I have no fucking idea, but it works.
	if (startMinutes < endMinutes) {
		const tmpMinutes = startMinutes;
		startMinutes = endMinutes;
		endMinutes = startMinutes;
    }
    
    
	if (amountTotalRadio) {
		for (let i = 0; i < amountNum; i++) {
			const randHour = Math.floor(Math.random()*(endHour-startHour+1)+startHour);
			const randMinutes = Math.floor(Math.random()*(endMinutes-startMinutes+1)+startMinutes);
			
			let randDate = new Date(sDate.getTime() + Math.random() * (eDate.getTime() - sDate.getTime()));
			randDate.setMinutes(randMinutes);
			randDate.setHours(randHour);

			if (randDate > curDate) {
				randDate = curDate;
            }
            
			const randHistory = historyData[Math.floor(Math.random()*historyData.length)];

			browser.history.addUrl({
				url: randHistory.url,
				title: randHistory.title,
				visitTime: randDate
			});
		}
	} else {
		const daysBetween = Math.round((eDate-sDate)/(1000*60*60*24));

		for (let i = daysBetween; i >= 0; i--) {
			for (let x = 0; x < amountNum; x++) {
				const randHour = Math.floor(Math.random()*(endHour-startHour+1)+startHour);
				const randMinutes = Math.floor(Math.random()*(endMinutes-startMinutes+1)+startMinutes);
				
				let randDate = new Date(sDate.getTime());
				randDate.setDate(sDate.getDate() + (daysBetween - i));
				randDate.setMinutes(randMinutes);
				randDate.setHours(randHour);

				if (randDate > curDate) {
					randDate = curDate;
				}
				
				const randHistory = historyData[Math.floor(Math.random()*historyData.length)];

				browser.history.addUrl({
					url: randHistory.url,
					title: randHistory.title,
					visitTime: randDate
				});
			}
		}
	}
}

function fillDynamicValues(dynamicData, userName, firstName, lastName) {
	function fillValues(str) {
		str = str.replace(
			/\^\<u\>\^/g, userName
		).replace(
			/\^\<f\>\^/g, firstName
		).replace(
			/\^\<l\>\^/g, lastName
		).replace(
			/\^\<n\>\^/g, firstName + ' ' + lastName
		);

		let beginIndex = str.indexOf('^<x');
		let endIndex = str.indexOf('>^', beginIndex);

		while (beginIndex !== -1 && endIndex !== -1) {
			let randLength = str.substring(beginIndex + 3, endIndex);
			let randStr = '';

			while (randLength-- > 0) {
				randStr += Math.floor(Math.random() * 10);
			}

			str = str.substring(0, beginIndex) + randStr + str.substring(endIndex + 2);

			beginIndex = str.indexOf('^<x');
			endIndex = str.indexOf('>^', beginIndex);
		}

		return str;
	}

	dynamicData.forEach((item) => {
		item.url = fillValues(item.url);
		item.title = fillValues(item.title);
    });
}

function generateHistory(e) {
	e.preventDefault();

	browser.storage.local.get(null, (items) => {
		let historyTypes = [];

		for (const item in items) {
			if (item.includes('type') && items[item]) {
				historyTypes.push(item);
			}
        }

		var JSONRequest = new XMLHttpRequest();
		JSONRequest.open('GET', browser.extension.getURL('data/history_data.json'), true);
		JSONRequest.onload = function() {
			if (JSONRequest.status >= 200 && JSONRequest.status < 400) {
				let JSONData = JSON.parse(JSONRequest.responseText);
				let staticData = [];
				let dynamicData = [];

				for (const types in JSONData) {
					if (!historyTypes.includes(types)) {
						delete JSONData[types];
					} else {
						JSONData[types].static.forEach((item) => {
							staticData.push(item);
						});
						if (items.useDynamicData) {
							JSONData[types].dynamic.forEach((item) => {
								dynamicData.push(item);
							});
						}
					}
				}

				let historyData;

				if (items.useDynamicData) {
                    fillDynamicValues(dynamicData, items.dynamicUserName, items.dynamicFirstName, items.dynamicLastName);
                    historyData = staticData.concat(dynamicData);
				} else {
					historyData = staticData;
                }

				if (items['clearExistingHistory']) {
					browser.history.deleteAll(() => {
						populateHistory(historyData, items.amountNum, items.startDate, items.endDate, items.startTime, items.endTime, items.amountTotalRadio);
					});
				} else {
					populateHistory(historyData, items.amountNum, items.startDate, items.endDate, items.startTime, items.endTime, items.amountTotalRadio);
				}
			} else {
				console.error('Something went horribly wrong');
			}
		};
		JSONRequest.overrideMimeType('application/json');
		JSONRequest.send(null);
	});
}
