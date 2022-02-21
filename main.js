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
  let BOARD = Gameboard.getBoardAsArr();

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
          endGame(true);
        }

        if (checkForTie()) {
          endGame(false);
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
    const ICON = document.createElement("img");
    const MARKER = CURRENTPLAYER.getMarker();

    const CIRCLEPATH = "./icons/circle.svg";
    const CROSSPATH = "./icons/cross.svg";

    BOARD[indexOfCell] = MARKER;

    MARKER === "X" ? (ICON.src = CROSSPATH) : (ICON.src = CIRCLEPATH);

    CELL.appendChild(ICON);

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

  const checkForTie = () => {
    return BOARD.every((CELL) => {
      return CELL !== "";
    });
  };

  const endGame = (winnerExists) => {
    if (winnerExists) {
      alert(
        `${!PLAYER1.checkTurn() ? PLAYER1.getName() : PLAYER2.getName()} won`
      );
    } else {
      alert("It's a tie");
    }

    REPLAYBUTTON.classList.remove("hidden");

    resetGame();
    render();
  };

  const resetGame = () => {
    PLAYER1.startTurn(); // reset player turn
    BOARD = Gameboard.getBoardAsArr(); // reset board

    const CELLS = document.querySelectorAll(".cell");
    CELLS.forEach((CELL) => {
      DISPLAYBOARD.removeChild(CELL);
    });
  };

  return { render, startGame, resetGame };
})();

// ! -------------------------------------------------- !

const STARTBUTTON = document.querySelector(".start");
const RETURNBUTTON = document.querySelector(".return");
const REPLAYBUTTON = document.querySelector(".replay");

const GAMECONTAINER = document.querySelector(".container");
const WELCOMESCREEN = document.querySelector(".welcome-screen");

STARTBUTTON.addEventListener("click", () => {
  Game.resetGame();
  Game.render();
  Game.startGame();
  GAMECONTAINER.classList.remove("hidden");
  WELCOMESCREEN.classList.add("hidden");
});

RETURNBUTTON.addEventListener("click", () => {
  GAMECONTAINER.classList.add("hidden");
  WELCOMESCREEN.classList.remove("hidden");
});

REPLAYBUTTON.addEventListener("click", () => {
  REPLAYBUTTON.classList.add("hidden");
  Game.resetGame();
  Game.render();
  Game.startGame();
});

// ! -------------------------------------------------- !
