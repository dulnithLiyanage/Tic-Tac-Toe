// ! Gameboard !
const Gameboard = (() => {
  const markers = ["X", "O"];
  const gameboardArr = ["", "", "", "", "", "", "", "", ""];

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

  return { markers, gameboardArr, getWinningCombos };
})();

// ! Player !
const Player = (name, marker, turn) => {
  const getName = () => name;

  const getMarker = () => marker;

  const checkTurn = () => turn;

  const startTurn = () => (turn = true);

  const endTurn = () => (turn = false);

  return { getName, getMarker, checkTurn, startTurn, endTurn };
};

// ? Player Creation

const player1 = Player("Luke", Gameboard.markers[0], true);
const player2 = Player("Vader", Gameboard.markers[1], false);

const displayBoard = (() => {
  const container = document.querySelector(".container");
  let gameBoard = Gameboard.gameboardArr;

  // ** Renders the gameboard
  const render = () => {
    gameBoard.forEach((slotValue, indexOfSlot) => {
      const slot = document.createElement("div");
      slot.classList.add("slot");
      slot.id = indexOfSlot;
      slot.innerText = slotValue;
      container.appendChild(slot);
    });
  };

  const getInactivePlayer = () => {
    return player1.checkTurn() ? player2 : player1;
  };

  const resetGame = () => {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    [...container.children].forEach((slot) => {
      container.removeChild(slot);
    });
    player1.startTurn();
    render();
    changeDOM();
  };

  // ** Adds the markers to the slots in the gameboard
  const changeDOM = () => {
    [...container.childNodes].forEach((slot) => {
      const indexOfSlot = slot.id;

      slot.addEventListener("click", () => {
        console.log(gameBoard);
        if (!gameBoard[indexOfSlot]) {
          if (player1.checkTurn()) {
            gameBoard[indexOfSlot] = player1.getMarker();
            slot.innerText = player1.getMarker();
            player1.endTurn();
            player2.startTurn();
          } else if (player2.checkTurn()) {
            gameBoard[indexOfSlot] = player2.getMarker();
            slot.innerText = player2.getMarker();
            player2.endTurn();
            player1.startTurn();
          }

          // ** Resets the game after a player wins
          if (checkWinner()) {
            const inactivePlayer = getInactivePlayer();
            console.log(`${inactivePlayer.getName()} wins!`);
            setTimeout(() => {
              resetGame();
            }, 1750);
          }
        }
      });
    });
  };

  const checkWinner = () => {
    const winningCombos = Gameboard.getWinningCombos();
    const inactivePlayer = getInactivePlayer();
    return winningCombos.some((combo) => {
      return combo.every((index) => {
        return gameBoard[index] === inactivePlayer.getMarker();
      });
    });
  };

  return { render, changeDOM };
})();

displayBoard.render();
displayBoard.changeDOM();
