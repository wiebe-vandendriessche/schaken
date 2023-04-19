
function SubmenuToggle1(){
    const wasSubClosed1 = localStorage.getItem("subclosed1" ) === "true";
    localStorage.setItem("subclosed1", !wasSubClosed1);
    let sub1 = document.getElementById("idSub1");
    sub1.classList.toggle("showMenu",!wasSubClosed1);
}

function SubmenuToggle2(){
    const wasSubClosed2 = localStorage.getItem("subclosed2" ) === "true";
    localStorage.setItem("subclosed2", !wasSubClosed2);
    let sub2 = document.getElementById("idSub2");
    sub2.classList.toggle("showMenu",!wasSubClosed2);
}

function Darkmode(){
    const wasDarkmode = localStorage.getItem("darkmode") === "true";
    localStorage.setItem("darkmode", !wasDarkmode);
    const body = document.body;
    body.classList.toggle("dark", !wasDarkmode);

    //text
    let modeText = document.body.querySelector(".link_name2");
    if (wasDarkmode === true) {
        modeText.innerText = "Dark";
    } else {
        modeText.innerText = "Light";
    }
}

function SidebarToggle(){
    const wasClosed = localStorage.getItem("closed") === "true";
    localStorage.setItem("closed", !wasClosed);
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("close", !wasClosed);
}