// ========================================
// OMDb SETTINGS
// ========================================

const API_KEY = "42e69fd5";

const API_URL = "https://www.omdbapi.com/";


// ========================================
// MOVIE YEAR RANGE
// ========================================

const MIN_YEAR = 1920;

const MAX_YEAR = new Date().getFullYear();


// ========================================
// ALLOWED COUNTRIES
// ========================================
//
// We allow:
// Europe
// Japan
// North America
// South America
//
// Movies can have multiple countries.
// For example:
//
// "United States, United Kingdom"
// "France, Germany"
// "Japan, United States"
//
// As long as at least one of the
// countries belongs to our allowed
// regions, the movie can be accepted.
//

const ALLOWED_COUNTRIES = [

    // -------------------------
    // EUROPE
    // -------------------------

    "Albania",
    "Andorra",
    "Austria",
    "Belarus",
    "Belgium",
    "Bosnia and Herzegovina",
    "Bulgaria",
    "Croatia",
    "Cyprus",
    "Czech Republic",
    "Czechia",
    "Denmark",
    "Estonia",
    "Finland",
    "France",
    "Germany",
    "Greece",
    "Hungary",
    "Iceland",
    "Ireland",
    "Italy",
    "Kosovo",
    "Latvia",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Malta",
    "Moldova",
    "Monaco",
    "Montenegro",
    "Netherlands",
    "North Macedonia",
    "Norway",
    "Poland",
    "Portugal",
    "Romania",
    "Russia",
    "San Marino",
    "Serbia",
    "Slovakia",
    "Slovenia",
    "Spain",
    "Sweden",
    "Switzerland",
    "Turkey",
    "Ukraine",
    "United Kingdom",
    "UK",
    "Vatican City",

    // -------------------------
    // JAPAN
    // -------------------------

    "Japan",

    // -------------------------
    // NORTH AMERICA
    // -------------------------

    "United States",
    "USA",
    "United States of America",

    "Canada",

    "Mexico",

    "Guatemala",
    "Belize",
    "Honduras",
    "El Salvador",
    "Nicaragua",
    "Costa Rica",
    "Panama",

    "Cuba",
    "Haiti",
    "Dominican Republic",

    "Jamaica",
    "Bahamas",
    "Barbados",
    "Trinidad and Tobago",

    // -------------------------
    // SOUTH AMERICA
    // -------------------------

    "Argentina",
    "Bolivia",
    "Brazil",
    "Chile",
    "Colombia",
    "Ecuador",
    "Guyana",
    "Paraguay",
    "Peru",
    "Suriname",
    "Uruguay",
    "Venezuela"

];


// ========================================
// SEARCH WORDS
// ========================================
//
// OMDb requires an "s" search term.
//
// We use lots of different words to
// create a large pool of movies.
//

const SEARCH_WORDS = [

    "love",
    "man",
    "woman",
    "night",
    "day",
    "life",
    "world",
    "time",
    "home",
    "dead",
    "dark",
    "last",
    "first",
    "one",
    "two",
    "three",

    "war",
    "king",
    "queen",

    "boy",
    "girl",

    "city",
    "house",
    "road",

    "fire",
    "water",

    "black",
    "white",
    "red",
    "blue",
    "green",

    "star",
    "dream",
    "heart",
    "lost",

    "new",
    "old",

    "great",
    "little",
    "big",

    "american",
    "europe",
    "japan",

    "summer",
    "winter",

    "school",
    "family",
    "friend",

    "music",
    "story",
    "secret",

    "death",
    "blood",

    "future",
    "past",

    "space",
    "earth",
    "planet",

    "ghost",
    "game",
    "killer",
    "hero",

    "road",
    "street",
    "town",

    "dream",
    "dreams",

    "father",
    "mother",
    "child",

    "brother",
    "sister",

    "king",
    "princess",

    "river",
    "mountain",

    "train",
    "car",

    "hotel",
    "restaurant",

    "summer",
    "winter",

    "rain",
    "sun",

    "moon",
    "star",

    "journey",
    "journey"

];


// ========================================
// DOM ELEMENTS
// ========================================

const randomButton =
    document.getElementById(
        "randomButton"
    );


const movieTitle =
    document.getElementById(
        "movieTitle"
    );


