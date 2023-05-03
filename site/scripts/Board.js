import {APiece} from "./Pieces/APiece.js";
import {Bisshop} from "./Pieces/Bisshop.js";
import {King} from "./Pieces/King.js";
import {Knight} from "./Pieces/Knight.js";
import {Pawn} from "./Pieces/Pawn.js";
import {Queen} from "./Pieces/Queen.js";
import {Rook} from "./Pieces/Rook.js";
import {Coordinate} from "./Coordinate.js";
import {LegalChecker} from "./LegalChecker.js";

export {Board};

class Board {
    amountOfMoves;

    constructor(setup) {
        this.board = [[], [], [], [], [], [], [], []];
        if (setup) {
            this.setupPieces("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
        }
        this.legalchecker= new LegalChecker(this);
        this.amountOfMoves=0;
    }

    setupPieces(FEN){//krijgt een string van de vorm rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1 zie https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation voor meer uitleg over FEN
        let Information=FEN.split(" ");
        let boardFEN=Information[0]
        let y = 0;
        let x = 0;

        for(let i=0;i<boardFEN.length;i++){
            let letterFen=boardFEN[i];
            if (letterFen==="/"){
                x=0;
                y+=1;
            }else if(isNaN(letterFen)){
                this.board[y][x]=this.creatPiece(letterFen,x,y);
                x+=1;
            }else {
                let cijferFen=parseInt(letterFen);
                for(let i=0;i<cijferFen;i++){
                    this.board[y][x+i]=0;
                }
                x+=cijferFen;
            }
        }
        let halveMove=0;
        if(Information[1]==="b"){
            halveMove+=1;
        }
        this.amountOfMoves=(parseInt(Information[5])-1)*2 + halveMove;
    }

    boardToFen(){
        var Fen;
        let castelstring;
        for(let i=0;i<8;i++){
            let count=0;
            for(let j=0;j<8;i++){
                let piece=this.board[i][i]
                if(piece===0){
                    count++;
                }else{
                    let type=typeof piece;
                    let firstletter=type[0];
                    if(piece.color){
                        firstletter.toLowerCase()
                    }
                    if(firstletter==="R" || firstletter==="r"){
                        if(piece.moved){
                            if(piece.pos.x===8){
                                castelstring+=piece.color?"q":"Q"
                            }else{
                                castelstring+=piece.color?"k":"K"
                            }

                        }
                    }
                    if(piece.color){
                       firstletter.toLowerCase()
                    }
                    if(count!==0){
                        Fen+=`${count}${firstletter}`
                    }else{
                        Fen+=`${firstletter}`
                    }
                }
            }
            Fen+="/";
        }

        Fen+=this.amountOfMoves%2===0?" b ":" w "
        Fen += `${castelstring} `;
        Fen += "- ";
        Fen +=`${this.amountOfMoves%2}`;
        Fen +=`${this.amountOfMoves/2}`;
        return Fen
    }

    creatPiece(letter,x,y){
        let color= letter===letter.toUpperCase()
        letter=letter.toUpperCase()
        if (letter==="R"){
            return new Rook(new Coordinate(x,y),color,true);
        }else if (letter==="N"){
            return new Knight(new Coordinate(x,y),color,true);
        }else if (letter==="P"){
            return new Pawn(new Coordinate(x,y),color,true);
        }else if (letter==="B"){
            return new Bisshop(new Coordinate(x,y),color,true);
        }else if (letter==="Q"){
            return new Queen(new Coordinate(x,y),color,true);
        }else if (letter==="K") {
            return new King(new Coordinate(x,y),color,true);
        }else{
            return null//eigenlijk hier exeption opwerpen om aan te tonen dat de input fout is -> doe dit dan!!
        }
    }

    possibleMoves(cord) {
        let piece = this.board[cord.y][cord.x];
        return this.legalchecker.possibleMoves(piece,false);
    }

    getPieces() {
        return this.board;
    }

    moveWithCheck(piece,cord){
        let realmoves=this.legalchecker.possibleMoves(piece,true);
        if(realmoves.some((move)=>JSON.stringify(move)===JSON.stringify(cord))){
            this.move(piece,cord);
            this.amountOfMoves++;
            return true;
        }else {
            return false;
        }
    }


    move(piece,cord){
        this.board[piece.pos.y][piece.pos.x] = 0;
        this.board[cord.y][cord.x] = piece;
        if (piece instanceof King && Math.abs(piece.pos.x-cord.x)>1){//if castle
            if (cord.x===6){
                let rook=this.board[piece.pos.y][7];
                this.move(rook,new Coordinate(5,piece.pos.y));
            }
            if (cord.x===2){
                let rook=this.board[piece.pos.y][0];
                this.move(rook,new Coordinate(3,piece.pos.y));
            }
        }
        piece.move(cord);
        if(piece instanceof Pawn && piece.pos.y===piece.endY){
            this.board[piece.pos.y][piece.pos.x]=new Queen(piece.pos,piece.kleur,true);
        }
    }

    colorToMove(){

        return this.amountOfMoves%2===0;
    }
    
    clone(imageOnLoad){
        let newboard= new Board(false);
        newboard.amountOfMoves=this.amountOfMoves;
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                let piece=this.board[y][x];
                if (piece!==0){
                    let virtpiece=this.board[y][x].clone(imageOnLoad);
                    newboard.board[y][x]=virtpiece;
                    if (piece instanceof King){
                        if (piece.kleur){
                            newboard.legalchecker.whiteking=virtpiece;
                        }else{
                            newboard.legalchecker.blackking=virtpiece;
                        }
                    }
                }else{
                    newboard.board[y][x]=0;
                }
            }
        }
        newboard.legalchecker.clone(newboard);
        return newboard;

    }
    isEnd(color) {
        let nummer = this.legalchecker.isEnd(color);
        if (1 === nummer) {
            return "checkmate";
        } else if (2 === nummer) {
            return "stalemate";
        } else {
            return "continue";
        }
    }
}