document.addEventListener('DOMContentLoaded', () => {
    restoreOptions();

    document.querySelectorAll('input').forEach((elem) => {
		elem.addEventListener('change', saveOptions);
    });
    
    document.querySelector('form').addEventListener('submit', generateHistory);

	document.getElementById('advancedOptions').addEventListener('click', (e) => {
        e.preventDefault();
        browser.runtime.openOptionsPage();
        return false;
    });
});
