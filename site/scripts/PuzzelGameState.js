import {GameStatePlay} from "./GameStatePlay.js";
import {Coordinate} from "./Coordinate.js";
import {popup_end} from "./Show.js";
import {FenConvertor} from "./FenConvertor.js";


export class PuzzelGameState extends GameStatePlay{


    constructor(canvas,lenght,colorA,colorB,colorC,colorD) {
        super(canvas,lenght,colorA,colorB,colorC,colorD);
        this.currentPuzele=undefined;
        this.movesPuzzel=undefined;
        this.amountofPuzzels=250;µ
        this.playedPuzzels;
    }

    // op dit moment is het efficient geschreven voor geheugen dat we nooit het hele document bij houden dat wil wel zeggen bij heel grote fetchopdrachten dat we dit meerdere keren gaan moeten doen.

    fetchNewPuzzels(){

        fetch(`http://localhost:3000/puzzels/${this.selectPuzzel()}`)
            .then((response) => response.json())
            .then((puzzel)=>{
                this.selectFenOfPuzzel(puzzel);
                FenConvertor.setupPieces(this.board,this.currentPuzele);
                this.drawGameboard();

                this.puzzlemove();

            })

    }

    selectPuzzel(){
        return Math.floor(Math.random()*this.amountofPuzzels);

    }

    selectFenOfPuzzel(data){
        this.movesPuzzel=data.Moves.split(" ");
        this.currentPuzele=data.FEN;
    }


    closePopup(popup){
        this.fetchNewPuzzels();
        this.playMoveType=(color,cord)=>{this.playPuzzelInPlay(color,cord)};
        this.playMove=this.play;
        this.close(popup);
    }
    playPuzzelInPlay(color,cord){
        if(this.checkMoves(this.clicked_piece.pos,cord)) {
            this.board.move(this.clicked_piece,cord)
            this.board.amountOfMoves++;
            GameStatePlay.PlayedMoves.Moveadd(cord, this.board.amountOfMoves, this.board, this.clicked_piece);
            this.playMove=()=>{};
            this.playSound();
            this.puzzlemove();
        }
        this.draw.drawGameboard(this.board);
        this.updatePlayedMoves(GameStatePlay.PlayedMoves.GetMoves())
    }

    puzzlemove(){
        setTimeout(() => {
            if(this.movesPuzzel.length>0){
                let move=this.movesPuzzel[0];
                this.movesPuzzel=this.movesPuzzel.slice(1);
                let cords=this.cordToMove(move)
                let oldcord=cords[0];
                let newcord=cords[1];

                let piece=this.board.board[oldcord.y][oldcord.x];
                this.board.move(piece,newcord);
                this.board.amountOfMoves++;
                GameStatePlay.PlayedMoves.Moveadd(newcord,this.board.amountOfMoves,this.board,this.clicked_piece);

                this.draw.drawGameboard(this.board);

                this.playSound();
                this.updatePlayedMoves(GameStatePlay.PlayedMoves.GetMoves());
                this.clicked=false;
                this.clicked_piece=0;
                this.playMove=this.play;
            }else{
                this.openEndGame(true);
            }

        }, 500);
    }

    cordToMove(move){
        let oldcord=Coordinate.changeToCord(move.slice(0,2));
        let newcord=Coordinate.changeToCord(move.slice(2));
        return [oldcord,newcord];
    }

    checkMoves(oldC,newC){
        let move=this.movesPuzzel[0]

        let oldcord=Coordinate.changeToCord(move.slice(0,2));
        let newcord=Coordinate.changeToCord(move.slice(2));
        if(oldcord.x===oldC.x && oldcord.y===oldC.y && newcord.x===newC.x && newcord.y===newC.y){
            this.movesPuzzel=this.movesPuzzel.slice(1);
            return true;
        }
        return false;
    }

    openEndGame(color) {
        setTimeout(() => {
            popup_end.classList.add("open-popup");
            this.setEndPopupText("Je hebt de puzzel correct opgelost!", popup_end);
        }, 500);
    }

    setEndPopupText(text,popup){
        popup.children[1].textContent=text;
    }
}

