/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Confetti from "react-confetti";

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button
      onClick={onSquareClick}
      className={`square ${isWinningSquare ? "winning-square" : ""}`}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, winningSquares }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status = "";
  if (winner) {
    status = "Winner: " + winner.player;
  } else {
    status = "Next Player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board">
        {squares.map((value, index) => (
          <Square
            key={index}
            value={value}
            onSquareClick={() => handleClick(index)}
            isWinningSquare={winningSquares.includes(index)}
          />
        ))}
      </div>
    </>
  );
}

function Modal({ winner, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Congratulations!</h2>
        <p>Winner: {winner}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const winner = calculateWinner(currentSquares);

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setShowModal(false);
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    if (calculateWinner(nextSquares)) {
      setShowModal(true);
    }
  }

  function restartGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
    setShowModal(false);
  }

  const moves = history.map((squares, move) => {
    let description = "";
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <>
      {winner && <Confetti />}
      {showModal && (
        <Modal winner={winner.player} onClose={() => setShowModal(false)} />
      )}
      <h1>Tic Tac Toe</h1>
      <div className="game">
        <div className="game-board">
          <Board
            xIsNext={xIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
            winningSquares={winner ? winner.line : []}
          />
        </div>
        <div className="game-info">
          <button onClick={restartGame}>Restart Game</button>
          <ol>{moves}</ol>
        </div>
      </div>
    </>
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
      return { player: squares[a], line: lines[i] };
    }
  }

  return null;
}
