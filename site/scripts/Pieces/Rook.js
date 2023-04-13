import {APiece} from "./APiece.js";
import {Coordinate} from "../Coordinate.js";
export {pushMoves};
export class Rook extends APiece{

    constructor(pos,kleur,imageLoad) {
        super(pos,kleur?500:-500,kleur,kleur?"w_rook":"b_rook",imageLoad);
    }
    show() {
        super.show();
    }

    possibleMoves(bord) {
        let veld=bord.getPieces(); // 2D-array van 64 blokjes met alle pieces erop en nullen waar niks staat
        let possiblemoves=[]; // container voor alle speelbare moves
        let moves=[new Coordinate(0,1), new Coordinate(0,-1), new Coordinate(1,0), new Coordinate(-1,0)]; // hulparray om forloop te kunnen uitvoeren
        pushMoves(possiblemoves,moves,this,veld);
        return possiblemoves;
    }

    move(cord) {
        this.pos = cord;
    }
    clone(imageOnLoad) {

        return new Rook(new Coordinate(this.pos.x,this.pos.y),this.kleur,imageOnLoad);
    }
}

function pushMoves(possiblemoves,moves,piece,veld){
    for (let i = 0; i < 4; i++) {
        let x=piece.pos.x; let y= piece.pos.y;
        let blocked=false;
        while (!blocked){
            x+=moves[i].x;
            y+=moves[i].y;
            if (x===-1 || y===-1 || y===8 || x==8){ //out of field check
                blocked=true;
            }else{
                let move= new Coordinate(x,y)
                if(veld[y][x]===0){ // checks if no piece on square
                    possiblemoves.push(move);
                }else{
                    let apiece=veld[y][x];
                    if (apiece.kleur!==piece.kleur){ // checks if piece is enemy
                        possiblemoves.push(move); // this is a possible move
                        blocked=true;
                    }else{
                        blocked=true;
                    }
                }
            }
        }
    }

}