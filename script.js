// ========================================
// OMDb
// ========================================

const API_KEY = "42e69fd5";

const API_URL = "https://www.omdbapi.com/";


// ========================================
// YEAR RANGE
// ========================================

const MIN_YEAR = 1920;

const MAX_YEAR =
    new Date().getFullYear();


// ========================================
// ALLOWED COUNTRIES
// ========================================

const ALLOWED_COUNTRIES = [

    // EUROPE

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

    // JAPAN

    "Japan",

    // NORTH AMERICA

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

    // SOUTH AMERICA

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
    "father",
    "mother",
    "child",
    "brother",
    "sister",
    "princess",
    "river",
    "mountain",
    "train",
    "car",
    "hotel",
    "journey"

];


// ========================================
// GAME STATE
// ========================================

let timeline = [];

let currentMovie = null;

let score = 0;

let gameOver = false;


// ========================================
// DOM
// ========================================

const movieCard =
    document.getElementById(
        "movieCard"
    );


const movieTitle =
    document.getElementById(
        "movieTitle"
    );


const timelineElement =
    document.getElementById(
        "timeline"
    );


const scoreElement =
    document.getElementById(
        "score"
    );


const statusElement =
    document.getElementById(
        "status"
    );


const newGameButton =
    document.getElementById(
        "newGameButton"
    );


const resultOverlay =
    document.getElementById(
        "resultOverlay"
    );


const resultIcon =
    document.getElementById(
        "resultIcon"
    );


const resultTitle =
    document.getElementById(
        "resultTitle"
    );


const resultMessage =
    document.getElementById(
        "resultMessage"
    );


const finalScore =
    document.getElementById(
        "finalScore"
    );


const playAgainButton =
    document.getElementById(
        "playAgainButton"
    );


// ========================================
// RANDOM NUMBER
// ========================================

function randomNumber(
    min,
    max
) {

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

async function searchMovies(
    search
) {

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
            `HTTP ${response.status}`
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
// MOVIE DETAILS
// ========================================

async function getMovieDetails(
    imdbID
) {

    const url =

        `${API_URL}` +

        `?apikey=${API_KEY}` +

        `&i=${encodeURIComponent(
            imdbID
        )}`;


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            `HTTP ${response.status}`
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
// COUNTRY CHECK
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
                country
                    .trim()
                    .toLowerCase();


            return ALLOWED_COUNTRIES.some(
                allowed =>

                    normalized ===
                    allowed
                        .toLowerCase()
            );

        }
    );

}


// ========================================
// YEAR
// ========================================

function getMovieYear(
    movie
) {

    if (!movie.Year) {

        return null;

    }


    /*
        We deliberately reject
        movies with ranges such as:

        1999–2001

        because the game needs
        one exact year.
    */

    if (
        !/^\d{4}$/.test(
            movie.Year
        )
    ) {

        return null;

    }


    return Number(
        movie.Year
    );

}


// ========================================
// VALID MOVIE
// ========================================

