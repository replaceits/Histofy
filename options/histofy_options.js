document.addEventListener('DOMContentLoaded', () => {
	restoreOptions();

	document.querySelectorAll('input').forEach((elem) => {
		elem.addEventListener('change', saveOptions);
	});

	document.querySelector('form').addEventListener('submit', generateHistory);
});
