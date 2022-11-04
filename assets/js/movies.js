"use strict";

(function () {
//  https://northern-magenta-cashew.glitch.me/movies

/* TODO
styling:
opacity ot panels
middle panel less transparrent
make panel 1 and 3 disappear in less than medium size
make arrows more visible
title styling more visible / cool
three buttons side-by-side instead of stacked
column sizes
card 1 and 3 shorter or smaller too
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

Use modals for the creating and editing movie forms.

Add a genre property to every movie.  look up genres in api

Allow users to sort the movies by rating, title, or genre (if you have it).  kinda like coffee project?

Allow users to search through the movies by rating, title, or genre (if you have it). kinda like coffee project?

Use a free movie API like OMDB to include extra info or render movie posters.

The id property of every movie should not be edited by hand. The purpose of this property is to uniquely identify that particular movie. That is, if we want to delete or modify an existing movie, we can specify what movie we want to change by referencing it's id. When a new movie is created (i.e. when you send a POST request to /movies with a title and a rating), the server will respond with the movie object that was created, including a generated id.     --->  have an array that is updated after each action
  */
let movieDB;

    function getEntireDB() {
        const url = 'https://northern-magenta-cashew.glitch.me/movies';
        return fetch(url)
            .then((response) => response.json())
            .then((data) => {
                movieDB = data;  // assign entire json file to an array
                console.log(movieDB);
            })
            .catch(() => console.log("There was an error loading the database"));
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
                console.log('The new movie was added.');
                movieDB.push(bodyStr);
                console.log(movieDB);
            })
            .catch(() => console.log("There was an error adding a new movie"));
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
                console.log('The new movie was added.');
                let delIdx;
                for (let i = 0; i < movieDB.length; i ++) {
                    if (movieDB[i].id === id) {
                        delIdx = i;
                    }
                }
                movieDB.splice(delIdx, 0);
                console.log(movieDB);
            })
            .catch(() => {
                console.log("There was an error deleting the movie");
            });
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
                console.log('The new movie was added.');
                let editIdx;
                for (let i = 0; i < movieDB.length; i ++) {
                    if (movieDB[i].id === id) {
                        editIdx = i;
                    }
                }
                movieDB.splice(editIdx, 1, bodyStr);
                console.log(movieDB);
            })
            .catch(() => {
                console.log("There was an error editing the movie");
            });
    };

    function getPoster() {
        //https://www.themoviedb.org/authenticate/${TMDB_KEY}/search/movie
        //https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query='Apocalypse%20Now'&language=en-US&page=1&include_adult=false
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query='Apocalypse%20Now'&language=en-US&page=1&include_adult=false`;
        const options = {
            method: 'GET',
        };
        fetch(url, options)
            .then((result) => result.json())
            .then((result) => {
                $('#poster').css('background-image', `url("https://image.tmdb.org/t/p/original${result.results[0].poster_path}")`);
//                console.log(result[0].poster_path);
                console.log(result.results[0].poster_path);
            })
            .catch(/* handle errors */);
    }

    // editMovie(288);
//    console.log(authenticate());
    //getPoster();
    getEntireDB();
    //let newMovie = {title: 'Baby Driver', genre: 'Crime', rating: 'R', director: 'Who knows'};
    //addMovie(newMovie);
    //let idNum = 289;
    //deleteMovie(idNum);
    //let editId = 288;
    //let revisedMovie = {title: 'Apocalypse Now', genre: 'Vietnam War', rating: 'R', director: 'Francis Ford Coppola'};
    //editMovie(editId, revisedMovie);
}());