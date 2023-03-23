import {APiece} from "./APiece.js";
import {Coordinate} from "../Coordinate.js";

export class Knight extends APiece{

    constructor(pos,kleur) {
        super(pos,kleur?30:-30,kleur,kleur?"w_knight":"b_knight");
    }

    possibleMoves(bord){//zit nog een foutje in
        let veld = bord.getPieces();
        let possiblemoves=[];
        //mogelijke zetten
        let moves=[new Coordinate(-1,2), new Coordinate(1,2), new Coordinate(-1,-2), new Coordinate(1,-2),new Coordinate(-2,-1), new Coordinate(-2,1), new Coordinate(2,-1), new Coordinate(2,1)]; // hulparray om forloop te kunnen uitvoeren
        let op_amount=moves.length;
        for (let i = 0; i < op_amount; i++) {
            let x=this.pos.x+moves[i].x;
            let y= this.pos.y+moves[i].y;
            //console.log("checking move ",x,y)
            if(x<=7 && x>=0 && y<=7 && y>=0){//check buiten bord
                let piece=veld[y][x];
                if(piece===0){
                    possiblemoves.push(new Coordinate(x,y));
                }else{
                    //alert(this.kleur+"   "+piece.kleur);
                    if(this.kleur!==piece.kleur){
                        possiblemoves.push(new Coordinate(x,y));
                    }
                }
            }
        }
        return possiblemoves;
    }


    move(cord) {
        this.pos = cord;
    }
    clone() {

        return new Knight(new Coordinate(this.pos.x,this.pos.y),this.kleur);
    }
}
