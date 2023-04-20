
/*Bij refresh*/
function OnloadMode(){
    //darkmode
    document.body.classList.toggle("dark", localStorage.getItem("darkmode") === "true");

    //sidebar
    document.querySelector(".sidebar").classList.toggle("close", localStorage.getItem("closed") === "true");

    //submenu's
    document.getElementById("idSub1").classList.toggle("showMenu", localStorage.getItem("subclosed1") === "true");
    document.getElementById("idSub2").classList.toggle("showMenu", localStorage.getItem("subclosed2") === "true");

    //kleine correctie
    let modeText = document.body.querySelector(".link_name2");
    if(localStorage.getItem("darkmode") === "true"){
        modeText.innerText = "Light";
    }
}