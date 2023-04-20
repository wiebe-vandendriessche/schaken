
let i = 0;
let text = "Welkom bij Schaken"

function typing(){

    if(i<text.length){
        document.getElementById("idTyping").innerHTML += text.charAt(i);
        i++;
        setTimeout(typing,50);
        console.log("test");
    }
}
typing();