import {APiece} from "./APiece.js";
import {Coordinate} from "../Coordinate.js";

export {Queen}
class Queen extends APiece{

    constructor(pos,kleur,imageLoad) {
        super(pos,kleur?900:-900,kleur,kleur?"w_queen":"b_queen",imageLoad);
    }


    possibleMoves(bord) { //Koningin
        let veld=bord.getPieces(); // 2D-array met alle pieces/nullen
        let possiblemoves=[]; // container voor alle speelbare moves
        // richtingen van de loper+Toren (X en +)
        let moves=[new Coordinate(1,-1), new Coordinate(1,1),
            new Coordinate(-1,1), new Coordinate(-1,-1),
            new Coordinate(0,1), new Coordinate(0,-1),
            new Coordinate(1,0), new Coordinate(-1,0)];
        this.pushMoves(possiblemoves,moves,veld);
        return possiblemoves;
    }


    clone(imageOnLoad) {

        return new Queen(new Coordinate(this.pos.x,this.pos.y),this.kleur,imageOnLoad);
    }
}