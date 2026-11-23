
const categories = [

    {
        name: "Fatazz World Pets",
        color: "#f2c94c",
        words: ["Lil' Fella", "Murr", "Rita", "Jeff Lewis"]
    },

    {
        name: "Locations of firsts",
        color: "#78a9d1",
        words: ["Loaf", "Street Lamp", "Astronomy", "Lake"]
    },

    {
        name: "Movies we've seen but one word",
        color: "#b49bd6",
        words: ["Walk", "Everything", "Supreme", "Man"]
    },

    {
        name: "Things we've crafted",
        color: "#82b58b",
        words: ["Mugs", "Pots", "Mine", "Canvas"]
    }

];

const MAX_MISTAKES = 4;


// ==========================================
// GAME ELEMENTS
// ==========================================

const puzzleGrid = document.getElementById("puzzleGrid");
const solvedGroups = document.getElementById("solvedGroups");
const gameMessage = document.getElementById("gameMessage");
const mistakesRemaining = document.getElementById("mistakesRemaining");

const submitGuessButton = document.getElementById("submitGuessButton");
const shuffleButton = document.getElementById("shuffleButton");
const deselectButton = document.getElementById("deselectButton");
const restartButton = document.getElementById("restartButton");
const previewTreeButton = document.getElementById("previewTreeButton");

const congratulationsPopup =
    document.getElementById("congratulationsPopup");

const closePopupButton =
    document.getElementById("closePopupButton");


// ==========================================
// GAME VARIABLES
// ==========================================

let selectedWords = [];
let solvedCategories = [];
let mistakes = MAX_MISTAKES;
let gameOver = false;

let tileOrder = [];


// ==========================================
// SHUFFLE FUNCTION
// ==========================================

function shuffleArray(array) {

    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];

    }

    return shuffled;

}


// ==========================================
// GET UNSOLVED WORDS
// ==========================================

function getRemainingWords() {

    let words = [];

    categories.forEach(category => {

        if (!solvedCategories.includes(category.name)) {

            category.words.forEach(word => {

                words.push({
                    word: word,
                    category: category.name
                });

            });

        }

    });

    return words;

}


// ==========================================
// DISPLAY THE PUZZLE
// ==========================================

function renderPuzzle() {

    puzzleGrid.innerHTML = "";

    const remainingWords = tileOrder.filter(item =>
        !solvedCategories.includes(item.category)
    );

    remainingWords.forEach(item => {

        const tile = document.createElement("button");

        tile.type = "button";
        tile.className = "connection-tile";
        tile.textContent = item.word;

        if (selectedWords.includes(item.word)) {

            tile.classList.add("selected");

        }

        tile.addEventListener("click", function() {

            toggleWord(item.word);

        });

        puzzleGrid.appendChild(tile);

    });

    submitGuessButton.disabled =
        selectedWords.length !== 4 || gameOver;

}


// ==========================================
// SELECT AND DESELECT WORDS
// ==========================================

function toggleWord(word) {

    if (gameOver) return;

    if (selectedWords.includes(word)) {

        selectedWords = selectedWords.filter(item =>
            item !== word
        );

    } else {

        if (selectedWords.length >= 4) return;

        selectedWords.push(word);

    }

    renderPuzzle();

}


// ==========================================
// SUBMIT A GUESS
// ==========================================

function submitGuess() {

    if (selectedWords.length !== 4 || gameOver) return;

    const matchingCategory = categories.find(category => {

        return selectedWords.every(word =>
            category.words.includes(word)
        );

    });

    if (matchingCategory) {

        // Correct answer

        solvedCategories.push(matchingCategory.name);

        gameMessage.textContent =
            "Correct! You found " + matchingCategory.name + ".";

        gameMessage.style.color = matchingCategory.color;

        selectedWords = [];

        renderSolvedGroups();
        renderPuzzle();


        // Check if every category has been solved

        if (solvedCategories.length === categories.length) {

            gameMessage.textContent =
                "Excellent! You solved the puzzle!";

            gameMessage.style.color = "#82b58b";

            previewTreeButton.disabled = false;

            shuffleButton.disabled = true;
            deselectButton.disabled = true;
            submitGuessButton.disabled = true;

            // Show congratulations popup

            congratulationsPopup.hidden = false;

        }

    } else {

        // Incorrect answer

        mistakes--;

        selectedWords = [];

        mistakesRemaining.textContent =
            "Mistakes remaining: " + mistakes;

        gameMessage.textContent =
            "Not quite! Try another combination.";

        gameMessage.style.color = "#d98b82";


        // Check if the player has run out of mistakes

        if (mistakes <= 0) {

            gameOver = true;

            gameMessage.textContent =
                "Game over! Restart to try again.";

            restartButton.hidden = false;

            shuffleButton.disabled = true;
            deselectButton.disabled = true;
            submitGuessButton.disabled = true;

        }

        renderPuzzle();

    }

}


// ==========================================
// DISPLAY SOLVED CATEGORIES
// ==========================================

function renderSolvedGroups() {

    solvedGroups.innerHTML = "";

    solvedCategories.forEach(categoryName => {

        const category = categories.find(item =>
            item.name === categoryName
        );

        const group = document.createElement("div");

        group.className = "solved-group";
        group.style.backgroundColor = category.color;

        const title = document.createElement("strong");

        title.textContent = category.name;

        const words = document.createElement("span");

        words.textContent = category.words.join(", ");

        group.appendChild(title);
        group.appendChild(words);

        solvedGroups.appendChild(group);

    });

}


// ==========================================
// SHUFFLE BUTTON
// ==========================================

shuffleButton.addEventListener("click", function() {

    if (gameOver) return;

    selectedWords = [];

    tileOrder = shuffleArray(getRemainingWords());

    renderPuzzle();

});


// ==========================================
// DESELECT BUTTON
// ==========================================

deselectButton.addEventListener("click", function() {

    if (gameOver) return;

    selectedWords = [];

    renderPuzzle();

});


// ==========================================
// SUBMIT BUTTON
// ==========================================

submitGuessButton.addEventListener("click", submitGuess);


// ==========================================
// CONGRATULATIONS POPUP
// ==========================================

closePopupButton.addEventListener("click", function() {

    congratulationsPopup.hidden = true;

});


// ==========================================
// RESTART BUTTON
// ==========================================

restartButton.addEventListener("click", function() {

    selectedWords = [];

    solvedCategories = [];

    mistakes = MAX_MISTAKES;

    gameOver = false;

    tileOrder = shuffleArray(getRemainingWords());

    mistakesRemaining.textContent =
        "Mistakes remaining: " + mistakes;

    gameMessage.textContent =
        "Select four words that belong together.";

    gameMessage.style.color = "";

    restartButton.hidden = true;

    congratulationsPopup.hidden = true;

    previewTreeButton.disabled = true;

    shuffleButton.disabled = false;
    deselectButton.disabled = false;
    submitGuessButton.disabled = true;

    renderSolvedGroups();
    renderPuzzle();

});


// ==========================================
// INITIALIZE GAME
// ==========================================

tileOrder = shuffleArray(getRemainingWords());

renderPuzzle();
renderSolvedGroups();
