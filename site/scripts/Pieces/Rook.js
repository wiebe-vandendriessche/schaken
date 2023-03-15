import {APiece} from "./APiece.js";
import {Coordinate} from "../Coordinate.js";

class Rook extends APiece{

    show() {
        super.show();
    }

    possibleMoves(bord) {
        bord.speelveld
        let possiblemoves=[];
        let x=this.pos.x; let y= this.pos.y;
        let notblocked=true;
        for (let i = 0; i < 4; i++) {
            while (notblocked){
                
            }
        }


    }

    move(bord) {
        super.move(bord);
    }
}