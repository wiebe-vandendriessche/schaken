import {Coordinate} from "./Coordinate.js";
import {Board} from "./Board.js";
export {MoveCacher};
class MoveCacher{


    constructor(){
        this.moves="";
        this.alleBoards=[];

    }
    Moveadd (NewCord,amountOfMoves,board){
        this.alleBoards.push(board.clone(true));
        if(amountOfMoves % 2===1){
            this.moves+=`${Math.ceil(amountOfMoves/2)}.\t${NewCord.convertToCHessCords(NewCord)}`;
        }else{
            this.moves+=`\t\t${NewCord.convertToCHessCords(NewCord)}\n`;
        }
    }
    MoveRemove(){
        this.moves=this.moves.slice(0,this.moves.length-5);
    }

    ReturnToPreviousMoves(){
        let len=this.alleBoards.length;
        if(len>=1){
            this.MoveRemove();
            this.alleBoards.pop();
            let new_board=this.alleBoards[len-2];
            return new_board;
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