import {APiece} from "./APiece.js";

class Board{
    constructor() {
        this.board=[[],[],[],[],[],[],[],[]]

    }

    possible_moves(cord){
        let piece = this.board[cord.y][cord.x];
        return piece.possible_moves();
    }

    move(cordoud,cordnieuw){
        let piece = this.board[cordoud.y][cordoud.x];
        this.board[cordoud.y][cordnieuw.x]=0;
        this.board[cordnieuw.y][cordnieuw.x]=piece;
    }

    showMoves(){

    }

    isChecked(){

    }

    canMove(){

    }
}

