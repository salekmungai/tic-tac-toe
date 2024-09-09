const Gameboard = (() => {
  let board = Array(9).fill(null);

  const getBoard = () => board;
  const setMark = (index, mark) => {
    if (!board[index] && mark) {
      board[index] = mark;
    }
  };
  const reset = () => {
    board = Array(9).fill(null);
  };

  return { getBoard, setMark, reset };
})();

const Player = (name, mark) => {
  const getName = () => name;
  const getMark = () => mark;
  return { getName, getMark };
};

const Game = (() => {
  let currentPlayer;
  let player1;
  let player2;
  let gameActive = false;

  const startGame = () => {
    const player1Name = document.getElementById('player1').value;
    const player2Name = document.getElementById('player2').value;

    if (player1Name && player2Name) {
      player1 = Player(player1Name, 'X');
      player2 = Player(player2Name, 'O');
      currentPlayer = player1;
      gameActive = true;
      Gameboard.reset();
      renderBoard();
      document.getElementById(
        'message'
      ).textContent = `${currentPlayer.getName()}'s turn`;
    }
  };

  const changePlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    document.getElementById(
      'message'
    ).textContent = `${currentPlayer.getName()}'s turn`;
  };

  const checkWinner = () => {
    const board = Gameboard.getBoard();
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        const winner =
          board[a] === player1.getMark()
            ? player1.getName()
            : player2.getName();
        showPopup(winner);
        gameActive = false;
        return;
      }
    }

    if (!board.includes(null)) {
      showPopup('Tie');
      gameActive = false;
    }
  };

  const handleSquareClick = (event) => {
    if (!gameActive) return;

    const index = event.target.getAttribute('data-index');
    if (Gameboard.getBoard()[index]) return;

    Gameboard.setMark(index, currentPlayer.getMark());
    renderBoard();
    checkWinner();
    if (gameActive) changePlayer();
  };

  const renderBoard = () => {
    const board = Gameboard.getBoard();
    document.querySelectorAll('.square').forEach((square, index) => {
      square.textContent = board[index];
    });
  };

  const showPopup = (winner) => {
    const winnerPopup = document.getElementById('winnerPopup');
    const winnerMessage = document.getElementById('winnerMessage');

    winnerMessage.textContent =
      winner === 'Tie' ? "It's a Tie!" : ` ${winner} Wins!`;
    winnerPopup.classList.remove('hidden');

    const restartGameButton = document.getElementById('restartGame');
    restartGameButton.addEventListener('click', restartGame);
  };

  const restartGame = () => {
    const winnerPopup = document.getElementById('winnerPopup');
    winnerPopup.classList.add('hidden');
    startGame();
  };

  document.getElementById('startGame').addEventListener('click', startGame);
  document
    .getElementById('gameBoard')
    .addEventListener('click', handleSquareClick);

  return { startGame };
})();
