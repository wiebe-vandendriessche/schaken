import {APiece} from "./APiece.js";
import {Coordinate} from "../Coordinate.js";
import {pushMoves} from "./Rook.js";

class Queen extends APiece{

    constructor(pos,kleur) {
        super(pos,kleur?90:-90,kleur,kleur?"w_queen":"b_queen");
    }
    show() {
        super.show();
    }

    possibleMoves(bord) {
        let veld=bord.speelveld; // 2D-array van 64 blokjes met alle pieces erop en nullen waar niks staat
        let possiblemoves=[]; // container voor alle speelbare moves
        let moves=[new Coordinate(1,-1), new Coordinate(1,1), new Coordinate(-1,1), new Coordinate(-1,-1)]; // moves van de bisschop
        pushMoves(possiblemoves,moves,this,veld); // imported function
        moves=[new Coordinate(0,1), new Coordinate(0,-1), new Coordinate(1,0), new Coordinate(-1,0)];// mmoves van de rook
        pushMoves(possiblemoves,moves,this,veld);
        return possiblemoves;
    }

    move(bord) {
        super.move(bord);
    }
}