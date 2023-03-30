import {APiece} from "../Pieces/APiece.js";
import {Bisshop} from "../Pieces/Bisshop.js";
import {King} from "../Pieces/King.js";
import {Knight} from "../Pieces/Knight.js";
import {Pawn} from "../Pieces/Pawn.js";
import {Queen} from "../Pieces/Queen.js";
import {Rook} from "../Pieces/Rook.js";
import {Coordinate} from "../Coordinate.js";

export class Bot{
    constructor(color, depth) {
        this.color = color;
        this.depth = depth;
    }

    minimax(board, depth, alpha, beta, color){
        let speelveld = board.board;
        if(depth === 0){
            return this.evaluation(board);
        }
        if(color){
            let maxEval = undefined;
            for(let y = 0; y < 7; y++){
                for(let x = 0; x < 7; x++){
                    let piece = speelveld[y][x];
                    if(piece !== 0 && piece.kleur === color){
                        let posMoves = board.legalchecker.possibleMoves(piece, false);
                        for(let cord of posMoves){
                            let cloneBoard = board.clone();
                            let fakePiece = cloneBoard.board[piece.pos.y][piece.pos.x];
                            cloneBoard.move(fakePiece, cord, fakePiece.possibleMoves(cloneBoard));
                            let val = this.minimax(cloneBoard, depth-1, alpha, beta, !color);
                            if(maxEval === undefined || val > maxEval)
                                maxEval = val;
                            if(alpha === undefined ||alpha < val)
                                alpha = val
                            if(beta <= alpha)
                                return maxEval;
                        }
                    }
                }
            }
            return maxEval;
        }
        else{
            let minEval = undefined;
            for(let y = 0; y < 7; y++){
                for(let x = 0; x < 7; x++){
                    let piece = speelveld[y][x];
                    if(piece !== 0 && piece.kleur === color){
                        let posMoves = board.legalchecker.possibleMoves(piece, false);
                        for(let cord of posMoves){
                            let cloneBoard = board.clone();
                            let fakePiece = cloneBoard.board[y][x];
                            cloneBoard.move(fakePiece, cord, fakePiece.possibleMoves(cloneBoard));
                            let val = this.minimax(cloneBoard, depth-1, alpha, beta, !color);
                            if(minEval === undefined || val < minEval)
                                minEval = val;
                            if(beta === undefined ||beta > val)
                                beta = val;
                            if(beta <= alpha)
                                return minEval;
                        }
                    }
                }
            }
            return minEval;
        }
    }

    evaluation(board){
        let speelveld = board.board;
        let values = 0
        for(let y = 0; y < 7; y++){
            for(let x = 0; x < 7; x++) {
                let piece = speelveld[y][x];
                if(piece !== 0){
                    values += piece.value;
                }
            }
        }
        return values;
    }

    nextMove(board){
        let speelveld = board.board;
        let array;
        let mainEval;
        for(let y = 0; y < 7; y++){
            for(let x = 0; x < 7; x++){
                let piece = speelveld[y][x];
                if(piece !== 0 && piece.kleur === this.color){
                    let array2 = [0, 0];
                    let subEval;
                    let posMoves = board.legalchecker.possibleMoves(piece, false);
                    for(let cord of posMoves){
                        let cloneBoard = board.clone();
                        let fakePiece = cloneBoard.board[y][x];
                        cloneBoard.move(fakePiece, cord, fakePiece.possibleMoves(cloneBoard));
                        let val = this.minimax(cloneBoard, this.depth, undefined, undefined, this.color);
                        if(this.color && (subEval === undefined || subEval < val)){
                            subEval = val;
                            array2 = [piece, cord];
                        }
                        else if(!this.color && (subEval === undefined || subEval > val)){
                            subEval = val;
                            array2 = [piece, cord];
                        }
                    }
                    if(this.color && (mainEval === undefined || subEval > mainEval)){
                        mainEval = subEval;
                        array = array2;
                    }
                    else if(!this.color && (mainEval === undefined || subEval < mainEval)){
                        mainEval = subEval;
                        array = array2;
                    }
                }
            }
        }
        return array;
    }
}