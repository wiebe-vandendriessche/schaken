import {APiece} from "./APiece.js";
import {Coordinate} from "../Coordinate.js";
import {Bisshop} from "./Bisshop.js"
import {Rook} from "./Rook.js"
import {Knight} from "./Knight.js";
export {King};
class King extends APiece{

    constructor(pos,kleur) {
        super(pos,kleur?30:-30,kleur,kleur?"w_king":"b_king");
    }

    // moet dit er wel staan als we deze kunnen invullen in de boven klasse
    move(bord) {
        super.move(bord);
    }

    possibleMoves(bord){
        let veld = bord.getPieces();
        let possiblemoves=[];
        //mogelijke zetten
        let moves=[new Coordinate(-1,-1), new Coordinate(-1,0), new Coordinate(-1,1), new Coordinate(0,1),new Coordinate(0,-1), new Coordinate(1,-1), new Coordinate(1,0), new Coordinate(1,1)]; // hulparray om forloop te kunnen uitvoeren
        let op_amount=moves.length;
        for (let i = 0; i < op_amount; i++) {
            let x=this.pos.x+moves[i].x;
            let y= this.pos.y+moves[i].y;
            if(x<=7 && x>=0 && y<=7 && y>=0){//chek buiten bord
                if(veld[y][x]!==0){
                    if(this.color!==veld[y][x].color){
                        possiblemoves.push(new Coordinate(x,y));
                    }
                }
            }
        }
        return possiblemoves;
    }

    is_cheked(bord){
        let possiblemoves=[];
        let moves=[new Coordinate(1,-1), new Coordinate(1,1), new Coordinate(-1,1), new Coordinate(-1,-1), new Coordinate(0,1), new Coordinate(0,-1), new Coordinate(1,0), new Coordinate(-1,0)]; // moves van de bisschop
        let len = moves.length;
        let checked=false;
        let x=0;
        let y=0;
        for(let i= 0; i < len;i++){
            let blocked=true;
            while(blocked && !checked) {
                x += this.x + moves[i].x;
                y += this.y + moves[i].y;
                let piece = bord[y][x];
                if (x===-1 || y===-1 || y===8 || x==8){ //out of field check
                    blocked=true;
                }else if (piece !== 0) {
                    if (piece.color !== this.color) {
                        if(i<=3 && piece instanceof Bisshop){
                            checked=true;
                        }else if(piece instanceof Rook){
                            checked=true;
                        }
                    }
                    blocked = true;
                }
            }
        }
        moves=[new Coordinate(-1,2), new Coordinate(1,2), new Coordinate(-1,-2), new Coordinate(1,-2),new Coordinate(-2,-1), new Coordinate(-2,1), new Coordinate(2,-1), new Coordinate(2,1)]; // hulparray om forloop te kunnen uitvoeren
        let op_amount=moves.length;
        if(!checked){
            for (let i = 0; i < op_amount; i++) {
                let x=this.pos.x+moves[i].x;
                let y= this.pos.y+moves[i].y;
                if(x<=7 && x>=0 && y<=7 && y>=0){//chek buiten bord
                    let piece=veld[y][x];
                    if(piece===0){
                        possiblemoves.push(new Coordinate(x,y));
                    }else{
                        if(this.color!==piece.color && piece instanceof Knight){
                            checked=true;
                        }
                    }
                }
            }
        }

        return checked;
    }


    move(bord) {
        super.move(bord);
    }
}