import {Board} from "./Board.js";
import {Coordinate} from "./Coordinate.js";
import {Bot} from "./Bot/Bot.js";
import {MoveCacher} from "./MoveCacher.js";
import {popup_end} from "./Show.js";//ik weet niet zeker of dit mag en of dit de mooiste oplossing is

export class GameState{
    static ofsetPiece=5;
    static PlayedMoves=new MoveCacher();
    bot;
    constructor(canvas,lenght,colorA,colorB,colorC,colorD) {

        this.botAdversairy=false;
        this.bodDifficulty=0;

        this.canvasElement = document.getElementById("canvas_element");
        this.canvas=canvas;
        this.lenght=lenght;
        this.square_size=this.lenght/8;
        this.ctx=canvas.getContext("2d");
        this.board= new Board(true);
        this.clicked=false;
        this.clicked_piece=0;
        GameState.PlayedMoves.setStart(new Board(true));
        this.colorA=colorA;
        this.colorB=colorB;
        this.colorC=colorC;
        this.colorD=colorD
        this.playMove=(event)=>{};
    }
    dummy(){
        this.board.setupPieces("q3k1nr/1pp1nQpp/3p4/1P2p3/4P3/B1PP1b2/B5PP/5K2 b k - 0 17");
        GameState.PlayedMoves.setStart(this.board);
        this.drawGameboard();
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
        //chekken voor de loop voor onnodige itteraties tegen te gaan
        //chekken na de loop voor als je twee keer terug wil maar maar een keer terug kan;
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
        this.canvas.setAttribute("height", this.lenght.toString());
        this.canvas.setAttribute("width", this.lenght.toString());
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.drawSquare(i,j,this.colorA,this.colorB);
            }
        }
    }

    drawPieces(list_piece){
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if(list_piece[i][j]!==0){//chekken of het vak niet leeg is want dan tekene van een piece
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
        this.board=new Board(true);
        GameState.PlayedMoves.reset();
        this.clicked=false;
        this.drawGameboard();
        this.updatePlayedMoves("");
        GameState.PlayedMoves.alleBoards.push(new Board(true));
        this.playMove=(event)=>{};
        this.openPopup(popup)
    }


    play(event){
        this.playMove(event)
    }

    bot_move(){
        let newCord;
        let piece;
        this.bot.nextMove(this.board).then(array=>{
            this.board.move(array[0], array[1])
            newCord=array[1];
            piece=array[0]
        }).then(()=>{
            this.board.amountOfMoves++;
            this.drawGameboard();

        }).then(()=>{
            GameState.PlayedMoves.Moveadd(newCord,this.board.amountOfMoves,this.board,piece);
            this.updatePlayedMoves(GameState.PlayedMoves.GetMoves());
        });
    }

    //duplicated code voor efficientie van de botmove om een if test minder te moeten doen nog geen tijd gehad of het een groot verschil maakt als de chek er bij komt
    async play_move_bot(event){
        let rect=this.canvas.getBoundingClientRect();
        let x=Math.floor((event.clientX-rect.x)/this.square_size);
        let y=Math.floor((event.clientY-rect.y)/this.square_size);
        let piece_clicked_now=this.board.getPieces()[y][x];
        let cord=new Coordinate(x,y);
        let color=this.board.colorToMove();
        this.drawGameboard()
        if(this.clicked){
            if(this.board.moveWithCheck(this.clicked_piece,cord)) {
                GameState.PlayedMoves.Moveadd(cord,this.board.amountOfMoves,this.board,this.clicked_piece);
                let status = this.board.isEnd(!color);
                if (status !== "continue") {
                    setTimeout(() => {
                        alert(status)
                    }, 500);
                }
                this.bot_move();
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
        console.log(GameState.PlayedMoves)
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
        this.playMove=(event)=>{this.play_move_bot(event)};
        this.bot=new Bot(col,this.bodDifficulty);
        if(col){
            this.bot_move();
        }
        this.close(popupDifficulty);

    }
    closePopup(popup,popupDifficulty,botDiff){
        let difficulty=parseInt(botDiff.value);
        this.botAdversairy= difficulty!==0;
        if(!this.botAdversairy){
            this.playMove=(event)=>{this.play_move_player(event)};
        }else{
            this.openPopup(popupDifficulty)
        }
        this.close(popup);
    }
    openEndGame(color){
        let status = this.board.isEnd(!color);
        console.log(status)
        if (status !== "continue") {//alles binnen deze functie moet niet effiecient zijn dit aangezien dat het maar en keer per spel wordt opgeroepen
            setTimeout(() => {
                popup_end.classList.add("open-popup");
                this.setEndPopupText(color,status,popup_end);
            }, 500);
        }
    }

    setEndPopupText(color,status,popup){
        let text;
        let text_color=color?"Withe":"Black";
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
        this.length = Math.min(this.canvasElement.offsetWidth, this.canvasElement.offsetHeight);
        this.square_size = this.length/8;
        console.log(`length: ${this.length}`);
        this.drawGameboard();
    }
}