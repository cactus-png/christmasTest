
// ==========================================
// PASSWORD SETTINGS
// ==========================================

// Change the password here:
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

let treeLoaded = false;

// ==========================================
// PASSWORD CHECK
// ==========================================

passwordForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const enteredPassword = passwordInput.value.trim();

    if (enteredPassword === PASSWORD) {
        passwordError.textContent = "";

        passwordPage.hidden = true;
        connectionsPage.hidden = false;
    } else {
        passwordError.textContent = "Incorrect password. Try again.";
        passwordInput.value = "";
        passwordInput.focus();
    }
});

// ==========================================
// LOAD CHRISTMAS TREE
// ==========================================

previewTreeButton.addEventListener("click", async function() {

    try {
        if (!treeLoaded) {
            await import("./script.js");
            treeLoaded = true;
        }

        connectionsPage.hidden = true;
        treePage.hidden = false;

    } catch (error) {
        console.error("Could not load the Christmas tree:", error);
        alert("There was a problem loading the Christmas tree. Check the browser console for details.");
    }

});
