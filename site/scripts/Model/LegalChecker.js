import {Board} from "./Board.js";
import {Pawn} from "./Pieces/Pawn.js";
import {King} from "./Pieces/King.js";
import {Rook} from "./Pieces/Rook.js";

export class LegalChecker{
    constructor(Board){
        this.Board=Board;
        this.whiteking=Board.board[7][4];
        this.blackking=Board.board[0][4];
        this.possiblemoves=null; //caching operations

        this.attackMapWhite=[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
        this.attackMapBlack=[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
    }




    castlingPossible(color){ // king checked zelf al of hij zelf niet gemoved heeft
        let speelveld=this.Board.getPieces();
        let attackmap=this.updateAttackMap(!color);
        let y_axis=color?7:0;// om te weten op welke y as de lege plekken moeten worden gechecked
        if (attackmap[y_axis][4]>0) {//als koning schaak staat sws niks returnen
            return "";
        }
        let rookleft =speelveld[y_axis][0];
        let rookright=speelveld[y_axis][7];
        let string=""; //
        if (rookleft!==0 && rookleft.getType().endsWith("rook") && rookleft.moved===false){
            let all_empty=true;//al plaatsen leeg
            for (let i = 1; i < 4; i++) {
                //kijken of geen stukken
                if(speelveld[y_axis][i]!==0 || attackmap[y_axis][i]>0 ){
                    all_empty=false;
                }
            }
            if (all_empty){
                string+="left";
            }
        }
        if (rookright!==0 && rookright.getType().endsWith("rook") && rookright.moved===false){
            let all_empty=true;//al plaatsen leeg
            for (let i = 5; i < 7; i++) {
                if(speelveld[y_axis][i]!==0 || attackmap[y_axis][i]>0 ){
                    all_empty=false;
                }
            }
            if (all_empty){
                string+="right";
            }
        }
        return string;
    }



    updateAttackMap(color){
        let speelveld=this.Board.getPieces();
        if(color){
            this.attackMapWhite=[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
        }else{
            this.attackMapBlack=[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
        }
        let attackmap= color? this.attackMapWhite:this.attackMapBlack;

        for (let y = 0; y <8 ; y++) {
            for (let x = 0; x <8; x++) {
                let piece=speelveld[y][x];
                if (piece!==0 && piece.kleur===color){
                    let posmoves;
                    if((piece.getType().endsWith("pawn"))||(piece.getType().endsWith("king"))){
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
                let virtpiece= cloneBoard.getPieces()[piece.pos.y][piece.pos.x];
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
        let speelveld=Boardvirtual.getPieces();
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                let piece= speelveld[y][x];
                if (piece!==0 && ( piece.getType().endsWith("king"))){
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
        let speelveld=this.Board.getPieces();
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                let piece = speelveld[y][x];
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