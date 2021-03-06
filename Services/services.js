import {windowWidth} from '../Scripts/search.js'

const APIKEY = "p7KQJzpXhEY1U6ksV908AMcBTMKz9l22"
const TRENDING_EP = "https://api.giphy.com/v1/gifs/trending"
const SEARCH_EP = "https://api.giphy.com/v1/gifs/search"
const UPLOAD_EP = "https://upload.giphy.com/v1/gifs"
const AUTOCOMPLETE_EP = "https://api.giphy.com/v1/gifs/search/tags"
const FAVORITE_EP = "https://api.giphy.com/v1/gifs/"
const TRENDING_SEARCH= "https://api.giphy.com/v1/trending/searches"

export default {

    /**
     * Returns the search made by the user
     */
    
    apiSearch(search, offset) {
        return new Promise ((resolve, reject) => {
            fetch(`${SEARCH_EP}?api_key=${APIKEY}&q=${search}&limit=12&offset=${offset}`)
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => reject(err));
        });
    },

    /**
    * Returns the data to the search engine to make the autocomplete option
    */

    apiAutocomplete(search) {
        return new Promise ((resolve, reject) => {
            fetch(`${AUTOCOMPLETE_EP}?api_key=${APIKEY}&q=${search}&limit=4`)
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => reject(err));
        })
    },

    /**
     * Returns the id from every gif chosen by the user
     */

    apiGetFavoriteId(id) {
        return new Promise ((resolve, reject) =>{
            fetch(`${FAVORITE_EP}${id}?api_key=${APIKEY}`)
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => reject(err));
        })
    },

    /**
     * Returns an array with a trend list
     */

    apiGetTrendingSearches() {
        return new Promise((resolve, reject) => {
            fetch(`${TRENDING_SEARCH}?api_key=${APIKEY}`)
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => reject(err));
        })
    },

    /**
     * Returns the newest trends elements
     */

    apiGetTrendings() {
        return new Promise((resolve, reject) => {
            fetch(`${TRENDING_EP}?api_key=${APIKEY}&limit=12`)
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => reject(err));
        })
    },
    
    /**
     * Compare the gif's id that the user gives as a favorite and changes the style to the favorite button
     */

    addFavorite(id) {
        this.apiGetFavoriteId(id)
        .then(res => {
            const {data} = res;
            const gifById = document.getElementById(`${id}`);
            const expandGifId = document.querySelector(".expand");
            const favArray = this.getFavElementsLS() || [];
            if (favArray.some((favArray) => favArray.id === id)) {
                this.deleteSame(favArray, id);
                if (windowWidth >= 768) {
                    gifById.classList.remove("active-fav");
                    if (expandGifId) {
                        expandGifId.classList.remove("active-fav-expand", "active-fav");
                    }
                }else{
                    expandGifId.classList.remove("active-fav-expand");
                }
            }else{
                favArray.push(data);
                if (windowWidth >= 768) {
                    gifById.classList.add("active-fav");
                    if (expandGifId) {
                        expandGifId.classList.add("active-fav-expand", "active-fav");  
                    }
                } else{
                    expandGifId.classList.add("active-fav-expand");
                }
            }
            this.setFavElementsLS(favArray);
        })
        .catch(err => console.error(`Un error ha ocurrido con la Api de busqueda por Id: ${err}`));
    },

    /**
     * Finds in the localstorage the same id for the elements and delete it
     */

    deleteSame(favArray, id) {
        const i = favArray.map((itemArray) => itemArray.id).indexOf(id);
        if (i !== -1) {
            favArray.splice(i, 1);
        }
    },

    /**
     * Saves in the localstorage the gif choose by the user to show it in the favorites section
     */

    setFavElementsLS(favArray) {
        localStorage.setItem("favoriteGifs", JSON.stringify(favArray));
    },

    /**
     * Return from the localstorage the gifs choose by the user
     */
    
    getFavElementsLS() {
        return JSON.parse(localStorage.getItem("favoriteGifs"));
    },

    /**
     * Returns an array with the 12 elements and adds an offset for show more gifs
     */

    getLimitFavElements(limit = 12, offset = 0) {
        if (!!localStorage.getItem("favoriteGifs")) {
            const limitFavorites = JSON.parse(localStorage.getItem("favoriteGifs"));
            return limitFavorites.slice(offset, offset + limit); 
        } else {
            return [];
        }
    },

    /**
     * Creates a form data and make a post request to the Api
     */

    apiUploadGif(blob) {
        const url = `${UPLOAD_EP}?api_key=${APIKEY}`;
        let form = new FormData();
        form.append("file", blob, "myGif.gif");
        return new Promise((resolve, reject) => {
            fetch(url, {method: "POST", body: form})
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => reject(err));
        })
    },

    /**
     * Saves to an array in the localstorage the gif created by the user
     */

    setMyGifToLocalStorage(myGifosArr) {
        localStorage.setItem("mygifs", JSON.stringify(myGifosArr));
    },

    /**
     * Gets from the localstorage all gifs created by the user
     */

    getMyGifFromLocalStorage() {
        return JSON.parse(localStorage.getItem("mygifs"));
    },

    /**
     * Detects when the user send the same id from the gif created by his/her and delete it from the localstorage and apply a reload for update the page
     */

    deleteGifo(id) {
        this.apiGetFavoriteId(id)
        .then(res => {
            const {data} = res;
            const gifosArray = this.getMyGifFromLocalStorage() || [];
            const expandGifoContainer = document.querySelector(".expand-elements");
            if (gifosArray.some((gifosArray) => gifosArray.id === data.id)) {
                this.deleteSameGifoId(gifosArray, id);
            }
            this.setMyGifToLocalStorage(gifosArray);
            if (expandGifoContainer) {
                location.reload();
            }
        })
        .catch(err => console.error(`Un error ha ocurrido con la Api de busqueda por Id: ${err}`));
    },

    /**
     * Creates a new array with all gif's id created by the user and delete the gif with the same id
     */

     deleteSameGifoId(gifosArray, id) {
        const i = gifosArray.map((itemArray) => itemArray.id).indexOf(id);
        if (i !== -1) {
            gifosArray.splice(i, 1);
        }
    },

    /**
     * Returns an array with the first 12 elements and gets from the offset the next 12 elements until not exist more
     */

     getLimitGifoElements(limit = 12, offset = 0) {
        if (!!localStorage.getItem("mygifs")) {
            const limitGifos = JSON.parse(localStorage.getItem("mygifs"));
            return limitGifos.slice(offset, offset + limit); 
        } else {
            return [];
        }
    }
}


