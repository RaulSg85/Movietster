// ========================================
// OMDb CONFIGURATION
// ========================================

const API_KEY = "42e69fd5";

const API_URL = "https://www.omdbapi.com/";


const MIN_YEAR = 1920;

const MAX_YEAR =
    new Date().getFullYear();


// ========================================
// SEARCH TERMS
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
    "star",
    "dream",
    "heart",
    "lost",
    "new",
    "old",
    "great",
    "little",
    "big",
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
    "ghost",
    "game",
    "hero",
    "father",
    "mother",
    "child",
    "brother",
    "sister",
    "train",
    "car",
    "hotel",
    "journey"

];


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
// GAME STATE
// ========================================

let timeline = [];

let currentMovie = null;

let score = 0;

let gameOver = false;


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

    return {
        word,
        year
    };

}


// ========================================
// OMDb SEARCH
// ========================================

async function searchMovies(
    search
) {

    const url =
        `${API_URL}?apikey=${API_KEY}` +
        `&s=${encodeURIComponent(search.word)}` +
        `&type=movie` +
        `&y=${search.year}`;


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            `OMDb HTTP error: ${response.status}`
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
        `${API_URL}?apikey=${API_KEY}` +
        `&i=${encodeURIComponent(imdbID)}`;


    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            `OMDb HTTP error: ${response.status}`
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
        countryString
            .split(",")
            .map(
                country =>
                    country
                        .trim()
                        .toLowerCase()
            );


    const allowedCountries = [

        // Europe

        "albania",
        "andorra",
        "austria",
        "belarus",
        "belgium",
        "bosnia and herzegovina",
        "bulgaria",
        "croatia",
        "cyprus",
        "czech republic",
        "czechia",
        "denmark",
        "estonia",
        "finland",
        "france",
        "germany",
        "greece",
        "hungary",
        "iceland",
        "ireland",
        "italy",
        "latvia",
        "lithuania",
        "luxembourg",
        "malta",
        "monaco",
        "montenegro",
        "netherlands",
        "norway",
        "poland",
        "portugal",
        "romania",
        "russia",
        "serbia",
        "slovakia",
        "slovenia",
        "spain",
        "sweden",
        "switzerland",
        "turkey",
        "ukraine",
        "united kingdom",

        // Japan

        "japan",

        // North America

        "united states",
        "usa",
        "canada",
        "mexico",
        "guatemala",
        "belize",
        "honduras",
        "el salvador",
        "nicaragua",
        "costa rica",
        "panama",
        "cuba",
        "haiti",
        "dominican republic",
        "jamaica",
        "bahamas",
        "barbados",
        "trinidad and tobago",

        // South America

        "argentina",
        "bolivia",
        "brazil",
        "chile",
        "colombia",
        "ecuador",
        "guyana",
        "paraguay",
        "peru",
        "suriname",
        "uruguay",
        "venezuela"

    ];


    return countries.some(
        country =>
            allowedCountries.includes(
                country
            )
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


    /*
        We only accept an exact
        four-digit year.
    */

    if (
        !/^\d{4}$/.test(
            movie.Year
        )
    ) {

        return false;

    }


    const year =
        Number(movie.Year);


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
// FIND RANDOM MOVIE
// ========================================

async function getRandomMovie() {

    for (
        let attempt = 0;
        attempt < 30;
        attempt++
    ) {

        statusElement.textContent =
            `Finding a movie... ${
                attempt + 1
            }/30`;


        const search =
            getRandomSearch();


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

                /*
                    Don't allow the same
                    movie twice.
                */

                if (
                    timeline.some(
                        movie =>
                            movie.imdbID ===
                            result.imdbID
                    )
                ) {

                    continue;

                }


                const details =
                    await getMovieDetails(
                        result.imdbID
                    );


                if (
                    isValidMovie(
                        details
                    )
                ) {

                    return details;

                }

            }

        }

        catch (error) {

            console.error(
                error
            );

        }

    }


    throw new Error(
        "Unable to find a suitable movie."
    );

}


// ========================================
// START GAME
// ========================================

async function startGame() {

    /*
        IMPORTANT:
        Hide the game-over screen.
    */

    resultOverlay.classList.remove(
        "visible"
    );


    score = 0;

    gameOver = false;

    currentMovie = null;

    timeline = [];


    scoreElement.textContent =
        "0";


    movieTitle.textContent =
        "Loading...";


    movieCard.draggable =
        false;


    statusElement.className =
        "status";


    /*
        Generate the starting year.
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


    /*
        SHOW THE STARTING YEAR
        IMMEDIATELY.
    */

    renderTimeline();


    statusElement.textContent =
        `Your starting year is ${
            startingYear
        }. Find a movie to place!`;


    try {

        await loadNextMovie();

    }

    catch (error) {

        console.error(
            error
        );


        statusElement.textContent =
            "Could not load a movie. Check your OMDb API key.";

    }

}