const movieYear =
    document.getElementById(
        "movieYear"
    );


const movieRuntime =
    document.getElementById(
        "movieRuntime"
    );


const movieRating =
    document.getElementById(
        "movieRating"
    );


const movieGenre =
    document.getElementById(
        "movieGenre"
    );


const moviePlot =
    document.getElementById(
        "moviePlot"
    );


const movieDirector =
    document.getElementById(
        "movieDirector"
    );


const movieActors =
    document.getElementById(
        "movieActors"
    );


const movieCountry =
    document.getElementById(
        "movieCountry"
    );


const poster =
    document.getElementById(
        "poster"
    );


const posterPlaceholder =
    document.getElementById(
        "posterPlaceholder"
    );


const imdbLink =
    document.getElementById(
        "imdbLink"
    );


const statusText =
    document.getElementById(
        "status"
    );


// ========================================
// RANDOM NUMBER
// ========================================

function randomNumber(min, max) {

    return Math.floor(

        Math.random() *
        (max - min + 1)

    ) + min;

}


// ========================================
// RANDOM SEARCH
// ========================================

function getRandomSearch() {

    const word =
        SEARCH_WORDS[
            randomNumber(
                0,
                SEARCH_WORDS.length - 1
            )
        ];


    const year =
        randomNumber(
            MIN_YEAR,
            MAX_YEAR
        );


    const page =
        randomNumber(
            1,
            10
        );


    return {

        word,
        year,
        page

    };

}


// ========================================
// SEARCH OMDb
// ========================================

async function searchMovies(search) {

    const url =

        `${API_URL}` +

        `?apikey=${API_KEY}` +

        `&s=${encodeURIComponent(
            search.word
        )}` +

        `&type=movie` +

        `&page=${search.page}` +

        `&y=${search.year}`;


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            `HTTP error: ${response.status}`
        );

    }


    const data =
        await response.json();


    if (
        data.Response === "False"
    ) {

        return null;

    }


    return data;

}


// ========================================
// GET MOVIE DETAILS
// ========================================

async function getMovieDetails(
    imdbID
) {

    const url =

        `${API_URL}` +

        `?apikey=${API_KEY}` +

        `&i=${encodeURIComponent(
            imdbID
        )}` +

        `&plot=full`;


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            `HTTP error: ${response.status}`
        );

    }


    const data =
        await response.json();


    if (
        data.Response === "False"
    ) {

        throw new Error(
            data.Error ||
            "Movie not found"
        );

    }


    return data;

}


// ========================================
// NORMALIZE COUNTRY
// ========================================

function normalizeCountry(
    country
) {

    return country
        .trim()
        .toLowerCase();

}


// ========================================
// CHECK COUNTRY
// ========================================

function isAllowedCountry(
    countryString
) {

    if (
        !countryString ||
        countryString === "N/A"
    ) {

        return false;

    }


    const countries =
        countryString.split(",");


    return countries.some(
        country => {

            const normalized =
                normalizeCountry(
                    country
                );


            return ALLOWED_COUNTRIES
                .some(
                    allowed =>

                        normalized ===
                        normalizeCountry(
                            allowed
                        )
                );

        }
    );

}


// ========================================
// CHECK YEAR
// ========================================

function isAllowedYear(
    movie
) {

    if (!movie.Year) {

        return false;

    }


    // OMDb can sometimes return
    // values such as:
    //
    // "1999"
    // "1999–2001"
    //
    // We only care about the first year.

    const yearMatch =
        movie.Year.match(
            /\d{4}/
        );


    if (!yearMatch) {

        return false;

    }


    const year =
        Number(
            yearMatch[0]
        );


    return (
        year >= MIN_YEAR &&
        year <= MAX_YEAR
    );

}


// ========================================
// CHECK IF VALID MOVIE
// ========================================

function isValidMovie(
    movie
) {

    if (!movie) {

        return false;

    }


    // Must be a movie.

    if (
        movie.Type !== "movie"
    ) {

        return false;

    }


    // Must be between
    // 1920 and current year.

    if (
        !isAllowedYear(movie)
    ) {

        return false;

    }


    // Must be from one of
    // our allowed regions.

    if (
        !isAllowedCountry(
            movie.Country
        )
    ) {

        return false;

    }


    return true;

}