function isValidMovie(
    movie
) {

    if (!movie) {

        return false;

    }


    if (
        movie.Type !== "movie"
    ) {

        return false;

    }


    const year =
        getMovieYear(
            movie
        );


    if (
        year === null
    ) {

        return false;

    }


    if (
        year < MIN_YEAR ||
        year > MAX_YEAR
    ) {

        return false;

    }


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
// GET RANDOM MOVIE
// ========================================

async function getRandomMovie() {

    if (
        API_KEY ===
        "YOUR_OMDB_API_KEY"
    ) {

        throw new Error(
            "Add your OMDb API key to script.js"
        );

    }


    /*
        We try multiple searches because
        many random searches will return
        movies that don't meet our country
        or year requirements.
    */

    for (
        let attempt = 0;
        attempt < 25;
        attempt++
    ) {

        const search =
            getRandomSearch();


        statusElement.textContent =
            `Finding movie... ${
                attempt + 1
            }/25`;


        try {

            const results =
                await searchMovies(
                    search
                );


            if (
                !results ||
                !results.Search
            ) {

                continue;

            }


            /*
                Rather than always taking
                the first result, shuffle
                through the results.
            */

            const shuffled =
                [...results.Search]
                    .sort(
                        () =>
                            Math.random() -
                            0.5
                    );


            for (
                const result
                of shuffled
            ) {

                const movie =
                    await getMovieDetails(
                        result.imdbID
                    );


                if (
                    isValidMovie(
                        movie
                    )
                ) {

                    return movie;

                }

            }

        }

        catch (error) {

            console.warn(
                error
            );

        }

    }


    throw new Error(
        "Couldn't find a suitable movie."
    );

}


// ========================================
// CREATE STARTING GAME
// ========================================

async function startGame() {

    gameOver = false;

    score = 0;

    timeline = [];


    scoreElement.textContent =
        score;


    resultOverlay.classList.add(
        "hidden"
    );


    statusElement.textContent =
        "Creating your timeline...";


    movieTitle.textContent =
        "Loading...";


    movieCard.draggable =
        false;


    /*
        Generate a random starting year.
    */

    const startingYear =
        randomNumber(
            MIN_YEAR,
            MAX_YEAR
        );


    timeline.push({

        title: "Starting Year",

        year: startingYear,

        starting: true

    });


    renderTimeline();


    /*
        Now get the first movie.
    */

    try {

        await loadNextMovie();

    }

    catch (error) {

        console.error(
            error
        );


        statusElement.textContent =
            error.message;

    }

}


// ========================================
// LOAD NEXT MOVIE
// ========================================

async function loadNextMovie() {

    statusElement.textContent =
        "Finding a movie...";


    movieCard.draggable =
        false;


    currentMovie =
        await getRandomMovie();


    movieTitle.textContent =
        currentMovie.Title;


    movieCard.draggable =
        true;


    statusElement.textContent =
        "Drag the movie into the correct position.";

}


// ========================================
// RENDER TIMELINE
// ========================================

function renderTimeline() {

    timelineElement.innerHTML =
        "";


    /*
        Sort timeline by year.
    */

    timeline.sort(
        (a, b) =>
            a.year - b.year
    );


    const container =
        document.createElement(
            "div"
        );


    container.className =
        "timeline-container";


    /*
        There is a drop zone before
        every movie and one after the
        final movie.

        Example:

        DROP → 1985 → DROP → 1990 → DROP
    */


    timeline.forEach(
        (movie, index) => {

            /*
                DROP ZONE
            */

            const dropZone =
                createDropZone(
                    index
                );


            container.appendChild(
                dropZone
            );


            /*
                MOVIE
            */

            const movieElement =
                createTimelineMovie(
                    movie
                );


            container.appendChild(
                movieElement
            );

        }
    );


    /*
        Final drop zone
    */

    const finalDropZone =
        createDropZone(
            timeline.length
        );


    container.appendChild(
        finalDropZone
    );


    timelineElement.appendChild(
        container
    );

}


// ========================================
// CREATE TIMELINE MOVIE
// ========================================

function createTimelineMovie(
    movie
) {

    const element =
        document.createElement(
            "div"
        );


    element.className =
        "timeline-movie";


    const dot =
        document.createElement(
            "div"
        );


    dot.className =
        "timeline-dot";


    const year =
        document.createElement(
            "div"
        );


    year.className =
        "timeline-year";


    year.textContent =
        movie.year;


    const title =
        document.createElement(
            "div"
        );


    title.className =
        "timeline-title";


    title.textContent =
        movie.title;


    element.appendChild(
        dot
    );


    element.appendChild(
        year
    );


    /*
        Only show the title of
        movies that have already
        been successfully placed.
    */

    if (
        !movie.starting
    ) {

        element.appendChild(
            title
        );

    }


    return element;

}


// ========================================
// CREATE DROP ZONE
// ========================================

function createDropZone(
    position
) {

    const zone =
        document.createElement(
            "div"
        );


    zone.className =
        "drop-zone";


    zone.dataset.position =
        position;


    /*
        Drag enters the zone.
    */

    zone.addEventListener(
        "dragover",
        event => {

            event.preventDefault();

            zone.classList.add(
                "active"
            );

        }
    );


    /*
        Drag leaves.
    */

    zone.addEventListener(
        "dragleave",
        () => {

            zone.classList.remove(
                "active"
            );

        }
    );


    /*
        Movie dropped.
    */

    zone.addEventListener(
        "drop",
        event => {

            event.preventDefault();

            zone.classList.remove(
                "active"
            );


            if (
                !currentMovie ||
                gameOver
            ) {

                return;

            }


            const position =
                Number(
                    zone.dataset.position
                );


            checkPlacement(
                position
            );

        }
    );


    return zone;

}


// ========================================
// DRAG START
// ========================================

movieCard.addEventListener(
    "dragstart",
    event => {

        if (
            !currentMovie ||
            gameOver
        ) {

            event.preventDefault();

            return;

        }


        movieCard.classList.add(
            "dragging"
        );


        event.dataTransfer.effectAllowed =
            "move";

    }
);


// ========================================
// DRAG END
// ========================================

movieCard.addEventListener(
    "dragend",
    () => {

        movieCard.classList.remove(
            "dragging"
        );

    }
);


// ========================================
// CHECK PLACEMENT
// ========================================

async function checkPlacement(
    position
) {

    if (
        !currentMovie ||
        gameOver
    ) {

        return;

    }


    /*
        We determine the allowed range
        for this position.

        Example:

        1985 | 1990

        The movie is correct if:

        1985 < movie year < 1990

        We also allow equality at the
        boundaries, although movies with
        the exact same year require a
        special rule.
    */


    let correct = false;


    if (
        timeline.length === 1
    ) {

        /*
            Only the starting year exists.

            Position 0 = before
            Position 1 = after
        */

        if (
            position === 0
        ) {

            correct =
                currentMovie.Year <
                timeline[0].year;

        }

        else {

            correct =
                currentMovie.Year >
                timeline[0].year;

        }

    }

    else {

        /*
            Timeline is already sorted.
        */

        if (
            position === 0
        ) {

            correct =
                currentMovie.Year <=
                timeline[0].year;

        }

        else if (
            position === timeline.length
        ) {

            correct =
                currentMovie.Year >=
                timeline[
                    timeline.length - 1
                ].year;

        }

        else {

            const previous =
                timeline[
                    position - 1
                ].year;


            const next =
                timeline[
                    position
                ].year;


            correct =

                currentMovie.Year >=
                previous &&

                currentMovie.Year <=
                next;

        }

    }


    if (correct) {

        await handleCorrectAnswer(
            position
        );

    }

    else {

        handleWrongAnswer(
            position
        );

    }

}


// ========================================
// CORRECT
// ========================================

async function handleCorrectAnswer(
    position
) {

    score++;

    scoreElement.textContent =
        score;


    statusElement.textContent =
        `✓ Correct! ${
            currentMovie.Title
        } was released in ${
            currentMovie.Year
        }. +1 point`;


    statusElement.className =
        "status success";


    /*
        Add movie to timeline.
    */

    timeline.push({

        title:
            currentMovie.Title,

        year:
            currentMovie.Year,

        starting:
            false

    });


    renderTimeline();


    /*
        Temporarily disable the card.
    */

    movieCard.draggable =
        false;


    currentMovie =
        null;


    /*
        Wait a moment so the player
        can see the successful result.
    */

    await wait(900);


    statusElement.className =
        "status";


    /*
        Get next movie.
    */

    try {

        await loadNextMovie();

    }

    catch (error) {

        console.error(
            error
        );


        statusElement.textContent =
            error.message;

    }

}


// ========================================
// WRONG
// ========================================

function handleWrongAnswer(
    position
) {

    gameOver =
        true;


    movieCard.draggable =
        false;


    /*
        Find the correct position
        visually so we can explain
        what happened.
    */

    const actualYear =
        currentMovie.Year;


    statusElement.textContent =
        `✗ Wrong! ${
            currentMovie.Title
        } was released in ${
            actualYear
        }.`;

    statusElement.className =
        "status error";


    /*
        Show the movie's real year
        before ending the game.
    */

    setTimeout(
        () => {

            showGameOver();

        },
        800
    );

}


// ========================================
// GAME OVER
// ========================================

function showGameOver() {

    resultIcon.textContent =
        "❌";


    resultTitle.textContent =
        "Game Over";


    resultMessage.innerHTML =

        `<strong>${
            currentMovie.Title
        }</strong> was released in ${
            currentMovie.Year
        }.`;


    finalScore.textContent =
        score;


    resultOverlay.classList.remove(
        "hidden"
    );

}


// ========================================
// WAIT
// ========================================

function wait(
    milliseconds
) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milliseconds
            )
    );

}


// ========================================
// BUTTONS
// ========================================

newGameButton.addEventListener(
    "click",
    startGame
);


playAgainButton.addEventListener(
    "click",
    startGame
);


// ========================================
// START
// ========================================

startGame();