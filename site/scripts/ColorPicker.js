

//document declaraties
let standaardKleuren = document.getElementById("Standaard");
let setWit = document.getElementById("Wit");
let body = document.body;
let canvas=document.getElementById("canvas_preview")
let ctx= canvas.getContext("2d");
let squaresize=canvas.width/8;
//functie voor het preview canvas
function rescale() {
    canvas.width=canvas.parentElement.offsetWidth*0.35;
    canvas.height=canvas.width;
    squaresize = canvas.width / 8;
    DrawPreview();
}
function DrawPreview(){
    let colorA=localStorage.getItem("color1");
    let colorB=localStorage.getItem("color2");
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            ctx.beginPath();
            if ((i + j) % 2 === 0) {
                ctx.fillStyle = colorA;
            } else {
                ctx.fillStyle = colorB;
            }
            ctx.fillRect(squaresize * i, squaresize * j, squaresize, squaresize);
            ctx.stroke();
        }
    }
}
window.addEventListener("resize", () => {
    rescale()
});


//Picker 1
let colorIndicator = document.getElementById('color-indicator');
let colorPicker = new iro.ColorPicker('#color-picker', {width: 180, color: "#fff"});
colorPicker.on('color:change', function (color) {
    colorIndicator.style.backgroundColor = color.hexString;
    OpslaanKleur1Localstorage(color.hexString);
    DrawPreview();
});

//Picker 2
let colorIndicator2 = document.getElementById('color-indicator2');
let colorPicker2 = new iro.ColorPicker('#color-picker2', {width: 180, color: "#fff"});
colorPicker2.on('color:change', function (color) {
    colorIndicator2.style.backgroundColor = color.hexString;
    OpslaanKleur2Localstorage(color.hexString);
    DrawPreview()
});


//eventlistener herlaad pagina
window.addEventListener("load", ()=>{OnloadColor();rescale()});


//onthoud kleuren
function OpslaanKleur1Localstorage(color){
    localStorage.setItem('color1', color);
}
function OpslaanKleur2Localstorage(color){
    localStorage.setItem('color2', color);
}

//neem kleuren bij reload
function OnloadColor(){
    let kleur1 = localStorage.getItem('color1');
    let kleur2 = localStorage.getItem('color2');
    colorPicker.color.hexString = kleur1;
    colorPicker2.color.hexString = kleur2;
}

//zet op wit zwart
function setStandaardKleuren(){
    let skleur1 = "#fff2e0"
    let skleur2 = "#000000"
    localStorage.setItem('color1', skleur1);
    localStorage.setItem('color2', skleur2);
    skleur1 = localStorage.getItem('color1');
    skleur2 = localStorage.getItem('color2');
    colorPicker.color.hexString = skleur1;
    colorPicker2.color.hexString = skleur2;
}



