
let is_muted = document.getElementById("toggle_sound");
let name = "sound";
let src = "sounds/standard.mp3";
let sound = new Audio(src);

let sounds = {"chess.com geluid":"sounds/standard.mp3", "capture geluid":"sounds/capture.mp3", "ander geluid":"sounds/chess.mp3"};

let togglebutton = document.getElementById("toggle_sound");

if(localStorage.getItem("sound")){
    src = localStorage.getItem("sound");
    sound = new Audio(src);
    document.getElementById(src).checked = true;
    togglebutton.checked = !(JSON.parse(localStorage.getItem("muted")));
}
else{
    localStorage.setItem("sound", src);
    localStorage.setItem("muted", sound.muted);
}

function toggleSound(){
    sound = new Audio(localStorage.getItem("sound"));
    sound.muted = JSON.parse(localStorage.getItem("muted"));
    sound.muted = !sound.muted;
    sound.play();
    localStorage.setItem("sound", src);
    localStorage.setItem("muted", sound.muted);
}

function changeSound(event){
    let key = event.target.value;
    src = sounds[key];
    sound = new Audio(src);
    localStorage.setItem("sound",src);
    sound.muted = !(togglebutton.value);
    sound.play();
}