import api from './../Services/services.js'

export default {

    /**
     * Compare the gif's id that the user gives as a favorite and changes the style to the favorite button
     */

    addFavorite(id) {
        api.apiGetFavoriteId(id)
        .then(res => {
            const {data} = res;
            const gifById = document.getElementById(`${id}`);
            const expandGifId = document.querySelector(".expand");
            const favArray = this.getFavElementsLS() || [];
            if (favArray.some((favArray) => favArray.id === id)) {
                this.deleteSame(favArray, id);
                gifById.classList.remove("active-fav");
                expandGifId.classList.remove("active-fav-expand");
            } else{
                favArray.push(data);
                gifById.classList.add("active-fav");
                expandGifId.classList.add("active-fav-expand");
            }
            this.setFavElementsLS(favArray);
        });
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
    }
}
