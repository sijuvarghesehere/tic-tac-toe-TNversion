/* =========================================
   ELEMENTS
========================================= */

const boardElement =
    document.getElementById("board");

const cells =
    document.querySelectorAll(".cell");

const statusElement =
    document.getElementById("status");

const strikeElement =
    document.getElementById("strike");

const tvScoreElement =
    document.getElementById("tvScore");

const jvScoreElement =
    document.getElementById("jvScore");

const drawScoreElement =
    document.getElementById("drawScore");

const nextRoundButton =
    document.getElementById("nextRound");

const resetScoreButton =
    document.getElementById("resetScore");


/* =========================================
   GAME STATE
========================================= */

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

let currentPlayer = "TV";

let gameActive = true;


/* =========================================
   SCORE
========================================= */

let scores = {
    TV: 0,
    JV: 0,
    DRAW: 0
};


/* =========================================
   WINNING COMBINATIONS
========================================= */

const winningPatterns = [

    /* Horizontal */

    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    /* Vertical */

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    /* Diagonal */

    [0, 4, 8],
    [2, 4, 6]

];


/* =========================================
   CELL EVENTS
========================================= */

cells.forEach((cell) => {

    cell.addEventListener(
        "click",
        function () {

            playMove(this);

        }
    );

});


/* =========================================
   PLAY MOVE
========================================= */

function playMove(cell) {

    /*
       Convert the data-index to
       a real number.
    */

    const index =
        Number(cell.dataset.index);


    /*
       Safety check.

       This specifically ensures tile 9
       (index 8) is treated exactly like
       every other tile.
    */

    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index > 8
    ) {
        return;
    }


    /*
       Don't allow moves after
       game has finished.
    */

    if (!gameActive) {
        return;
    }


    /*
       Don't allow an occupied tile.
    */

    if (board[index] !== "") {
        return;
    }


    /* SAVE MOVE */

    board[index] =
        currentPlayer;


    /* DISPLAY MOVE */

    cell.textContent =
        currentPlayer;


    /* ADD PLAYER CLASS */

    cell.classList.remove(
        "tv",
        "jv"
    );

    cell.classList.add(
        currentPlayer.toLowerCase()
    );


    /*
       Check the result.
    */

    evaluateGame();

}


/* =========================================
   EVALUATE GAME
========================================= */

function evaluateGame() {

    /*
       Check all winning combinations.
    */

    for (
        const pattern of winningPatterns
    ) {

        const [a, b, c] =
            pattern;


        /*
           A winner exists when:

           - first cell isn't empty
           - all three are equal
        */

        if (

            board[a] !== "" &&

            board[a] === board[b] &&

            board[a] === board[c]

        ) {

            handleWin(pattern);

            return;
        }

    }


    /*
       If no empty cells remain,
       it is a draw.
    */

    if (
        board.every(
            cell => cell !== ""
        )
    ) {

        handleDraw();

        return;
    }


    /*
       Otherwise switch players.
    */

    switchPlayer();

}


/* =========================================
   HANDLE WIN
========================================= */

function handleWin(pattern) {

    /*
       Stop additional moves.
    */

    gameActive = false;


    /*
       Increase winner score.
    */

    scores[currentPlayer]++;


    /*
       Update visible score.
    */

    updateScores();


    /*
       Winner message.
    */

    statusElement.textContent =
        `${currentPlayer} Wins!`;


    /*
       Draw winning line.
    */

    animateStrike(pattern);

}


/* =========================================
   HANDLE DRAW
========================================= */

function handleDraw() {

    /*
       Stop additional moves.
    */

    gameActive = false;


    /*
       Increase draw score.
    */

    scores.DRAW++;


    /*
       Update scoreboard.
    */

    updateScores();


    /*
       Display message.
    */

    statusElement.textContent =
        "It's a Draw!";

}


/* =========================================
   SWITCH PLAYER
========================================= */

function switchPlayer() {

    if (
        currentPlayer === "TV"
    ) {

        currentPlayer = "JV";

    } else {

        currentPlayer = "TV";

    }


    statusElement.textContent =
        `${currentPlayer}'s Turn`;

}


