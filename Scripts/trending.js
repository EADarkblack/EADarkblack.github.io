import api from './../Services/services.js'
import {windowWidth, expandGif, addBtnIconFav, dataFavIconToggle, addDownloadBtn, addExpandBtn} from './search.js'

// Variables

const tracks = document.querySelector(".track");
const previousBtn = document.querySelector(".previous");
const nextBtn = document.querySelector(".next");
const containerGif1 = document.querySelector(".first");
const containerGif2 = document.querySelector(".second");
const containerGif3 = document.querySelector(".third");
const containerGif4 = document.querySelector(".fourth");
const trendingContainer = document.querySelector(".trending-container");
let direction = -1;
let initialPosition = null;
let moving = false;
let transform = 0;
let lastPageX = 0;
let transformValue = 0;

// Functions

/**
 * Gets the trending data from the Api and execute the functions that belong to mobile or desktop version
 */

export const getTrendsData = function() {
    api.apiGetTrendings()
    .then(res => {
        const {data} = res;
        if (windowWidth < 768) {
            showTrendsDataMobile(data);
            mobileEvents();
        } else {
            showTrendsData(data)
        }
        dataFavIconToggle();
    })
    .catch(err => {
        console.error(`Error al conectarse con la Api de tendencias: ${err}`);
    });
}

/**
 * Prints in four different containers the data received by the Api (Only desktop and tablets)
 */

const showTrendsData = function(data) {
    for (let i = 0; i < 3; i++) {
        containerGif1.innerHTML += `
                <div class="gif-trendings" id="el-${data[i].id}">
                <figure>
                    <img src="${data[i].images.downsized_medium.url}" alt="" class="trend-img">
                    <div class="layer">
                        <div class="icons-img">
                            <span class="icon-icon-fav" id="${data[i].id}">
                                <span class="icon-icon-fav-active"></span>
                                <span class="path1"></span>
                                <span class="path2"></span>
                            </span>
                            <span class="icon-icon-download" id="dow-${data[i].id}">
                                <span class="path1"></span>
                                <span class="path2"></span>
                            </span>
                            <span class="icon-icon-max-normal" id="exp-${data[i].id}">
                                <span class="path1"></span>
                                <span class="path2"></span>
                            </span>
                        </div>
                        <div class="info-element">
                            <h5 class="username">${data[i].username}</h5>
                            <h1 class="title-element">${data[i].title}</h1>
                        </div>
                    </div>
                </figure>
            </div>
        `
    }
    for (let i = 3; i < 6; i++) {
        containerGif2.innerHTML += `
            <div class="gif-trendings" id="el-${data[i].id}">
            <figure>
                <img src="${data[i].images.downsized_medium.url}" alt="" class="trend-img">
                <div class="layer">
                    <div class="icons-img">
                        <span class="icon-icon-fav" id="${data[i].id}">
                            <span class="icon-icon-fav-active"></span>
                            <span class="path1"></span>
                            <span class="path2"></span>
                        </span>
                        <span class="icon-icon-download" id="dow-${data[i].id}">
                            <span class="path1"></span>
                            <span class="path2"></span>
                        </span>
                        <span class="icon-icon-max-normal" id="exp-${data[i].id}">
                            <span class="path1"></span>
                            <span class="path2"></span>
                        </span>
                    </div>
                    <div class="info-element">
                        <h5 class="username">${data[i].username}</h5>
                        <h1 class="title-element">${data[i].title}</h1>
                    </div>
                </div>
            </figure>
        </div>
        `
    }
    for (let i = 6; i < 9; i++) {
        containerGif3.innerHTML += `
            <div class="gif-trendings" id="el-${data[i].id}">
            <figure>
                <img src="${data[i].images.downsized_medium.url}" alt="" class="trend-img">
                <div class="layer">
                    <div class="icons-img">
                        <span class="icon-icon-fav" id="${data[i].id}">
                            <span class="icon-icon-fav-active"></span>
                            <span class="path1"></span>
                            <span class="path2"></span>
                        </span>
                        <span class="icon-icon-download" id="dow-${data[i].id}">
                            <span class="path1"></span>
                            <span class="path2"></span>
                        </span>
                        <span class="icon-icon-max-normal" id="exp-${data[i].id}">
                            <span class="path1"></span>
                            <span class="path2"></span>
                        </span>
                    </div>
                    <div class="info-element">
                        <h5 class="username">${data[i].username}</h5>
                        <h1 class="title-element">${data[i].title}</h1>
                    </div>
                </div>
            </figure>
        </div>
        `
    }
    for (let i = 9; i < 12; i++) {
        containerGif4.innerHTML += `
            <div class="gif-trendings" id="el-${data[i].id}">
            <figure>
                <img src="${data[i].images.downsized_medium.url}" alt="" class="trend-img">
                <div class="layer">
                    <div class="icons-img">
                        <span class="icon-icon-fav" id="${data[i].id}">
                            <span class="icon-icon-fav-active"></span>
                            <span class="path1"></span>
                            <span class="path2"></span>
                        </span>
                        <span class="icon-icon-download" id="dow-${data[i].id}">
                            <span class="path1"></span>
                            <span class="path2"></span>
                        </span>
                        <span class="icon-icon-max-normal" id="exp-${data[i].id}">
                            <span class="path1"></span>
                            <span class="path2"></span>
                        </span>
                    </div>
                    <div class="info-element">
                        <h5 class="username">${data[i].username}</h5>
                        <h1 class="title-element">${data[i].title}</h1>
                    </div>
                </div>
            </figure>
        </div>
        `
    }
    trackEventStop();
    addBtnIconFav();
    addDownloadBtn();
    addExpandBtn();
}

