import {Evaluation} from "./Evaluator/Evaluation.js";
import {Board} from "../Board.js";
import {Coordinate} from "../Coordinate.js";

const board= new Board(true);
let bot;
console.log("Web worker script loaded successfully");

self.addEventListener("message",(event)=>{

   let data=JSON.parse(event.data);

    let backdata;
    //console.log(data.type,data.type==="move")
    if (data.type==="maakbot"){

        bot= new Bot(data.color,+data.depth, new Evaluation());
        if(data.color){
            backdata=move();

            self.postMessage(JSON.stringify(backdata));
        }

    }else if(data.type==="move"){

        board.move(board.board[data.cord1.y][data.cord1.x],data.cord2);

        backdata=move();

        self.postMessage(JSON.stringify(backdata));

    }
});

function move(){
    let [cord1,cord2] =bot.nextMove(board);
    board.move(board.board[cord1.y][cord1.x],cord2);
    let backdata= {
        "cord1": cord1,
        "cord2": cord2
    }
    return backdata;
}

export class Bot{
    constructor(color, depth, evaluation) {
        this.color = color;
        this.depth = depth;
        this.evaluation = evaluation;
    }

    negamax(board,depth, alpha, beta, color){
        let speelveld = board.board;
        let bestScore = undefined;
        let move = [];
        if(depth === 0) {
            if(color)
                return [this.evaluation.evaluate(board), null];
            else
                return [-this.evaluation.evaluate(board), null];
        }
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
                            let [score, array] = this.negamax(cloneBoard, depth-1, -beta, -alpha, !color);
                            score *= -1;
                            if(score >= beta){
                                return [score, [x, y, cord]];
                            }
                            if(bestScore === undefined || score > bestScore){
                                bestScore = score;
                                move = [x, y, cord];
                                if(score > alpha){
                                    alpha = score;
                                }
                            }
                        }
                    }
                }
            }
        }
        if(bestScore === undefined){
            if(color)
                return [this.evaluation.evaluate(board), null];
            else
                return [-this.evaluation.evaluate(board), null];
        }
        return [bestScore, move];
    }
    /*
    undoMove(piece,oldcord,movedstatus,takenpiece,Board){
            let cordtaken=piece.pos;
            Board.move(piece,oldcord);
            Board.board[cordtaken.y][cordtaken.x]=takenpiece;// takenpiece trg op zijn plaats zetten
            if (movedstatus!==undefined)
                piece.moved=movedstatus;
            if (piece instanceof King && Math.abs(cordtaken.x-oldcord.x)>1){//if castle
                let rook;
                if (oldcord.x===6){
                    rook=Board.board[piece.pos.y][5];
                    Board.move(rook,new Coordinate(7,piece.pos.y));
                }else {
                    rook=Board.board[piece.pos.y][3];
                    Board.move(rook,new Coordinate(0,piece.pos.y));
                }
                rook.moved=false;

            }
    }
    */
    nextMove(board){
        let [val, array] = this.negamax(board, this.depth, -20000, 20000, this.color);
        let cord = new Coordinate(array[0], array[1]);
        return [cord, array[2]];
    }
/*
    minimax(board, depth, alpha, beta, color){
        let speelveld = board.board;
        if(depth === 0){
            return this.evaluation.evaluate(board, color);
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
                                if (beta <= alpha) {
                                    return maxEval;
                                }
                            }
                        }
                    }
                }
            }
            if(maxEval === undefined)
                return this.evaluation.evaluate(board, color);
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
                            let fakePiece = cloneBoard.board[piece.pos.y][piece.pos.x];
                            cloneBoard.move(fakePiece, cord);
                            if (!cloneBoard.legalchecker.isChecked(piece.kleur)) {
                                let val = this.minimax(cloneBoard, depth - 1, alpha, beta, !color);
                                if (minEval === undefined || val < minEval)
                                    minEval = val;
                                if (beta > val)
                                    beta = val;
                                if (beta <= alpha) {
                                    return minEval;
                                }
                            }

                        }
                    }
                }
            }
            if(minEval === undefined)
                return this.evaluation.evaluate(board, color);
            return minEval;
        }
    }
    */
}