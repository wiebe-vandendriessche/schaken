import {Board} from "./Board.js";
import {Pawn} from "./Pieces/Pawn.js";
import {King} from "./Pieces/King.js";

export class LegalChecker{
    constructor(Board){
        this.Board=Board;
        this.whiteking=Board.board[7][4];
        this.blackking=Board.board[0][4];
        this.possiblemoves=null;
        this.attackMapWhite=[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
        this.attackMapBlack=[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
    }
    updateAttackMap(color){
        if(color){
            this.attackMapWhite=[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
        }else{
            this.attackMapBlack=[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
        }
        let attackmap= color? this.attackMapWhite:this.attackMapBlack;

        for (let y = 0; y <8 ; y++) {
            for (let x = 0; x <8; x++) {
                let piece=this.Board.board[y][x];
                if (piece!==0 && piece.kleur===color){
                    let posmoves;
                    if(piece instanceof Pawn){
                        posmoves=piece.attackMoves(this.Board);
                    }else{
                        posmoves=piece.possibleMoves(this.Board);
                    }

                    for (let move of posmoves){
                        attackmap[move.y][move.x]++;
                    }
                }
            }
        }
        return attackmap;
    }

    isChecked(color) {

        let attackmap=this.updateAttackMap(!color);
        let king= color? this.whiteking: this.blackking;
        if (attackmap[king.pos.y][king.pos.x]!==0){

            return true;
        }else{

            return false;
        }
    }

    possibleMoves(piece,isCached){
        if(isCached){
            return this.possiblemoves;
        }else{
            let pseudolegalmoves=piece.possibleMoves(this.Board);
            let realmoves=[];
            for (let coord of pseudolegalmoves){
                let cloneBoard=this.Board.clone(false);
                let virtpiece= cloneBoard.board[piece.pos.y][piece.pos.x];
                cloneBoard.move(virtpiece,coord,pseudolegalmoves);
                if (!cloneBoard.legalchecker.isChecked(piece.kleur)){
                    realmoves.push(coord);
                }

            }
            this.possiblemoves=realmoves;

            return realmoves;
        }
    }

    clone(Boardvirtual){
        let lchecker= new LegalChecker(Boardvirtual);
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                let piece= Boardvirtual.board[y][x];
                if (piece!==0 && ( piece instanceof King)){
                    if (piece.kleur===true){
                        lchecker.whiteking=piece;
                    }else{
                        lchecker.blackking=piece;
                    }

                }
            }

        }
        return lchecker;
    }
    
    isEnd(color){

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                let piece = this.Board.board[y][x];
                if (piece!==0 && piece.kleur===color) {
                    if(this.possibleMoves(piece, false).length!==0){
                        return 0;
                    }
                }
            }
        }
        if (this.isChecked(color)){
            return 1;
        }else {
            return  2;
        }
    }



}