// ========================================
// DISPLAY MOVIE
// ========================================

function displayMovie(
    movie
) {

    movieTitle.textContent =
        movie.Title ||
        "Unknown Title";


    movieYear.textContent =
        `🎬 ${movie.Year || "—"}`;


    movieRuntime.textContent =
        `⏱ ${movie.Runtime || "—"}`;


    movieRating.textContent =
        `⭐ ${
            movie.imdbRating &&
            movie.imdbRating !== "N/A"
                ? movie.imdbRating
                : "N/A"
        }`;


    movieGenre.textContent =
        movie.Genre ||
        "Genre unknown";


    moviePlot.textContent =

        movie.Plot &&
        movie.Plot !== "N/A"

            ? movie.Plot

            : "No plot information available.";


    movieDirector.textContent =
        movie.Director ||
        "Unknown";


    movieActors.textContent =
        movie.Actors ||
        "Unknown";


    movieCountry.textContent =
        movie.Country ||
        "Unknown";


    // -------------------------
    // POSTER
    // -------------------------

    if (

        movie.Poster &&
        movie.Poster !== "N/A"

    ) {

        poster.src =
            movie.Poster;


        poster.style.display =
            "block";


        posterPlaceholder.style.display =
            "none";

    }

    else {

        poster.style.display =
            "none";


        posterPlaceholder.style.display =
            "flex";

    }


    // -------------------------
    // IMDb
    // -------------------------

    if (
        movie.imdbID
    ) {

        imdbLink.href =
            `https://www.imdb.com/title/${
                movie.imdbID
            }/`;


        imdbLink.style.display =
            "inline-block";

    }

    else {

        imdbLink.style.display =
            "none";

    }

}


// ========================================
// GET RANDOM MOVIE
// ========================================

async function getRandomMovie() {

    if (
        API_KEY ===
        "YOUR_OMDB_API_KEY"
    ) {

        statusText.textContent =
            "Add your OMDb API key to script.js first.";

        return;

    }


    randomButton.disabled =
        true;


    document.body.classList.add(
        "loading"
    );


    statusText.textContent =
        "Looking for a movie...";


    try {

        let validMovie =
            null;


        let attempts =
            0;


        /*
         * We try multiple searches.
         *
         * This is necessary because OMDb's
         * search API doesn't provide a
         * country/region filter.
         *
         * We therefore search and then
         * inspect the full movie details.
         */


        while (

            validMovie === null &&
            attempts < 20

        ) {

            attempts++;


            const search =
                getRandomSearch();


            statusText.textContent =
                `Searching for a movie... ${
                    attempts
                }/20`;


            try {

                const searchResults =
                    await searchMovies(
                        search
                    );


                if (
                    !searchResults ||
                    !searchResults.Search
                ) {

                    continue;

                }


                // Pick a random result.

                const randomResult =

                    searchResults.Search[
                        randomNumber(
                            0,
                            searchResults.Search.length - 1
                        )
                    ];


                statusText.textContent =
                    "Checking movie...";


                const movie =
                    await getMovieDetails(
                        randomResult.imdbID
                    );


                // Check year + country.

                if (
                    isValidMovie(movie)
                ) {

                    validMovie =
                        movie;

                }

            }

            catch (error) {

                console.warn(
                    "Search attempt failed:",
                    error
                );

            }

        }


        // -------------------------
        // NO MOVIE FOUND
        // -------------------------

        if (!validMovie) {

            throw new Error(

                "Couldn't find a suitable movie. " +
                "Try again."

            );

        }


        // -------------------------
        // DISPLAY
        // -------------------------

        displayMovie(
            validMovie
        );


        statusText.textContent =

            `Found a ${
                validMovie.Country
            } movie 🎬`;

    }


    catch (error) {

        console.error(
            error
        );


        movieTitle.textContent =
            "Nothing found";


        moviePlot.textContent =
            error.message;


        statusText.textContent =
            "Try pressing the button again.";

    }


    randomButton.disabled =
        false;


    document.body.classList.remove(
        "loading"
    );

}


// ========================================
// BUTTON
// ========================================

randomButton.addEventListener(
    "click",
    getRandomMovie
);