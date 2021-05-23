import api from './../Services/services.js'

// Variables//

const searchInput = document.querySelector(".search-bar");
const containerResults = document.querySelector(".content-elements");
const searchBtnActive = document.querySelector(".sug");
const searchBtn = document.querySelector(".fa-search");
const showMoreBtn = document.querySelector(".more-btn");
const displaySection = document.querySelector(".new-search-section");
const notFoundImg = document.querySelector("#not-found-img");
const notFoundText = document.querySelector("#not-found-title");
const listAutocomplete = document.querySelector(".list-sug");
const searchBar = document.querySelector(".search-bar-style");
const inputIcon = document.querySelector(".input-icon");
let titleSearch = document.querySelector(".title-search-elements");
let totalResults = 0;

/**
 *  Receive the data from the api to display it on the screen
 */

const searchResults = function() {
    const search = searchInput.value;
    const offset = totalResults || 0;
    displaySection.style.display = "flex";
    showMoreBtn.style.display = "none";
    titleSearch.innerText = search.charAt(0).toUpperCase() + search.slice(1);
    api.apiSearch(search, offset)
    .then(res => {
        const {data} = res;
        showResults(data);
    })
    .catch(err => {
        console.error(`Error al conectarse con la Api de busqueda.`, err);
    });
}

/**
 * Prints in the screen the results from the search bar
 */

const showResults = function(data) {
    if(data.length) {
        showMoreResults(data);
        notFoundImg.style.display = "none";
        notFoundText.style.display = "none";
        totalResults += data.length;
        for (let i = 0; i < data.length; i++) {
            console.log(data);
            containerResults.innerHTML += 
            `
                <div class="gif-elements">
                <img src="${data[i].images.original.url}" alt="">
                <div class="hover-color">
                    <div class="hover-elements">
                        <div class="icons-img">
                            <span class="icon-icon-download">
                                <span class="path1"></span>
                                <span class="path2"></span>
                            </span>
                            <span class="icon-icon-fav">
                                <span class="path1"></span>
                                <span class="path2"></span>
                            </span>
                            <span class="icon-icon-max-normal">
                                <span class="path1"></span>
                                <span class="path2"></span>
                            </span>
                        </div>
                        <div class="info-element">
                            <h5 class="username">${data[i].username}</h5>
                            <h1 class="title-element">${data[i].title}</h1>
                        </div>
                    </div>
                </div>
            </div>
            `
        }
    }
}

/**
 * Hides the show more button when there are less than 12 gifs
 */

const showMoreResults = function(data) {
    if (data.length < 12) {
        showMoreBtn.style.display = "none";
    } else {
        showMoreBtn.style.display = "block";
    }
}

/**
 * Receive the data from the api to display it on the suggestion list
 */

const autocompleteEngine = function() {
    const search = searchInput.value;
    toggleIcon();
    api.apiAutocomplete(search)
    .then(res => {
        const {data} = res;
        listAutocomplete.innerHTML = '';
        showSuggestions(data);
    })
    .catch(err => {
        console.error(`error al conectarse con la Api de autocompletar.`, err);
    });
}

/**
 * Prints on the screen the suggestion list while the user is typing
 */

const showSuggestions = function(data) {
    if (data.length) {
        for (let i = 0; i < data.length; i++) {
            let nameData = data[i].name;
            nameData = data[i].name.charAt(0).toUpperCase() + data[i].name.slice(1);
            listAutocomplete.innerHTML += `
            <li class="suggestion"><i class="fas fa-search sug 1"> ${nameData}</i></li>
            `
        }
        setAutocomplete();
        searchBar.classList.add("active");
    } else {
        searchBar.classList.remove("active");
    }
}

/**
 * Sets to the search engine the suggestion clicked by the user
 */

const setAutocomplete = function() {
    const suggestionList = document.querySelectorAll(".suggestion");
    for (let i = 0; i < suggestionList.length; i++) {
        suggestionList[i].addEventListener("click", setSearchAutocomplete);
    }
}

/**
 * Starts to finding the typed data ingresed by the user
 */

const setSearchAutocomplete = function() {
    searchInput.value = event.target.innerText.replace('suggestion-', '');
    searchResults();
    searchBar.classList.remove("active");
    containerResults.innerHTML = "";
    notFoundImg.style.display = "unset";
    notFoundText.style.display = "unset";
};

/**
 * Toggles the icon when the user type in the search engine
 */

const toggleIcon = function() {
    if (searchInput.value) {
        inputIcon.innerHTML = `
        <i class="fas fa-times"></i>
        `
        resetInputSearch();
    } else{
        inputIcon.innerHTML = `<i class="fas fa-search"></i>`
    }
}

/**
 * Resets the search engine to the deafult settings when the user click to the X
 */

const resetInputSearch = function() {
    const resetIcon = document.querySelector(".fa-times");
    resetIcon.addEventListener("click", () => {
        searchInput.value = "";
        inputIcon.innerHTML = `<i class="fas fa-search"></i>`;
        searchBar.classList.remove("active");
    });
}


// Listeners

searchInput.addEventListener("keyup", (e) => {
    if(e.keyCode === 13){
        e.preventDefault();
        containerResults.innerHTML = "";
        notFoundImg.style.display = "unset";
        notFoundText.style.display = "unset";
        searchResults();
        searchBar.classList.remove("active");

    }
});
searchBtnActive.addEventListener("click", searchResults);
searchBtn.addEventListener("click", searchResults);
showMoreBtn.addEventListener("click", searchResults);
searchInput.addEventListener("input", autocompleteEngine);