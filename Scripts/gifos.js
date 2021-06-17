import api from '../Services/services.js'
import { showMoreBtn, closeExpandView, downloadFunction, windowWidth, addDownloadBtn } from './search.js'

// Global Variables

const noGifosContent = document.querySelector(".no-content-misgifos-section");
const misGifosContainer = document.querySelector(".gifos");
let totalGifosArr = [];
let totalGifos = 0;

// Functions

/**
 * Gets all gifs created by the user from the localstorage
 */

const getGifosFromLocalStorage = function(btnState = false) {
    if (!btnState) {
        setTotalGifos(0);
        totalGifosArr = [];
    }
    const offset = totalGifos || 0;
    const totalGifosElements = api.getMyGifFromLocalStorage() || [];
    const gifoElements = api.getLimitGifoElements(12, offset);
    if (totalGifosElements.length !== 0) {
        noGifosContent.style.display = "none";
        markupGifosElements(gifoElements);
        showMoreBtnGifos(totalGifosElements);
    } else {
        noGifosContent.style.display = "flex";
        misGifosContainer.style.display = "none";
    }
}

/**
 * Prints all gifs created by the user and sets a new number for the offset (Adds functionality to the buttons)
 */

const markupGifosElements = function(gifoElements) {
    for (let i = 0; i < gifoElements.length; i++) {
        totalGifosArr.push(gifoElements[i]);
        misGifosContainer.innerHTML += `
                <div class="gif-elements" id="el-${gifoElements[i].id}">
                <figure>
                    <img src="${gifoElements[i].images.downsized_medium.url}" alt="">
                    <div class="layer">
                        <div class="icons-img">
                            <span class="icon-icon-trash-hover" id="del-${gifoElements[i].id}">
                                <span class="path1"></span>
                                <span class="path2"></span>
                            </span>
                            <span class="icon-icon-download" id="dow-${gifoElements[i].id}">
                                <span class="path1"></span>
                                <span class="path2"></span>
                            </span>
                            <span class="icon-icon-max-normal expand-gifo-icon" id="gifo-exp-${gifoElements[i].id}">
                                <span class="path1"></span>
                                <span class="path2"></span>
                            </span>
                        </div>
                        <div class="info-element">
                            <h5 class="username">${gifoElements[i].username}</h5>
                            <h1 class="title-element">${gifoElements[i].title}</h1>
                        </div>
                    </div>
                </figure>
            </div>
        `
    }
    setTotalGifos(document.querySelectorAll(".gif-elements").length);
    if (windowWidth < 768) {
        expandGifoElement();
    } else {
        addDeleteBtn();
        addDownloadBtn();
        addGifoExpandBtn();
    }
}

/**
 * Sets the new number for the offset, this number took from "markupGifosElements" function
 */

 const setTotalGifos = function(totalGifs) {
    totalGifos = totalGifs;
}

/**
 * Adds an event that allow to the user open his/her gif using the tap (mobile)
 */

const expandGifoElement = function() {
    const gifsElements = document.querySelectorAll(".gif-elements");
    for (let i = 0; i < gifsElements.length; i++) {
        const gifExpandId = gifsElements[i].id;
        const id = gifExpandId.replace("el-", "");
        api.apiGetFavoriteId(id)
        .then(res => {
            const {data} = res;
            gifsElements[i].addEventListener("click", () => {
                expandGifo(data);
            });
        });
    }
}

/**
 * Adds the fullscreen mode for the gif created by the user, this fullscreen mode is a bit different from others
 */

const expandGifo = function(data) {
    const expandContainer = document.querySelector(".expand-view");
    window.scroll(0, 0);
    document.body.style.overflow = "hidden";
    expandContainer.innerHTML = `
            <div class="expand-elements">
            <div class="close-icon">
                <span></span>
                <span></span>
            </div>
            <div class="expand-img">
                <img src="${data.images.original.url}" alt="">
            </div>
            <div class="expand-info-elements">
                <div class="expand-info">
                    <h5 class="username">${data.username}</h5>
                    <h1 class="title-element">${data.title}</h1>
                </div>
                <div class="expand-icons">
                    <span class="icon-icon-trash-hover expand-gifo" id="del-${data.id}">
                        <span class="path1"></span>
                        <span class="path2"></span>
                    </span>
                    <span class="icon-icon-download expand-download">
                        <span class="path1"></span>
                        <span class="path2"></span>
                    </span>
                </div>
            </div>
        </div>
    `
    closeExpandView();
    addDeleteGifoExpand(data);
    const downloadBtnExpand = document.querySelector(".expand-download");
    downloadBtnExpand.addEventListener("click", () => {
        downloadFunction(data);
    });
}

/**
 * Allows to the user delete his/her gif on the fullscreen mode
 */

const addDeleteGifoExpand = function(data) {
    const deleteBtn = document.querySelector(".expand-gifo");
    deleteBtn.addEventListener("click", () => {
        api.deleteGifo(data.id);
    })
}

/**
 * Adds functionality to the delete button on the desktop and tablet version
 */

const addDeleteBtn = function() {
    const delBtn = document.querySelectorAll(".icon-icon-trash-hover");
    const allGifoElements = document.querySelectorAll(".gif-elements");
    for (let i = 0; i < delBtn.length; i++) {
        delBtn[i].addEventListener("click", () => {
            const replaceId = delBtn[i].id;
            const id = replaceId.replace("del-", "");
            api.deleteGifo(id);
            misGifosContainer.removeChild(allGifoElements[i]);
            getUpdateGifosLocalStorage();
        })
    }
}

/**
 * Adds to the expand button its own functionality without using the same expand function used by other gifs
 */

const addGifoExpandBtn = function() {
    const allGifoExpandBtn = document.querySelectorAll(".expand-gifo-icon");
    for (let i = 0; i < allGifoExpandBtn.length; i++) {
        const expandIdBtn = allGifoExpandBtn[i].id;
        const id = expandIdBtn.replace("gifo-exp-", "");
        api.apiGetFavoriteId(id)
        .then(res => {
            const {data} = res;
            allGifoExpandBtn[i].addEventListener("click", () => {
                expandGifo(data);
            });
        });
    };
}

/**
 * When exists more than 12 gifs created by the user, shows the button "Ver Más"
 */

const showMoreBtnGifos = function(totalGifosElements) {
    if (totalGifos < totalGifosElements.length) {
        showMoreBtn.style.display = "block";
    } else {
        showMoreBtn.style.display = "none";
    }
}

/**
 * When the user deletes all gifs allow show the "not found content" image (IRT)
 */

const getUpdateGifosLocalStorage = function() {
    const totalGifosElements = api.getMyGifFromLocalStorage() || [];
    if (totalGifosElements.length > 1) {
        noGifosContent.style.display = "none";
    } else {
        noGifosContent.style.display = "flex";
        misGifosContainer.style.display = "none";
    }
}

// Listeners

showMoreBtn.addEventListener("click", getGifosFromLocalStorage(true));
showMoreBtn.addEventListener("click", () => {
    getGifosFromLocalStorage(true)
});