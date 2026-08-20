const cells = document.querySelectorAll(".cell");

const statusText =
    document.getElementById("status");

const restartButton =
    document.getElementById("restart");

const strike =
    document.getElementById("strike");


/* GAME BOARD */

let board = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
];


/* CURRENT PLAYER */

let currentPlayer = "TV";


/* GAME STATUS */

let gameActive = true;


/* WINNING COMBINATIONS */

const winningPatterns = [

    // Rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    // Columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // Diagonals
    [0, 4, 8],
    [2, 4, 6]

];


/* CELL CLICK */

cells.forEach(cell => {

    cell.addEventListener("click", () => {

        const index =
            cell.dataset.index;


        /* Don't allow occupied cells */

        if (
            board[index] !== "" ||
            !gameActive
        ) {
            return;
        }


        /* Add player to board */

        board[index] =
            currentPlayer;


        /* Display player */

        cell.textContent =
            currentPlayer;


        /* Add player styling */

        if (currentPlayer === "TV") {

            cell.classList.add("tv");

        } else {

            cell.classList.add("jv");

        }


        /* Check game */

        checkWinner();

    });

});


/* CHECK WINNER */

function checkWinner() {

    for (
        let pattern of winningPatterns
    ) {

        const [a, b, c] =
            pattern;


        /* Check if three are equal */

        if (

            board[a] !== "" &&

            board[a] === board[b] &&

            board[a] === board[c]

        ) {

            /* Game over */

            gameActive = false;


            /* Winner message */

            statusText.textContent =
                `${currentPlayer} Wins!`;


            /* Show strike */

            showStrike(pattern);


            return;

        }

    }


    /* CHECK DRAW */

    if (!board.includes("")) {

        gameActive = false;

        statusText.textContent =
            "It's a Draw!";

        return;

    }


    /* SWITCH PLAYER */

    if (currentPlayer === "TV") {

        currentPlayer = "JV";

    } else {

        currentPlayer = "TV";

    }


    /* Update status */

    statusText.textContent =
        `${currentPlayer}'s Turn`;

}


/* SHOW WINNING STRIKE */

function showStrike(pattern) {

    const [a, b, c] =
        pattern;


    /* Get board */

    const boardElement =
        document.getElementById("board");


    /* Get positions */

    const cellA =
        cells[a];

    const cellC =
        cells[c];


    const boardRect =
        boardElement.getBoundingClientRect();

    const rectA =
        cellA.getBoundingClientRect();

    const rectC =
        cellC.getBoundingClientRect();


    /* START POINT */

    const x1 =
        rectA.left +
        rectA.width / 2 -
        boardRect.left;


    const y1 =
        rectA.top +
        rectA.height / 2 -
        boardRect.top;


    /* END POINT */

    const x2 =
        rectC.left +
        rectC.width / 2 -
        boardRect.left;


    const y2 =
        rectC.top +
        rectC.height / 2 -
        boardRect.top;


    /* CALCULATE DISTANCE */

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


    /* CALCULATE ANGLE */

    const angle =
        Math.atan2(

            y2 - y1,

            x2 - x1

        ) *

        180 /

        Math.PI;


    /* POSITION STRIKE */

    strike.style.left =
        `${x1}px`;

    strike.style.top =
        `${y1}px`;


    /* ROTATE STRIKE */

    strike.style.transform =
        `rotate(${angle}deg)`;


    /* SHOW STRIKE */

    strike.style.opacity = "1";


    /* ANIMATE STRIKE */

    requestAnimationFrame(() => {

        strike.style.width =
            `${length}px`;

    });

}


/* RESTART GAME */

restartButton.addEventListener(
    "click",
    restartGame
);


function restartGame() {


    /* RESET BOARD */

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


    /* RESET PLAYER */

    currentPlayer = "TV";


    /* ACTIVATE GAME */

    gameActive = true;


    /* RESET STATUS */

    statusText.textContent =
        "TV's Turn";


    /* CLEAR CELLS */

    cells.forEach(cell => {

        cell.textContent = "";

        cell.classList.remove(
            "tv",
            "jv"
        );

    });


    /* RESET STRIKE */

    strike.style.width = "0";

    strike.style.opacity = "0";

    strike.style.transform =
        "rotate(0deg)";

}