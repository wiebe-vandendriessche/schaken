import {Coordinate} from "./Coordinate.js";
export {MoveCacher};
class MoveCacher{

    constructor(){
        this.moves="";
        this.alleBoards=[]
    }
    Moveadd (NewCord,amountOfMoves,board){
        this.alleBoards.push(board.clone());
        console.log(this.alleBoards);
        if(amountOfMoves % 2===1){
            this.moves+=`${Math.ceil(amountOfMoves/2)}.\t${NewCord.convertToCHessCords(NewCord)}`;
        }else{
            this.moves+=`\t \t${NewCord.convertToCHessCords(NewCord)}\n`;
        }
    }

    ReturnToPreviousMoves(){
        this.alleBoards.pop()
        return this.alleBoards[this.alleBoards-1]
    }

    GetMoves (){
        return this.moves;
    }
}