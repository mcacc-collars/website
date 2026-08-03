/* *****************************************************************************
 * This script allows for 3 display modes: light, dark or nocturnal (a red-
 * shifted & dim display friendly to circadian rhythm). It operates in two ways:
 *
 * 1. On page load: Retrieve a visitor's previous choice from local-storage. If
 * no previous choice, use the browser preference (if there is none, use dark).
 * But, don't save that as a choice (keep using the browser preference each
 * visit, or default dark if no preference).
 *
 * 2. When the visitor chooses a display mode from the dropdown menu: that
 * choice is applied (the body's class set) & saved to local storage to be used
 * from in #1 above.
 *
 * PROBLEM: The screen may flash as a page loads (if the browser defaults to a
 * white background, and dark is chosen for this site. It could flash if your
 * browser defaults a black background, and light is chosen here.).
 *
 * FIX: I could only get this to work (not flash) by moving the #1 (load) part to
 * the html file's <script> element. Moreover, that element had to be placed just
 * after the opening <body> tag (not in <head>).
 *
 * But, I couldn't move the getElementById (sets the menu item to visually
 * reflect which display mode is being used) to the html <script> element. The
 * document doesn't at the time that element is processed. So, it had to stay
 * here in the #1 "Load" section. Which meant all the other stuff (determining
 * what the display mode should be) has to be here too. Or, put the other way:
 * just the document.body.classList.add has to be in the html <script> element.
 * That's the only thing that can't be here. That needs the "if" block there.
 *
 * FWIW: The variable storedDisplay is global. It can be accessed from the
 * <script> element. But, I've read globals are discouraged. So, I declare a new
 * one there. If I recall, the global nature of that variable didn't help there
 * (in the html <script> element) because it would execute before this .js file.
 * I.e., the variable contained nothing. It's probably possible to access the
 * retreived falue from the <script>'s variable here (without declaring a var
 * here, nor retrieving the local storage here). I assume <script> reliably
 * executes first and would define the global, and put the value in it. (I got
 * tired of thinking about. It seems clearer for each one to have it's own var,
 * set it.).
 *
 * This script was created from the two-mode script shown in:
 *     https://www.youtube.com/watch?v=_gKEUYarehE
 * ****************************************************************************/

/* TESTING: To test the logic for no stored choice (testing the browser
 * preference), uncomment the following line to delete any stored value when
 * the page loads. */
// localStorage.removeItem('display')


/* *****************************************************************************
 * 1. PAGE LOAD:
 * - Retrieve the previously-chosen display mode, or use the browser preference.
 *   If none of the above, use dark (default).
 * - Set the dropdown menu to reflect which mode is being used.
 * - Create an object to be the event handler (if the user changes the drop-down
 *   choice).
 * *****************************************************************************/
let storedDisplay = localStorage.getItem("display");
const selectDisplay = document.getElementById("display-dropdown");

//console.log('LOAD entry: storedDisplay:', storedDisplay);

/* If the visitor hasn't chosen a display mode, use their browser preference.
 * But, don't save this as a chosen display mode. Just follow their browser
 * preference until they choose something more specific on this site. (If there
 * is no preference, default to dark. */
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

// If browsers didn't flash, this (set the body's class) should be done here.
// Instead, it's done at the top of each page's body element.
//     document.body.classList.add(storedDisplay)

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

    // Store the selected display mode to use when the page reloads.
    localStorage.setItem("display", selectedValue);

});
