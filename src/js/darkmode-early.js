/* *****************************************************************************
 * This should be done in darkmode.js (in the part for the page's initial
 * loading). But, browsers flash a white screen before the dark screen because
 * that's executed too late. Doing it here (inside the *body* element, not head)
 * results in no flash.
 *
 * There is only one page-load operation that still occurs in the .js file:
 * setting the dropdown-choice value to reflect the display mode in use. (FWIW:
 * that part can't happen here because this happens too early. The drop-down
 * object doesn't exist yet.). See the .js file for more info.
 * ****************************************************************************/
/* TESTING: To test the logic for no stored choice (using the browser
 * preference), uncomment the following line to delete any stored value when the
 * page loads. */

//localStorage.removeItem('display')


/* This is a GLOBAL variable. It is refered to in the .js file to set the
 * dropdown value to reflect the display mode being used. (Note: the .js script
 * is loaded "defer." That may have something to do with this variable being
 * reliably available to it.) */
let storedDisplay = localStorage.getItem("display");
//console.log('HTML: storedDisplay:', storedDisplay);

// If the visitor hasn't chosen a display mode, use their browser preference
// (default dark if no preference).
if (storedDisplay === null) {
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)");

    if (prefersLight.matches) {
        //console.log('Initial: no stored choice. Browser prefers light');
        storedDisplay = "lightmode";
    } else {
        //console.log('Initial: no stored choice. Browser does not prefer light. Using dark.');
        storedDisplay = "darkmode";
    }
}

// Set the body's class attribute. (This is the only thing that can't be done in
// the .js file. Someday browsers may handle this better, and it could be done
// there.)
document.body.classList.add(storedDisplay);
