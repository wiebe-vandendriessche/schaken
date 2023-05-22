import {Rook} from "./Pieces/Rook.js";
import {Coordinate} from "./Coordinate.js";
import {Knight} from "./Pieces/Knight.js";
import {Pawn} from "./Pieces/Pawn.js";
import {Bisshop} from "./Pieces/Bisshop.js";
import {Queen} from "./Pieces/Queen.js";
import {King} from "./Pieces/King.js";

export class FenConvertor{

    static setupPieces(board,FEN){//krijgt een string van de vorm rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1 zie https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation voor meer uitleg over FEN
        let Information=FEN.split(" ");
        let boardFEN=Information[0]
        let y = 0;
        let x = 0;
        let castlestring=Information[2];

        for(let i=0;i<boardFEN.length;i++){
            let letterFen=boardFEN[i];
            if (letterFen==="/"){
                x=0;
                y+=1;
            }else if(isNaN(letterFen)){
                board.board[y][x]=this.createPiece(letterFen,x,y,castlestring);
                x+=1;
            }else {
                let cijferFen=parseInt(letterFen);
                for(let i=0;i<cijferFen;i++){
                    board.board[y][x+i]=0;
                }
                x+=cijferFen;
            }
        }
        let halveMove=0;
        if(Information[1]==="b"){
            halveMove+=1;
        }
        board.amountOfMoves=(parseInt(Information[5])-1)*2 + halveMove;
    }
    static boardToFen(board){
        let Fen;
        let castelstring="";
        let witheKingMove=false;
        let BlackKingMove=false;
        for(let i=0;i<8;i++){
            let count=0;

            for(let j=0;j<8;j++){
                let piece=board.board[i][j];
                if(piece===0){
                    count++;
                }else{
                    let firstletter=piece.constructor.name[0];
                    if(firstletter==="R" || firstletter==="r"){
                        if(!piece.moved){
                            if(piece.pos.x===7){
                                castelstring+=piece.kleur?"q":"Q"
                            }else{
                                castelstring+=piece.kleur?"k":"K"
                            }

                        }
                    }
                    if(firstletter==="K" || firstletter==="k"){
                        if(piece.kleur && piece.moved){
                            witheKingMove=true;
                        }else if(piece.moved){//je moet niet meer cheken op kleur wat je weet al dat het niet wit is
                            BlackKingMove=true;
                        }
                    }
                    if(!piece.kleur){
                        firstletter=firstletter.toLowerCase()
                    }
                    if(count!==0){
                        Fen+=`${count}${firstletter}`
                        count=0;
                    }else{
                        Fen+=`${firstletter}`
                    }
                }
                if(j===7 && count!==0){
                    Fen+=`${count}`
                }
            }
            if(i<7){
                Fen+="/";
            }

        }
        if(witheKingMove){
            castelstring=castelstring.replace("K","");
            castelstring=castelstring.replace("Q","");
        }
        if(BlackKingMove){
            castelstring=castelstring.replace("k","");
            castelstring=castelstring.replace("q","");
        }

        Fen +=board.amountOfMoves%2!==0?" b ":" w "
        if(castelstring===""){
            Fen += "- ";//geen enkele rokade is nog mogelijk
        }else{
            Fen += `${castelstring} `;
        }

        Fen += "- "; //hier komen normaal de posites waar enpassent mogelijk is
        Fen +=`${board.amountOfMoves%2} `;
        Fen +=`${Math.floor(board.amountOfMoves/2)}`;
        return Fen
    }
     static createPiece(letter, x, y, castelstring){
        let color= letter===letter.toUpperCase()
        letter=letter.toUpperCase()
        if (letter==="R"){
            let rook = new Rook(new Coordinate(x,y),color,true);
            if(FenConvertor.rookCastle(castelstring,color,x,y)){
                rook.moved=true;
            }
            return rook;
        }else if (letter==="N"){
            return new Knight(new Coordinate(x,y),color,true);
        }else if (letter==="P"){
            let pawn= new Pawn(new Coordinate(x,y),color,true);
            if (color){
                if (y!==6){
                    pawn.moved=true;
                }
            }else {
                if (y!==1){
                    pawn.moved=true;
                }
            }
            return  pawn;
        }else if (letter==="B"){
            return new Bisshop(new Coordinate(x,y),color,true);
        }else if (letter==="Q"){
            return new Queen(new Coordinate(x,y),color,true);
        }else  {
            let king=new King(new Coordinate(x,y),color,true);
            if(FenConvertor.kingCastle(castelstring,color)){
                king.moved=true;
            }
            return king;
        }
    }

     static kingCastle(castlestring,color){
         let queencheck="q";
         let kingcheck="k";
         if(color){
             queencheck=queencheck.toUpperCase();
             kingcheck=kingcheck.toUpperCase();
         }
         return !(castlestring.includes(kingcheck)&&castlestring.includes(queencheck));

    }

    static rookCastle(castlestring,color,x,y){
        let queencheck="q";
        let kingcheck="k";
        let ycheck=0;
        if(color){
            queencheck=queencheck.toUpperCase();
            kingcheck=kingcheck.toUpperCase();
            ycheck=7;
        }
        //effectief chekken van de rook
        if(y===ycheck){
            if(x===7){
                return !castlestring.includes(kingcheck);
            }else if(x===0){
                return !castlestring.includes(queencheck);
            }
        }
        return false;

    }



}