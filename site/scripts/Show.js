

import {GameState} from "./GameState.js";
import {PuzzelGameState} from "./PuzzelGameState.js";


let canvas = document.getElementById("canvas");
let undobutton=document.getElementById("undo_move");
let restartbutton=document.getElementById("restart");
let resignebutton=document.getElementById("resign");

let typeOFGame=document.getElementById("type_gamestate").textContent

let popup=document.getElementById("popup");
let closePopupButton=document.getElementById("close_popup");
let botPlayer=document.getElementById("adversary");
let botDiff=document.getElementById("difficulty");
let playerColor=document.getElementById("color")
let popup_difficulty=document.getElementById("popup_difficulty")
let closePopupDifficultyButton=document.getElementById("close_popup_difficulty")
let restartEndButton=document.getElementById("close_popup_end")

// juiste gamestate bepalen
let gameState
if(typeOFGame==="Speel: PvP"){
    gameState=new GameState(document.getElementById("canvas"),680,"#cceeea","#386bf3","rgba(147,239,132,0.5)","rgba(87,173,73,0.5)");
}else{
    gameState=new PuzzelGameState(document.getElementById("canvas"),680,"#cceeea","#386bf3","rgba(147,239,132,0.5)","rgba(87,173,73,0.5)");
}

export let popup_end=document.getElementById("end");
window.addEventListener("load", ()=>{gameState.openPopup(popup)});

gameState.drawGameboard();
undobutton.addEventListener("click",()=>{gameState.undoMove()});
restartbutton.addEventListener("click",()=>{gameState.restart(popup)});
canvas.addEventListener("click",(event)=>{gameState.play(event)});

closePopupButton.addEventListener("click",()=>{gameState.closePopup(popup,popup_difficulty,botPlayer)})

closePopupDifficultyButton.addEventListener("click",()=>{gameState.closePopupDifficulty(popup_difficulty,botDiff,playerColor)});

restartEndButton.addEventListener("click",()=>{gameState.close(popup_end);gameState.restart(popup);});

resignebutton.addEventListener("click",()=>{gameState.openPopup(popup_end);gameState.setEndPopupText(gameState,"resign",popup_end)})
window.addEventListener("keypress",()=>{gameState.dummy()});