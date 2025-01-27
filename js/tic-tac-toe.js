const gameBoard = document.getElementById("game");
const winnerText = document.getElementById("winner");

let board = Array(9).fill(null);
let currentPlayer = "X";

function checkWinner() {
  const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Linhas
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Colunas
    [0, 4, 8],
    [2, 4, 6], // Diagonais
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return board.includes(null) ? null : "Empate";
}

function handleClick(e) {
  const index = e.target.dataset.index;

  if (!board[index]) {
    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.classList.add("taken");

    const winner = checkWinner();
    if (winner) {
      winnerText.textContent =
        winner === "Empate" ? "Empate!" : `${winner} venceu!`;
      gameBoard.style.pointerEvents = "none";
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
  }
}

function initializeGame() {
  gameBoard.innerHTML = "";
  board.fill(null);
  currentPlayer = "X";
  winnerText.textContent = "";
  gameBoard.style.pointerEvents = "auto";

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleClick);
    gameBoard.appendChild(cell);
  }
}

initializeGame();
