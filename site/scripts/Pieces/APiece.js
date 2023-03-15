export {APiece}
/**
 * Abstract Class APIECE.
 *
 * @class Animal
 */
class APiece {

    constructor(pos,value,kleur) {
        this.value=value;
        this.taken=false;
        this.pos=pos;
        this.kleur=kleur;
        if (this.constructor == APiece) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    show() {
        throw new Error("Method 'show()' must be implemented.");
    }

    possibleMoves(bord) {
        throw new Error("Method 'possibleMoves()' must be implemented.");
    }

    move(bord){
        throw new Error("Method 'possibleMoves()' must be implemented.");
    }
}