// ========================================
// LOAD MOVIE
// ========================================

async function loadNextMovie() {

    movieCard.draggable =
        false;


    currentMovie =
        await getRandomMovie();


    movieTitle.textContent =
        currentMovie.Title;


    movieCard.draggable =
        true;


    statusElement.className =
        "status";


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
        Sort oldest → newest.
    */

    timeline.sort(
        (a, b) =>
            a.year - b.year
    );


    const timelineDiv =
        document.createElement(
            "div"
        );


    timelineDiv.className =
        "timeline";


    const container =
        document.createElement(
            "div"
        );


    container.className =
        "timeline-container";


    timeline.forEach(
        (movie, index) => {

            /*
                Drop zone before movie.
            */

            container.appendChild(
                createDropZone(
                    index
                )
            );


            /*
                Movie marker.
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
        Final drop zone.
    */

    container.appendChild(
        createDropZone(
            timeline.length
        )
    );


    timelineDiv.appendChild(
        container
    );


    timelineElement.appendChild(
        timelineDiv
    );

}


// ========================================
// TIMELINE MOVIE
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


    if (
        movie.starting
    ) {

        element.classList.add(
            "starting"
        );

    }


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


    element.appendChild(
        dot
    );


    element.appendChild(
        year
    );


    /*
        Don't show "Starting Year"
        as a movie title.
    */

    if (
        !movie.starting
    ) {

        const title =
            document.createElement(
                "div"
            );


        title.className =
            "timeline-title";


        title.textContent =
            movie.title;


        element.appendChild(
            title
        );

    }


    return element;

}


// ========================================
// DROP ZONE
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


    zone.addEventListener(
        "dragover",
        event => {

            event.preventDefault();

            if (
                !gameOver &&
                currentMovie
            ) {

                zone.classList.add(
                    "active"
                );

            }

        }
    );


    zone.addEventListener(
        "dragleave",
        () => {

            zone.classList.remove(
                "active"
            );

        }
    );


    zone.addEventListener(
        "drop",
        event => {

            event.preventDefault();

            zone.classList.remove(
                "active"
            );


            if (
                gameOver ||
                !currentMovie
            ) {

                return;

            }


            checkPlacement(
                position
            );

        }
    );


    return zone;

}


// ========================================
// DRAG EVENTS
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

function checkPlacement(
    position
) {

    const movieYear =
        Number(
            currentMovie.Year
        );


    let correct = false;


    /*
        Before the oldest movie.
    */

    if (
        position === 0
    ) {

        correct =
            movieYear <=
            timeline[0].year;

    }


    /*
        After the newest movie.
    */

    else if (
        position === timeline.length
    ) {

        correct =
            movieYear >=
            timeline[
                timeline.length - 1
            ].year;

    }


    /*
        Between two movies.
    */

    else {

        const previousYear =
            timeline[
                position - 1
            ].year;


        const nextYear =
            timeline[
                position
            ].year;


        correct =

            movieYear >=
            previousYear &&

            movieYear <=
            nextYear;

    }


    if (correct) {

        handleCorrectAnswer();

    }

    else {

        handleWrongAnswer();

    }

}


// ========================================
// CORRECT ANSWER
// ========================================

async function handleCorrectAnswer() {

    score++;

    scoreElement.textContent =
        score;


    statusElement.className =
        "status success";


    statusElement.textContent =
        `✓ Correct! ${
            currentMovie.Title
        } was released in ${
            currentMovie.Year
        }. +1 point`;


    timeline.push({

        title:
            currentMovie.Title,

        year:
            Number(
                currentMovie.Year
            ),

        imdbID:
            currentMovie.imdbID,

        starting:
            false

    });


    renderTimeline();


    movieCard.draggable =
        false;


    currentMovie =
        null;


    await wait(1000);


    if (
        gameOver
    ) {

        return;

    }


    try {

        await loadNextMovie();

    }

    catch (error) {

        console.error(
            error
        );


        statusElement.textContent =
            "Could not load the next movie.";

    }

}


// ========================================
// WRONG ANSWER
// ========================================

function handleWrongAnswer() {

    gameOver = true;


    movieCard.draggable =
        false;


    statusElement.className =
        "status error";


    statusElement.textContent =
        `✗ Wrong! ${
            currentMovie.Title
        } was released in ${
            currentMovie.Year
        }.`;


    setTimeout(
        showGameOver,
        900
    );

}


// ========================================
// GAME OVER
// ========================================

function showGameOver() {

    resultMessage.innerHTML =
        `<strong>${
            currentMovie.Title
        }</strong> was released in ${
            currentMovie.Year
        }.`;


    finalScore.textContent =
        score;


    /*
        Explicitly show the overlay.
    */

    resultOverlay.classList.add(
        "visible"
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