// ========================================
// OMDb CONFIGURATION
// ========================================

const API_KEY = "42e69fd5";

const API_URL = "https://www.omdbapi.com/";


const MIN_YEAR = 1920;

const MAX_YEAR =
    new Date().getFullYear();


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
// DRAG STATE
// ========================================

let isDragging = false;

let dragGhost = null;

let activeDropZone = null;

let dragPointerId = null;


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
// SEARCH OMDb
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
// ALLOWED COUNTRIES
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

        // ==================================
        // EUROPE
        // ==================================

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
        "liechtenstein",
        "lithuania",
        "luxembourg",
        "malta",
        "moldova",
        "monaco",
        "montenegro",
        "netherlands",
        "north macedonia",
        "norway",
        "poland",
        "portugal",
        "romania",
        "russia",
        "san marino",
        "serbia",
        "slovakia",
        "slovenia",
        "spain",
        "sweden",
        "switzerland",
        "turkey",
        "ukraine",
        "united kingdom",
        "vatican city",

        // ==================================
        // JAPAN
        // ==================================

        "japan",

        // ==================================
        // NORTH AMERICA
        // ==================================

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

        // ==================================
        // SOUTH AMERICA
        // ==================================

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
                    Don't use a movie
                    already in the timeline.
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
        Stop any active drag.
    */

    cancelDrag();


    /*
        Hide Game Over.
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


    movieCard.classList.remove(
        "dragging"
    );


    /*
        Generate starting year.
    */

    const startingYear =
        randomNumber(
            MIN_YEAR,
            MAX_YEAR
        );


    timeline.push({

        title:
            "Starting Year",

        year:
            startingYear,

        starting:
            true

    });


    /*
        Render immediately so
        the player can see their
        starting year.
    */

    renderTimeline();


    statusElement.className =
        "status";


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
// LOAD NEXT MOVIE
// ========================================

async function loadNextMovie() {

    movieCard.style.pointerEvents =
        "none";


    currentMovie =
        await getRandomMovie();


    movieTitle.textContent =
        currentMovie.Title;


    movieCard.style.pointerEvents =
        "auto";


    statusElement.className =
        "status";


    statusElement.textContent =
        "Press and hold the movie, then drag it to the timeline.";

}


// ========================================
// RENDER TIMELINE
// ========================================

