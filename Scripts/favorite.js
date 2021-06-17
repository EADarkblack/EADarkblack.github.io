import api from './../Services/services.js'
import {showMoreBtn, containerResults, windowWidth, expandEventGifElement, addDownloadBtn, addExpandBtn, dataFavIconToggle} from './search.js'

// Global Variables

const noFavElements = document.querySelector(".no-content-fav-section");
const favsContainer = document.querySelector(".fav");
let totalGifArr = [];
let totalFavGif = 0;

// Functions

/**
 * Executes the getFavElements function only when the user is located in the favorite section
 */

const functionExecute = function(btnState = false) {
    if (favsContainer) {
        getFavElements(btnState);
        showMoreBtn.addEventListener("click", () => functionExecute(true));
    }
}

/**
 * Gets from the localstorage the gifs liked by the user using an array with a 12 limit
 */

const getFavElements = function(btnState) {
    if (!btnState) {
        setTotalFav(0);
        totalGifArr = [];
    }
    const offset = totalFavGif || 0;
    const totalFavElements = api.getFavElementsLS() || [];
    const favElements = api.getLimitFavElements(12, offset);
    if (totalFavElements.length !== 0) {
        noFavElements.style.display = "none";
        markupFavElements(favElements);
        showMoreBtnFav(totalFavElements);
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
    for (let i = 0; i < favElements.length; i++) {
        totalGifArr.push(favElements[i]);
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
                            <span class="icon-icon-max-normal all-gifs" id="exp-${favElements[i].id}">
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
    setTotalFav(document.querySelectorAll(".gif-elements").length);
    if (windowWidth >= 768) {
        deleteFavElement();
        addDownloadBtn();
        addExpandBtn();
    } else {
        expandEventGifElement();
    }
}

/**
 * Allows show the button "Ver más" when exists more than 12 gifs and adds a new number for the offset
 */

const showMoreBtnFav = function(totalFavElements) {
    if (totalFavGif < totalFavElements.length) {
        showMoreBtn.style.display = "block";
    } else {
        showMoreBtn.style.display = "none";
    }
} 

/**
 * Sets a new number for the offset
 */

const setTotalFav = function(totalGif){
    totalFavGif = totalGif;
}

/**
 * Removes the gif from the favorite container when the user click the favorite button
 */

export const deleteFavElement = function() {
    const allElements = document.querySelectorAll(".gif-elements");
    for (let i = 0; i < allElements.length; i++) {
        const favIconContent = document.querySelectorAll(".icon-icon-fav");
        const id = favIconContent[i].id;
        favIconContent[i].addEventListener("click", () => {
            api.addFavorite(id);
            getUpdateLocalStorage();
            deleteElement(allElements[i]);
        });
    }
}

/**
 * Adds the "no content" message when the user deletes all favorite elements from the favorite container
 */

const getUpdateLocalStorage = function() {
    const totalFavElements = api.getFavElementsLS() || [];
    if (totalFavElements.length > 1) {
        noFavElements.style.display = "none";
    } else {
        noFavElements.style.display = "flex";
        containerResults.style.display = "none";
    }
}

/**
 * Deletes the element after 200 ms to allow delete first the element from the localstorage
 */

const deleteElement = function(allElements) {
    setTimeout(() => {
        favsContainer.removeChild(allElements);
    }, 200)
}

// Triggers

functionExecute();