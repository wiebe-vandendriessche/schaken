
import {APiece} from "./APiece.js";
import {Coordinate} from "../Coordinate.js";

class Knight extends APiece{

    constructor(pos,kleur) {
        super(pos,kleur?30:-30,kleur,kleur?"w_knight":"b_knight");
    }


    move(bord) {
        super.move(bord);
    }

    possibleMoves(){
        let veld = bord.speelveld
        let possiblemoves=[];

        let moves=[new Coordinate(-1,2), new Coordinate(1,2), new Coordinate(-1,-2), new Coordinate(1,-2),new Coordinate(-2,-1), new Coordinate(-2,1), new Coordinate(2,-1), new Coordinate(2,1)]; // hulparray om forloop te kunnen uitvoeren
        let op_amount=moves.length;
        for (let i = 0; i < op_amount; i++) {
            let x=this.pos.x+moves[i].x;
            let y= this.pos.y+moves[i].y;
            if(x<=7 && x>=0 && y<=7 && y>=0){
                if(veld[x][y]!==0){
                    possiblemoves.push(new Coordinate(x,y));
                }else{
                    if(this.color!==veld[y][x].color){
                        possiblemoves.push(new Coordinate(x,y));
                    }
                }
            }

        }
        return possiblemoves;
    }


    move(bord) {
        super.move(bord);
    }
}
