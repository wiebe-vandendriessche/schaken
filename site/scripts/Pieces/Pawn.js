import {APiece} from "./APiece.js";
import {Coordinate} from "../Coordinate.js";
import {pushMoves} from "./Rook.js";
export  {Pawn};
class Pawn extends APiece{

    constructor(pos,kleur) {
        super(pos,kleur?10:-10,kleur,kleur?"w_pawn":"b_pawn");
        this.moved=false;
    }


    move(bord) {
        super.move(bord);
    }

    possibleMoves(){
        let veld = bord.speelveld
        let possiblemoves=[];
        let x=this.pos.x;let y= this.pos.y;
        let factor = kleur?-1:1;
        if(!moved && veld[y+1*factor][x]==null && veld[y+2*factor][x]==null){
            possiblemoves.push(new Coordinate(x,y+1*factor));
            possiblemoves.push(new Coordinate(x,y+2*factor));
        }else if (veld[y+1*factor][x]==null){
            possiblemoves.push(new Coordinate(x,y+1*factor))
        }
        if (x!=7 && veld[y+factor*1][x+1]!=null ){
            if (veld[y+factor*1][x+1].kleur!==this.kleur){
                pushMoves(new Coordinate(x+1,y+factor*1));
            }
        }
        if (x!=0 && veld[y+factor*1][x-1]!=null ){
            if (veld[y+factor*1][x-1].kleur!==this.kleur){
                pushMoves(new Coordinate(x-1,y+factor*1));
            }
        }
        return possiblemoves;
    }


    move(bord) {
        super.move(bord);
    }
}