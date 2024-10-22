import React, { useState } from "react";
import "./index.css"; // Import file CSS
import "bootstrap/dist/css/bootstrap.min.css";

function Square({ value, onSquareClick, highlight }) {
  return (
    <button
      className={`square ${highlight ? "highlight" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ squares, onSquareClick, winningSquares }) {
  function renderSquare(i) {
    return (
      <Square
        key={i}
        value={squares[i]}
        onSquareClick={() => onSquareClick(i)}
        highlight={winningSquares && winningSquares.includes(i)}
      />
    );
  }

  function renderBoard() {
    const board = [];
    for (let row = 0; row < 3; row++) {
      const boardRow = [];
      for (let col = 0; col < 3; col++) {
        boardRow.push(renderSquare(row * 3 + col));
      }
      board.push(
        <div key={row} className="board-row">
          {boardRow}
        </div>
      );
    }
    return board;
  }

  return <>{renderBoard()}</>;
}

export default function Game() {
  const [history, setHistory] = useState([
    { squares: Array(9).fill(null), location: null },
  ]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true); // State for sorting order
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;
  const winnerInfo = calculateWinner(currentSquares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const winningSquares = winnerInfo ? winnerInfo.line : null;

  function handlePlay(nextSquares, location) {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, location },
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleClick(i) {
    if (currentSquares[i] || winner) {
      return;
    }
    const nextSquares = currentSquares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    const location = [Math.floor(i / 3), i % 3];
    handlePlay(nextSquares, location);
  }

  function toggleSortOrder() {
    setIsAscending(!isAscending);
  }

  let status;
  let statusClass = "status";
  let boardClass = "game-board";
  if (winner) {
    status = "Winner: " + winner;
    statusClass += " winner";
  } else if (currentMove === 9) {
    status = "The game is a draw.";
    statusClass += " draw";
    boardClass += " draw-effect";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const moves = history.map((step, move) => {
    const location = step.location
      ? `(${step.location[0] + 1}, ${step.location[1] + 1})`
      : "";
    let description;
    if (move === currentMove) {
      if (move === 0) {
        description = "Go to game start";
      } else {
        description = `You are at move #${location}`;
      }
    } else if (move > 0) {
      description = `Go to move #${location}`;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        {move === currentMove ? (
          <span className="current-move">{description}</span>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  const sortedMoves = isAscending ? moves : moves.slice().reverse();

  return (
    <div className="container game">
      <div className="row row-config">
        <div className="col-md-6">
          <div className={boardClass}>
            <Board
              squares={currentSquares}
              onSquareClick={handleClick}
              winningSquares={winningSquares}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="game-info">
            <div className={statusClass}>{status}</div>
            <button className="sort-button" onClick={toggleSortOrder}>
              {isAscending ? "Sort Descending" : "Sort Ascending"}
            </button>
            <div className="moves-list-container">
              <ol className="moves-list">{sortedMoves}</ol>
            </div>
          </div>
        </div>
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
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}
