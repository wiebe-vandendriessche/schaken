


function closePopup(e){
    console.log(e.parentElement.id);
    let Popup = document.getElementById(e.parentElement.id);
    Popup.classList.remove("open-popup");
}

function openPopup(e){

    closeAllPopups();

    console.log(e.id);
    let Popup = document.getElementById(e.id + "Popup");
    Popup.classList.add("open-popup");
}

function closeAllPopups(){
    let nogOpen = document.getElementsByClassName("open-popup");
    for(let i of nogOpen){
        i.classList.remove("open-popup");
    }
}

