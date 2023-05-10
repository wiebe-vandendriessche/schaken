import {Board} from "./Model/Board.js";
import {Coordinate} from "./Coordinate.js";

import {MoveCacher} from "./MoveCacher.js";
import {popup_end} from "./Show.js";
import {Draw} from "./Draw.js";

//ik weet niet zeker of dit mag en of dit de mooiste oplossing is

export class GameState{
    static PlayedMoves=new MoveCacher();

    constructor(canvas,colorA,colorB,colorC,colorD,          sound = new Audio("sounds/standard.mp3")) {


        this.botAdversairy=false;
        this.bodDifficulty=0;
        this.bot=undefined;

        this.draw=new Draw(canvas,colorA,colorB,colorC,colorD,5);

        this.canvas=canvas;


        this.board= new Board(true);
        this.clicked=false;
        this.clicked_piece=0;

        GameState.PlayedMoves.setStart(new Board(true));
        this.playMove=()=>{};

        this.sound = sound;
    }


    undoMove(){
        let undoAantal=1;
        if(this.botAdversairy){
            undoAantal=2;
        }
        //checken voor de loop voor onnodige iterates tegen te gaan
        //checken na de loop voor als je twee keer terug wil maar maar een keer terug kan;
        if(GameState.PlayedMoves.moves!==""){
            for(let i=0;i<undoAantal;i++){
                if(GameState.PlayedMoves.moves!==""){
                    this.ReturnToPreviousBoard();
                    this.clicked_piece=0;
                    this.clicked=false;
                    this.updatePlayedMoves(GameState.PlayedMoves.GetMoves());

                }
            }
            this.draw.drawGameboard(this.board);
        }
        //console.log(GameState.PlayedMoves.GetMoves());
    }

    restart(popup){
        if (this.bot!==undefined){
            this.bot.terminate();
            this.bot=undefined;
        }
        this.board=new Board(true);
        GameState.PlayedMoves.reset();
        this.clicked=false;
        this.draw.drawGameboard(this.board);
        this.updatePlayedMoves("");
        GameState.PlayedMoves.alleBoards.push(new Board(true));
        this.playMove=(event)=>{};
        this.openPopup(popup)
    }



    bot_move(event){
        let data=JSON.parse(event.data);
        let piece= this.board.board[data.cord1.y][data.cord1.x];
        let newCord= data.cord2;
        this.board.move(piece,newCord);
        this.board.amountOfMoves++;
        this.draw.drawGameboard(this.board);
        this.playSound();
        this.openEndGame(this.bot.color);
        GameState.PlayedMoves.Moveadd(new Coordinate(newCord.x,newCord.y),this.board.amountOfMoves,this.board,piece);
        this.updatePlayedMoves(GameState.PlayedMoves.GetMoves());
        this.playMove=this.play_move_bot;
        //eventlisteners toevoegen
        this.undo=this.undoMove;

    }

