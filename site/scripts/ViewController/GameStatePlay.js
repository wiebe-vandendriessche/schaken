
import {Board} from "../Model/Board.js";
import {Coordinate} from "../Model/Coordinate.js";

import {MoveCacher} from "./MoveCacher.js";
import {popup_end} from "../View/Show.js";
import {Draw} from "./Draw.js";

import {AGamestate} from "./AGamestate.js";

//ik weet niet zeker of dit mag en of dit de mooiste oplossing is

export class GameStatePlay extends AGamestate{



    constructor(canvas,colorA,colorB,colorC,colorD,          sound = new Audio("sounds/standard.mp3")) {
        super(canvas,colorA,colorB,colorC,colorD,sound)
        this.botAdversairy=false;
        this.botDifficulty=0;
        this.bot=undefined;
    }


    undoMove(){
        let undoAantal=1;
        if(this.botAdversairy){
            undoAantal=2;
        }

        //checken voor de loop voor onnodige iterates tegen te gaan
        //checken na de loop voor als je twee keer terug wil maar maar een keer terug kan;
        if(GameStatePlay.PlayedMoves.moves!==""){
            for(let i=0;i<undoAantal;i++){
                if(GameStatePlay.PlayedMoves.moves!==""){
                    this.ReturnToPreviousBoard();
                    this.clickedPiece=0;
                    this.clicked=false;
                    this.updatePlayedMoves(GameStatePlay.PlayedMoves.GetMoves());


                    }
                }
                this.draw.drawGameboard(this.board);
            }

        //console.log(GameStatePlay.PlayedMoves.GetMoves());
    }

    restart(popup){
        if (this.bot!==undefined){
            this.bot.terminate();
            this.bot=undefined;
        }
        super.restart(popup)
    }



    botMove(event){
        let data=JSON.parse(event.data);
        let piece= this.board.board[data.cord1.y][data.cord1.x];
        let newCord= data.cord2;
        this.board.move(piece,newCord);
        this.board.amountOfMoves++;
        this.draw.drawGameboard(this.board);
        this.playSound();
        this.openEndGame(this.bot.color);
        GameStatePlay.PlayedMoves.Moveadd(new Coordinate(newCord.x,newCord.y),this.board.amountOfMoves,this.board,piece);
        this.updatePlayedMoves(GameStatePlay.PlayedMoves.GetMoves());
        this.playMove=(event)=>{this.play(event)}
        //eventlisteners toevoegen
        this.undo=this.undoMove;

    }

    closePopupDifficulty(popupDifficulty,botDiff,color){
        let col=parseInt(color.value)===0;
        this.botDifficulty= botDiff.value;
        //console.log(col+"     "+this.bodDifficulty);
        this.playMove=this.play;
        this.playMoveType=(color, cord)=>this.playBotInPlay(color,cord);

        const baseURL = window.location.href.split('/').slice(0, -1).join('/');
        this.bot=new Worker(`${baseURL}/scripts/Model/Bot/Bot.js`, { type: "module" });
        console.log(`${baseURL}/scripts/Model/Bot/Bot.js`);
        let data={//opdracht sturen naar de webworker --> zodat volledig async werkt
            "type":"maakbot",
            "color":col,
            "depth":this.botDifficulty
        }
        data=JSON.stringify(data);
        this.bot.addEventListener("message",(event)=>{ this.botMove(event)})// zodat -> bot zijn move telkens kan terugsturen als wij hem data verzenden
        this.bot.postMessage(data);



        this.close(popupDifficulty);
        console.log("this.bord->",this.board)

    }

    closePopup(popup,popupDifficulty,botDiff){
        let difficulty=parseInt(botDiff.value);
        this.botAdversairy= difficulty!==0;
        let undoknop=document.getElementById("undo_move")
        if(!this.botAdversairy){
            //wel undoknop hier
            undoknop.disable=false
            undoknop.hidden=false
            this.playMove=(event)=>{this.play(event)};
            this.playMoveType=(color, cord)=>{this.playHumanInPlay(color,cord)};
        }else{
            //geen undomove bij bot (nog niet)
            undoknop.disable=true
            undoknop.hidden=true
            this.openPopup(popupDifficulty)
        }
        this.close(popup);
    }
    openEndGame(color){
        let status = this.board.isEnd(!color);
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
        let text_color=color?"Wit":"zwart";
        if(status==="checkmate"){
            text=`${text_color} is gewonnen door schaakmat`;
        }else if(status==="stalemate"){//else if gebruikt voor andere eindes zoals 50 zetten zonder capture en 3 zelfde posities
            text=`spelen gelijk door pat`
        }else if(status==="resign"){
            text=`${text_color} wint door opgave`
        }
        popup.children[1].textContent=text;
    }

    playBotInPlay(color,cord){//color staat hier bij om altijd evenveel parameter te hebben
        let oldcord=this.clickedPiece.pos;
        if(this.board.moveWithCheck(this.clickedPiece,cord)) {
            GameStatePlay.PlayedMoves.Moveadd(cord,this.board.amountOfMoves,this.board,this.clickedPiece);
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
            if(this.bot!==undefined) {
                this.bot.postMessage(JSON.stringify(data));
            }
            // even eventlistener van UndoMove en PlayMove uitzetten
            this.undo=()=>{}
        }else{
            this.draw.drawGameboard(this.board);
        }
    }

    playHumanInPlay(color,cord){
        if(this.board.moveWithCheck(this.clickedPiece,cord)){
            AGamestate.PlayedMoves.Moveadd(cord,this.board.amountOfMoves,this.board,this.clickedPiece);
            this.draw.drawGameboard(this.board)//moet hier ook eens staan voor het geval dat het d
            this.playSound();
            this.openEndGame(color);
        }else{
            this.draw.drawGameboard(this.board);
        }
        this.updatePlayedMoves(GameStatePlay.PlayedMoves.GetMoves())
    }
}