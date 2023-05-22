import {IEvaluation} from "./IEvaluation.js";

export class Evaluation extends IEvaluation{
    constructor() {
        super();
        this.tableDictionary = new Map();
        this.squareTables();
    }

    evaluate(board) {
        return this.materialCount(board) + this.checkmate(board);
    }

    checkmate(board){
        let val = 0;
        if (board.legalchecker.isChecked(true) && board.isEnd(true) === "checkmate") {
            val += -10000;
        }
        if (board.legalchecker.isChecked(false) && board.isEnd(false) === "checkmate") {
            val += 10000;
        }
        return val;
    }

    materialCount(board) {
        let speelveld = board.board;
        let score = 0;
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                let piece = speelveld[y][x];
                if (piece !== 0) {
                    let type = piece.getType();
                    score += piece.value;
                    if (type.includes("king")) {
                        if (piece.kleur) {
                            this.whiteking = piece;
                        } else {
                            this.blackking = piece;
                        }
                    } else {
                        score += this.tableDictionary.get(type)[y][x];
                    }
                }
            }
        }
        return score;
    }

    endGameEval(myScore, opponentScore, color) {
        let endGameEval = 0;
        if (myScore > opponentScore + 200) {
            let king = color ? this.whiteking : this.blackking;
            let distanceToEdge = this.endGameTable[king.y][king.x];
            endGameEval += (distanceToEdge) * 5;
            endGameEval += (14 - (Math.abs(this.whiteking.x - this.blackking.x) + Math.abs(this.whiteking.y - this.blackking.y))) * 5;
        }
        return endGameEval;
    }

    endGameWeight(material) {
        const multiplier = 1 / 6200;
        return 1 > (multiplier * material);
    }

    squareTables(){
        this.endGameTable =
            [[6, 5, 4, 3, 3, 4, 5, 6],
            [5, 4, 3, 2, 2, 3, 4, 5],
            [4, 3, 2, 1, 1, 2, 3, 4],
            [3, 2, 1, 0, 0, 1, 2, 3],
            [3, 2, 1, 0, 0, 1, 2, 3],
            [4, 3, 2, 1, 1, 2, 3, 4],
            [5, 4, 3, 2, 2, 3, 4, 5],
            [6, 5, 4, 3, 3, 4, 5, 6]];
        this.tableDictionary.set("w_pawn",
            [[0, 0, 0, 0, 0, 0, 0, 0],
            [10, 10, 10, 10, 10, 10, 10, 10],
            [2, 2, 4, 6, 6, 4, 2, 2],
            [1, 1, 2, 5, 5, 2, 1, 1],
            [0, 0, 0, 4, 4, 0, 0, 0],
            [1, 1, -2, 2, 2, -2, 1, 1],
            [1, 4, 2, -5, -5, 2, 4, 1],
            [0, 0, 0, 0, 0, 0, 0, 0]]);
        this.tableDictionary.set("b_pawn", this.tableDictionary.get("w_pawn").slice().reverse().map(row => row.map(value => -1 * value)));
        this.tableDictionary.set("w_knight",
            [[-8, -7, -6, -6, -6, -6, -7, -8],
            [-7, -3, 0, 0, 0, 0, -3, -7],
            [-6, 0, 2, 3, 3, 2, 0, -6],
            [-6, 1, 3, 4, 4, 3, 1, -6],
            [-6, 0, 3, 4, 4, 3, 0, -6],
            [-6, 1, 2, 3, 3, 2, 1, -6],
            [-7, -3, 0, 5, 5, 0, -3, -7],
            [-8, -7, -6, -6, -6, -6, -7, -8]]);
        this.tableDictionary.set("b_knight", this.tableDictionary.get("w_knight").slice().reverse().map(row => row.map(value => -1 * value)));
        this.tableDictionary.set("w_bishop",
            [[-8, -7, -6, -6, -6, -6, -7, -8],
            [-2, -1, -1, -1, -1, -1, -1, -2],
            [-1, 0, 0, 0, 0, 0, 0, -1],
            [-1, 0, 1, 1, 1, 1, 0, -1],
            [-1, 1, 1, 1, 1, 1, 1, -1],
            [-1, 0, 1, 1, 1, 1, 0, -1],
            [-1, 1, 1, 1, 1, 1, 1, -1],
            [-1, 1, 0, 0, 0, 0, 1, -1],
            [-2, -1, -1, -1, -1, -1, -1, -2]]);
        this.tableDictionary.set("b_bishop", this.tableDictionary.get("w_bishop").slice().reverse().map(row => row.map(value => -1 * value)));
        this.tableDictionary.set("w_rook",
            [[0, 0, 0, 0, 0, 0, 0, 0],
            [1, 2, 2, 2, 2, 2, 2, 1],
            [-5, 0, 0, 0, 0, 0, 0, -1],
            [-5, 0, 0, 0, 0, 0, 0, -1],
            [-5, 0, 0, 0, 0, 0, 0, -1],
            [-5, 0, 0, 0, 0, 0, 0, -1],
            [-5, 0, 0, 0, 0, 0, 0, -1],
            [0, 0, 1, 4, 1, 4, 0, 0]]);
        this.tableDictionary.set("b_rook", this.tableDictionary.get("w_rook").slice().reverse().map(row => row.map(value => -1 * value)));
        this.tableDictionary.set("w_queen",
            [[-4, -2, -2, -1, -1, -2, -2, -4],
            [-2, 0, 0, 0, 0, 0, 0, -2],
            [-2, 0, 1, 1, 1, 1, 0, -2],
            [-1, 0, 1, 1, 1, 1, 0, -1],
            [-1, 0, 1, 1, 1, 1, 0, -1],
            [-2, 0, 1, 1, 1, 1, 0, -2],
            [-2, 0, 0, 0, 0, 0, 0, -2],
            [-4, -2, -2, -1, -1, -2, -2, -4]]);
        this.tableDictionary.set("b_queen", this.tableDictionary.get("w_queen").slice().reverse().map(row => row.map(value => -1 * value)));
        this.tableDictionary.set("w_king",
            [[-3, -4, -4, -5, -5, -4, -4, -3],
            [-3, -4, -4, -5, -5, -4, -4, -3],
            [-3, -4, -4, -5, -5, -4, -4, -3],
            [-3, -4, -4, -5, -5, -4, -4, -3],
            [-2, -3, -3, -4, -4, -3, -3, -2],
            [-1, -2, -2, -2, -2, -2, -2, -1],
            [1, 1, 0, 0, 0, 0, 1, 1],
            [1, 5, -1, 0, 0, -1, 5, 1]]);
        this.tableDictionary.set("b_king", this.tableDictionary.get("w_king").slice().reverse().map(row => row.map(value => -1 * value)));
    }
}