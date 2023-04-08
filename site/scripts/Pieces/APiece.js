export {APiece}
/**
 * Abstract Class APIECE.
 *
 * @class Animal
 */
class APiece {

    constructor(pos,value,kleur,img,imageload) {
        this.value=value;
        this.taken=false;
        this.pos=pos;
        this.kleur=kleur;
        this.image=undefined;
        if (imageload){
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

    move(cord){
        this.pos = cord;
    }

    getPos(){
        return this.pos
    }
}