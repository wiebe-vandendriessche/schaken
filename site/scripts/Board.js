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
            this.board[1][i] = new Pawn(new Coordinate(1, i), false);
            this.board[6][i] = new Pawn(new Coordinate(6, i), true);
        }

        this.board[7][4] = new King(new Coordinate(7, 4), true);
        this.board[7][3] = new Queen(new Coordinate(7,3), true);
        this.board[7][2] = new Bisshop(new Coordinate(7, 2), true);
        this.board[7][5] = new Bisshop(new Coordinate(7, 5), true);
        this.board[7][1] = new Knight(new Coordinate(7, 1), true);
        this.board[7][0] = new Rook(new Coordinate(7, 6), true);
        this.board[7][6] = new Knight(new Coordinate(7, 6), true);
        this.board[7][7] = new Rook(new Coordinate(7, 7), true);

        this.board[0][4] = new King(new Coordinate(0, 4), false);
        this.board[0][3] = new Queen(new Coordinate(0, 3), false);
        this.board[0][2] = new Bisshop(new Coordinate(0, 2), false);
        this.board[0][5] = new Bisshop(new Coordinate(0, 5), false);
        this.board[0][1] = new Knight(new Coordinate(0, 1), false);
        this.board[0][0] = new Rook(new Coordinate(0, 0), false);
        this.board[0][6] = new Knight(new Coordinate(0, 6), false);
        this.board[0][7] = new Rook(new Coordinate(0, 7), false);

        for(let i = 2; i < 6; i++){
            for(let j = 0; j < 8; j++){
                this.board[i][j] = 0;
            }
        }
    }
    possible_moves(cord) {
        let piece = this.board[cord.y][cord.x];
        return piece.possible_moves();
    }

    getPieces() {
        return this.board;
    }

    move(cordoud, cordnieuw) {
        let piece = this.board[cordoud.y][cordoud.x];
        this.board[cordoud.y][cordnieuw.x] = 0;
        this.board[cordnieuw.y][cordnieuw.x] = piece;
    }

    showMoves() {

    }

    isChecked() {

    }

    canMove() {

    }
}