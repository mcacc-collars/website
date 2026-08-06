/*global storedDisplay*/
/* *****************************************************************************
 * This script allows for 3 display modes: light, dark or nocturnal (a no-blue &
 * dim display which is friendly to circadian rhythm). This script does two
 * things:
 *
 * 1. On page load: a) Retrieve a visitor's previous choice from local-storage,
 * b) set the body's class to that. c) set the pulldown list's selected value
 * to reflect the mode being used. d) create an event handler for use if the user
 * chooses a different display mode from the dropdown lost.
 *
 * If no previous choice has been saved, use the browser's preference (if there
 * is none, default to dark). But, don't save that as a choice (keep using the
 * browser preference each visit until the user chooses something different.).
 *
 * 2. When the visitor chooses a display mode from the page's dropdown menu:
 * a) apply that to the body's class. And, b) save it to local storage (to be
 * used in #1 page-load above).
 *
 * PROBLEM: The screen may flash as a page loads (if the browser defaults to a
 * white background, and dark is chosen for this site. It could also flash if
 * your browser defaults a black background, and light is chosen here.).
 *
 * FIX: I could only get this to work (not flash) by moving #1-b (set the body's
 * class on page load) to the html file's <script> element. Moreover, that
 * element had to be placed immediately after the opening <body> tag (not in
 * <head>. Being at the top of <body> seems to cause page display to wait until
 * the inline script executes (sets the body's class). No flash occurs.
 *
 * Moving 1-b to inline script (in each html file) necessitated moving 1-a there
 * too (retrieving the stored value, and setting the default if no stored value).
 * The only page-load parts that can remain here are 1-c and -d. (The inline
 * script executes too soon for 1-c to execute there - the drop-down list doesn't
 * exist then.). The display-mode (either retrieved from a saved choice, or
 * defaulted) is a global variable set in the html, but can be accessed here.
 * (Loading this script with DEFER may be necessary for that.).
 *
 * Someday, maybe the class can be set here without flashing. The lines that
 * should be able to work surrounded by >>> <<<. If those could be uncommented,
 * nothing would be needed in the html.
 *
 * This script was created from the two-mode script shown in:
 *     https://www.youtube.com/watch?v=_gKEUYarehE
 * ****************************************************************************/

/* TESTING: To test the logic for no stored choice (using the browser
 * preference), uncomment the following line to delete any stored value when the
 * page loads. */
//localStorage.removeItem('display')

/* This is used to set an event handler to handle if the user changes the display
 * mode */
const selectDisplay = document.getElementById("display-dropdown");

/* *****************************************************************************
 * 1. PAGE LOAD:
 * If the display mode could be set here, the following would occur:
 *    1a. Retrieve the previously-chosen display mode, or use the browser
 *        preference. If none of the above, use dark (default).
 *    1b. Set the dropdown menu to reflect which mode is being used.
 *    1c. Create an event handler (if the user changes the drop-down choice)
 *
 * But, 1a & b must occur in the html's inline script (and must occur in the body
 * element, not head) or browsers will flash white before setting dark (or flash
 * dark before setting white)
 * *****************************************************************************/

// Retrieve the user's saved choice (if they have made a choice previously)
// >>> let storedDisplay = localStorage.getItem("display"); <<<
//console.log('LOAD entry: storedDisplay:', storedDisplay);

/* If the visitor hasn't chosen a display mode, use their browser preference.
 * But, don't save this as a chosen display mode. Just follow their browser
 * preference until they choose something more specific on this site. (If
 * there is no preference, default to dark. */
// >>> if (storedDisplay === null) {
//    const prefersLight = window.matchMedia("(prefers-color-scheme: light)");
//
//    if (prefersLight.matches) {
//        //console.log('Initial: no stored choice. Browser prefers light');
//        storedDisplay = "lightmode";
//    } else {
//        //console.log('Initial: no stored choice. Browser does not prefer light. Using dark.');
//        storedDisplay = "darkmode";
//    }
//} <<<

// If browsers didn't flash, this (set the body's class) should be done here.
// Instead, it's done at the top of each page's body element.
//   >>> document.body.classList.add(storedDisplay) <<<

// ^^^ The above occurs in the html file. ^^^

// Set the drop-down menu to reflect the display mode being used.
document.getElementById("display-dropdown").value = storedDisplay;


/* *****************************************************************************
 * 2. DROPDOWN CHOICE HAS OCCURED:
 * - Retrieve the chosen value.
 * - Remove any body class previously set. I don't check to see if anything is
 * set. I just remove the possibilities. (It may be easier/faster to remove all 3
 * no matter what was chosen.).
 * - Set the body class to the chosen mode.
 * - Save the choice so it can be used if the user returns.
 * *****************************************************************************/
selectDisplay.addEventListener("change", function (event) {

    // Retrieve the ID value of the selected option
    const selectedValue = event.target.value;

    // Call the function to remove the prior mode's class. (It may be faster to
    // remove all 3 classes instead of figuring out which two could be present).
    if (selectedValue === "darkmode") {
        document.body.classList.remove("lightmode");
        document.body.classList.remove("noctmode");
    //  console.log('Selected:', selectedValue);
    } else if (selectedValue === "lightmode") {
        document.body.classList.remove("darkmode");
        document.body.classList.remove("noctmode");
    //  console.log('Selected:', selectedValue);
    } else if (selectedValue === "noctmode") {
        document.body.classList.remove("lightmode");
        document.body.classList.remove("darkmode");
    //  console.log('Selected:', selectedValue);
    } else {
        console.log("ERROR: unknown value selected (this should never happen):", selectedValue);
    }

    // Set the class for the display mode
    document.body.classList.add(selectedValue);

    // Save the selected display mode to use when the page reloads.
    localStorage.setItem("display", selectedValue);

});
