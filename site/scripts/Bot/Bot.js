import {APiece} from "../Pieces/APiece.js";
import {Bisshop} from "../Pieces/Bisshop.js";
import {King} from "../Pieces/King.js";
import {Knight} from "../Pieces/Knight.js";
import {Pawn} from "../Pieces/Pawn.js";
import {Queen} from "../Pieces/Queen.js";
import {Rook} from "../Pieces/Rook.js";
import {Coordinate} from "../Coordinate.js";
import {Evaluation} from "./Evaluation.js";

export class Bot{
    constructor(color, depth) {
        this.color = color;
        this.depth = depth;
        // this.counter = 0;
    }
    minimax(board, depth, alpha, beta, color){
        let speelveld = board.board;
        // this.counter++;
        // console.log(this.counter);
        if(depth === 0){
            return Evaluation.Evaluate(board, color);
        }
        if(color){
            let maxEval = undefined;
            for(let y = 0; y < 8; y++){
                for(let x = 0; x < 8; x++){
                    let piece = speelveld[y][x];
                    if(piece !== 0 && piece.kleur === color){
                        let posMoves = piece.possibleMoves(board);
                        for(let cord of posMoves){
                            let cloneBoard = board.clone(false);
                            let fakePiece = cloneBoard.board[piece.pos.y][piece.pos.x];
                            cloneBoard.move(fakePiece, cord);
                            if (!cloneBoard.legalchecker.isChecked(piece.kleur)) {
                                let val = this.minimax(cloneBoard, depth - 1, alpha, beta, !color);
                                if (maxEval === undefined || val > maxEval)
                                    maxEval = val;
                                if (alpha < val)
                                    alpha = val;
                                if (beta <= alpha)
                                    return maxEval;
                            }
                        }
                    }
                }
            }
            // console.log("maxEval: " + maxEval);
            if(maxEval === undefined)
                return Evaluation.Evaluate(board, color);
            return maxEval;
        }
        else{
            let minEval = undefined;
            for(let y = 0; y < 8; y++){
                for(let x = 0; x < 8; x++){
                    let piece = speelveld[y][x];
                    if(piece !== 0 && piece.kleur === color){
                        let posMoves = piece.possibleMoves(board);
                        for(let cord of posMoves){
                            let cloneBoard = board.clone(false);
                            let fakePiece = cloneBoard.board[y][x];
                            cloneBoard.move(fakePiece, cord);
                            if (!cloneBoard.legalchecker.isChecked(piece.kleur)) {
                                let val = this.minimax(cloneBoard, depth - 1, alpha, beta, !color);
                                if (minEval === undefined || val < minEval)
                                    minEval = val;
                                if (beta > val)
                                    beta = val;
                                if (beta <= alpha)
                                    return minEval;
                            }
                        }
                    }
                }
            }
            // console.log("minEval: " + minEval);
            if(minEval === undefined)
                return Evaluation.Evaluate(board, color);
            return minEval;
        }
    }

     async nextMove(board){
        return new Promise((resolve) => {
            let speelveld = board.board;
            let array;
            let mainEval;
            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 8; x++) {
                    let piece = speelveld[y][x];
                    if (piece !== 0 && piece.kleur === this.color) {
                        let array2 = [0, 0];
                        let subEval = undefined;
                        let posMoves = board.legalchecker.possibleMoves(piece);
                        for (let cord of posMoves) {
                            let cloneBoard = board.clone(false);
                            let fakePiece = cloneBoard.board[y][x];
                            cloneBoard.move(fakePiece, cord);
                            if (!cloneBoard.legalchecker.isChecked(piece.kleur)) {
                                let val = this.minimax(cloneBoard, this.depth, -20000, 20000, !this.color);
                                if (this.color && (subEval === undefined || subEval < val)) {
                                    subEval = val;
                                    array2 = [piece, cord];
                                } else if (!this.color && (subEval === undefined || subEval > val)) {
                                    subEval = val;
                                    array2 = [piece, cord];
                                }
                            }
                            if (this.color && (mainEval === undefined || subEval > mainEval)) {
                                mainEval = subEval;
                                array = array2;
                            } else if (!this.color && (mainEval === undefined || subEval < mainEval)) {
                                mainEval = subEval;
                                array = array2;
                            }
                        }
                    }
                }
            }
            console.log(mainEval, this.color);
            resolve(array);
        });
    }
}