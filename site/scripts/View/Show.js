import {GameStatePlay} from "../ViewController/GameStatePlay.js";
import {PuzzelGameState} from "../ViewController/PuzzelGameState.js";


let canvas = document.getElementById("canvas");
let undobutton = document.getElementById("undo_move");
let restartbutton = document.getElementById("restart");
let resignbutton = document.getElementById("resign");


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



//default geluid instellen
let sound;
if(localStorage.getItem("sound")){
    let src = localStorage.getItem("sound")
    sound = new Audio(src);
    sound.muted = JSON.parse(localStorage.getItem("muted"));
}
else{
    localStorage.setItem("sound", "sounds/standard.mp3");
    sound =  new Audio("sounds/standard.mp3");
    localStorage.setItem("muted", sound.muted);
}

// juiste gamestate bepalen
let gameState
if (typeOFGame === "Speel") {
    gameState = new GameStatePlay(canvas,kleur1, kleur2, "rgba(147,239,132,0.5)", "rgba(87,173,73,0.5)", sound);
} else {
    gameState = new PuzzelGameState(canvas, kleur1, kleur2, "rgba(147,239,132,0.5)", "rgba(87,173,73,0.5)", sound);
}

export let popup_end = document.getElementById("end");
window.addEventListener("load", () => {
    gameState.openPopup(popup)
});

gameState.draw.drawGameboard(gameState.board);
undobutton.addEventListener("click",()=>{gameState.undoMove()});


restartbutton.addEventListener("click", () => {
    gameState.restart(popup)
});
canvas.addEventListener("click", (event) => {
    gameState.playMove(event);
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



window.addEventListener("resize", () => {
    gameState.draw.rescale(gameState.board)
});
window.addEventListener("load", () => {
    gameState.draw.rescale(gameState.board)
});

resignbutton.addEventListener("click", () => {
    gameState.openPopup(popup_end);
    gameState.setEndPopupText(gameState.board.amountOfMoves%2!==0, "resign", popup_end)
})