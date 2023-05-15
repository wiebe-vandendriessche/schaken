document.addEventListener("keydown", function(event) {
    // Code to check for key combination
});

let schakenCode = ["s", "c", "h", "a", "k", "e", "n"];
let schakenCodeIndex = 0;

document.addEventListener("keydown", function(event) {
    if (event.key === schakenCode[schakenCodeIndex]) {
        schakenCodeIndex++;
        if (schakenCodeIndex === schakenCode.length) {
            let rot = document.getElementById("easterRotate");
            rot.classList.add("easter");
            schakenCodeIndex = 0;
            setTimeout(removeEaster, 1000);
        }
    } else {
        schakenCodeIndex = 0;
    }
});

function removeEaster(){
    let rot = document.getElementById("easterRotate");
    rot.classList.remove("easter");
}