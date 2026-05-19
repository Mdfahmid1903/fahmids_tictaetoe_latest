let boxes = document.querySelectorAll(".box");
let resetbtn = document.querySelector("#resetbtn");
let newbtn = document.querySelector("#newbtn");
let msgcontainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let count = 0;
let difficulty = "easy"; // default easy

let winPatterns = [
    [0, 1, 2], [0, 3, 6], [0, 4, 8],
    [1, 4, 7], [2, 5, 8], [2, 4, 6],
    [3, 4, 5], [6, 7, 8]
];

// =====================
// Difficulty set করো
// =====================
let setDifficulty = (level) => {
    difficulty = level;
    document.getElementById("easybtn").classList.remove("active");
    document.getElementById("hardbtn").classList.remove("active");
    document.getElementById(level + "btn").classList.add("active");
    resetGame();
}

// =====================
// Player click
// =====================
boxes.forEach((box) => {
    box.addEventListener("click", () => {
        box.innerText = "x";
        box.disabled = true;
        count++;
        wincheck();

        if (count == 9 && msgcontainer.classList.contains("hide")) {
            msg.innerText = "Match Draw! 🤝";
            msgcontainer.classList.remove("hide");
            return;
        }

        setTimeout(() => {
            if (msgcontainer.classList.contains("hide")) {
                computerturn();
            }
        }, 300);
    });
});

// =====================
// Computer turn
// =====================
let computerturn = () => {
    let move;

    if (difficulty === "easy") {
        move = randomMove();
    } else {
        move = bestMove(); // Minimax
    }

    if (move === null) return;

    boxes[move].innerText = "o";
    boxes[move].disabled = true;
    count++;
    wincheck();

    if (count == 9 && msgcontainer.classList.contains("hide")) {
        msg.innerText = "Match Draw! 🤝";
        msgcontainer.classList.remove("hide");
    }
}

// =====================
// Easy — Random move
// =====================
let randomMove = () => {
    let emptyBoxes = [];
    boxes.forEach((box, index) => {
        if (box.innerText === "") emptyBoxes.push(index);
    });
    if (emptyBoxes.length === 0) return null;
    return emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
}

// =====================
// Hard — Minimax best move
// =====================
let bestMove = () => {
    let board = getBoard();
    let best = minimax(board, true);
    return best.index;
}

let getBoard = () => {
    let board = [];
    boxes.forEach((box) => board.push(box.innerText));
    return board;
}

let checkResult = (board) => {
    for (let pattern of winPatterns) {
        let a = board[pattern[0]];
        let b = board[pattern[1]];
        let c = board[pattern[2]];
        if (a !== "" && a === b && b === c) return a;
    }
    if (board.every(cell => cell !== "")) return "draw";
    return null;
}

let minimax = (board, isComputer) => {
    let result = checkResult(board);
    if (result === "o") return { score: 10 };
    if (result === "x") return { score: -10 };
    if (result === "draw") return { score: 0 };

    let moves = [];

    board.forEach((cell, index) => {
        if (cell === "") {
            let newBoard = [...board];
            newBoard[index] = isComputer ? "o" : "x";
            let moveScore = minimax(newBoard, !isComputer);
            moves.push({ index, score: moveScore.score });
        }
    });

    if (isComputer) {
        return moves.reduce((best, move) =>
            move.score > best.score ? move : best
        );
    } else {
        return moves.reduce((best, move) =>
            move.score < best.score ? move : best
        );
    }
}

// =====================
// Winner check
// =====================
let wincheck = () => {
    for (let pattern of winPatterns) {
        let a = boxes[pattern[0]].innerText;
        let b = boxes[pattern[1]].innerText;
        let c = boxes[pattern[2]].innerText;
        if (a !== "" && a === b && b === c) {
            showWinner(a);
        }
    }
}

let showWinner = (winner) => {
    msg.innerText = winner === "x" ? "You Win! 🎉" : "Computer Wins! 🤖";
    msgcontainer.classList.remove("hide");
    disableBoxes();
}

// =====================
// Reset
// =====================
let resetGame = () => {
    count = 0;
    enableBoxes();
    msgcontainer.classList.add("hide");
}

let enableBoxes = () => {
    boxes.forEach((box) => {
        box.disabled = false;
        box.innerText = "";
    });
}

let disableBoxes = () => {
    boxes.forEach((box) => {
        box.disabled = true;
    });
}

resetbtn.addEventListener("click", resetGame);
newbtn.addEventListener("click", resetGame);