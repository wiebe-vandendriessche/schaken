import {APiece} from "./APiece.js";
import {Coordinate} from "../Coordinate.js";
export  {Pawn};
class Pawn extends APiece {

    constructor(pos, kleur,imageLoad) {
        super(pos, kleur ? 100 : -100, kleur, kleur ? "w_pawn" : "b_pawn",imageLoad);
        this.moved = false;
        this.endY=kleur?0:7;

    }



    move(cord) {
        super.move(cord);
        this.moved=true;
    }

    possibleMoves(bord) {
        let veld = bord.getPieces(); //vraag de 2D-array van pieces
        let possiblemoves = [];
        let x = this.pos.x;
        let y = this.pos.y;

        let factor = this.kleur ? -1 : 1 // gaat het naar onder of naar boven

        if (!this.moved && veld[y + 1 * factor][x] === 0 && veld[y + 2 * factor][x] === 0) {
            possiblemoves.push(new Coordinate(x, y + 1 * factor));
            possiblemoves.push(new Coordinate(x, y + 2 * factor));
        } else if (veld[y + 1 * factor][x] === 0) {
            possiblemoves.push(new Coordinate(x, y + 1 * factor))
        }
        //!!! is duplicate code mare is veel efficienter dan nu attackmoves() oproepen (4 seconden verschil op diepte 4) !!!!
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
    attackMoves(board) { //wordt niet gebruikt in possiblemoves wegens efficientie is wel nodig voor functionaliteit om attackmaps te maken
        let veld = board.getPieces();
        let possiblemoves = [];
        let x = this.pos.x;
        let y = this.pos.y;
        let factor = this.kleur ? -1 : 1;
        let piece;
        //staat er een vijand diagonaal
        //rechtsvoor (bij een uiterst linkse pion kan dit niet)
        if (x !== 7 ) {
            piece=veld[y + factor * 1][x + 1];
            if (piece===0||piece.kleur !== this.kleur) {
                possiblemoves.push(new Coordinate(x + 1, y + factor * 1));
            }
        }
        //linksvoor (bij een uiterst rechtse pion kan dit niet)
        if (x !== 0 ) {
            piece=veld[y + factor * 1][x - 1];
            if (piece===0||piece.kleur !== this.kleur) {
                possiblemoves.push(new Coordinate(x - 1, y + factor * 1));
            }
        }

        return possiblemoves;
    }

    clone(imageOnLoad) {
        let pawn=new Pawn(new Coordinate(this.pos.x,this.pos.y),this.kleur,imageOnLoad);
        pawn.moved=this.moved;
        return pawn;
    }
}
