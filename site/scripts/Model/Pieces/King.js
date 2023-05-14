import {APiece} from "./APiece.js";
import {Coordinate} from "../Coordinate.js";
import {Bisshop} from "./Bisshop.js"
import {Rook} from "./Rook.js"
import {Knight} from "./Knight.js";
export {King};
class King extends APiece{

    constructor(pos,kleur,imageLoad) {
        super(pos,kleur?5000:-5000,kleur,kleur?"w_king":"b_king",imageLoad);
        this.moved=false;
    }

    // moet dit er wel staan als we deze kunnen invullen in de boven klasse
    move(bord) {
        this.moved=true;
        super.move(bord);
    }
    attackMoves(bord){
        let veld = bord.getPieces();
        let possiblemoves=[];
        //mogelijke zetten
        let moves=[new Coordinate(-1,-1), new Coordinate(-1,0), new Coordinate(-1,1), new Coordinate(0,1),new Coordinate(0,-1), new Coordinate(1,-1), new Coordinate(1,0), new Coordinate(1,1)]; // hulparray om forloop te kunnen uitvoeren
        let op_amount=moves.length;
        for (let i = 0; i < op_amount; i++) {
            let x=this.pos.x+moves[i].x;
            let y= this.pos.y+moves[i].y;
            if(x<=7 && x>=0 && y<=7 && y>=0){//check buiten bord
                let piece=veld[y][x];
                if(piece!==0){
                    if(this.kleur!==veld[y][x].kleur){

                        possiblemoves.push(new Coordinate(x,y));
                    }
                }else{
                    possiblemoves.push(new Coordinate(x,y))
                }
            }
        }
        return possiblemoves;
    }
    possibleMoves(bord){
        let possiblemoves=this.attackMoves(bord);
        if (!this.moved){
            let string=bord.legalchecker.castlingPossible(this.kleur);
            if (string.includes("right")){
                possiblemoves.push(new Coordinate(6,this.pos.y))
            }
            if (string.includes("left")){
                possiblemoves.push(new Coordinate(2,this.pos.y))
            }
        }
        return possiblemoves;
    }




    move(cord) {
        super.move(cord);
        this.moved=true;
    }
    clone(imageOnLoad) {
        let king=new King(new Coordinate(this.pos.x,this.pos.y),
                                            this.kleur,imageOnLoad);
        king.moved=this.moved;
        return king;
    }
}