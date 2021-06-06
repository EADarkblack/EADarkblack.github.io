import api from './../Services/services.js'
import {showMoreBtn, containerResults, windowWidth, expandEventGifElement, addBtnIconFav, addDownloadBtn, addExpandBtn, dataFavIconToggle} from './search.js'

// Global Variables

const noFavElements = document.querySelector(".no-content-fav-section");
let totalGif = 0;

// Functions

/**
 * Gets from the localstorage the gifs liked by the user using an array with a 12 limit
 */

const getFavElements = function() {
    const offset = totalGif || 0;
    const favElements = api.getLimitFavElements(12, offset);
    if (favElements.length !== 0) {
        noFavElements.style.display = "none";
        markupFavElements(favElements);
        dataFavIconToggle();
    } else {
        noFavElements.style.display = "flex";
        containerResults.style.display = "none";
    }
}

/**
 * Prints on the screen all gifs liked by the user and adds its respective functionality
 */

const markupFavElements = function(favElements) {
    showMoreBtnFav(favElements);
    for (let i = 0; i < favElements.length; i++) {
        containerResults.innerHTML += `
                <div class="gif-elements" id="el-${favElements[i].id}">
                <figure>
                    <img src="${favElements[i].images.downsized_medium.url}" alt="">
                    <div class="layer">
                        <div class="icons-img">
                            <span class="icon-icon-fav" id="${favElements[i].id}">
                                <span class="icon-icon-fav-active"></span>
                                <span class="path1"></span>
                                <span class="path2"></span>
                            </span>
                            <span class="icon-icon-download" id="dow-${favElements[i].id}">
                                <span class="path1"></span>
                                <span class="path2"></span>
                            </span>
                            <span class="icon-icon-max-normal" id="exp-${favElements[i].id}">
                                <span class="path1"></span>
                                <span class="path2"></span>
                            </span>
                        </div>
                        <div class="info-element">
                            <h5 class="username">${favElements[i].username}</h5>
                            <h1 class="title-element">${favElements[i].title}</h1>
                        </div>
                    </div>
                </figure>
            </div>
        `
    }
    if (windowWidth < 768) {
        expandEventGifElement();
    } else {
        addBtnIconFav();
        addDownloadBtn();
        addExpandBtn();
    }
}

/**
 * Allows show the button "Ver más" when exists more than 12 gifs and adds a new number for the offset
 */

const showMoreBtnFav = function(favElements) {
    if (favElements.length < 12) {
        showMoreBtn.style.display = "none";
    } else {
        showMoreBtn.style.display = "block";
        totalGif += 12;
    }
}

// Listeners

showMoreBtn.addEventListener("click", getFavElements);

// Triggers

getFavElements();