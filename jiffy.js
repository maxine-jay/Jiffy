const API_KEY = 'ayi1VlthxKWKr0kIG0AkxTZHMWSGMBTB'
const videosEl = document.querySelector('.videos')
const searchEl = document.querySelector('.search-input')
const hintEl = document.querySelector('.search-hint')
const clearEl = document.querySelector('.search-clear')

const randomChoice = (arr) => {
    const randIndex = Math.floor(Math.random() * arr.length)
    return arr[randIndex]
}

function createVideo(src) {
    //createElement lets us create elements inside of JS
    const video = document.createElement('video')
        //set attributes
    video.src = src
    video.autoplay = true
    video.loop = true
        //   set class name using javascript
    video.className = 'video'
    return video
}

const toggleLoading = (state) => {

    if (state) {
        document.body.classList.add('loading')
        searchEl.disabled = true
    } else {
        document.body.classList.remove('loading')
        searchEl.disabled = false
        searchEl.focus()
    }
}

const searchGiphy = (searchTerm) => {
    toggleLoading(true)
    console.log('search for', searchTerm)

    fetch(
            `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchTerm}&limit=100&offset=0&rating=pg-13&lang=en`
        )
        .then((response) => {
            // Convert to JSON
            return response.json()
        })
        .then((json) => {
            const gif = randomChoice(json.data)
            const src = gif.images.original.mp4
            console.log(src)

            const video = createVideo(src)

            //grab videos element and append our newly created video to it

            videosEl.appendChild(video)

            video.addEventListener('loadeddata', event => {

                video.classList.add('visible')
                toggleLoading(false)
                document.body.classList.add('has-results')
                hintEl.innerHTML = `Hit enter to search more ${searchTerm}`
            })
        })
        .catch((error) => {
            toggleLoading(false)
            hintEl.innerHTML = `Nothing found for ${searchTerm}`
        })
}



// here we separate out our key function and we can call to it in various places in our code
const doSearch = (event) => {
    const searchTerm = searchEl.value
        //   only run when we have search term that is longer than 2 characters and enter key is pressed

    if (searchTerm.length > 2) {
        hintEl.innerHTML = `Hit enter to search ${searchTerm}`
        document.body.classList.add('show-hint')
    } else {
        document.body.classList.remove('show-hint')
    }
    if (event.key === 'Enter' && searchEl.value.length > 2) {
        searchGiphy(searchTerm)
    }
}


//clears video stack, search field and hint
const clearSearch = event => {
    document.body.classList.remove('has-results')
    videosEl.innerHTML = ''
    hintEl.innerHTML = ''
    searchEl.value = ''
    searchEl.focus()
}

searchEl.addEventListener('keyup', doSearch)
clearEl.addEventListener('click', clearSearch)

document.addEventListener('keyup', event => {
    if (event.key === 'Escape') {
        clearSearch()
    }
})