function renderTimeline() {

    timelineElement.innerHTML =
        "";


    /*
        Oldest → newest.
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
        Create a drop zone BEFORE
        every movie.
    */

    timeline.forEach(
        (movie, index) => {

            container.appendChild(
                createDropZone(
                    index
                )
            );


            container.appendChild(
                createTimelineMovie(
                    movie
                )
            );

        }
    );


    /*
        Final drop zone after
        the newest movie.
    */

    container.appendChild(
        createDropZone(
            timeline.length
        )
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


    /*
        The visible line.
    */

    const line =
        document.createElement(
            "div"
        );


    line.className =
        "drop-line";


    zone.appendChild(
        line
    );


    /*
        DROP label.
    */

    const label =
        document.createElement(
            "div"
        );


    label.className =
        "drop-label";


    label.textContent =
        "DROP";


    zone.appendChild(
        label
    );


    /*
        Store the position directly
        on the element.
    */

    zone.dataset.position =
        position;


    return zone;

}


// ========================================
// POINTER DOWN
// ========================================

movieCard.addEventListener(
    "pointerdown",
    event => {

        if (
            gameOver ||
            !currentMovie
        ) {

            return;

        }


        /*
            Only accept the primary
            mouse button.

            Touch and pen are also
            considered primary.
        */

        if (
            event.pointerType ===
            "mouse" &&
            event.button !== 0
        ) {

            return;

        }


        event.preventDefault();


        dragPointerId =
            event.pointerId;


        /*
            Capture pointer movements
            even if the finger/mouse
            leaves the card.
        */

        movieCard.setPointerCapture(
            event.pointerId
        );


        startDrag(
            event
        );

    }
);


// ========================================
// POINTER MOVE
// ========================================

movieCard.addEventListener(
    "pointermove",
    event => {

        if (
            !isDragging ||
            event.pointerId !==
                dragPointerId
        ) {

            return;

        }


        event.preventDefault();


        moveDrag(
            event
        );

    }
);


// ========================================
// POINTER UP
// ========================================

movieCard.addEventListener(
    "pointerup",
    event => {

        if (
            !isDragging ||
            event.pointerId !==
                dragPointerId
        ) {

            return;

        }


        event.preventDefault();


        finishDrag();

    }
);


// ========================================
// POINTER CANCEL
// ========================================

movieCard.addEventListener(
    "pointercancel",
    () => {

        cancelDrag();

    }
);


// ========================================
// START DRAG
// ========================================

function startDrag(
    event
) {

    isDragging = true;


    movieCard.classList.add(
        "dragging"
    );


    /*
        Create floating movie title.
    */

    dragGhost =
        document.createElement(
            "div"
        );


    dragGhost.className =
        "drag-ghost";


    dragGhost.textContent =
        currentMovie.Title;


    document.body.appendChild(
        dragGhost
    );


    updateGhostPosition(
        event.clientX,
        event.clientY
    );


    /*
        Highlight the closest
        drop position immediately.
    */

    updateDropZone(
        event.clientX,
        event.clientY
    );

}


// ========================================
// MOVE DRAG
// ========================================

function moveDrag(
    event
) {

    updateGhostPosition(
        event.clientX,
        event.clientY
    );


    updateDropZone(
        event.clientX,
        event.clientY
    );


    /*
        Automatically scroll the
        timeline when dragging near
        its left/right edge.
    */

    autoScrollTimeline(
        event.clientX
    );

}


// ========================================
// UPDATE GHOST
// ========================================

function updateGhostPosition(
    x,
    y
) {

    if (!dragGhost) {

        return;

    }


    dragGhost.style.left =
        `${x}px`;


    dragGhost.style.top =
        `${y}px`;

}


// ========================================
// FIND DROP ZONE
// ========================================

function updateDropZone(
    pointerX,
    pointerY
) {

    const zones =
        Array.from(
            document.querySelectorAll(
                ".drop-zone"
            )
        );


    if (
        zones.length === 0
    ) {

        return;

    }


    let closestZone =
        null;

    let closestDistance =
        Infinity;


    /*
        Find the zone whose center
        is closest to the pointer.

        We mainly care about the
        horizontal position.
    */

    zones.forEach(
        zone => {

            const rect =
                zone.getBoundingClientRect();


            const centerX =
                rect.left +
                rect.width / 2;


            const centerY =
                rect.top +
                rect.height / 2;


            const distance =

                Math.abs(
                    pointerX -
                    centerX
                ) +

                Math.abs(
                    pointerY -
                    centerY
                ) *
                0.25;


            if (
                distance <
                closestDistance
            ) {

                closestDistance =
                    distance;

                closestZone =
                    zone;

            }

        }
    );


    /*
        Remove old highlight.
    */

    if (
        activeDropZone &&
        activeDropZone !==
            closestZone
    ) {

        activeDropZone.classList.remove(
            "active"
        );

    }


    activeDropZone =
        closestZone;


    if (
        activeDropZone
    ) {

        activeDropZone.classList.add(
            "active"
        );

    }

}


// ========================================
// AUTO SCROLL
// ========================================

function autoScrollTimeline(
    pointerX
) {

    const rect =
        timelineElement.getBoundingClientRect();


    const edge =
        80;


    /*
        Near left edge.
    */

    if (
        pointerX <
        rect.left + edge
    ) {

        timelineElement.scrollLeft -=
            12;

    }


    /*
        Near right edge.
    */

    else if (
        pointerX >
        rect.right - edge
    ) {

        timelineElement.scrollLeft +=
            12;

    }

}


// ========================================
// FINISH DRAG
// ========================================

function finishDrag() {

    if (!isDragging) {

        return;

    }


    let position = null;


    if (
        activeDropZone
    ) {

        position =
            Number(
                activeDropZone
                    .dataset
                    .position
            );

    }


    cleanupDrag();


    /*
        No valid drop position.
    */

    if (
        position === null
    ) {

        return;

    }


    checkPlacement(
        position
    );

}


// ========================================
// CANCEL DRAG
// ========================================

function cancelDrag() {

    if (!isDragging) {

        cleanupDrag();

        return;

    }


    cleanupDrag();

}


// ========================================
// CLEANUP DRAG
// ========================================

function cleanupDrag() {

    isDragging = false;


    movieCard.classList.remove(
        "dragging"
    );


    if (
        dragGhost
    ) {

        dragGhost.remove();

        dragGhost = null;

    }


    if (
        activeDropZone
    ) {

        activeDropZone.classList.remove(
            "active"
        );

        activeDropZone = null;

    }


    dragPointerId = null;

}


// ========================================
// CHECK PLACEMENT
// ========================================

function checkPlacement(
    position
) {

    if (
        !currentMovie ||
        gameOver
    ) {

        return;

    }


    const movieYear =
        Number(
            currentMovie.Year
        );


    let correct = false;


    /*
        BEFORE EVERYTHING
    */

    if (
        position === 0
    ) {

        correct =
            movieYear <=
            timeline[0].year;

    }


    /*
        AFTER EVERYTHING
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
        BETWEEN TWO MOVIES
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

        handleCorrectAnswer(
            position
        );

    }

    else {

        handleWrongAnswer();

    }

}


// ========================================
// CORRECT ANSWER
// ========================================

async function handleCorrectAnswer(
    position
) {

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


    /*
        Add the movie.
    */

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


    /*
        Render again.

        The movie will automatically
        appear in chronological order.
    */

    renderTimeline();


    movieCard.style.pointerEvents =
        "none";


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


    movieCard.style.pointerEvents =
        "none";


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

    if (!currentMovie) {

        return;

    }


    resultMessage.innerHTML =
        `<strong>${
            currentMovie.Title
        }</strong> was released in ${
            currentMovie.Year
        }.`;


    finalScore.textContent =
        score;


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
// START GAME
// ========================================

startGame();