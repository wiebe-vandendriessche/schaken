


export class Evaluation{


    static Evaluate(board){
        let totalValue = 0;
        totalValue += this.materialCount(board);

        return totalValue;
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