import {GameStatePlay} from "./GameStatePlay.js";
import {Coordinate} from "../Model/Coordinate.js";
import {popup_end} from "../View/Show.js";
import {FenConvertor} from "../Model/FenConvertor.js";
import {Plot} from "./PlotElo.js";
import {AGamestate} from "./AGamestate.js";


export class PuzzelGameState extends GameStatePlay{


    constructor(canvas,colorA,colorB,colorC,colorD) {
        super(canvas,colorA,colorB,colorC,colorD);
        this.currentPuzzel=undefined;
        this.movesPuzzel=undefined;

        this.amountofPuzzels=79;
        this.playedPuzzels=[];
        this.soundwrong=new Audio("sounds/wrong.mp3");
        this.possibleScore=0;
        this.amountOfMistakes=0;
        this.plot=new Plot("Vooruitgang");

        this.updateRating();

    }


    fetchNewPuzzels(){
        fetch(`https://645b63c3a8f9e4d6e767035c.mockapi.io/Puzzels/${this.selectPuzzel()}`)
            .then((response) => response.json())
            .then((puzzel)=>{
                this.selectFenOfPuzzel(puzzel);
                FenConvertor.setupPieces(this.board,this.currentPuzzel.FEN);
                this.draw.drawGameboard(this.board);
                this.puzzlemove();
                let ratingelement=document.getElementById("puz_rating");
                ratingelement.textContent=`Moeilijkheid puzzel : ${this.currentPuzzel.Rating}`;
                this.possibleScore=parseInt(this.currentPuzzel.Rating)/100;
                this.amountOfMistakes=0;


            })

    }

    selectPuzzel(){
        let index=Math.floor(Math.random()*this.amountofPuzzels);//selecteer een puzzelid
        if (this.playedPuzzels.length>=this.amountofPuzzels){
            this.playedPuzzels=[];// maakt de played puzzels leeg als ze alemaal gespeeld;
        }
        while(this.playedPuzzels.some(id=>id===index)){
            index=Math.floor(Math.random()*this.amountofPuzzels);
        }
        this.playedPuzzels.push(index);
        return index;
    }

    selectFenOfPuzzel(data){
        this.movesPuzzel=data.Moves.split(" ");
        this.currentPuzzel=data;
    }


    closePopup(popup){
        this.fetchNewPuzzels();
        this.playMoveType=(color,cord)=>{this.playPuzzelInPlay(color,cord)};
        this.playMove=this.play;
        this.close(popup);
    }

    playPuzzelInPlay(color,cord){
        if(this.checkMoves(this.clickedPiece.pos,cord)) {
            this.board.move(this.clickedPiece,cord)
            this.board.amountOfMoves++;
            AGamestate.PlayedMoves.Moveadd(cord, this.board.amountOfMoves, this.board, this.clickedPiece);
            this.playMove=()=>{};
            this.playSound();
            this.puzzlemove();
            this.updatePlayedMoves(AGamestate.PlayedMoves.GetMoves())
        }else{
            if (this.genuineClick(this.clickedPiece,cord)) { // kijken of player niet gwn een andere pion aanklikt of misklikt
                console.log("fout");
                this.soundwrong.play().catch(err => console.error(err));
                this.possibleScore -= 5;
                this.amountOfMistakes += 1;
            }
        }
        this.draw.drawGameboard(this.board);
    }
    genuineClick(piece,cord){
        if (this.board.possibleMoves(piece.pos).some(cordc=>(cordc.x===cord.x && cordc.y===cord.y))){
            return true;
        }
        return false;
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
                GameStatePlay.PlayedMoves.Moveadd(newcord,this.board.amountOfMoves,this.board,this.clickedPiece);

                this.draw.drawGameboard(this.board);

                this.playSound();
                this.updatePlayedMoves(GameStatePlay.PlayedMoves.GetMoves());
                this.clicked=false;
                this.clickedPiece=0;
                this.playMove=this.play;
            }else{
                let ratingelement=document.getElementById("puz_rating");
                ratingelement.textContent=`Moeilijkheid puzzel : `;
                let rating=parseInt(localStorage.getItem("rating"));
                this.possibleScore=Math.max(Math.round(this.possibleScore),-20);
                document.getElementById("elodiv").textContent=` Jouw Score:\n${rating} ${this.possibleScore>=0?"+":"-"} ${Math.abs(this.possibleScore)}`;
                localStorage.setItem("rating",""+(rating+this.possibleScore));
                this.updateRating();
                this.openEndGame(true);
            }

        }, 500);
    }
    updateRating(){
        let rating= localStorage.getItem("rating");
        if (rating===undefined){
            localStorage.setItem("rating","1000");
            rating=1000;
        }else{
            rating=parseInt(rating)
        }
        document.getElementById("currentrating").textContent=`Jouw Score : ${rating}`;
        this.plot.plotData([this.playedPuzzels.length,rating]);
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
            this.setEndPopupText(`Je hebt de puzzel opgelost met ${this.amountOfMistakes} fouten!`, popup_end);
        }, 500);
    }

    setEndPopupText(text,popup){
        popup.children[1].textContent=text;
    }
}

