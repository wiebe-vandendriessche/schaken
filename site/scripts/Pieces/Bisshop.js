
import {APiece} from "./APiece.js";
import {Coordinate} from "../Coordinate.js";
import {pushMoves} from "./Rook.js";

export class Bisshop extends APiece{

    constructor(pos,kleur,imageLoad) {
        super(pos,kleur?300:-300,kleur,kleur?"w_bishop":"b_bishop",imageLoad);
    }


    possibleMoves(bord) {
        let veld=bord.getPieces(); // 2D-array van 64 blokjes met alle pieces erop en nullen waar niks staat
        let possiblemoves=[]; // container voor alle speelbare moves
        let moves=[new Coordinate(1,-1), new Coordinate(1,1), new Coordinate(-1,1), new Coordinate(-1,-1)]; // hulparray om forloop te kunnen uitvoeren
        pushMoves(possiblemoves,moves,this,veld); // imported function
        return possiblemoves;
    }


    clone(imageOnLoad) {

        return new Bisshop(new Coordinate(this.pos.x,this.pos.y),this.kleur,imageOnLoad);
    }
}