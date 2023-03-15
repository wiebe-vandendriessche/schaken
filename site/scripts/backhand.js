let len=600
let square_size = len / 8
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let ofsetPiece=5;
let list =[["picture/b_rook_png_128px.png","picture/b_knight_png_128px.png","picture/b_bishop_png_128px.png","picture/b_queen_png_128px.png","picture/b_king_png_128px.png","picture/b_bishop_png_128px.png","picture/b_knight_png_128px.png","picture/b_rook_png_128px.png"],["picture/b_pawn_png_128px.png","picture/b_pawn_png_128px.png","picture/b_pawn_png_128px.png","picture/b_pawn_png_128px.png","picture/b_pawn_png_128px.png","picture/b_pawn_png_128px.png","picture/b_pawn_png_128px.png","picture/b_pawn_png_128px.png"],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],["picture/w_pawn_png_128px.png","picture/w_pawn_png_128px.png","picture/w_pawn_png_128px.png","picture/w_pawn_png_128px.png","picture/w_pawn_png_128px.png","picture/w_pawn_png_128px.png","picture/w_pawn_png_128px.png","picture/w_pawn_png_128px.png"],["picture/w_rook_png_128px.png","picture/w_knight_png_128px.png","picture/w_bishop_png_128px.png","picture/w_queen_png_128px.png","picture/w_king_png_128px.png","picture/w_bishop_png_128px.png","picture/w_knight_png_128px.png","picture/w_rook_png_128px.png"]]


window.onload=draw_board();
window.onload=draw_pieces(list);

function draw_board() {
    canvas.setAttribute("height", len.toString());
    canvas.setAttribute("width", len.toString());
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            ctx.beginPath();
            if ((i + j) % 2 === 0) {
                ctx.fillStyle = "#582b2b";
            } else {
                ctx.fillStyle = "#de7070";
            }
            ctx.fillRect(square_size * i, square_size * j, square_size, square_size);
            ctx.stroke();
        }
    }
}
 function draw_pieces(list_piece){
     for (let i = 0; i < 8; i++) {
         for (let j = 0; j < 8; j++) {
             if(list_piece[i][j]!==0){
                 let img=new Image();
                 img.src=list_piece[i][j];
                 img.onload= () => {
                     ctx.drawImage(img,square_size*j+ofsetPiece,square_size*i+ofsetPiece,square_size-2*ofsetPiece,square_size-2*ofsetPiece)
                 };
             }
         }
     }
 }