     play_move_bot(event){
        let rect=this.canvas.getBoundingClientRect();
        let x=Math.floor((event.clientX-rect.x)/this.draw.squareSize);
        let y=Math.floor((event.clientY-rect.y)/this.draw.squareSize);
        let piece_clicked_now=this.board.getPieces()[y][x];
        let cord=new Coordinate(x,y);
        let color=this.board.colorToMove();
        this.draw.drawGameboard(this.board);
        if(this.clicked){
            let oldcord=this.clicked_piece.pos;
            if(this.board.moveWithCheck(this.clicked_piece,cord)) {
                GameState.PlayedMoves.Moveadd(cord,this.board.amountOfMoves,this.board,this.clicked_piece);
                this.openEndGame();
                this.draw.drawGameboard(this.board);
                this.playSound();
                let data={
                    "type":"move",
                    "cord1":oldcord,
                    "cord2":cord
                }
                this.playMove=()=>{};
                this.openEndGame(!this.bot.color);
                this.bot.postMessage(JSON.stringify(data));

                // even eventlistener van UndoMove en PlayMove uitzetten
                this.undo=()=>{}

            }
            this.clicked = false;
            this.clicked_piece = 0;
        }else{
            if(piece_clicked_now!==0 && piece_clicked_now.kleur===color){
                this.draw.drawPossible(this.board.possibleMoves(cord));
                this.clicked_piece=piece_clicked_now
                this.clicked=true
            }
        }
    }
    play_move_player(event){
        let rect=this.canvas.getBoundingClientRect();
        let x=Math.floor((event.clientX-rect.x)/this.draw.squareSize);
        let y=Math.floor((event.clientY-rect.y)/this.draw.squareSize);

        let piece_clicked_now=this.board.getPieces()[y][x];
        let cord=new Coordinate(x,y);
        let color=this.board.colorToMove();
        if(this.clicked){
            if(this.board.moveWithCheck(this.clicked_piece,cord)){
                GameState.PlayedMoves.Moveadd(cord,this.board.amountOfMoves,this.board,this.clicked_piece);
                this.draw.drawGameboard(this.board)//moet hier ook eens staan voor het geval dat het d
                this.playSound();
                this.openEndGame(color);
            }else{
                this.draw.drawGameboard(this.board);
            }
            this.updatePlayedMoves(GameState.PlayedMoves.GetMoves())
            this.clicked=false;
            this.clicked_piece=0;

        }else{
            if(piece_clicked_now!==0 && piece_clicked_now.kleur===color){
                this.draw.drawPossible(this.board.possibleMoves(cord));
                this.clicked_piece=piece_clicked_now
                this.clicked=true;
            }
        }
    }

    ReturnToPreviousBoard(){
        this.board=GameState.PlayedMoves.ReturnToPreviousMoves();
    }


    updatePlayedMoves(moves){
        let text=document.getElementById("playedMoves");
        text.textContent=moves;
    }

    openPopup(popup){
        popup.classList.add("open-popup");
    }
    closePopupDifficulty(popupDifficulty,botDiff,color){
        let col=parseInt(color.value)===0;
        this.bodDifficulty= botDiff.value;
        //console.log(col+"     "+this.bodDifficulty);
        this.playMove=this.play_move_bot;
        const baseURL = window.location.href.split('/').slice(0, -1).join('/');
        this.bot=new Worker(`${baseURL}/scripts/Model/Bot/Bot.js`, { type: "module" });

        let data={//opdracht sturen naar de webworker --> zodat volledig async werkt
            "type":"maakbot",
            "color":col,
            "depth":this.bodDifficulty
        }
        data=JSON.stringify(data);
        this.bot.addEventListener("message",(event)=>{ this.bot_move(event)})// zodat -> bot zijn move telkens kan terugsturen als wij hem data verzenden
        this.bot.postMessage(data);



        this.close(popupDifficulty);
        console.log("this.bord->",this.board)

    }
    closePopup(popup,popupDifficulty,botDiff){
        let difficulty=parseInt(botDiff.value);
        this.botAdversairy= difficulty!==0;
        console.log("1")
        if(!this.botAdversairy){
            this.playMove=(event)=>{this.play_move_player(event)};
        }else{
            this.openPopup(popupDifficulty)
        }
        this.close(popup);
    }
    openEndGame(color){

        let status = this.board.isEnd(!color);
        console.log(status);
        if (status !== "continue") {
            if (this.bot!==undefined){
                this.bot.terminate();
                this.bot=undefined;
            }

            setTimeout(() => {
                popup_end.classList.add("open-popup");
                this.setEndPopupText(color,status,popup_end);
            }, 500);
        }
    }

    setEndPopupText(color,status,popup){
        let text;
        if(status==="checkmate"){
            let text_color=color?"Withe":"Black";
            text=`${text_color} won by ${status}`;
        }else if(status==="stalemate"){//else if gebruikt voor andere eindes zoals 50 zetten zonder capture en 3 zelfde posities
            text=`draw by ${status}`
        }else if(status==="resign"){
            let text_color=!color?"Withe":"Black";
            text=`${text_color} won by ${status}ation`
        }
        popup.children[1].textContent=text;
    }
    close(popup){
        popup.classList.remove("open-popup");
    }


    playSound(){
        // this.sound = new Audio("sounds/chess.mp3");
        this.sound.play()

    }


}