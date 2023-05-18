import {Coordinate} from "../Coordinate.js";

export {APiece}
/**
 * Abstract Class APIECE.
 *
 * @class Animal
 */
class APiece {

    constructor(pos,value,kleur,img,imageload) {
        this.value=value;
        this.type=img;// string w_king gelijk zetten aan type voor vereenvoudiging if structuur in Evaluation--> veel efficienter
        this.pos=pos;
        this.kleur=kleur;
        this.image=undefined;
        if (!(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) && imageload){ // kijken of we niet in de webworker zitten want deze kan geen images laden && imageload gewenst
            this.image=new Image();
            this.image.src="picture/"+img+"_png_128px.png";

        }

        /* te trage methode voor in algoritme bij cloning;
        if (this.constructor == APiece) {
            throw new Error("Abstract classes can't be instantiated.");
        }

         */
    }

    clone(imageOnLoad) {
        throw new Error("Method 'show()' must be implemented.");
    }

    possibleMoves(bord) {
        throw new Error("Method 'possibleMoves()' must be implemented.");
    }
    getType(){
        return this.type;
    }

    move(cord){
        this.pos = cord;
    }

    pushMoves(possiblemoves,moves,veld){
        for (let i = 0; i < moves.length; i++) {
            let x = this.pos.x;
            let y = this.pos.y;
            let blocked = false;
            while (!blocked) { //zolang
                x += moves[i].x;
                y += moves[i].y;
                //blijft het binnen het bord?
                if (x === -1 || y === -1 || y === 8 || x === 8) {
                    blocked = true;
                } else {
                    let move = new Coordinate(x, y)
                    if (veld[y][x] === 0) { //is het vak leeg
                        possiblemoves.push(move);
                    } else {
                        let apiece = veld[y][x];
                        // staat er een vijand
                        if (apiece.kleur !== this.kleur) {
                            possiblemoves.push(move);
                        }
                        blocked = true;
                    }
                }
            }
        }
    }

}