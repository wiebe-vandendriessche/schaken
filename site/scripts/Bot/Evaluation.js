import {Pawn} from "../Pieces/Pawn.js";
import {King} from "../Pieces/King.js";
import {Knight} from "../Pieces/Knight.js";
import {Bisshop} from "../Pieces/Bisshop.js";
import {Queen} from "../Pieces/Queen.js";
import {Rook} from "../Pieces/Rook.js";


export class Evaluation{
    constructor(){
        this.tableDictionary=new Map();
        this.squareTables();
    }

    Evaluate(board){

        let tableScore = this.materialCount(board)+this.checkmate(board);

        /*let whiteEndGameWeight = this.endGameWeight((this.whiteMaterialCount-(this.whitePawns*100)));
        let blackEndGameWeight = this.endGameWeight(-1*(this.blackMaterialCount+(this.blackPawns*100)));
        if(whiteEndGameWeight)
            whiteScore += this.endGameEval(whiteScore, -1*this.blackMaterialCount, false);
        else
            whiteScore += this.tableDictionary.get("w_king")[this.whiteKing.x][this.whiteKing.y];
        if(blackEndGameWeight)
            blackScore -= this.endGameEval(-1*blackScore, this.whiteMaterialCount, true);
        else
            blackScore += this.tableDictionary.get("b_king")[this.blackKing.x][this.blackKing.y];
*/

        return tableScore;
    }

    checkmate(board){
        let val = 0;
        if(board.legalchecker.isChecked(true) && board.isEnd(true) === "checkmate") {
            // console.log("HONK");
            val += -10000;
        }
        if(board.legalchecker.isChecked(false) && board.isEnd(false) === "checkmate") {
            // console.log("HOKN");
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


                    score += piece.value;
                    score += this.tableDictionary.get(piece.getType())[y][x];

                }
            }
        }
        return score;

    }
/*
    endGameEval(myScore, opponentScore, color){
        let endGameEval = 0;
        if(myScore < opponentScore){
            let king=color?this.whiteKing.x:this.blackKing.x;
            let distance = Math.min(king.x,7-(king.x),7-king.y,king.y);
            endGameEval += distance*5;
            endGameEval += (14-(Math.abs(this.whiteKing.x-this.blackKing.x)+Math.abs(this.whiteKing.y-this.blackKing.y)))*2
            // console.log("EndgameEval:",endGameEval);
        }
        return endGameEval;
    }*/

    endGameWeight(material){
        const multiplier = 1/6000;
        return 1 > multiplier*material;
    }

    squareTables(){
        this.tableDictionary.set("w_pawn", [
            [0,  0,  0,  0,  0,  0,  0,  0],
            [10, 10, 10, 10, 10, 10, 10, 10],
            [2, 2, 4, 6, 6, 4, 2, 2],
            [1,  1, 2, 5, 5, 2,  1,  1],
            [0,  0,  0, 4, 4,  0,  0,  0],
            [1, 1,-2,  2,  2,-2, 1,  1],
            [1, 4, 2,-5,-5, 2, 4, 1 ],
            [0,  0,  0,  0,  0,  0,  0,  0]]);
        this.tableDictionary.set("b_pawn",this.tableDictionary.get("w_pawn").slice().reverse().map(row => row.map(value => -1 * value)));
        this.tableDictionary.set("w_knight", [[-8,-7,-6,-6,-6,-6,-7,-8],
            [-7,-3,  0,  0,  0,  0,-3,-7],
            [-6,  0, 2, 3, 3, 2,  0,-6],
            [-6,  1, 3, 4, 4, 3,  1,-6],
            [-6,  0, 3, 4, 4, 3,  0,-6],
            [-6,  1, 2, 3, 3, 2,  1,-6],
            [-7,-3,  0,  5,  5,  0,-3,-7],
            [-8,-7,-6,-6,-6,-6,-7,-8]]);
        this.tableDictionary.set("b_knight",this.tableDictionary.get("w_knight").slice().reverse().map(row => row.map(value => -1 * value)));
        this.tableDictionary.set("w_bishop", [[-8,-7,-6,-6,-6,-6,-7,-8],
            [-2,-1,-1,-1,-1,-1,-1,-2],
            [-1, 0, 0, 0, 0, 0, 0,-1],
            [-1, 0, 1, 1, 1,  1,  0,-1],
            [-1,  1,  1, 1, 1,  1,  1,-1],
            [-1,  0, 1, 1, 1, 1,  0,-1],
            [-1, 1, 1, 1, 1, 1, 1,-1],
            [-1,  1,  0,  0,  0,  0,  1,-1],
            [-2,-1,-1,-1,-1,-1,-1,-2]])
        this.tableDictionary.set("b_bishop",this.tableDictionary.get("w_bishop").slice().reverse().map(row => row.map(value => -1 * value)));
        this.tableDictionary.set("w_rook", [
            [0,  0,  0,  0,  0,  0,  0,  0],
            [1, 2, 2, 2, 2, 2, 2,  1],
            [-5,  0,  0,  0,  0,  0,  0, -1],
            [-5,  0,  0,  0,  0,  0,  0, -1],
            [-5,  0,  0,  0,  0,  0,  0, -1],
            [-5,  0,  0,  0,  0,  0,  0, -1],
            [-5,  0,  0,  0,  0,  0,  0, -1],
            [0,  0,  1,  4,  1,  4,  0,  0]]);
        this.tableDictionary.set("b_rook",this.tableDictionary.get("w_rook").slice().reverse().map(row => row.map(value => -1 * value)));
        this.tableDictionary.set("w_queen", [
            [-4,-2,-2, -1, -1,-2,-2,-4],
            [-2,  0,  0,  0,  0,  0,  0,-2],
            [-2,  0,  1,  1,  1,  1,  0,-2],
            [-1,  0,  1,  1,  1,  1,  0, -1],
            [-1,  0,  1,  1,  1,  1,  0, -1],
            [-2,  0,  1,  1,  1,  1,  0,-2],
            [-2,  0,  0,  0,  0,  0,  0,-2],
            [-4,-2,-2, -1, -1,-2,-2,-4]]);
        this.tableDictionary.set("b_queen",this.tableDictionary.get("w_queen").slice().reverse().map(row => row.map(value => -1 * value)));
        this.tableDictionary.set("w_king", [[-3,-4,-4,-5,-5,-4,-4,-3],
            [-3,-4,-4,-5,-5,-4,-4,-3],
            [-3,-4,-4,-5,-5,-4,-4,-3],
            [-3,-4,-4,-5,-5,-4,-4,-3],
            [-2,-3,-3,-4,-4,-3,-3,-2],
            [-1,-2,-2,-2,-2,-2,-2,-1],
            [1, 1,  0,  0,  0,  0, 1, 1],
            [1, 5, -1,  0,  0, -1, 5, 1]]);
        this.tableDictionary.set("b_king",this.tableDictionary.get("w_king").slice().reverse().map(row => row.map(value => -1 * value)));
    }
}