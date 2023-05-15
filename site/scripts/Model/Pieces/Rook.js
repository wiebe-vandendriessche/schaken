import {APiece} from "./APiece.js";
import {Coordinate} from "../Coordinate.js";

export class Rook extends APiece{

    constructor(pos,kleur,imageLoad) {
        super(pos,kleur?500:-500,kleur,kleur?"w_rook":"b_rook",imageLoad);
        this.moved=false;

    }


    possibleMoves(bord) {
        let veld=bord.getPieces(); // 2D-array van 64 blokjes met alle pieces erop en nullen waar niks staat
        let possiblemoves=[]; // container voor alle speelbare moves
        let moves=[new Coordinate(0,1), new Coordinate(0,-1), new Coordinate(1,0), new Coordinate(-1,0)]; // hulparray om forloop te kunnen uitvoeren
        this.pushMoves(possiblemoves,moves,veld);
        return possiblemoves;
    }

    move(cord) {
        super.move(cord)
        this.moved=true;
    }
    clone(imageOnLoad) {
        let rook=new Rook(new Coordinate(this.pos.x,this.pos.y),this.kleur,imageOnLoad);
        rook.moved=this.moved;
        return rook;
    }
}

