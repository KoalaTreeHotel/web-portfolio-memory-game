// The Simon Memory Game using JS and some jQuery. Using four colored buttons, a pattern will be
// generated by the computer. It will start with one color (color-1), the user then has to 
// replicate this one color (color-1). The computer will generate another color (color-2), the user
// then has to replicate the sequence of color-1 then color-2. The computer then generates another
// color (color-3), the user has to replicate the pattern color-1, color-2 then color-3. This
// process repeats until the user can no longer replicate the ever expanding sequence of colors.

const buttonColors = ["red", "blue", "green", "yellow"];
let computerArray = [];
let userArray = [];
let gameStarted = false;
let gameLevel = 0;

// Press "s" to start the game. Listening on entire page for a keypress using jQuery.
$(document).on("keydown", (event) => {
    if (event.code === "KeyS" && event.key === "s") {
        if (gameStarted === false) {
            computerNextSequence();
            gameStarted = true;
        }
    }
});

// Listen for player clicks on all buttons (ie: listen on all btn classes).
// Note: cannot use arrow function as we need to access "this".
$(".btn").click(function () {
    if (gameStarted === true) {
        // The IDs of the buttons are their colors.
        const userChosenColor = $(this).attr("id");
        // Store the chosen color in the player's pattern array.
        userArray.push(userChosenColor);
        playSound(userChosenColor);
        animateButton(userChosenColor);

        checkAnswer(userArray.length - 1);
    }
});

// Game logic:
// The length of computerArray will equal the level we're at in the game, for example, at level 3: 
// computerArray=["red","blue","green"], length is 3, we're at level 3 of the game.
// To pass level 3, the user has to input the sequence "red", "blue" then "green":
// (1) userArray["red"],                length=1, check 1st indexes of userArray & computerArray match.
// (2) userArray["red","blue"],         length=2, check 2nd indexes of userArray & computerArray match.
// (3) userArray["red","blue","green"], length=3, check 3rd indexes of userArray & computerArray match.
// If any of these checks fail, the user has input the wrong sequence and the game is over.
// If all the checks pass and the lengths of userArray and computerArray match, the level is complete
// and we proceed to the next level. A new color is pushed to computerArray, userArray is reset, and
// the process is repeated.
// 
// Check if the computer and user patterns match at a particular level of the game.
function checkAnswer(currLevel) {
    if (userArray[currLevel] === computerArray[currLevel]) {
        if (userArray.length === computerArray.length) {
            setTimeout(function () { computerNextSequence(); }, 1000);
        }
    }
    else {
        playSound("wrong");
        $("body").addClass("game-over");
        $("#level-title").html("Game Over! Press \"s\" to play again.");
        setTimeout(function () { $("body").removeClass("game-over"); }, 200);
        startOver();
    }
}

// Computer adding another pattern to the sequence.
function computerNextSequence() {
    userArray = [];
    gameLevel++;
    $("#level-title").text(`Level ${gameLevel}`);
    // Computer is randomly selecting a color to add to the pattern.
    const randomNumber = randomNumberGenerate(0, 3);
    const randomChosenColor = buttonColors[randomNumber];
    // Store the chosen color in the computer's pattern array.
    computerArray.push(randomChosenColor);

    $("#" + randomChosenColor).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomChosenColor);
}

// Animate a particular colored button using jQuery.
function animateButton(col) {
    $("#" + col).addClass("pressed");
    setTimeout(function () {
        $("#" + col).removeClass("pressed");
    }, 100);
}

// Play sound associated with particular color.
function playSound(col) {
    const soundFile = `./sounds/${col}.mp3`;
    (new Audio(soundFile)).play();
}

// Return a random number in the range min to max (inclusive of min and max).
function randomNumberGenerate(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startOver() {
    gameLevel = 0;
    computerArray = [];
    gameStarted = false;
}