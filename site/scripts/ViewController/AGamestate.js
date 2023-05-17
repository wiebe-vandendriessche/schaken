import {Board} from "../Model/Board.js";
import {Coordinate} from "../Model/Coordinate.js";

import {MoveCacher} from "./MoveCacher.js";

import {popup_end} from "../View/Show.js";

import {Draw} from "./Draw.js";

//ik weet niet zeker of dit mag en of dit de mooiste oplossing is

export class AGamestate {
    static PlayedMoves=new MoveCacher();

    constructor(canvas,colorA,colorB,colorC,colorD,sound = new Audio("sounds/standard.mp3")) {

        this.draw=new Draw(canvas,colorA,colorB,colorC,colorD,5);

        this.canvas=canvas;


        this.board= new Board(true);
        this.clicked=false;
        this.clickedPiece=0;

        AGamestate.PlayedMoves.setStart(new Board(true));
        this.playMove=()=>{};//aan en uitzetten van play
        this.undo=()=>{}; //aan en uitzetten van undoMove

        this.playMoveType=(color, cord)=>{};//juiste tupe van hoe er wordt gepeeld kiezen

        this.sound = sound;


        if (this.constructor === AGamestate) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }
    play(event){
        let rect=this.canvas.getBoundingClientRect();
        let x=Math.floor((event.clientX-rect.x)/this.draw.squareSize);
        let y=Math.floor((event.clientY-rect.y)/this.draw.squareSize);
        let piece_clicked_now=this.board.getPieces()[y][x];
        let cord=new Coordinate(x,y);
        let color=this.board.colorToMove();
        if(this.clicked){

            this.playMoveType(color,cord);

            this.clicked=false;
            this.clickedPiece=0;

        }else{
            if(piece_clicked_now!==0 && piece_clicked_now.kleur===color){
                this.draw.drawPossible(this.board.possibleMoves(cord));
                this.clickedPiece=piece_clicked_now
                this.clicked=true;
            }
        }
    }


    undoMove(){ }

    restart(popup){
        this.board=new Board(true);
        AGamestate.PlayedMoves.reset();
        this.clicked=false;
        this.draw.drawGameboard(this.board);
        this.updatePlayedMoves("");
        AGamestate.PlayedMoves.allBoards.push(new Board(true));
        this.playMove=(event)=>{};
        this.openPopup(popup)
    }

    ReturnToPreviousBoard(){
        this.board=AGamestate.PlayedMoves.ReturnToPreviousMoves();
    }

    updatePlayedMoves(moves){
        let text=document.getElementById("playedMoves");
        text.textContent=moves;
    }

    openPopup(popup){
        popup.classList.add("open-popup");
    }

    close(popup){
        popup.classList.remove("open-popup");
    }

    playSound(){
        this.sound.play()
            .catch(err => console.error(err));
    }
}