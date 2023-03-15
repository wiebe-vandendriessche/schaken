let len=600
let square_size = len / 8
let canvas = document.getElementById("canvas");
let ofsetPiece

//window.onload=draw_board();
window.onload=draw_pieces();


function draw_board() {
    canvas.setAttribute("height", len.toString());
    canvas.setAttribute("width", len.toString());
    let ctx = canvas.getContext("2d");
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            ctx.beginPath();
            if ((i + j) % 2 == 0) {
                ctx.fillStyle = "#582b2b";
            } else {
                ctx.fillStyle = "#de7070";
            }
            ctx.fillRect(square_size * i, square_size * j, square_size, square_size);
            ctx.stroke();
        }
    }
}
 function draw_pieces(){
     let ctx = canvas.getContext("2d");
     for (let i = 0; i < 8; i++) {
         for (let j = 0; j < 8; j++) {
             let img=new Image();
             img.onload=function (){
                 ctx.drawImage(img,square_size*i+ofsetPiece,square_size*j+ofsetPiece,square_size-2*ofsetPiece,square_size-2*ofsetPiece)
             }
             img.src="picture/b_bishop_png_128px.png"
         }
     }
 }

