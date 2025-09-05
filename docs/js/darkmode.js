/* *****************************************************************************
 * This script allows for 3 display modes: light, dark or nocturnal (a red-
 * shifted & dim display, friendly to circadian rhythm.). 
 * 
 * 1. On page load: Retrieve a visitor's previous choice from local-storage. If
 * no previous choice, use the visitor's browser preference. If that's dark, 
 * use darkmode. But, don't save that as a choice. Likewise, if their
 * browser preference isn't dark, this site will be set to lightmode. This 
 * won't be saved as a choice either. (Their browser preference will
 * be used for each visit, until they choose something more specific on this
 * site.). 
 * 
 * 2. When the visitor chooses a display mode from the dropdown menu: that
 * choice is applied & saved to local storage to be used each time the page 
 * loads (#1 above).
 * 
 * FLASHING FIX!!!: All of the above processing should occur in this .js file.
 * But, the pages flash when they load. If you're using darkmode, the default
 * white background appears briefly before black. (If you set the default bg
 * color to black - and you use lightmode - you'll see it flash black.).
 * 
 * The fix seems to be to move the "document.body.classList.add" to the html
 * file (inside the <body> element. From what I read, this blocks display until
 * that executes.).
 * 
 * FWIW: Before I read about that fix, I set the default background color (:root
 * in the style.css file) to #888 (midway between black & white). This seemed
 * to soften the flash. (Downside: you see it in both light & dark modes. But,
 * not as jarring as seeing it in just one). I left that because it seems like a
 * good fallback. (If browsers didnt have this problem, then it would be a
 * little simpler if :root cold be default lightmode.).
 * 
 * This script was created from the two-mode script shown in:
 * https://www.youtube.com/watch?v=_gKEUYarehE
 * ****************************************************************************/

/* TESTING: To test the logic for no stored choice (testing the browser
 * preference), uncomment the following line to delete any stored value when
 * the page loads. */
// localStorage.removeItem('display')


/* *****************************************************************************
 * PAGE LOAD:
 * 1. Retrieve the previously-chosen theme (there may not be one)
 * 2. Create an object to set the chosen option (this won't be used if 1) the
 *    visitor never chose anything in the past (nothing retrieved from local
 *    storage. And, 2) if no previous choice, and the user's light/dark browser
 *    preference isn't set to dark. */ 
let storedDisplay = localStorage.getItem('display')
const selectDisplay = document.getElementById('display-dropdown')

//console.log('LOAD entry: storedDisplay:', storedDisplay);

/* If the visitor hasn't chosen a display mode, use their browser preference.
 * But, don't save this as a chosen display mode. Just follow their browser
 * preference until they choose something more specific on this site. */
if (storedDisplay === null) {
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

	if (prefersDark.matches) {
		//console.log('Initial: no stored value. Browser prefers dark');
		storedDisplay = "darkmode"
	}
	else {
		//console.log('Initial: no stored value. Browser does not prefer dark. Using light.');
		storedDisplay = "lightmode"
	}
}

//	document.body.classList.add(storedDisplay) < If browsers didn't flash, this should be done here
	document.getElementById("display-dropdown").value = storedDisplay



/* *****************************************************************************
 * EVENT HANDLER:
 * If the visitor selects a display mode, 1) set the classlist. And, 2) save
 * that choice to local storage. */
selectDisplay.addEventListener('change', function(event) {

// Retrieve the ID value of the selected option
const selectedValue = event.target.value;

// Call the function to set remove prior mode's class. (It may be faster to
// remove all 3 classes instead of figuring out which two might need removal.). 
if (selectedValue === "darkmode") {
	document.body.classList.remove('lightmode')
	document.body.classList.remove('noctmode')
//	console.log('Selected:', selectedValue);
}
else if (selectedValue === "lightmode") {
	document.body.classList.remove('darkmode')
	document.body.classList.remove('noctmode')
//	console.log('Selected:', selectedValue);
}
else if (selectedValue === "noctmode") {
	document.body.classList.remove('lightmode')
	document.body.classList.remove('darkmode')
//	console.log('Selected:', selectedValue);
}
else {
	console.log('ERROR: unknown value selected (this should never happen):', selectedValue);
}

// Set the class for the display mode
document.body.classList.add(selectedValue)

// Store the selected display mode to use when the page reloads.
localStorage.setItem('display', selectedValue)

});
