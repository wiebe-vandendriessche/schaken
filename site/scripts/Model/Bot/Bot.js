
import {Evaluation} from "./Evaluation.js";
import {Board} from "../Board.js";
const board= new Board(true);
let bot;
console.log("Web worker script loaded successfully");

self.addEventListener("message",(event)=>{

   let data=JSON.parse(event.data);

    let backdata;
    console.log(data.type,data.type==="move")
    if (data.type==="maakbot"){

        bot= new Bot(data.color,+data.depth);
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
    constructor(color, depth) {
        this.color = color;
        this.depth = depth;
        this.evaluation = new Evaluation();
        // this.counter = 0;
    }

    negamax(board,depth, alpha, beta, color){
        let speelveld = board.board;
        let bestScore = undefined;
        if(depth === 0) {
            if(color)
                return this.evaluation.Evaluate(board);
            else
                return -this.evaluation.Evaluate(board);
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
                            let score = -this.negamax(cloneBoard, depth-1, -beta, -alpha, !color);
                            if(score >= beta){
                                return score;
                            }
                            if(bestScore === undefined || score > bestScore){
                                bestScore = score;
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
                return this.evaluation.Evaluate(board);
            else
                return -this.evaluation.Evaluate(board);
        }
        return bestScore;
    }

    // if(bestScore === undefined)
    // return this.evaluation.Evaluate(board, color);

//     let val = this.minimax(cloneBoard, depth - 1, alpha, beta, !color);
//     if(color){
//         if (bestScore === undefined || val > bestScore)
//             bestScore = val;
//         if (alpha < val)
//             alpha = val;
//         if (beta <= alpha)
//             return bestScore;
//     }
//     else{
//     if (bestScore === undefined || val < bestScore)
//     bestScore = val;
//     if (beta > val)
//     beta = val;
//     if (beta <= alpha)
//     return bestScore;
// }

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

    minimax(board, depth, alpha, beta, color){
        let speelveld = board.board;
        // this.counter++;
        // console.log(this.counter);
        if(depth === 0){
            return this.evaluation.Evaluate(board, color);
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
            // console.log("maxEval: " + maxEval);
            if(maxEval === undefined)
                return this.evaluation.Evaluate(board, color);
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
            // console.log("minEval: " + minEval);
            if(minEval === undefined)
                return this.evaluation.Evaluate(board, color);
            return minEval;
        }
    }

    nextMove(board){
            let speelveld = board.board;
            let array;
            let mainEval;
            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 8; x++) {
                    let piece = speelveld[y][x];
                    if (piece !== 0 && piece.kleur === this.color) {
                        let posMoves = piece.possibleMoves(board);
                        for (let cord of posMoves) {
                            let cloneBoard = board.clone(false);
                            let fakePiece = cloneBoard.board[piece.pos.y][piece.pos.x];
                            cloneBoard.move(fakePiece, cord);
                            if (!cloneBoard.legalchecker.isChecked(piece.kleur)) {
                                // OUDE VERSIE
                                // let val = this.minimax(cloneBoard, this.depth, -20000, 20000, !this.color);
                                // let val = this.negamax(cloneBoard, this.depth, -20000, 20000, !this.color);
                                // if (this.color && (subEval === undefined || subEval < val)) {
                                //     subEval = val;
                                //     array2 = [piece, cord];
                                // } else if (!this.color && (subEval === undefined || subEval > val)) {
                                //     subEval = val;
                                //     array2 = [piece, cord];

                                // NIEUWE VERSIE
                                let val = this.negamax(cloneBoard, this.depth-1, -20000, 20000, !this.color);
                                // niet meer nodig om te checken
                                if ((mainEval === undefined || mainEval > val)) {
                                    mainEval = val;
                                    array = [piece.pos, cord];
                                }
                            }
                        }
                    }
                }
            }
            console.log(mainEval, this.color, array);
            return array;
    }
}