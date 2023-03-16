import {Board} from "./Board.js";
import {Coordinate} from "./Coordinate.js";

let len=600
let square_size = len / 8

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
//ofset zodat de stukken mooi in het midden staan
let ofsetPiece=5;
let board= new Board();
console.log(board.getPieces());
dummy();
draw_board();
draw_pieces(board.getPieces());

function dummy(){
    let bool=board.move(board.getPieces()[0][1],new Coordinate(3,1));
    console.log(bool);
}

function draw_board() {
    canvas.setAttribute("height", len.toString());
    canvas.setAttribute("width", len.toString());
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            ctx.beginPath();
            if ((i + j) % 2 === 0) {
                ctx.fillStyle = "#582b2b";
            } else {
                ctx.fillStyle = "#de7070";
            }
            ctx.fillRect(square_size * i, square_size * j, square_size, square_size);
            ctx.stroke();
        }
    }
}
 function draw_pieces(list_piece){
     for (let i = 0; i < 8; i++) {
         for (let j = 0; j < 8; j++) {
             if(list_piece[i][j]!==0){//chekken of het vak niet leeg is want dan tekene van een piece
                 let piece= list_piece[i][j];
                 let img= new Image();
                 img.src=piece.image;
                 img.onload= () => {
                     ctx.drawImage(img,square_size*j+ofsetPiece,square_size*i+ofsetPiece,square_size-2*ofsetPiece,square_size-2*ofsetPiece)
                 };
             }
         }
     }
 }

