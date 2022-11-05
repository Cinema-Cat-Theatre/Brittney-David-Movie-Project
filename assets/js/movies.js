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
wire up the button to function
functions that clean up the array. sort the array, clean up database, keep generated ids
get genres api
load page
    Display a "loading..." message
    Make an AJAX request to get a listing of all the movies
    When the initial AJAX request comes back, remove the "loading..." message and replace it with HTML generated from the json response your code receives
    ---> an html element who's display attribute changes from block to none upon api success.  Then show all movies as cards in a carousel? https://getbootstrap.com/docs/5.2/components/carousel/ having global var that = currently displayed movie and have buttons under carousel that do what is requested below

    Allow users to add new movies
    Create a form for adding a new movie that has fields for the movie's title and rating
    When the form is submitted, the page should not reload / refresh, instead, your javascript should make a POST request to /movies with the information the user put into the form
    ---> Simple post

    Allow users to edit existing movies
    Give users the option to edit an existing movie
    A form should be pre-populated with the selected movie's details
    Like creating a movie, this should not involve any page reloads, instead your javascript code should make an ajax request when the form is submitted.
    ---> if movie is showing in carousel, then "edit" button will populate and submit button puts data

    Delete movies
    Each movie should have a "delete" button
    When this button is clicked, your javascript should send a DELETE request - have a "are you sure?" modal: https://getbootstrap.com/docs/5.2/components/modal/#how-it-works

    Bonuses
    Add a disabled attribute to buttons while their corresponding ajax request is still pending.
    no problem

Show a loading animation instead of just text that says "loading...".

Add a genre property to every movie.  look up genres in api

Allow users to sort the movies by rating, title, or genre (if you have it).  kinda like coffee project?

Allow users to search through the movies by rating, title, or genre (if you have it). kinda like coffee project?

Use a free movie API like OMDB to include extra info or render movie posters.

The id property of every movie should not be edited by hand. The purpose of this property is to uniquely identify that particular movie. That is, if we want to delete or modify an existing movie, we can specify what movie we want to change by referencing it's id. When a new movie is created (i.e. when you send a POST request to /movies with a title and a rating), the server will respond with the movie object that was created, including a generated id.     --->  have an array that is updated after each action
  */
