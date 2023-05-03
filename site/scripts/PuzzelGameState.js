import {GameState} from "./GameState.js";

export class PuzzelGameState extends GameState{

    constructor(canvas,lenght,colorA,colorB,colorC,colorD) {
        super(canvas,lenght,colorA,colorB,colorC,colorD);
        //fetchen

    }

    fetchNewPuzzels(){}

    closePopup(popup){
        //this.board.setupPieces(Fen);
        this.close(popup);
    }
}

