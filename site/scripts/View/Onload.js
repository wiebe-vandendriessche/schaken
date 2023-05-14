
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

    //voor als er nog niets in local storage kleuren zit
    if(localStorage.getItem('color1') == null){
        let skleur1 = "#fff2e0"
        let skleur2 = "#000000"
        localStorage.setItem('color1', skleur1);
        localStorage.setItem('color2', skleur2);
        skleur1 = localStorage.getItem('color1');
        skleur2 = localStorage.getItem('color2');
        colorPicker.color.hexString = skleur1;
        colorPicker2.color.hexString = skleur2;
    }
}