let movieDB;
let currentMovieIndexNum = 0;
let genreList;

    function getEntireDB() {
        const url = 'https://northern-magenta-cashew.glitch.me/movies';
        return fetch(url)
            .then((response) => response.json())
            .then((data) => {
                movieDB = data;  // assign entire json file to an array
                getGenreList();
            })
            .catch(() => console.log("There was an error loading the database"));
    }

    function populateCards() {
        //card 1
        $('#card1-title').text(`${JSON.stringify(movieDB[checkMovieIndex(currentMovieIndexNum - 1)].title)}`);
        getPoster(`${JSON.stringify(movieDB[checkMovieIndex(currentMovieIndexNum - 1)].title)}`, 1);
        //card 2
        $('#featured-title').text(`${JSON.stringify(movieDB[checkMovieIndex(currentMovieIndexNum)].title)}`);
        $('#featured-director').text(`${JSON.stringify(movieDB[checkMovieIndex(currentMovieIndexNum)].director)}`);
        $('#featured-rating').text(`${JSON.stringify(movieDB[checkMovieIndex(currentMovieIndexNum)].rating)}`);
        $('#movie-count').text(`${currentMovieIndexNum+1} of ${movieDB.length}`);
        getPoster(`${JSON.stringify(movieDB[checkMovieIndex(currentMovieIndexNum)].title)}`, 2);
        //card 3
        $('#card3-title').text(`${JSON.stringify(movieDB[checkMovieIndex(currentMovieIndexNum + 1)].title)}`);
        getPoster(`${JSON.stringify(movieDB[checkMovieIndex(currentMovieIndexNum + 1)].title)}`, 3);
    }

    function checkMovieIndex(num) {
        let newIdx = num
        if (num < 0) {
            newIdx = movieDB.length-1;
        }
        if (num >= movieDB.length)  {
            newIdx = 0;
        }
        return newIdx;
    }

    function prepAdd(e) {
        e.preventDefault();
        let idNum = movieDB[currentMovieIndexNum].id;
        //figure out the id number of the editing movie, build the body from the form, then call the transaction
        //let newMovie = {title: 'Baby Driver', genre: 'Crime', rating: 'R', director: 'Who knows'};
        //addMovie(newMovie);
        let addTitle = document.querySelector('#add-title').value;
        let addRating = document.querySelector('#add-rating').value;
        let addDirector = document.querySelector('#add-director').value;
        let addString = {title: `${addTitle}`, rating: `${addRating}`, director: `${addDirector}`};
        addMovie(addString);
    }

    function addMovie(bodyStr) {
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
                movieDB.push(bodyStr);
            })
            .catch(() => console.log("There was an error adding a new movie"));
    }

    function prepEdit(e) {
        e.preventDefault();
        //populate form
        //figure out the id number of the editing movie, build the body from the form, then call the transaction
    }

    function editMovie(id, bodyStr) {//  PUT is basically the same as replace, and PATCH is the same as append
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
                let editIdx;
                for (let i = 0; i < movieDB.length; i ++) {
                    if (movieDB[i].id === id) {
                        editIdx = i;
                    }
                }
                movieDB.splice(editIdx, 1, bodyStr);
            })
            .catch(() => {
                console.log("There was an error editing the movie");
            });
    }

    function prepDelete(e) {
        e.preventDefault();
        //figure out the id number of the deleting movie then call the transaction
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
                console.log('The new movie was deleted.');
                let delIdx;
                for (let i = 0; i < movieDB.length; i ++) {
                    if (movieDB[i].id === id) {
                        delIdx = i;
                    }
                }
                movieDB.splice(delIdx, 0);
            })
            .catch(() => {
                console.log("There was an error deleting the movie");
            });
    }

    function getPoster(title, whichCard) {
         title = encodeURIComponent(title);
       const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query='${title}'&language=en-US&page=1&include_adult=false`;
        const options = {
            method: 'GET',
        };
        fetch(url, options)
            .then((result) => result.json())
            .then((result) => {
                switch (whichCard) {
                    case 1:
                        $('#card1-movie-poster').attr("src", `https://image.tmdb.org/t/p/original${result.results[0].poster_path}`);
                        break;
                    case 2:
                        $('#current-movie-poster').attr("src", `https://image.tmdb.org/t/p/original${result.results[0].poster_path}`);
                        // $('#featured-genre').text(getGenreName(result.results[0].genre_ids[0]));
                        $('#featured-genre').text(movieDB[currentMovieIndexNum].genre);
                        break;
                    case 3:
                        $('#card3-movie-poster').attr("src", `https://image.tmdb.org/t/p/original${result.results[0].poster_path}`);                         $('#card1-genre').attr("src", `https://image.tmdb.org/t/p/original${result.results[0].poster_path}`);
                        break;
                }
            })
            .catch(() => (console.log("Something went wrong loading the poster")));
    }

    function getGenreList() {
        const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_KEY}`;
        const options = {
            method: 'GET',
        };
        fetch(url, options)
            .then((result) => result.json())
            .then((result) => {
                genreList = result.genres;
                updateGenres();
            })
            .catch(() => (console.log("Something went wrong loading the poster")));
    }

    function updateGenres() {
        movieDB.forEach((element, index) => {
            getGenre(element.title, index);
        });
        populateCards();
    }

    function getGenre(title, index) {
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

    function getGenreName(genreId) {
        let name = "unknown";
        for (let i = 0; i < genreList.length; i++) {
            if (genreList[i].id === genreId) {
                name = genreList[i].name;
            }
        }
        return name;
    }

    function fwdOne() {
            currentMovieIndexNum++;
            if (currentMovieIndexNum === movieDB.length) {
                currentMovieIndexNum = 0;
            }
            populateCards();
    }

    function backOne() {
        currentMovieIndexNum--;
        if (currentMovieIndexNum < 0) {
            currentMovieIndexNum = movieDB.length - 1;
        }
        populateCards()
    }

    // editMovie(288);
//    console.log(authenticate());
    //getPoster();
    getEntireDB();

    //let idNum = 289;
    //deleteMovie(idNum);
    // let editId = 287;
    // let revisedMovie = {title: 'Reservoir Dogs', genre: 'Crime', rating: 'R', director: 'Quentin Tarantino'};
    // editMovie(editId, revisedMovie);
    //getPoster("apocalypse Now", 2);
    $('#submit-edit').on('click', prepEdit);
    $('#submit-add').on('click', prepAdd);
    $('#submit-delete').on('click', prepDelete);
    $('#left-button').on('click', backOne);
    $('#right-button').on('click',  fwdOne);

}());