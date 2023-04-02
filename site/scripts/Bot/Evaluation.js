import {Pawn} from "../Pieces/Pawn.js";
import {King} from "../Pieces/King.js";

export class Evaluation{
    static Evaluate(board){
        this.whitePawns = 0;
        this.blackPawns = 0;
        let whiteScore = 0;
        let blackScore = 0;

        let whiteMaterialCount = this.materialCount(board, true);
        let blackMaterialCount = this.materialCount(board, false);
        let whiteEndGameWeight = this.endGameWeight((whiteMaterialCount-(this.whitePawns*10)));
        let blackEndGameWeight = this.endGameWeight(-1*(blackMaterialCount-(this.blackPawns*10)));
        whiteScore += this.endGameEval(whiteScore, -1*blackMaterialCount,whiteEndGameWeight, false);
        // console.log(whiteEndGameWeight);
        blackScore -= this.endGameEval(-1*blackScore, whiteMaterialCount,blackEndGameWeight, true);
        whiteScore += whiteMaterialCount;
        blackScore += blackMaterialCount;
        let score = this.checkmate(board)+ whiteScore + blackScore;
        // console.log(score);
        return score;
    }

    static checkmate(board){
        let val = 0;
        if(board.legalchecker.isChecked(true) && board.isEnd(true) === "checkmate") {
            console.log("HONK");
            val += -10000;
        }
        if(board.legalchecker.isChecked(false) && board.isEnd(false) === "checkmate") {
            console.log("HOKN");
            val += 10000;
        }
        return val;
    }

    static materialCount(board, color){
        let speelveld = board.board;
        let values = 0;
        for(let y = 0; y < 8; y++){
            for(let x = 0; x < 8; x++) {
                let piece = speelveld[y][x];
                if(piece !== 0 && piece.kleur === color){
                    values += piece.value;
                    if(piece instanceof Pawn)
                        color?(this.whitePawns++):(this.blackPawns++);
                    if(piece instanceof King)
                        color?(this.whiteKing = piece.pos):(this.blackKing=piece.pos);
                }
            }
        }
        return values;
    }

    static endGameEval(myScore, opponentScore, endGameWeight, color){
        let endGameEval = 0;
        // console.log(myScore)
        // console.log(opponentScore)
        // console.log(endGameWeight)
        // console.log(color)
        if(endGameWeight > 0 && myScore < opponentScore){
            let distanceToEdge = Math.min(color?this.whiteKing.x:this.blackKing.x + color?this.whiteKing.y:this.blackKing.y
                ,7-(color?this.blackKing.x:this.whiteKing.x) + 7-(color?this.blackKing.y:this.whiteKing.y));
            console.log(distanceToEdge);
            endGameEval += (distanceToEdge)*10;
            endGameEval += (14-(Math.abs(this.whiteKing.x-this.blackKing.x)+Math.abs(this.whiteKing.y-this.blackKing.y)))*4
            // console.log("EndgameEval:",endGameEval);
        }
        return Math.round(endGameEval);
    }

    static endGameWeight(material){
        const multiplier = 1/180;
        // console.log(material)
        return 1 - Math.min(1, multiplier*material);
    }
}
