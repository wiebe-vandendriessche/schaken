import {Board} from "./Board.js";
import {Coordinate} from "./Coordinate.js";
import {Bot} from "./Bot/Bot.js";
let player=0;
let len=680
let square_size = len / 8

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
//ofset zodat de stukken mooi in het midden staan
let ofsetPiece=5;
let board= new Board(true);

let clicked=false;
let clicked_piece=0;

//console.log(board.getPieces());
//dummy();
draw_board();
draw_pieces(board.getPieces(),true);
let blackbot= new Bot(false,2);
function dummy(){


}

function draw_square(i,j,colora,colorb){
    ctx.beginPath();
    if ((i + j) % 2 === 0) {
        ctx.fillStyle = colora;
    } else {
        ctx.fillStyle = colorb;
    }
    ctx.fillRect(square_size * i, square_size * j, square_size, square_size);
    ctx.stroke();
}

function draw_board() {
    canvas.setAttribute("height", len.toString());
    canvas.setAttribute("width", len.toString());
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            draw_square(i,j,"#cceeea","#386bf3");
        }
    }
}

function draw_pieces(list_piece,onLoad){
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if(list_piece[i][j]!==0){//chekken of het vak niet leeg is want dan tekene van een piece
                let piece= list_piece[i][j];
                let img= piece.image;
                if (onLoad) {
                    img.onload = () => {
                        ctx.drawImage(img, square_size * j + ofsetPiece, square_size * i + ofsetPiece, square_size - 2 * ofsetPiece, square_size - 2 * ofsetPiece)
                    }
                }
                ctx.drawImage(img,square_size*j+ofsetPiece,square_size*i+ofsetPiece,square_size-2*ofsetPiece,square_size-2*ofsetPiece);
            }



        }
    }
}


function draw_posible(cords){
    for(let i=0;i<cords.length;i++){
        draw_square(cords[i].x,cords[i].y,"rgba(147,239,132,0.5)","rgba(87,173,73,0.5)");
    }
}


canvas.addEventListener("click",()=>{
    if (player===0) {
        play_move();
    }else if (player===1){
        play_moveBot()
    }

});
function play_move(){
    let rect=canvas.getBoundingClientRect();
    let x=Math.floor((event.clientX-rect.x)/square_size);
    let y=Math.floor((event.clientY-rect.y)/square_size);
    let piece_clicked_now=board.getPieces()[y][x];
    let cord=new Coordinate(x,y);
    let color=board.colorToMove();
    if(clicked){
        if(board.moveWithCheck(clicked_piece,cord)) {
            draw_board()
            draw_pieces(board.getPieces(), false)
            updatePlayedMoves();

            let status = board.isEnd(!color);
            console.log(status);
            if (status !== "continue") {
                setTimeout(() => {
                    alert(status)
                }, 1000);
            }
            let array = blackbot.nextMove(board);
            console.log("HEEFT BOT GEMOVED",board.move(array[0], array[1],array[0].possibleMoves(board)));

            board.amountOfMoves++;
            status = board.isEnd(color);
            console.log(status);
            if (status !== "continue") {
                setTimeout(() => {
                    alert(status)
                }, 1000);
            }
        }
        draw_board();
        draw_pieces(board.getPieces(), false);
        clicked = false;
        clicked_piece = 0;

    }else{

        if(piece_clicked_now!==0 && piece_clicked_now.kleur===color){
            draw_posible(board.possibleMoves(cord));
            clicked_piece=piece_clicked_now
            clicked=true
        }
    }
}
function play_moveBot(){
    play_move();

}

function updatePlayedMoves(){
    let text=document.getElementById("playedMoves");
    console.log(board.getAlleMovesPlayedInGame());
    text.textContent=board.getAlleMovesPlayedInGame();
}

// temporary




