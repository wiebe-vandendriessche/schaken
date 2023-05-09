import {Board} from "./Board.js";
import {Coordinate} from "./Coordinate.js";

import {MoveCacher} from "./MoveCacher.js";
import {popup_end} from "./Show.js";//ik weet niet zeker of dit mag en of dit de mooiste oplossing is

export class GameState{
    static ofsetPiece=5;
    static PlayedMoves=new MoveCacher();

    constructor(canvas,length,colorA,colorB,colorC,colorD) {

        this.botAdversairy=false;
        this.bodDifficulty=0;
        this.bot=undefined;
        this.canvasElement = canvas.parentElement;
        this.canvas=canvas;
        this.lenght=length;
        this.square_size=this.lenght/8;
        this.ctx=canvas.getContext("2d");
        this.board= new Board(true);
        this.clicked=false;
        this.clicked_piece=0;
        GameState.PlayedMoves.setStart(new Board(true));
        this.colorA=colorA;
        this.colorB=colorB;
        this.colorC=colorC;
        this.colorD=colorD;
        this.playMove=()=>{};
        this.sound = new Audio("./sounds/chess.mp3");
    }


    dummy(){
        console.log(this.board);
        console.log(this.board.boardToFen());
    }

    drawGameboard(){
        this.drawBoard();
        this.drawPieces(this.board.getPieces());
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
            this.drawGameboard();
        }
        //console.log(GameState.PlayedMoves.GetMoves());
    }
    drawSquare(i,j,colorA,colorB){
        this.ctx.beginPath();
        if ((i + j) % 2 === 0) {
            this.ctx.fillStyle = colorA;
        } else {
            this.ctx.fillStyle = colorB;
        }
        this.ctx.fillRect(this.square_size * i, this.square_size * j, this.square_size, this.square_size);
        this.ctx.stroke();
    }

    drawBoard() {

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.drawSquare(i,j,this.colorA,this.colorB);
            }
        }
    }

    drawPieces(list_piece){
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if(list_piece[i][j]!==0){//checken of het vak niet leeg is want dan tekenen van een piece
                    let piece= list_piece[i][j];

                    let img=piece.image;
                    img.onload= () => {
                        this.ctx.drawImage(img,this.square_size*j+GameState.ofsetPiece,this.square_size*i+GameState.ofsetPiece,this.square_size-2*GameState.ofsetPiece,this.square_size-2*GameState.ofsetPiece);
                    };
                    this.ctx.drawImage(img,this.square_size*j+GameState.ofsetPiece,this.square_size*i+GameState.ofsetPiece,this.square_size-2*GameState.ofsetPiece,this.square_size-2*GameState.ofsetPiece);//Volgende keren geen onload event meer
                }
            }
        }
    }


    drawPossible(cords){
        for(let i=0;i<cords.length;i++){
            this.drawSquare(cords[i].x,cords[i].y,this.colorC,this.colorD);
        }
    }


    restart(popup){
        if (this.bot!==undefined){
            this.bot.terminate();
            this.bot=undefined;
        }
        this.board=new Board(true);
        GameState.PlayedMoves.reset();
        this.clicked=false;
        this.drawGameboard();
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
        this.drawGameboard();
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
        let x=Math.floor((event.clientX-rect.x)/this.square_size);
        let y=Math.floor((event.clientY-rect.y)/this.square_size);
        let piece_clicked_now=this.board.getPieces()[y][x];
        let cord=new Coordinate(x,y);
        let color=this.board.colorToMove();
        this.drawGameboard()
        if(this.clicked){
            let oldcord=this.clicked_piece.pos;
            if(this.board.moveWithCheck(this.clicked_piece,cord)) {
                GameState.PlayedMoves.Moveadd(cord,this.board.amountOfMoves,this.board,this.clicked_piece);
                let status = this.board.isEnd(!color);
                this.openEndGame()
                this.drawGameboard()
                this.playSound();
                let data={
                    "type":"move",
                    "cord1":oldcord,
                    "cord2":cord
                }
                this.playMove=()=>{};
                this.bot.postMessage(JSON.stringify(data));

                // even eventlistener van UndoMove en PlayMove uitzetten
                this.undo=()=>{}

                this.openEndGame(color);
            }
            this.clicked = false;
            this.clicked_piece = 0;
        }else{

            if(piece_clicked_now!==0 && piece_clicked_now.kleur===color){
                this.drawPossible(this.board.possibleMoves(cord));
                this.clicked_piece=piece_clicked_now
                this.clicked=true
            }
        }
    }
    play_move_player(event){
        let rect=this.canvas.getBoundingClientRect();
        let x=Math.floor((event.clientX-rect.x)/this.square_size);
        let y=Math.floor((event.clientY-rect.y)/this.square_size);
        let piece_clicked_now=this.board.getPieces()[y][x];
        let cord=new Coordinate(x,y);
        let color=this.board.colorToMove();
        if(this.clicked){
            if(this.board.moveWithCheck(this.clicked_piece,cord)){
                GameState.PlayedMoves.Moveadd(cord,this.board.amountOfMoves,this.board,this.clicked_piece);
                this.drawGameboard();//moet hier ook eens staan voor het geval dat het d
                this.playSound();
                this.openEndGame(color);
            }else{
                this.drawGameboard();
            }
            this.updatePlayedMoves(GameState.PlayedMoves.GetMoves())
            this.clicked=false;
            this.clicked_piece=0;

        }else{
            if(piece_clicked_now!==0 && piece_clicked_now.kleur===color){
                this.drawPossible(this.board.possibleMoves(cord));
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
        this.bot=new Worker(`${baseURL}/scripts/Bot/Bot.js`, { type: "module" });

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
        console.log("hunk")
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

    rescale(){
        this.length = this.canvasElement.offsetWidth
        this.square_size = this.length/8;
        this.canvas.width=this.length;
        this.canvas.height=this.length;

        this.drawGameboard();
    }

    playSound(){
        this.sound.play();
    }
}