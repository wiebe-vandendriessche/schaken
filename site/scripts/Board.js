import {APiece} from "./Pieces/APiece.js";
import {Bisshop} from "./Pieces/Bisshop.js";
import {King} from "./Pieces/King.js";
import {Knight} from "./Pieces/Knight.js";
import {Pawn} from "./Pieces/Pawn.js";
import {Queen} from "./Pieces/Queen.js";
import {Rook} from "./Pieces/Rook.js";
import {Coordinate} from "./Coordinate.js";

import {LegalChecker} from "./LegalChecker.js";
import {MoveCacher} from "./MoveCacher.js";

export {Board};

class Board {
    static PlayedMoves = new MoveCacher();

    constructor(setup) {
        this.board = [[], [], [], [], [], [], [], []];

        if (setup) {
            this.setupPieces();
        }
        this.legalchecker= new LegalChecker(this);
        this.amountOfMoves=0;
    }

    setupPieces() {
        for (let i = 0; i < 8; i++) {
            this.board[1][i] = new Pawn(new Coordinate(i, 1), false,true);
            this.board[6][i] = new Pawn(new Coordinate(i, 6), true,true);
        }

        this.board[7][4] = new King(new Coordinate(4, 7), true,true);
        this.board[7][3] = new Queen(new Coordinate(3,7), true,true);
        this.board[7][2] = new Bisshop(new Coordinate(2, 7), true,true);
        this.board[7][5] = new Bisshop(new Coordinate(5, 7), true,true);
        this.board[7][1] = new Knight(new Coordinate(1, 7), true,true);
        this.board[7][0] = new Rook(new Coordinate(0,7), true,true);
        this.board[7][6] = new Knight(new Coordinate(6, 7), true,true);
        this.board[7][7] = new Rook(new Coordinate(7, 7), true,true);

        this.board[0][4] = new King(new Coordinate(4, 0), false,true);
        this.board[0][3] = new Queen(new Coordinate(3, 0), false,true);
        this.board[0][2] = new Bisshop(new Coordinate(2, 0), false,true);
        this.board[0][5] = new Bisshop(new Coordinate(5, 0), false,true);
        this.board[0][1] = new Knight(new Coordinate(1, 0), false,true);
        this.board[0][0] = new Rook(new Coordinate(0, 0), false,true);
        this.board[0][6] = new Knight(new Coordinate(6, 0), false,true);
        this.board[0][7] = new Rook(new Coordinate(7, 0), false,true);

        for(let i = 2; i < 6; i++){
            for(let j = 0; j < 8; j++){
                this.board[i][j] = 0;
            }
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
        if(this.move(piece,cord,realmoves)){
            this.amountOfMoves++;
            Board.PlayedMoves.Moveadd(cord,this.amountOfMoves,this);
            return true;
        }else {
            return false;
        }
    }


    getAlleMovesPlayedInGame(){
        return Board.PlayedMoves.GetMoves();
    }

    move(piece,cord, possible_moves){
        let good = false;
        let counter = 0;
        while(!good && counter < possible_moves.length){
            if(JSON.stringify(possible_moves[counter++]) === JSON.stringify(cord))
                good = true;
        }
        if(!good)
            return false;
        this.board[piece.pos.y][piece.pos.x] = 0;
        this.board[cord.y][cord.x] = piece;

        piece.move(cord);
        if(piece instanceof Pawn && piece.pos.y===piece.endY){
            this.board[piece.pos.y][piece.pos.x]=new Queen(piece.pos,piece.kleur);
        }
        return true;
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

    PrevouisPosition(){

        return Board.PlayedMoves.ReturnToPreviousMoves()
    }



}