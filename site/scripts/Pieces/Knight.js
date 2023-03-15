import {APiece} from "./APiece.js";
import {Coordinate} from "../Coordinate.js";

class Rook extends APiece{

    constructor(pos,kleur) {
        super(pos,kleur?30:-30,kleur,kleur?"w_knight":"b_knight");
    }
    show() {
        super.show();
    }

    possibleMoves(bord) {

    }

    move(bord) {
        super.move(bord);
    }
}
