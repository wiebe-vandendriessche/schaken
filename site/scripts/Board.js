import {APiece} from "./Pieces/APiece.js";
import {Bisshop} from "./Pieces/Bisshop.js";
import {King} from "./Pieces/King.js";
import {Knight} from "./Pieces/Knight.js";
import {Pawn} from "./Pieces/Pawn.js";
import {Queen} from "./Pieces/Queen.js";
import {Rook} from "./Pieces/Rook.js";
import {Coordinate} from "./Coordinate.js";
import {MoveCacher} from "./MoveCacher.js";


export {Board};

class Board {
    static PlayedMoves = new MoveCacher();

    constructor(setup) {
        this.board = [[], [], [], [], [], [], [], []];
        this.whiteking;
        this.blackking;
        if (setup){this.setupPieces();}
        this.amountOfMoves=0;
        this.attackMapWhite=[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
        this.attackMapBlack=[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
    }


    setupPieces() {
        for (let i = 0; i < 8; i++) {
            this.board[1][i] = new Pawn(new Coordinate(i, 1), false);
            this.board[6][i] = new Pawn(new Coordinate(i, 6), true);
        }

        this.whiteking=this.board[7][4] = new King(new Coordinate(4, 7), true);
        this.board[7][3] = new Queen(new Coordinate(3,7), true);
        this.board[7][2] = new Bisshop(new Coordinate(2, 7), true);
        this.board[7][5] = new Bisshop(new Coordinate(5, 7), true);
        this.board[7][1] = new Knight(new Coordinate(1, 7), true);
        this.board[7][0] = new Rook(new Coordinate(0,7), true);
        this.board[7][6] = new Knight(new Coordinate(6, 7), true);
        this.board[7][7] = new Rook(new Coordinate(7, 7), true);

        this.blackking=this.board[0][4] = new King(new Coordinate(4, 0), false);
        this.board[0][3] = new Queen(new Coordinate(3, 0), false);
        this.board[0][2] = new Bisshop(new Coordinate(2, 0), false);
        this.board[0][5] = new Bisshop(new Coordinate(5, 0), false);
        this.board[0][1] = new Knight(new Coordinate(1, 0), false);
        this.board[0][0] = new Rook(new Coordinate(0, 0), false);
        this.board[0][6] = new Knight(new Coordinate(6, 0), false);
        this.board[0][7] = new Rook(new Coordinate(7, 0), false);

        for(let i = 2; i < 6; i++){
            for(let j = 0; j < 8; j++){
                this.board[i][j] = 0;
            }
        }
    }
    possible_moves(cord) {
        let piece = this.board[cord.y][cord.x];
        return piece.possibleMoves(this);
    }

    getPieces() {
        return this.board;
    }

    moveWithCheck(piece,cord){
        let virtualbord= this.clone();
        let virtualpiece=virtualbord.board[piece.pos.y][piece.pos.x];
        if(virtualbord.move(virtualpiece,cord)){
            Board.PlayedMoves.undoVirtualMoves(this);//omdat Board.played moves static is moet eerst alle mogelijke zetten die gedaan zijn op een virtueel bord ongedaan gemaakt worden
            if (virtualbord.isChecked(piece.kleur)){
                return false;
            }else {
                this.move(piece,cord);
                console.log(Board.PlayedMoves);
                this.amountOfMoves++;
                Board.PlayedMoves.Moveadd(cord,this.amountOfMoves,this);
                return true;
            }
        }else {
            return false;
        }
    }

    move(piece,cord){
        let possible_moves = piece.possibleMoves(this);
        let good = false;
        let counter = 0;
        while(!good && counter < possible_moves.length){
            if(JSON.stringify(possible_moves[counter++]) === JSON.stringify(cord))
                good = true;
        }
        if(!good)
            return false;
        this.board[piece.pos.y][piece.pos.x] = 0;
        this.board[cord.y][cord.x] = piece;

        piece.move(cord);
        if(piece instanceof Pawn && piece.pos.y===piece.endY){
            this.board[piece.pos.y][piece.pos.x]=new Queen(piece.pos,piece.kleur);
        }
        return true;
    }


    colorToMove(){
        return this.amountOfMoves%2===0;
    }

    updateAttackMap(color){
        if(color){
            this.attackMapWhite=[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
        }else{
            this.attackMapBlack=[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
        }
        let attackmap= color? this.attackMapWhite:this.attackMapBlack;
        //dit kan wss in de if hierboven gebeuren
        for (let y = 0; y <8 ; y++) {
            for (let x = 0; x <8; x++) {
                let piece=this.board[y][x];
                if (piece!==0 && piece.kleur===color){
                    let posmoves;
                    if(piece instanceof Pawn){
                        posmoves=piece.attackMoves(this);
                    }else{
                        posmoves=piece.possibleMoves(this);
                    }

                    for (let move of posmoves){
                        attackmap[move.y][move.x]++;
                    }
                }
            }
        }

        return attackmap;
    }
    showMoves() {

    }

    isChecked(color) {

        let attackmap=this.updateAttackMap(!color);
        let king= color? this.whiteking: this.blackking;
        //console.log(king);
        if (attackmap[king.pos.y][king.pos.x]!==0){
            //console.log("KING CHECKED");
            return true;
        }else{

            return false;
        }
    }
    clone(){
        let newboard= new Board(false);
        newboard.amountOfMoves=this.amountOfMoves;
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                let piece=this.board[y][x];
                if (piece!==0){
                    let virtpiece=this.board[y][x].clone();
                    newboard.board[y][x]=virtpiece;
                    if (piece instanceof King){
                        if (piece.kleur){
                            newboard.whiteking=virtpiece;
                        }else{
                            newboard.blackking=virtpiece;
                        }
                    }
                }else{
                    newboard.board[y][x]=0;
                }
            }
        }
        return newboard;

    }

    PrieviesPosition(){

        return Board.PlayedMoves.ReturnToPreviousMoves()
    }

    getAlleMovesPlayedInGame(){
        return Board.PlayedMoves.GetMoves();
    }

    canMove() {

    }
}