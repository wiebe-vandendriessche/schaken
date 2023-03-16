import {APiece} from "./APiece.js";
import {Coordinate} from "../Coordinate.js";
export  {Pawn};
class Pawn extends APiece {

    constructor(pos, kleur) {
        super(pos, kleur ? 10 : -10, kleur, kleur ? "w_pawn" : "b_pawn");
        this.moved = false;
    }


    move(cord) {
        this.pos=cord;
        this.moved=true;
    }

    possibleMoves(bord) {
        let veld = bord.getPieces();
        let possiblemoves = [];
        let x = this.pos.x;
        let y = this.pos.y;
        let factor = this.kleur ? -1 : 1
        console.log(veld[y]);
        console.log(y + 2 * factor);
        if (!this.moved && veld[y + 1 * factor][x] === 0 && veld[y + 2 * factor][x] === 0) {
            possiblemoves.push(new Coordinate(x, y + 1 * factor));
            possiblemoves.push(new Coordinate(x, y + 2 * factor));
        } else if (veld[y + 1 * factor][x] == 0) {
            possiblemoves.push(new Coordinate(x, y + 1 * factor))
        }
        if (x !== 7 && veld[y + factor * 1][x + 1] !== 0) {
            if (veld[y + factor * 1][x + 1].kleur !== this.kleur) {
                possiblemoves.push(new Coordinate(x + 1, y + factor * 1));
            }
        }
        if (x !== 0 && veld[y + factor * 1][x - 1] !== 0) {
            if (veld[y + factor * 1][x - 1].kleur !== this.kleur) {
                possiblemoves.push(new Coordinate(x - 1, y + factor * 1));
            }
        }
        return possiblemoves;
    }


}
