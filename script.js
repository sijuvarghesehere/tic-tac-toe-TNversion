/* ========================================
   GET HTML ELEMENTS
======================================== */

const cells =
    document.querySelectorAll(".cell");

const statusText =
    document.getElementById("status");

const restartButton =
    document.getElementById("restart");

const resetScoreButton =
    document.getElementById("resetScore");

const strike =
    document.getElementById("strike");

const tvScoreDisplay =
    document.getElementById("tvScore");

const jvScoreDisplay =
    document.getElementById("jvScore");

const drawScoreDisplay =
    document.getElementById("drawScore");


/* ========================================
   GAME BOARD
======================================== */

let board = [

    "",
    "",
    "",

    "",
    "",
    "",

    "",
    "",
    ""

];


/* ========================================
   CURRENT PLAYER
======================================== */

let currentPlayer = "TV";


/* ========================================
   GAME ACTIVE
======================================== */

let gameActive = true;


/* ========================================
   SCORES
======================================== */

let tvScore = 0;

let jvScore = 0;

let drawScore = 0;


/* ========================================
   WINNING PATTERNS
======================================== */

const winningPatterns = [

    /* ROWS */

    [0, 1, 2],

    [3, 4, 5],

    [6, 7, 8],


    /* COLUMNS */

    [0, 3, 6],

    [1, 4, 7],

    [2, 5, 8],


    /* DIAGONALS */

    [0, 4, 8],

    [2, 4, 6]

];


/* ========================================
   CELL CLICK EVENTS
======================================== */

cells.forEach(cell => {

    cell.addEventListener(
        "click",
        handleCellClick
    );

});


/* ========================================
   HANDLE CELL CLICK
======================================== */

function handleCellClick() {


    /*
       Get the exact clicked tile.

       Number() makes sure the value
       is treated as a number.
    */

    const index =
        Number(
            this.dataset.index
        );


    /*
       Don't allow moves when:

       - Cell is already occupied
       - Game is finished
    */

    if (

        board[index] !== "" ||

        !gameActive

    ) {

        return;

    }


    /*
       Save player's move.
    */

    board[index] =
        currentPlayer;


    /*
       Display player.
    */

    this.textContent =
        currentPlayer;


    /*
       Add player class.
    */

    if (
        currentPlayer === "TV"
    ) {

        this.classList.add("tv");

    }

    else {

        this.classList.add("jv");

    }


    /*
       Check whether someone won
       or the game is a draw.
    */

    checkWinner();

}


/* ========================================
   CHECK WINNER
======================================== */

function checkWinner() {


    /*
       Check every winning combination.
    */

    for (
        let pattern of winningPatterns
    ) {


        const [a, b, c] =
            pattern;


        /*
           Example:

           TV TV TV

           If all three positions
           contain the same player,
           that player wins.
        */

        if (

            board[a] !== "" &&

            board[a] === board[b] &&

            board[a] === board[c]

        ) {


            /*
               Stop the game.
            */

            gameActive = false;


            /*
               Update winner score.
            */

            if (
                currentPlayer === "TV"
            ) {

                tvScore++;

            }

            else {

                jvScore++;

            }


            /*
               Update scoreboard.
            */

            updateScoreDisplay();


            /*
               Display winner.
            */

            statusText.textContent =
                `${currentPlayer} Wins!`;


            /*
               Display animated strike.
            */

            showStrike(pattern);


            return;

        }

    }


    /* ====================================
       CHECK DRAW
    ==================================== */

    if (
        !board.includes("")
    ) {


        /*
           Stop game.
        */

        gameActive = false;


        /*
           Increase draw score.
        */

        drawScore++;


        /*
           Update scoreboard.
        */

        updateScoreDisplay();


        /*
           Display draw message.
        */

        statusText.textContent =
            "It's a Draw!";


        return;

    }


    /* ====================================
       SWITCH PLAYER
    ==================================== */

    if (
        currentPlayer === "TV"
    ) {

        currentPlayer = "JV";

    }

    else {

        currentPlayer = "TV";

    }


    /*
       Update status.
    */

    statusText.textContent =
        `${currentPlayer}'s Turn`;

}


