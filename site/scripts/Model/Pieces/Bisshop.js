
import {APiece} from "./APiece.js";
import {Coordinate} from "../Coordinate.js";


export class Bisshop extends APiece{

    constructor(pos,kleur,imageLoad) {
        super(pos,kleur?300:-300,kleur,kleur?"w_bishop":"b_bishop",imageLoad);
    }


    possibleMoves(bord) { //loper
        let veld=bord.getPieces(); // 2D-array met alle pieces/nullen
        let possiblemoves=[]; // container voor alle speelbare moves
        // alle beweegingsrichitngen ( bewegen als een kruis X)
        let moves=[new Coordinate(1,-1), new Coordinate(1,1),
            new Coordinate(-1,1), new Coordinate(-1,-1)];
        this.pushMoves(possiblemoves,moves,veld); // functie van Apiece
        return possiblemoves;
    }


    clone(imageOnLoad) {

        return new Bisshop(new Coordinate(this.pos.x,this.pos.y),this.kleur,imageOnLoad);
    }
}