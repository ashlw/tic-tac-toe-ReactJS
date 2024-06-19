import { useState } from "react";

function Square({ value, onSquareClick, win }) {
  const c = "square" + (win ? " square--win" : "");
  return (
    <button className={c} onClick={onSquareClick}>
      {value}
    </button>
  );
}
function Board({ isNext, squares, onPlay, move }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (isNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, i);
  }
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner.player;
  } else if (move === 9) {
    status = "It's a draw!";
  } else {
    status = "Next player: " + (isNext ? "X" : "O");
  }

  const square_row = [];
  let count = 0;
  for (let i = 0; i < 3; i++) {
    row = [];
    for (let j = 0; j < 3; j++) {
      const val = i * 3 + j;
      let win_square = false;
      if (winner) {
        win_square = winner.line.includes(val);
      }
      row.push(
        <Square
          key={count}
          value={squares[count]}
          onSquareClick={() => handleClick(val)}
          win={win_square}
        />
      );
      count++;
    }
    square_row.push(
      <div className="board-row" key={i}>
        {row}
      </div>
    );
  }
  return (
    <>
      <div className="status">{status}</div>
      {square_row}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([
    {
      squares: Array(9).fill(null),
      currentCoord: null,
    },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const [ascending, setAscending] = useState(true);
  xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares, coords) {
    // const r = Math.floor(coords / 3);
    // const c = coords % 3;
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      {
        squares: nextSquares,
        currentCoord: coords,
      },
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggle() {
    setAscending(!ascending);
  }

  const moves = history.map((squares, move) => {
    let description;
    let r = Math.floor(squares.currentCoord / 3);
    let c = squares.currentCoord % 3;
    console.log(r, c);
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>
          {description} [{r}, {c}]
        </button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          isNext={xIsNext}
          squares={currentSquares.squares}
          onPlay={handlePlay}
          move={currentMove}
        />
      </div>
      <div className="game-info">
        <p>Currently on move {currentMove}</p>
        <p></p>
        <button onClick={() => toggle()}>Click to toggle order</button>
        <ol>{ascending ? moves : moves.reverse()}</ol>
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
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
