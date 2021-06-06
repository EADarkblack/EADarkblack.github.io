// Global Variables

const BURGUER_ICON = document.querySelector(".burguer-icon");
const DARKMODE_BUTTON = document.querySelector(".theme-button");
const CLASSLIST_BODY = document.body.classList;

// Functions

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

/**
 *  validate the DarkModeStatus from the localstorage
 */

const getDarkModeStatus = () => {
    return localStorage.getItem("modeStatus");
}

const setDarkModeStatus = (value) => {
    localStorage.setItem("modeStatus", value.toString());
}

const validatorThemeStatus = function() {
    if(getDarkModeStatus() === "true"){
        CLASSLIST_BODY.add("theme--dark");
        DARKMODE_BUTTON.innerText = "Modo Diurno";
    } else {
        CLASSLIST_BODY.remove("theme--dark");
        DARKMODE_BUTTON.innerText = "Modo Nocturno";
    }
};

/** 
 * Switch to the Dark Mode 
*/

const themeSwitch = function() {
    DARKMODE_BUTTON.addEventListener("click", switchTheme);
    function switchTheme() {
        if(CLASSLIST_BODY.contains("theme--dark")) {
            DARKMODE_BUTTON.innerText = "Modo Nocturno";
            setDarkModeStatus(false);
        } else{
            DARKMODE_BUTTON.innerText = "Modo Diurno";
            setDarkModeStatus(true);
        }
        CLASSLIST_BODY.toggle("theme--dark");
    }
}

// Triggers

menuDisplay();
noScrolling();
validatorThemeStatus();
themeSwitch();