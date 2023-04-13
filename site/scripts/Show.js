
import {GameState} from "./GameState.js";


let canvas = document.getElementById("canvas");
let undobutton=document.getElementById("undo_move")
let restartbutton=document.getElementById("restart");
let gameState=new GameState(document.getElementById("canvas"),680,"#cceeea","#386bf3","rgba(147,239,132,0.5)","rgba(87,173,73,0.5)");

gameState.drawGameboard();
undobutton.addEventListener("click",()=>{gameState.undoMove()});
restartbutton.addEventListener("click",()=>{gameState.restart()});
canvas.addEventListener("click",(event)=>{gameState.play_move_player(event)});



