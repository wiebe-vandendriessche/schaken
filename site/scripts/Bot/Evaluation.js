import {Pawn} from "../Pieces/Pawn.js";
import {King} from "../Pieces/King.js";
import {Knight} from "../Pieces/Knight.js";
import {Bisshop} from "../Pieces/Bisshop.js";
import {Queen} from "../Pieces/Queen.js";
import {Rook} from "../Pieces/Rook.js";

export class Evaluation{
    constructor(){
        this.squareTables();
    }

    Evaluate(board){
        this.whitePawns = 0;
        this.blackPawns = 0;
        let whiteScore = 0;
        let blackScore = 0;

        this.whiteMaterialCount = 0;
        this.blackMaterialCount = 0;
        let tableScore = this.materialCount(board);

        whiteScore = this.whiteMaterialCount;
        blackScore = this.blackMaterialCount;

        let whiteEndGameWeight = this.endGameWeight((this.whiteMaterialCount-(this.whitePawns*100)));
        let blackEndGameWeight = this.endGameWeight(-1*(this.blackMaterialCount-(this.blackPawns*100)));
        if(whiteEndGameWeight>0)
            whiteScore += this.endGameEval(whiteScore, -1*this.blackMaterialCount, whiteEndGameWeight,false);
        else
            whiteScore += this.whiteKingTable[this.whiteKing.x][this.whiteKing.y];
        if(blackEndGameWeight>0)
            blackScore -= this.endGameEval(-1*blackScore, this.whiteMaterialCount, blackEndGameWeight,true);
        else
            blackScore += this.blackKingTable[this.blackKing.x][this.blackKing.y];

        whiteScore += this.whiteMaterialCount;
        blackScore += this. blackMaterialCount;

        return this.checkmate(board) + whiteScore + blackScore+tableScore;
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

    materialCount(board){
        let speelveld = board.board;
        let score = 0;
        for(let y = 0; y < 8; y++){
            for(let x = 0; x < 8; x++) {
                let piece = speelveld[y][x];
                if(piece !== 0){
                    let color = piece.kleur;
                    if(color)
                        this.whiteMaterialCount += piece.value;
                    else
                        this.blackMaterialCount += piece.value;
                    if(piece instanceof Pawn) {
                        color ? (this.whitePawns++) : (this.blackPawns++);
                        color ? (score += this.whitePawnTable[y][x]) : score += this.blackPawnTable[y][x];
                    }
                    else if(piece instanceof Knight){
                        color ? score += this.whiteKnightTable[y][x] : score += this.blackKnightTable[y][x];
                    }
                    else if(piece instanceof Rook){
                        color ? score += this.whiteRookTable[y][x] : score += this.blackRookTable[y][x];
                    }
                    else if(piece instanceof Bisshop){
                        color ? score += this.whiteBishopTable[y][x] : score += this.blackBishopTable[y][x];
                    }
                    else if(piece instanceof Queen){
                        color ? score += this.whiteQueenTable[y][x] : score += this.blackQueenTable[y][x];
                    }
                    else if(piece instanceof King) {
                        color ? (this.whiteKing = piece.pos) : (this.blackKing = piece.pos);
                    }
                }
            }
        }
        return score;
    }

    endGameEval(myScore, opponentScore, endGameWeight, color){
        let endGameEval = 0;
        if(myScore > opponentScore+200){
            let distanceToEdge = Math.max(3-color?this.whiteKing.x:this.blackKing.x, color?this.whiteKing.x:this.blackKing.x-4)
                + Math.max(3-color?this.whiteKing.y:this.blackKing.y, color?this.whiteKing.y:this.blackKing.y-4);
            // console.log(distanceToEdge);
            endGameEval += (distanceToEdge)*100;
            endGameEval += (14-(Math.abs(this.whiteKing.x-this.blackKing.x)+Math.abs(this.whiteKing.y-this.blackKing.y)))*40;
            // console.log(`color: ${color}, EndgameEval: ${endGameEval}`);
        }
        return Math.round(endGameEval*endGameWeight);
    }

    endGameWeight(material){
        const multiplier = 1/6200;
        return 1 - Math.min(multiplier*material,1);
    }

    squareTables(){
        this.whitePawnTable = [
            [0,  0,  0,  0,  0,  0,  0,  0],
            [50, 50, 50, 50, 50, 50, 50, 50],
            [10, 10, 20, 30, 30, 20, 10, 10],
            [5,  5, 10, 25, 25, 10,  5,  5],
            [0,  0,  0, 20, 20,  0,  0,  0],
            [5, -5,-10,  0,  0,-10, -5,  5],
            [5, 10, 10,-20,-20, 10, 10,  5],
            [0,  0,  0,  0,  0,  0,  0,  0]];
        this.blackPawnTable = this.whitePawnTable.slice().reverse().map(row => row.map(value => 1 * value));
        console.log(this.blackPawnTable)
        this.whiteKnightTable = [
            [-50,-40,-30,-30,-30,-30,-40,-50],
            [-40,-20,  0,  0,  0,  0,-20,-40],
            [-30,  0, 10, 15, 15, 10,  0,-30],
            [-30,  5, 15, 20, 20, 15,  5,-30],
            [-30,  0, 15, 20, 20, 15,  0,-30],
            [-30,  5, 10, 15, 15, 10,  5,-30],
            [-40,-20,  0,  5,  5,  0,-20,-40],
            [-50,-40,-30,-30,-30,-30,-40,-50]];
        this.blackKnightTable = this.whiteKnightTable.slice().reverse().map(row => row.map(value => 1 * value));
        console.log(this.blackKnightTable)
        this.whiteBishopTable = [
            [-20,-10,-10,-10,-10,-10,-10,-20],
            [-10,  0,  0,  0,  0,  0,  0,-10],
            [-10,  0,  5, 10, 10,  5,  0,-10],
            [-10,  5,  5, 10, 10,  5,  5,-10],
            [-10,  0, 10, 10, 10, 10,  0,-10],
            [-10, 10, 10, 10, 10, 10, 10,-10],
            [-10,  5,  0,  0,  0,  0,  5,-10],
            [-20,-10,-10,-10,-10,-10,-10,-20]];
        this.blackBishopTable = this.whiteBishopTable.slice().reverse().map(row => row.map(value => 1 * value));
        console.log(this.blackBishopTable)
        this.whiteRookTable = [
            [0,  0,  0,  0,  0,  0,  0,  0],
            [5, 10, 10, 10, 10, 10, 10,  5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [-5,  0,  0,  0,  0,  0,  0, -5],
            [0,  0,  0,  5,  5,  0,  0,  0]];
        this.blackRookTable = this.whiteRookTable.slice().reverse().map(row => row.map(value => 1 * value));
        console.log(this.blackRookTable)
        this.whiteQueenTable = [
            [-20,-10,-10, -5, -5,-10,-10,-20],
            [-10,  0,  0,  0,  0,  0,  0,-10],
            [-10,  0,  5,  5,  5,  5,  0,-10],
            [-5,  0,  5,  5,  5,  5,  0, -5],
            [0,  0,  5,  5,  5,  5,  0, -5],
            [-10,  5,  5,  5,  5,  5,  0,-10],
            [-10,  0,  5,  0,  0,  0,  0,-10],
            [-20,-10,-10, -5, -5,-10,-10,-20]];
        this.blackQueenTable = this.whiteQueenTable.slice().reverse().map(row => row.map(value => 1 * value));
        console.log(this.blackQueenTable)
        this.whiteKingTable = [
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-30,-40,-40,-50,-50,-40,-40,-30],
            [-20,-30,-30,-40,-40,-30,-30,-20],
            [-10,-20,-20,-20,-20,-20,-20,-10],
            [20, 20,  0,  0,  0,  0, 20, 20],
            [20, 30, 10,  0,  0, 10, 30, 20]];
        this.blackKingTable = this.whiteKingTable.slice().reverse().map(row => row.map(value => 1 * value));
        console.log(this.blackKingTable)
    }
}