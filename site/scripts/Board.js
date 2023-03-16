import {APiece} from "./Pieces/APiece.js";
import {Bisshop} from "./Pieces/Bisshop.js";
import {King} from "./Pieces/King.js";
import {Knight} from "./Pieces/Knight.js";
import {Pawn} from "./Pieces/Pawn.js";
import {Queen} from "./Pieces/Queen.js";
import {Rook} from "./Pieces/Rook.js";
import {Coordinate} from "./Coordinate.js";


export {Board};

class Board {
    constructor() {
        this.board = [[], [], [], [], [], [], [], []];
        this.setupPieces();

    }

    setupPieces() {
        for (let i = 0; i < 8; i++) {
            this.board[1][i] = new Pawn(new Coordinate(i, 1), false);
            this.board[6][i] = new Pawn(new Coordinate(i, 6), true);
        }

        this.board[7][4] = new King(new Coordinate(4, 7), true);
        this.board[7][3] = new Queen(new Coordinate(3,7), true);
        this.board[7][2] = new Bisshop(new Coordinate(2, 7), true);
        this.board[7][5] = new Bisshop(new Coordinate(5, 7), true);
        this.board[7][1] = new Knight(new Coordinate(1, 7), true);
        this.board[7][0] = new Rook(new Coordinate(6,7), true);
        this.board[7][6] = new Knight(new Coordinate(6, 7), true);
        this.board[7][7] = new Rook(new Coordinate(7, 7), true);

        this.board[0][4] = new King(new Coordinate(4, 0), false);
        this.board[0][3] = new Queen(new Coordinate(3, 0), false);
        this.board[0][2] = new Bisshop(new Coordinate(2, 0), false);
        this.board[0][5] = new Bisshop(new Coordinate(5, 0), false);
        this.board[0][1] = new Knight(new Coordinate(1, 0), false);
        this.board[0][0] = new Rook(new Coordinate(0, 0), false);
        this.board[0][6] = new Knight(new Coordinate(6, 0), false);
        this.board[0][7] = new Rook(new Coordinate(7, 0), false);

        for(let i = 2; i < 6; i++){
            for(let j = 0; j < 8; j++){
                this.board[i][j] = 0;
            }
        }
    }
    possible_moves(cord) {
        let piece = this.board[cord.y][cord.x];
        return piece.possibleMoves(this);
    }

    getPieces() {
        return this.board;
    }

    move(piece, cord) {
        let possible_moves = piece.possibleMoves(this);
        console.log(possible_moves);
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
        return true;
    }


    showMoves() {

    }

    isChecked() {

    }

    canMove() {

    }
}