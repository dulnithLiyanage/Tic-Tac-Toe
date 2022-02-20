// ! Gameboard !

const Gameboard = (() => {
  const MARKERS = ["X", "O"];

  const getBoardAsArr = () => ["", "", "", "", "", "", "", "", ""];

  const getWinningCombos = () => {
    return [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
  };

  return { MARKERS, getBoardAsArr, getWinningCombos };
})();

// ! Player !
const Player = (name, marker, turn) => {
  const getName = () => name;

  const getMarker = () => marker;

  const checkTurn = () => turn;

  const startTurn = () => {
    turn = true;
  };

  const endTurn = () => {
    turn = false;
  };

  return { getName, getMarker, checkTurn, startTurn, endTurn };
};

// ! Functionality of the Game
const Game = (() => {
  const DISPLAYBOARD = document.querySelector(".gameboard");
  const BOARD = Gameboard.getBoardAsArr();
  const PLAYER1 = Player("Player 1", Gameboard.MARKERS[0], true);
  const PLAYER2 = Player("Player 2", Gameboard.MARKERS[1], false);

  const render = () => {
    BOARD.forEach((CELL) => {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.innerText = CELL;
      DISPLAYBOARD.appendChild(cell);
    });
  };

  const startGame = () => {
    const CELLS = document.querySelectorAll(".cell");
    CELLS.forEach((CELL, indexOfCell) => {
      CELL.addEventListener("click", () => {
        takeInput(CELL, indexOfCell);

        if (checkWinner()) {
          endGame();
        }
      });
    });
  };

  const takeInput = (CELL, indexOfCell) => {
    if (BOARD[indexOfCell] === "") {
      if (PLAYER1.checkTurn()) {
        addMarker(PLAYER1, PLAYER2, CELL, indexOfCell);
      } else if (PLAYER2.checkTurn()) {
        addMarker(PLAYER2, PLAYER1, CELL, indexOfCell);
      }
    }
  };

  const addMarker = (CURRENTPLAYER, NEXTPLAYER, CELL, indexOfCell) => {
    BOARD[indexOfCell] = CURRENTPLAYER.getMarker();
    CELL.innerText = CURRENTPLAYER.getMarker();
    CURRENTPLAYER.endTurn();
    NEXTPLAYER.startTurn();
  };

  const checkWinner = () => {
    const WINNINGCOMBOS = Gameboard.getWinningCombos();

    const PREVIOUSMARKER = !PLAYER1.checkTurn()
      ? PLAYER1.getMarker()
      : PLAYER2.getMarker();

    return WINNINGCOMBOS.some((combos) => {
      return combos.every((index) => {
        return BOARD[index] === PREVIOUSMARKER;
      });
    });
  };

  const endGame = () => {
    console.log("Winner");
  };
  return { render, startGame };
})();

// ! ----------------

Game.render();

// ! ----------------

const STARTBUTTON = document.querySelector("button");

STARTBUTTON.addEventListener("click", () => {
  Game.startGame();
});
