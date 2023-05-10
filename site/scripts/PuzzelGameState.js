import {GameState} from "./GameState.js";
import {Coordinate} from "./Coordinate.js";
import {popup_end} from "./Show.js";
import {FenConvertor} from "./FenConvertor.js";


export class PuzzelGameState extends GameState{


    constructor(canvas,lenght,colorA,colorB,colorC,colorD) {
        super(canvas,lenght,colorA,colorB,colorC,colorD);
        this.currentPuzele=undefined;
        this.movesPuzzel=undefined;
        this.amountofPuzzels=250;µ
        this.playedPuzzels
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
        this.playMove=this.play_move_Puzzle;
        this.close(popup);
    }
    play_move_Puzzle(event){
        let rect=this.canvas.getBoundingClientRect();
        let x=Math.floor((event.clientX-rect.x)/this.draw.squareSize);
        let y=Math.floor((event.clientY-rect.y)/this.draw.squareSize);
        let piece_clicked_now=this.board.getPieces()[y][x];
        let cord=new Coordinate(x,y);
        let color=this.board.colorToMove();
        if(this.clicked){
            if(this.checkMoves(this.clicked_piece.pos,cord)) {
                this.board.move(this.clicked_piece,cord)
                this.board.amountOfMoves++;
                GameState.PlayedMoves.Moveadd(cord, this.board.amountOfMoves, this.board, this.clicked_piece);
                this.playMove=()=>{};
                this.playSound();
                this.puzzlemove();
            }
            this.draw.drawGameboard(this.board);
            this.updatePlayedMoves(GameState.PlayedMoves.GetMoves())
            this.clicked=false;
            this.clicked_piece=0;

        }else{
            if(piece_clicked_now!==0 && piece_clicked_now.kleur===color){
                this.draw.drawPossible(this.board.possibleMoves(cord));
                this.clicked_piece=piece_clicked_now
                this.clicked=true;
            }
        }
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
                GameState.PlayedMoves.Moveadd(newcord,this.board.amountOfMoves,this.board,this.clicked_piece);

                this.draw.drawGameboard(this.board);

                this.playSound();
                this.updatePlayedMoves(GameState.PlayedMoves.GetMoves());
                this.clicked=false;
                this.clicked_piece=0;
                this.playMove=this.play_move_Puzzle;
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

