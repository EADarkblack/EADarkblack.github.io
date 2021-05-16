// Global Variables

const BURGUER_ICON = document.querySelector(".burguer-icon");
console.log(BURGUER_ICON);

// Mobile Version Functionalities

/**
 * display the menu when clicked in the menu icon
 */

const menuDisplay = function() {
    BURGUER_ICON.addEventListener("click", display);
    function display (){
        let menu = document.getElementById("menu");
        menu.classList.toggle("display-menu");
        BURGUER_ICON.classList.toggle("burguer-open-icon");
    }
}

/**
 * block the scroll when the menu is active
 */

const noScrolling = function() {
    BURGUER_ICON.addEventListener("click", disableScroll);  
    function disableScroll(){
        let bodyNoScroll = document.getElementById("body");
        if (bodyNoScroll.style.overflow === "hidden") {
            bodyNoScroll.style.overflow = "initial";
        } else {
            bodyNoScroll.style.overflow = "hidden";
        }
    }
}

noScrolling();
menuDisplay();