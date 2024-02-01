import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ board, xIsNext, onPlay }) {
  function handleClick(i) {
    if(board[i] || calculateWinner(board)) return;

    const nextBoardState = board.slice();
    nextBoardState[i] = xIsNext ? "X" : "O";
    onPlay(nextBoardState);
  }

  const winner = calculateWinner(board);
  let status;

  if(winner) {
    status = "Winner: " + winner;
  }
  else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  let boardJsx = [];
  for(let i = 0; i < 3; i++) {
    let squares = []
    for(let j = 0; j < 3; j++) {
      squares = [...squares, <Square value={board[3 * i + j]} onSquareClick={() => handleClick(3 * i + j)} />]
    }
    let row = <div className="board-row">{squares}</div>;
    boardJsx = [...boardJsx, row];
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardJsx}
    </>
  )
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentBoard = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextBoardState) {
    const newHistory = [...history.slice(0, currentMove + 1), nextBoardState];
    setHistory(newHistory);
    setCurrentMove(newHistory.length - 1);
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  const moves = history.map((board, move) => {
    let description;

    if(move > 0) {
      description = "Go to move #" + move;
    }
    else {
      description = "Go to game start";
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} board={currentBoard} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
