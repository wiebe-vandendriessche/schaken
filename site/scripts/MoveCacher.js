import {Coordinate} from "./Coordinate.js";
export {MoveCacher};
class MoveCacher{

    constructor(){
        this.moves="";
    }
    Moveadd (NewCord,amountOfMoves){

        if(amountOfMoves % 2===1){
            this.moves+=`${Math.ceil(amountOfMoves/2)}.\t${NewCord.convertToCHessCords(NewCord)}`;
        }else{
            this.moves+=`\t \t${NewCord.convertToCHessCords(NewCord)}\n`;
        }
    }

    GetMoves (){
        return this.moves;
    }
}