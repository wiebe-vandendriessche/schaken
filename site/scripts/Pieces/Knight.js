import {APiece} from "./APiece";

class Knight extends APiece{
    show() {
        super.show();
    }

    possibleMoves(bord) {
        let veld = bord.speelveld
        let possiblemoves=[];

        let moves=[new Coordinate(-1,2), new Coordinate(1,2), new Coordinate(-1,-2), new Coordinate(1,-2),new Coordinate(-2,-1), new Coordinate(-2,1), new Coordinate(2,-1), new Coordinate(2,1)]; // hulparray om forloop te kunnen uitvoeren
        let op_amount=moves.length;
        for (let i = 0; i < op_amount; i++) {
            let x=this.pos.x+moves[i].x;
            let y= this.pos.y+moves[i].y;
            if(veld[x][y]!==0){
                possiblemoves.push(new Coordinate(x,y));
            }else{
                if(this.color!==veld[y][x].color){
                    possiblemoves.push(new Coordinate(x,y));
                }
            }
        }
        return possiblemoves;
    }


    move(bord) {
        super.move(bord);
    }
}