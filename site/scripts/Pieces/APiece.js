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


        if (this.constructor == APiece) {
            throw new Error("Abstract classes can't be instantiated.");
        }
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


}