"use strict";

(function () {
//  https://northern-magenta-cashew.glitch.me/movies

    /* TODO
    styling:
    opacity ot panels
    middle panel less transparrent
    make panel 1 and 3 disappear in less than medium size
    three buttons side-by-side instead of stacked
    revisit bg image
    load page

    html
    make sure form names ids etc are correct / linked

    js - jquery
    load page
        Display a "loading..." message
        Make an AJAX request to get a listing of all the movies
        When the initial AJAX request comes back, remove the "loading..." message and replace it with HTML generated from the json response your code receives
        ---> an html element who's display attribute changes from block to none upon api success.  Then show all movies as cards in a carousel? https://getbootstrap.com/docs/5.2/components/carousel/ having global var that = currently displayed movie and have buttons under carousel that do what is requested below

        Bonuses
        Add a disabled attribute to buttons while their corresponding ajax request is still pending.
        no problem

    Show a loading animation instead of just text that says "loading...".

    Done but need buttons for this:  Allow users to sort the movies by rating, title, or genre (if you have it).  kinda like coffee project?


      */
    let movieDB;  // the general array that holds all the loaded movies
    let currentMovieIndexNum = 0;  // the index number of the current featured movie
    let genreList;  // an array that holds the genre codes for translation of api result

    function getEntireDB() {  // pull movie db from glitch
        const url = 'https://northern-magenta-cashew.glitch.me/movies';
        return fetch(url)
            .then((response) => response.json())
            .then((data) => {
                movieDB = data;  // assign entire json file to an array
                getGenreList();  // now that we have movie list, get genre code translator file
            })
            .catch(() => console.log("There was an error loading the database"));
    }

    function getGenreList() {  // get file that hold translations for genre codes
        const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_KEY}`;
        const options = {
            method: 'GET',
        };
        fetch(url, options)
            .then((result) => result.json())
            .then((result) => {
                genreList = result.genres;
                updateGenres();  //  update the genres in the local db
            })
            .catch(() => (console.log("Something went wrong loading the poster")));
    }

    function updateGenres() {  // get english genre names for local db
        movieDB.forEach((element, index) => {
            getGenre(element.title, index);
        });
        // hide the loading image
        populateCards();  // update the screen
    }

    function getGenre(title, index) {  // get a genre code for a movie
        title = encodeURIComponent(title);
        let url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query='${title}'&language=en-US&page=1&include_adult=false`;
        const options = {
            method: 'GET',
        };
        fetch(url, options)
            .then((result) => result.json())
            .then((result) => {
                movieDB[index].genre = getGenreName(result.results[0].genre_ids[0]);
            })
            .catch(() => (console.log("Something went wrong getting a genre")));
    }

    function getGenreName(genreId) {  // translate a genre code to plain english
        let name = "unknown";
        for (let i = 0; i < genreList.length; i++) {
            if (genreList[i].id === genreId) {
                name = genreList[i].name;
            }
        }
        return name;
    }

    function populateCards() {  // display everything on the cards
        //card 1
        $('#card1-title').text(`${JSON.stringify(movieDB[checkMovieIndex(currentMovieIndexNum - 1)].title)}`);
        getPoster(`${JSON.stringify(movieDB[checkMovieIndex(currentMovieIndexNum - 1)].title)}`, 1);
        //card 2
        $('#featured-title').text(`${JSON.stringify(movieDB[checkMovieIndex(currentMovieIndexNum)].title)}`);
        $('#featured-director').text(`${JSON.stringify(movieDB[checkMovieIndex(currentMovieIndexNum)].director)}`);
        $('#featured-rating').text(`${JSON.stringify(movieDB[checkMovieIndex(currentMovieIndexNum)].rating)}`);
        $('#movie-count').text(`${currentMovieIndexNum + 1} of ${movieDB.length}`);
        getPoster(`${JSON.stringify(movieDB[checkMovieIndex(currentMovieIndexNum)].title)}`, 2);
        //card 3
        $('#card3-title').text(`${JSON.stringify(movieDB[checkMovieIndex(currentMovieIndexNum + 1)].title)}`);
        getPoster(`${JSON.stringify(movieDB[checkMovieIndex(currentMovieIndexNum + 1)].title)}`, 3);
        populateEditForm();
    }

    function checkMovieIndex(num) {  // utility that ensures cards have valid index numbers from arrray
        let newIdx = num
        if (num < 0) {
            newIdx = movieDB.length - 1;
        }
        if (num >= movieDB.length) {
            newIdx = 0;
        }
        return newIdx;
    }

    function getPoster(title, whichCard) {  // get posters for card from API
        title = encodeURIComponent(title);
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query='${title}'&language=en-US&page=1&include_adult=false`;
        const options = {
            method: 'GET',
        };
        fetch(url, options)
            .then((result) => result.json())
            .then((result) => {
                switch (whichCard) {  //  update the cards appropriately
                    case 1:
                        $('#card1-movie-poster').attr("src", `https://image.tmdb.org/t/p/original${result.results[0].poster_path}`);
                        break;
                    case 2:
                        $('#current-movie-poster').attr("src", `https://image.tmdb.org/t/p/original${result.results[0].poster_path}`);
                        // $('#featured-genre').text(getGenreName(result.results[0].genre_ids[0]));
                        $('#featured-genre').text(movieDB[currentMovieIndexNum].genre);
                        break;
                    case 3:
                        $('#card3-movie-poster').attr("src", `https://image.tmdb.org/t/p/original${result.results[0].poster_path}`);
                        $('#card1-genre').attr("src", `https://image.tmdb.org/t/p/original${result.results[0].poster_path}`);
                        break;
                }
            })
            .catch(() => (console.log("Something went wrong loading the poster")));
    }

    function populateEditForm() {  // put preload values into edit form
        document.querySelector('#edit-title').value = movieDB[currentMovieIndexNum].title;
        document.querySelector('#edit-rating').value = movieDB[currentMovieIndexNum].rating;
        document.querySelector('#edit-director').value = movieDB[currentMovieIndexNum].director;
    }

    function prepAdd(e) {  // get the body ready for the add movie API call upon submit
        e.preventDefault();
        let addTitle = document.querySelector('#add-title').value;
        let addRating = document.querySelector('#add-rating').value;
        let addDirector = document.querySelector('#add-director').value;
        let addString = {title: `${addTitle}`, rating: `${addRating}`, director: `${addDirector}`};
        addMovie(addString);
    }

    function addMovie(bodyStr) {  //  make the api call to add a movie
        const newMovieInfo = bodyStr;
        const url = 'https://northern-magenta-cashew.glitch.me/movies';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMovieInfo),
        };
        fetch(url, options)
            .then(() => {
                movieDB.push(bodyStr);  // update local db
                populateCards();  // update screen
            })
            .catch(() => console.log("There was an error adding a new movie"));
    }

    function prepEdit(e) {  // get the body ready for the add movie API call upon submit
        e.preventDefault();
        let idNum = movieDB[currentMovieIndexNum].id;
        let editTitle = document.querySelector('#edit-title').value;
        let editRating = document.querySelector('#edit-rating').value;
        let editDirector = document.querySelector('#edit-director').value;
        let editString = {title: `${editTitle}`, rating: `${editRating}`, director: `${editDirector}`};
        editMovie(idNum, editString);
    }

    function editMovie(id, bodyStr) {  //  make the api call to edit a movie
        const url = `https://northern-magenta-cashew.glitch.me/movies/${id}`;
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyStr),
        };
        fetch(url, options)
            .then(() => {
                movieDB.splice(currentMovieIndexNum, 1, bodyStr);  // update local db
                populateCards();   //  update screen
            })
            .catch(() => {
                console.log("There was an error editing the movie");
            });
    }

    function prepDelete(e) { // handle the submit button on delete movie form and make API call
        e.preventDefault();
        let idNum = movieDB[currentMovieIndexNum].id;
        deleteMovie(idNum);
    }

    function deleteMovie(id) {
        const url = `https://northern-magenta-cashew.glitch.me/movies/${id}`;
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(url, options)
            .then(() => {
                movieDB.splice(currentMovieIndexNum, 1);  // update local db
                console.log(movieDB);
                fwdOne();  // update screen
            })
            .catch(() => {
                console.log("There was an error deleting the movie");
            });
    }

    function fwdOne() {  // change current index number when user advances with button
        currentMovieIndexNum++;
        if (currentMovieIndexNum === movieDB.length) {  // keep index in array bounds
            currentMovieIndexNum = 0;
        }
        populateCards();  // update screen
    }

    function backOne() {  // change current index number when user retreats with button
        currentMovieIndexNum--;
        if (currentMovieIndexNum < 0) {  // keep index in array bounds
            currentMovieIndexNum = movieDB.length - 1;
        }
        populateCards();  // update screen
    }

    function sortByRating(objArray) {
             objArray.sort(function(a, b) {
                let textA = a.rating;
                let textB = b.rating;
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
             populateCards();
    }

    function sortByTitle(objArray) {
            objArray.sort(function(a, b) {
                var textA = a.title.toUpperCase();
                var textB = b.title.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
        populateCards();
    }

    function sortByGenre(objArray) {
           objArray.sort(function(a, b) {
                var textA = a.genre.toUpperCase();
                var textB = b.genre.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
        populateCards();
    }

     //  light the fuse by getting the db from glitch
    getEntireDB();

    // wire up the buttons
    $('#submit-edit').on('click', prepEdit);
    $('#submit-add').on('click', prepAdd);
    $('#submit-delete').on('click', prepDelete);
    $('#left-button').on('click', backOne);
    $('#right-button').on('click', fwdOne);

}());