/* ========================================
   UPDATE SCOREBOARD
======================================== */

function updateScoreDisplay() {


    tvScoreDisplay.textContent =
        tvScore;


    jvScoreDisplay.textContent =
        jvScore;


    drawScoreDisplay.textContent =
        drawScore;

}


/* ========================================
   SHOW WINNING STRIKE
======================================== */

function showStrike(pattern) {


    const [a, b, c] =
        pattern;


    /*
       Get board position.
    */

    const boardElement =
        document.getElementById("board");


    /*
       Get first and last
       winning cells.
    */

    const cellA =
        cells[a];

    const cellC =
        cells[c];


    /*
       Get board rectangle.
    */

    const boardRect =
        boardElement
            .getBoundingClientRect();


    /*
       Get cell rectangles.
    */

    const rectA =
        cellA
            .getBoundingClientRect();

    const rectC =
        cellC
            .getBoundingClientRect();


    /* ====================================
       START POINT
    ==================================== */

    const x1 =

        rectA.left +

        rectA.width / 2 -

        boardRect.left;


    const y1 =

        rectA.top +

        rectA.height / 2 -

        boardRect.top;


    /* ====================================
       END POINT
    ==================================== */

    const x2 =

        rectC.left +

        rectC.width / 2 -

        boardRect.left;


    const y2 =

        rectC.top +

        rectC.height / 2 -

        boardRect.top;


    /* ====================================
       CALCULATE LINE LENGTH
    ==================================== */

    const length =

        Math.sqrt(

            Math.pow(
                x2 - x1,
                2
            )

            +

            Math.pow(
                y2 - y1,
                2
            )

        );


    /* ====================================
       CALCULATE ANGLE
    ==================================== */

    const angle =

        Math.atan2(

            y2 - y1,

            x2 - x1

        )

        *

        180

        /

        Math.PI;


    /* ====================================
       POSITION STRIKE
    ==================================== */

    strike.style.left =
        `${x1}px`;

    strike.style.top =
        `${y1}px`;


    /* ====================================
       ROTATE STRIKE
    ==================================== */

    strike.style.transform =
        `rotate(${angle}deg)`;


    /* ====================================
       SHOW STRIKE
    ==================================== */

    strike.style.opacity =
        "1";


    /* ====================================
       ANIMATE STRIKE
    ==================================== */

    requestAnimationFrame(() => {

        strike.style.width =
            `${length}px`;

    });

}


/* ========================================
   NEXT ROUND BUTTON
======================================== */

restartButton.addEventListener(
    "click",
    restartGame
);


/* ========================================
   RESTART GAME
======================================== */

function restartGame() {


    /*
       Clear board.

       Score remains unchanged.
    */

    board = [

        "",
        "",
        "",

        "",
        "",
        "",

        "",
        "",
        ""

    ];


    /*
       TV always starts
       the next round.
    */

    currentPlayer =
        "TV";


    /*
       Activate game.
    */

    gameActive = true;


    /*
       Update status.
    */

    statusText.textContent =
        "TV's Turn";


    /*
       Clear every cell.
    */

    cells.forEach(cell => {

        cell.textContent = "";

        cell.classList.remove(
            "tv",
            "jv"
        );

    });


    /*
       Reset winning strike.
    */

    strike.style.width =
        "0";

    strike.style.opacity =
        "0";

    strike.style.transform =
        "rotate(0deg)";

}


/* ========================================
   RESET SCORE BUTTON
======================================== */

resetScoreButton.addEventListener(
    "click",
    resetScores
);


/* ========================================
   RESET SCORES
======================================== */

function resetScores() {


    /*
       Reset TV score.
    */

    tvScore = 0;


    /*
       Reset JV score.
    */

    jvScore = 0;


    /*
       Reset draw score.
    */

    drawScore = 0;


    /*
       Update scoreboard.
    */

    updateScoreDisplay();


    /*
       Start fresh round.
    */

    restartGame();

}
