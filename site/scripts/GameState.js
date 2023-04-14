import {Board} from "./Board.js";
import {Coordinate} from "./Coordinate.js";

export class GameState{
    static ofsetPiece=5;
    constructor(canvas,lenght,colorA,colorB,colorC,colorD) {

        this.botAdversairy=false;
        this.bodDifficulty=0;

        this.canvas=canvas;
        this.lenght=lenght;
        this.square_size=this.lenght/8;
        this.ctx=canvas.getContext("2d");
        this.board= new Board(true);
        this.clicked=false;
        this.clicked_piece=0;
        Board.PlayedMoves.alleBoards.push(new Board(true));
        this.colorA=colorA;
        this.colorB=colorB;
        this.colorC=colorC;
        this.colorD=colorD
    }

    drawGameboard(){
        this.drawBoard();
        this.drawPieces(this.board.getPieces());
    }
    undoMove(){
        //console.log(Board.PlayedMoves.GetMoves())

        if(Board.PlayedMoves.moves!==""){
            this.ReturnToPreviousBoard();
            this.updatePlayedMoves(this.board.getAlleMovesPlayedInGame());
            this.drawGameboard();
        }

    }
    drawSquare(i,j,colorA,colorB){
        this.ctx.beginPath();
        if ((i + j) % 2 === 0) {
            this.ctx.fillStyle = colorA;
        } else {
            this.ctx.fillStyle = colorB;
        }
        this.ctx.fillRect(this.square_size * i, this.square_size * j, this.square_size, this.square_size);
        this.ctx.stroke();
    }

    drawBoard() {
        this.canvas.setAttribute("height", this.lenght.toString());
        this.canvas.setAttribute("width", this.lenght.toString());
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.drawSquare(i,j,this.colorA,this.colorB);
            }
        }
    }

    drawPieces(list_piece){
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if(list_piece[i][j]!==0){//chekken of het vak niet leeg is want dan tekene van een piece
                    let piece= list_piece[i][j];

                    let img=piece.image;
                    img.onload= () => {
                        this.ctx.drawImage(img,this.square_size*j+GameState.ofsetPiece,this.square_size*i+GameState.ofsetPiece,this.square_size-2*GameState.ofsetPiece,this.square_size-2*GameState.ofsetPiece);
                    };
                    this.ctx.drawImage(img,this.square_size*j+GameState.ofsetPiece,this.square_size*i+GameState.ofsetPiece,this.square_size-2*GameState.ofsetPiece,this.square_size-2*GameState.ofsetPiece);//Volgende keren geen onload event meer
                }
            }
        }
    }


    drawPossible(cords){
        for(let i=0;i<cords.length;i++){
            this.drawSquare(cords[i].x,cords[i].y,this.colorC,this.colorD);
        }
    }


    restart(popup){
        this.board=new Board(true);
        Board.PlayedMoves.reset();
        this.clicked=false;
        this.drawGameboard();
        this.updatePlayedMoves("");
        this.openPopup(popup)
    }

    play_move_player(event){

        let rect=this.canvas.getBoundingClientRect();
        let x=Math.floor((event.clientX-rect.x)/this.square_size);
        let y=Math.floor((event.clientY-rect.y)/this.square_size);
        let piece_clicked_now=this.board.getPieces()[y][x];
        let cord=new Coordinate(x,y);
        let color=this.board.colorToMove();
        if(this.clicked){
            this.board.moveWithCheck(this.clicked_piece,cord);
            this.drawGameboard()
            this.updatePlayedMoves(this.board.getAlleMovesPlayedInGame())
            this.clicked=false;
            this.clicked_piece=0;

        }else{
            if(piece_clicked_now!==0 && piece_clicked_now.kleur===color){
                this.drawPossible(this.board.possibleMoves(cord));
                this.clicked_piece=piece_clicked_now
                this.clicked=true;
            }
        }

    }

    ReturnToPreviousBoard(){
        this.board=this.board.PrevouisPosition()
    }


    updatePlayedMoves(moves){
        let text=document.getElementById("playedMoves");
        text.textContent=moves;
    }

    openPopup(popup){
        popup.classList.add("open-popup");
    }

    closePopup(popup,botDiff){
        let difficulty=parseInt(botDiff.value);
        this.botAdversairy=difficulty!==0;
        this.bodDifficulty=difficulty;
        popup.classList.remove("open-popup");
    }
}