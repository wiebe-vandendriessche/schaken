import {GameState} from "./GameState.js";
import {PuzzelGameState} from "./PuzzelGameState.js";


let canvas = document.getElementById("canvas");
let undobutton = document.getElementById("undo_move");
let restartbutton = document.getElementById("restart");
let menuButton = document.getElementById("menuButton");
let resignebutton = document.getElementById("resign");


let typeOFGame = document.getElementById("type_gamestate").textContent


let popup = document.getElementById("popup");
let closePopupButton = document.getElementById("close_popup");
let botPlayer = document.getElementById("adversary");
let botDiff = document.getElementById("difficulty");
let playerColor = document.getElementById("color")
let popup_difficulty = document.getElementById("popup_difficulty")
let closePopupDifficultyButton = document.getElementById("close_popup_difficulty")
let restartEndButton = document.getElementById("close_popup_end")

//default kleur zetten
let kleur1 = '#fff2e0';
let kleur2 = '#000000';
if (localStorage.getItem('color1')) {
    kleur1 = localStorage.getItem('color1');
    kleur2 = localStorage.getItem('color2');
}

// juiste gamestate bepalen
let gameState
if (typeOFGame === "Speel") {
    gameState = new GameState(document.getElementById("canvas"), 680, kleur1, kleur2, "rgba(147,239,132,0.5)", "rgba(87,173,73,0.5)");
} else {
    gameState = new PuzzelGameState(document.getElementById("canvas"), 680, kleur1, kleur2, "rgba(147,239,132,0.5)", "rgba(87,173,73,0.5)");
}

export let popup_end = document.getElementById("end");
window.addEventListener("load", () => {
    gameState.openPopup(popup)
});

gameState.drawGameboard();
undobutton.addEventListener("click",()=>{gameState.undo()});
restartbutton.addEventListener("click",()=>{gameState.restart(popup)});
canvas.addEventListener("click",(event)=>{gameState.play(event)});

restartbutton.addEventListener("click", () => {
    gameState.restart(popup)
});
canvas.addEventListener("click", (event) => {
    gameState.play(event)
});


closePopupButton.addEventListener("click", () => {
    gameState.closePopup(popup, popup_difficulty, botPlayer)
})

closePopupDifficultyButton.addEventListener("click", () => {
    gameState.closePopupDifficulty(popup_difficulty, botDiff, playerColor)
});

restartEndButton.addEventListener("click", () => {
    gameState.close(popup_end);
    gameState.restart(popup);
});

window.addEventListener("keypress", () => {
    gameState.fetchNewPuzzels()
});

window.addEventListener("resize", () => {
    gameState.rescale()
});
window.addEventListener("load", () => {
    gameState.rescale()
});

resignebutton.addEventListener("click", () => {
    gameState.openPopup(popup_end);
    gameState.setEndPopupText(gameState, "resign", popup_end)
})

