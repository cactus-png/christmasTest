
/* ==========================================
   CHRISTMAS GIFT SETTINGS
========================================== */

// CHANGE THE PASSWORD HERE
const PASSWORD = "Christmas2026";


// ==========================================
// PAGE ELEMENTS
// ==========================================

const passwordPage = document.getElementById("passwordPage");
const connectionsPage = document.getElementById("connectionsPage");
const treePage = document.getElementById("treePage");

const passwordForm = document.getElementById("passwordForm");
const passwordInput = document.getElementById("passwordInput");
const passwordError = document.getElementById("passwordError");

const previewTreeButton = document.getElementById("previewTreeButton");


// ==========================================
// PAGE TRANSITIONS
// ==========================================

function showPage(page) {

    passwordPage.hidden = true;
    connectionsPage.hidden = true;
    treePage.hidden = true;

    page.hidden = false;
}


// ==========================================
// PAGE 1: PASSWORD CHECK
// ==========================================

passwordForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const enteredPassword = passwordInput.value;

    if (enteredPassword === PASSWORD) {

        passwordError.textContent = "";

        passwordInput.value = "";

        showPage(connectionsPage);

    } else {

        passwordError.textContent =
            "That's not quite right. Try again!";

        passwordInput.value = "";

        passwordInput.focus();

    }

});


// ==========================================
// PAGE 2: CONNECTIONS TO TREE
// TEMPORARY UNTIL GAME IS CREATED
// ==========================================

let treeLoaded = false;

previewTreeButton.addEventListener("click", async function() {

    showPage(treePage);

    // Load the original Christmas tree only once
    if (!treeLoaded) {

        try {

            await import("./script.js");

            treeLoaded = true;

        } catch (error) {

            console.error("Could not load Christmas tree:", error);

            alert("Something went wrong loading your Christmas tree.");

            showPage(connectionsPage);

        }

    }

});