/* =========================================
   UPDATE SCOREBOARD
========================================= */

function updateScores() {

    tvScoreElement.textContent =
        String(scores.TV);

    jvScoreElement.textContent =
        String(scores.JV);

    drawScoreElement.textContent =
        String(scores.DRAW);

}


/* =========================================
   ANIMATE WINNING STRIKE
========================================= */

function animateStrike(pattern) {

    const [firstIndex, , lastIndex] =
        pattern;


    /*
       Get the actual cells.
    */

    const firstCell =
        cells[firstIndex];

    const lastCell =
        cells[lastIndex];


    /*
       The strike is relative to
       board-wrapper.

       This keeps it completely
       separate from the clickable
       grid.
    */

    const wrapper =
        document.querySelector(
            ".board-wrapper"
        );


    const wrapperRect =
        wrapper.getBoundingClientRect();


    const firstRect =
        firstCell.getBoundingClientRect();

    const lastRect =
        lastCell.getBoundingClientRect();


    /*
       Calculate starting point.
    */

    const x1 =
        firstRect.left +
        firstRect.width / 2 -
        wrapperRect.left;


    const y1 =
        firstRect.top +
        firstRect.height / 2 -
        wrapperRect.top;


    /*
       Calculate ending point.
    */

    const x2 =
        lastRect.left +
        lastRect.width / 2 -
        wrapperRect.left;


    const y2 =
        lastRect.top +
        lastRect.height / 2 -
        wrapperRect.top;


    /*
       Calculate line length.
    */

    const deltaX =
        x2 - x1;

    const deltaY =
        y2 - y1;


    const length =
        Math.sqrt(
            deltaX * deltaX +
            deltaY * deltaY
        );


    /*
       Calculate angle.
    */

    const angle =
        Math.atan2(
            deltaY,
            deltaX
        ) *
        180 /
        Math.PI;


    /*
       Reset line first.

       This makes repeated rounds
       animate correctly.
    */

    strikeElement.style.transition =
        "none";

    strikeElement.style.width =
        "0px";

    strikeElement.style.opacity =
        "0";

    strikeElement.style.left =
        `${x1}px`;

    strikeElement.style.top =
        `${y1}px`;

    strikeElement.style.transform =
        `rotate(${angle}deg)`;


    /*
       Force browser to register
       the reset before animation.
    */

    strikeElement.offsetWidth;


    /*
       Restore animation.
    */

    strikeElement.style.transition =
        "width 0.45s ease, opacity 0.15s ease";


    strikeElement.style.opacity =
        "1";


    /*
       Animate from zero to
       winning line length.
    */

    requestAnimationFrame(() => {

        strikeElement.style.width =
            `${length}px`;

    });

}


/* =========================================
   NEXT ROUND
========================================= */

nextRoundButton.addEventListener(
    "click",
    startNewRound
);


function startNewRound() {

    /*
       Reset board state.
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
       TV starts every round.
    */

    currentPlayer = "TV";


    /*
       Allow moves.
    */

    gameActive = true;


    /*
       Update status.
    */

    statusElement.textContent =
        "TV's Turn";


    /*
       Clear every cell.
    */

    cells.forEach((cell) => {

        cell.textContent = "";

        cell.classList.remove(
            "tv",
            "jv"
        );

    });


    /*
       Hide winning strike.
    */

    hideStrike();

}


/* =========================================
   HIDE STRIKE
========================================= */

function hideStrike() {

    strikeElement.style.transition =
        "none";

    strikeElement.style.width =
        "0px";

    strikeElement.style.opacity =
        "0";

    strikeElement.style.transform =
        "rotate(0deg)";

}


/* =========================================
   RESET SCORE
========================================= */

resetScoreButton.addEventListener(
    "click",
    resetEverything
);


function resetEverything() {

    /*
       Reset scores.
    */

    scores = {
        TV: 0,
        JV: 0,
        DRAW: 0
    };


    /*
       Update scoreboard.
    */

    updateScores();


    /*
       Start a completely
       fresh round.
    */

    startNewRound();

}