/**
 * Leaves only one container and prints the mobile version of the trending carousel
 */

const showTrendsDataMobile = function(data) {
    tracks.removeChild(containerGif2);
    tracks.removeChild(containerGif3);
    tracks.removeChild(containerGif4);
    for (let i = 0; i < data.length; i++) {
        containerGif1.innerHTML += `
                <div class="gif-trendings" id="el-${data[i].id}">
                <figure>
                    <img src="${data[i].images.downsized_medium.url}" alt="" class="trend-img">
                    <div class="layer">
                        <div class="icons-img">
                            <span class="icon-icon-fav" id="${data[i].id}">
                                <span class="icon-icon-fav-active"></span>
                                <span class="path1"></span>
                                <span class="path2"></span>
                            </span>
                            <span class="icon-icon-download" id="dow-${data[i].id}">
                                <span class="path1"></span>
                                <span class="path2"></span>
                            </span>
                            <span class="icon-icon-max-normal" id="exp-${data[i].id}">
                                <span class="path1"></span>
                                <span class="path2"></span>
                            </span>
                        </div>
                        <div class="info-element">
                            <h5 class="username">${data[i].username}</h5>
                            <h1 class="title-element">${data[i].title}</h1>
                        </div>
                    </div>
                </figure>
            </div>
        `
    }
    addExpandTrendMobile();
}

/**
 * Cancels the first event of the document "tracks" to avoid the auto slide when the user put the mouse over a gif
 */

const trackEventStop = function() {
    const layerEventRemove = document.querySelectorAll(".layer");
    for (let i = 0; i < layerEventRemove.length; i++) {
        layerEventRemove[i].addEventListener("transitionend", () => {
            if (direction === -1) {
                tracks.prepend(tracks.lastElementChild);
            } else if(direction === 1) {
                tracks.appendChild(tracks.firstElementChild);
            }
            tracks.style.transition = "none";
            tracks.style.transform = "translate(0)";
            setTimeout(() => {
                tracks.style.transition = "all 0.5s";
            })
        });
        
    }
}

/**
 * Gets the new initial position when the user swipe the carousel to the right
 */

const gestureStart = function(e) {
    initialPosition = e.pageX;
    moving = true;
    const transformMatrix = window.getComputedStyle(containerGif1).getPropertyValue("transform");
    if (transformMatrix !== "none") {
        transform = parseInt(transformMatrix.split(",")[4].trim());
    }
}

/**
 * Allows translate the "carousel" container and avoid show an empty space when the container reach the end
 */

const gestureMove = function(e) {
    if (moving) {
        const differenceX = e.pageX - initialPosition;
        if (e.pageX - lastPageX > 0) {
            if (transformValue > 0) {
                return;
            }
        } else {
            if (Math.abs(transformValue) > containerGif1.offsetWidth - 320) {
                return;
            }
        }
        transformValue = transform + differenceX;
        containerGif1.style.transform = `translateX(${transformValue}px)`;
    }
    lastPageX = e.pageX;
}

/**
 * Sets to "let moving" its default value
 */

const gestureEnd = function() {
    moving = false;
}

/**
 * compares and execute the events for the mobile version
 */

const mobileEvents = function() {
    if (window.PointerEvent) {
        window.addEventListener("pointerdown", gestureStart);
        window.addEventListener("pointermove", gestureMove);
        window.addEventListener("pointerup", gestureEnd);
    } else{
        window.addEventListener("touchdown", gestureStart);
        window.addEventListener("touchmove", gestureMove);
        window.addEventListener("touchup", gestureEnd);
    }
}

/**
 * Adds the click event for every gif container on the trending section
 */

const addExpandTrendMobile = function() {
    const gifsTrend = document.querySelectorAll(".gif-trendings");
    for (let i = 0; i < gifsTrend.length; i++) {
        const gifExpandId = gifsTrend[i].id;
        const id = gifExpandId.replace("el-", "");
        api.apiGetFavoriteId(id)
        .then(res => {
            const {data} = res;
            gifsTrend[i].addEventListener("click", () => {
                expandGif(data);
            });
        });
    }
}

// Listeners

previousBtn.addEventListener("click", () => {
    if (direction === -1) {
        direction = 1;
        tracks.appendChild(tracks.firstElementChild);
    }
    trendingContainer.style.justifyContent = "flex-end";
    tracks.style.transform = "translate(25%)";
});
nextBtn.addEventListener("click", () => {
    if (direction === 1) {
        direction = -1;
        tracks.prepend(tracks.lastElementChild);
    }
    trendingContainer.style.justifyContent = "flex-start";
    tracks.style.transform = "translate(-25%)";
});
tracks.addEventListener("transitionend", () => {
    if (direction === -1) {
        tracks.appendChild(tracks.firstElementChild);
    } else if(direction === 1) {
        tracks.prepend(tracks.lastElementChild);
    }
    tracks.style.transition = "none";
    tracks.style.transform = "translate(0)";
    setTimeout(() => {
        tracks.style.transition = "all 0.5s";
    })
});

// Triggers

getTrendsData();

