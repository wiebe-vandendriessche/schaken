


export class Evaluation{


    static Evaluate(board, color){
        let totalValue = 0;
        totalValue += this.materialCount(board);
        totalValue += this.checkmate(board, color);
        return totalValue;
    }

    static checkmate(board, color){
        if(color && board.legalchecker.isChecked(color) && board.isEnd(color) === "checkmate") {
            console.log("HONK");
            return -2000;
        }
        if(!color && board.legalchecker.isChecked(!color) && board.isEnd(!color).localeCompare("checkmate") === 0) {
            console.log("HOKN");
            return 2000;
        }
        else
            return 0;
    }

    static materialCount(board){
        let speelveld = board.board;
        let values = 0;
        for(let y = 0; y < 8; y++){
            for(let x = 0; x < 8; x++) {
                let piece = speelveld[y][x];
                if(piece !== 0){
                    values += piece.value;
                }
            }
        }
        return values;
    }
}