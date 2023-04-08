


export class Evaluation{


    static Evaluate(board, color){
        let totalValue = 0;
        totalValue += this.materialCount(board);
        totalValue += this.checkmate(board, color);
        return totalValue;
    }

    static checkmate(board, color){
        if(board.legalchecker.isChecked(true) &&  board.isEnd(true).localeCompare("checkmate") === 0) {

            return -5000;
        }
        else if(board.legalchecker.isChecked(false) && board.isEnd(false).localeCompare("checkmate") === 0) {
            
            return 5000;
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