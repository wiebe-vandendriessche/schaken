import {APiece} from "./Pieces/APiece.js";
import {Bisshop} from "./Pieces/Bisshop.js";
import {King} from "./Pieces/King.js";
import {Knight} from "./Pieces/Knight.js";
import {Pawn} from "./Pieces/Pawn.js";
import {Queen} from "./Pieces/Queen.js";
import {Rook} from "./Pieces/Rook.js";
import {Coordinate} from "./Coordinate.js";
import {LegalChecker} from "./LegalChecker.js";
import {FenConvertor} from "./FenConvertor.js";


export {Board};

class Board {


    constructor(setup) {
        this.board = [[], [], [], [], [], [], [], []];
        if (setup) {
            this.setupPieces("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
        }
        this.legalchecker= new LegalChecker(this);
        this.amountOfMoves=0;
    }

    setupPieces(FEN){//krijgt een string van de vorm rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1 zie https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation voor meer uitleg over FEN
        FenConvertor.setupPieces(this,FEN)
    }

    possibleMoves(cord) {
        let piece = this.board[cord.y][cord.x];
        //eerste klik op de pion bij spelen ->cachen
        return this.legalchecker.possibleMoves(piece,false);
    }
    moveWithCheck(piece,cord){
        //tweede klik -> al gecached
        let realmoves=this.legalchecker.possibleMoves(piece,true);
        if(realmoves.some(move=>move.x===cord.x && move.y===cord.y)){
            //verzet het schaakstuk in 2D-array en wijzigt zijn coord
            this.move(piece,cord);
            this.amountOfMoves++;
            return true;
        }else {
            return false;
        }
    }

    getPieces() {
        return this.board;
    }




    move(piece,cord){
        this.board[piece.pos.y][piece.pos.x] = 0; //vakje wordt leeg
        this.board[cord.y][cord.x] = piece; //verplaats naar cord
        //kijken voor rokeren (altijd een zet die verder gaat dan 1 vakje)
        if (piece.getType().endsWith("king") && Math.abs(piece.pos.x-cord.x)>1){
            //rechts
            if (cord.x===6){
                let rook=this.board[piece.pos.y][7];
                this.move(rook,new Coordinate(5,piece.pos.y));
            }
            //links
            if (cord.x===2){
                let rook=this.board[piece.pos.y][0];
                this.move(rook,new Coordinate(3,piece.pos.y));
            }
        }
        piece.move(cord);
        // als het de pion aan einde komt-> promoveren naar queen
        if(piece.getType().endsWith("pawn") && piece.pos.y===piece.endY){
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
                    if (piece.getType().endsWith("king")){
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