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

  let available = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // Available indexes for the AI

  console.log(available);

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

  const startGameAgainstHuman = () => {
    const CELLS = document.querySelectorAll(".cell");
    CELLS.forEach((CELL, indexOfCell) => {
      CELL.addEventListener("click", () => {
        takeInput(CELL, indexOfCell);

        if (checkWinner()) {
          endGame(true);
        } else if (checkForTie()) {
          endGame(false);
        }
      });
    });
  };

  const startGameAgainstComputer = () => {
    const CELLS = document.querySelectorAll(".cell");
    CELLS.forEach((CELL, indexOfCell) => {
      CELL.addEventListener("mousedown", () => {
        if (PLAYER1.checkTurn()) {
          takeInput(CELL, indexOfCell);
        }

        if (checkWinner()) {
          endGame(true);
        } else if (checkForTie()) {
          endGame(false);
        }
      });

      CELL.addEventListener("mouseup", () => {
        if (PLAYER2.checkTurn()) {
          easyAI(CELLS);
        }

        if (checkWinner()) {
          endGame(true);
        } else if (checkForTie()) {
          endGame(false);
        }
      });
    });
  };

  const easyAI = (CELLS) => {
    let randomIndex = Math.floor(Math.random() * available.length);

    let randomCell = available.splice(randomIndex, 1);

    takeInput(CELLS[randomCell], randomCell);
  };

  const takeInput = (CELL, indexOfCell) => {
    if (BOARD[indexOfCell] === "") {
      if (PLAYER1.checkTurn()) {
        addMarker(PLAYER1, PLAYER2, CELL, indexOfCell);
        TURN.innerText = `${PLAYER2.getName()}'s turn`;
      } else if (PLAYER2.checkTurn()) {
        addMarker(PLAYER2, PLAYER1, CELL, indexOfCell);
        TURN.innerText = `${PLAYER1.getName()}'s turn`;
      }
    }
  };

  const addMarker = (CURRENTPLAYER, NEXTPLAYER, CELL, indexOfCell) => {
    const ICON = document.createElement("img");
    const MARKER = CURRENTPLAYER.getMarker();

    const CIRCLEPATH = "./icons/circle.svg";
    const CROSSPATH = "./icons/cross.svg";

    BOARD[indexOfCell] = MARKER;

    // Removes the index from the available array used by the AI
    if (PLAYER1.checkTurn()) {
      available.splice(available.indexOf(indexOfCell), 1);
    }

    MARKER === "X" ? (ICON.src = CROSSPATH) : (ICON.src = CIRCLEPATH);

    CELL.appendChild(ICON);

    CURRENTPLAYER.endTurn();
    NEXTPLAYER.startTurn();
  };

  const checkWinner = () => {
    const WINNINGCOMBOS = Gameboard.getWinningCombos();

    // gets the mark of the previous player
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
      MESSAGE.innerText = ` Congratulations "${
        !PLAYER1.checkTurn() ? PLAYER1.getName() : PLAYER2.getName()
      }" Won 🥳`;
    } else if (!winnerExists) {
      MESSAGE.innerText = "It's a tie 😅";
    }

    TURN.innerText = "";
    MESSAGECARD.classList.remove("hidden");
  };

  const resetGame = () => {
    TURN.innerText = `${PLAYER1.getName()}'s turn`; // Reset the turn message
    PLAYER1.startTurn(); // reset player turn
    BOARD = Gameboard.getBoardAsArr(); // reset board

    available = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // reset available indexes

    // Removes the previous markers
    const CELLS = document.querySelectorAll(".cell");
    CELLS.forEach((CELL) => {
      DISPLAYBOARD.removeChild(CELL);
    });
  };
  return { render, startGameAgainstHuman, startGameAgainstComputer, resetGame };
})();

// ! -------------------------------------------------- !

const VSPLAYER = document.querySelector(".start");
const VSCOMPUTER = document.querySelector(".start-computer");
const RETURNBUTTON = document.querySelector(".return");
const REPLAYBUTTON = document.querySelector(".replay");
const ENDGAMEBUTTON = document.querySelector(".end-session");

const GAMEBOARDCONTAINER = document.querySelector(".gameboard-container");
const TURN = GAMEBOARDCONTAINER.firstElementChild;
const WELCOMESCREEN = document.querySelector(".welcome-screen");
const MESSAGECARD = document.querySelector(".message-card-container");
const MESSAGE = document.querySelector(".message");

VSPLAYER.addEventListener("click", () => {
  Game.resetGame();
  Game.render();
  Game.startGameAgainstHuman();
  GAMEBOARDCONTAINER.classList.remove("hidden");
  WELCOMESCREEN.classList.add("hidden");

  REPLAYBUTTON.addEventListener("click", () => {
    MESSAGECARD.classList.add("hidden");
    Game.resetGame();
    Game.render();
    Game.startGameAgainstHuman();
  });
});

VSCOMPUTER.addEventListener("click", () => {
  Game.resetGame();
  Game.render();
  Game.startGameAgainstComputer();
  GAMEBOARDCONTAINER.classList.remove("hidden");
  WELCOMESCREEN.classList.add("hidden");

  REPLAYBUTTON.addEventListener("click", () => {
    MESSAGECARD.classList.add("hidden");
    Game.resetGame();
    Game.render();
    Game.startGameAgainstComputer();
  });
});

RETURNBUTTON.addEventListener("click", () => {
  GAMEBOARDCONTAINER.classList.add("hidden");
  WELCOMESCREEN.classList.remove("hidden");
});

ENDGAMEBUTTON.addEventListener("click", () => {
  MESSAGECARD.classList.add("hidden");
  GAMEBOARDCONTAINER.classList.add("hidden");
  WELCOMESCREEN.classList.remove("hidden");
});

// ! -------------------------------------------------- !
