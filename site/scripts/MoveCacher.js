import {Knight} from "./Pieces/Knight.js";

export {MoveCacher};
class MoveCacher{


    constructor(){
        this.moves="";
        this.alleBoards=[];

    }
    Moveadd (NewCord,amountOfMoves,board,piece){
        let firstLetter=piece.constructor.name[0];

        if(firstLetter==="P"){
            firstLetter=" ";
        }else if(piece instanceof Knight){
            firstLetter="N"
        }

        this.alleBoards.push(board.clone(true));
        if(amountOfMoves % 2===1){
            this.moves+=`${Math.ceil(amountOfMoves/2)}.\t${firstLetter}${NewCord.convertToCHessCords(NewCord)}`;
        }else{//kleine letter gebruiken volgend de regels moet een zwart piece met een kleine letter
            this.moves+=`\t\t${firstLetter.toLowerCase()}${NewCord.convertToCHessCords(NewCord)}\n`;
        }
    }
    MoveRemove(){
        this.moves=this.moves.slice(0,this.moves.length-6);
    }

    ReturnToPreviousMoves(){
        let len=this.alleBoards.length;
        if(len>=1){
            this.MoveRemove();
            this.alleBoards.pop();
            return this.alleBoards[len - 2].clone(true);//moet een clone zijn om geen referentie naar een bord bij te houden
        }else{
            return this.alleBoards[len-1];
        }
    }
    setStart(board){
        this.alleBoards.push(board.clone(true));
    }
    clone(){
        let clone=new MoveCacher();
        clone.setAlleBoards(this.alleBoards)//dit is geen diepe copy van de array maar we smijten het oude object weg waardoor het eigenlijk niet echt een clone is maar eerder een vervanging
        clone.setMoves(this.moves)//idem setAlleBoards
        return clone
    }
    setMoves(moves){
        this.moves=moves;
    }
    setAlleBoards(alleboards){
        this.alleBoards=alleboards;
    }

    GetMoves (){
        return this.moves;
    }
    reset(){
        this.moves="";
        this.alleBoards=[];
    }
}