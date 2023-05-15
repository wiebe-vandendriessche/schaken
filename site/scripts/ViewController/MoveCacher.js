import {Knight} from "../Model/Pieces/Knight.js";

export {MoveCacher};
class MoveCacher{
    constructor(){
        this.moves="";
        this.allBoards=[];

    }
    Moveadd (NewCord,amountOfMoves,board,piece){
        let firstLetter=piece.constructor.name[0];

        if(firstLetter==="P"){
            firstLetter=" ";
        }else if(piece instanceof Knight){
            firstLetter="N"
        }
        this.allBoards.push(board.clone(true));
        if(amountOfMoves % 2===1){
            let number=Math.ceil(amountOfMoves/2)
            let ending_spatie="";//ending spatie is nodig voor als er een getal kleiner dan tien als zetnummer is om toch altijd even lange strings te krijgen
            if(number<10){
                ending_spatie=" ";
            }
            this.moves+=`${number}.   ${firstLetter}${NewCord.convertToCHessCords(NewCord)}${ending_spatie}`;
        }else{//kleine letter gebruiken volgend de regels moet een zwart piece met een kleine letter
            this.moves+=`\t\t  ${firstLetter.toLowerCase()}${NewCord.convertToCHessCords(NewCord)} \n`;
        }
    }
    MoveRemove(){
        this.moves=this.moves.slice(0,this.moves.length-9);
    }

    ReturnToPreviousMoves(){
        let len=this.allBoards.length;
        if(len>=1){
            this.MoveRemove();
            this.allBoards.pop();
            return this.allBoards[len - 2].clone(true);//moet een clone zijn om geen referentie naar een bord bij te houden
        }else{
            return this.allBoards[len-1];
        }
    }
    setStart(board){
        this.allBoards.push(board.clone(true));
    }

    GetMoves (){
        return this.moves;
    }
    reset(){
        this.moves="";
        this.allBoards=[];
    }
}