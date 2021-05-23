const APIKEY = `p7KQJzpXhEY1U6ksV908AMcBTMKz9l22`
const TRENDING_EP = `https://api.giphy.com/v1/gifs/trending`
const SEARCH_EP = 'https://api.giphy.com/v1/gifs/search'
const UPLOAD_EP = "https://upload.giphy.com/v1/gifs"
const AUTOCOMPLETE_EP = "https://api.giphy.com/v1/gifs/search/tags"

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
    * Returns the data to the isearch engine to make the autocomplete option
    */

    apiAutocomplete(search) {
        return new Promise ((resolve, reject) => {
            fetch(`${AUTOCOMPLETE_EP}?api_key=${APIKEY}&q=${search}&limit=4`)
            .then(res => res.json())
            .then(data => resolve(data))
            .catch(err => reject(err));
        })
    },
}


