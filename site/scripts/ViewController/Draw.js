
export class Draw{

    constructor(canvas,colorA,colorB,colorC,colorD,offsetPiece=5) {
        this.canvas = canvas;
        this.ctx=canvas.getContext("2d");
        this.canvasElement = canvas.parentElement;

        this.squareSize=0;

        this.colorA=colorA;
        this.colorB=colorB;
        this.colorC=colorC;
        this.colorD=colorD;

        this.offsetPiece=offsetPiece;

    }

    drawSquare(i,j,colorA,colorB){
        this.ctx.beginPath();

        if ((i + j) % 2 === 0) {
            this.ctx.fillStyle = colorA;
        } else {
            this.ctx.fillStyle = colorB;
        }

        this.ctx.fillRect(this.squareSize * i, this.squareSize * j, this.squareSize, this.squareSize);
        this.ctx.stroke();
    }

    drawGameboard(board){
        this.drawBoard();
        this.drawPieces(board.getPieces());
    }

    drawBoard() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.drawSquare(i,j,this.colorA,this.colorB);
            }
        }
    }

    drawPieces(listPieces){
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if(listPieces[i][j]!==0){//checken of het vak niet leeg is want dan tekenen van een piece
                    let piece= listPieces[i][j];
                    let img=piece.image;
                    img.onload= () => {
                        this.ctx.drawImage(img,this.squareSize*j+this.offsetPiece,this.squareSize*i+this.offsetPiece,this.squareSize-2*this.offsetPiece,this.squareSize-2*this.offsetPiece);
                    };
                    this.ctx.drawImage(img,this.squareSize*j+this.offsetPiece,this.squareSize*i+this.offsetPiece,this.squareSize-2*this.offsetPiece,this.squareSize-2*this.offsetPiece);//Volgende keren geen onload event meer
                }
            }
        }
    }

    drawPossible(cords){
        for(let i=0;i<cords.length;i++){
            this.drawSquare(cords[i].x,cords[i].y,this.colorC,this.colorD);
        }
    }

    rescale(board){
        let length = this.canvasElement.offsetWidth
        this.squareSize = length/8;
        this.canvas.width = length;
        this.canvas.height = length;

        this.drawGameboard(board);
    }
}