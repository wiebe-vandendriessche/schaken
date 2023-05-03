import {GameState} from "./GameState.js";


let CanvasPreview = document.getElementById("canvas-preview");

let colorA ="#cceeea";
let colorB ="#386bf3";
let colorC ="rgba(147,239,132,0.5)";
let colorD ="rgba(87,173,73,0.5)";
let length = 680;

let c = new GameState(CanvasPreview, length, colorA, colorB, colorC, colorD);
c.drawBoard();
console.log("drawing");

