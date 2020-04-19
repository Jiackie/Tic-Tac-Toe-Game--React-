function Square(props) {
  return (
    <button
      className={`square ${props.winPosition ? 'win' : ''}`}
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function Board (props) {
  return (
    <div>
      {[0,1,2].map(i => {
        return (
          <div className="board-row" key={i}>
            {[0,1,2].map(j => {
              const position = j + i * 3;
              const winPosition = props.winPosition.indexOf(position) === -1 ? false: true;
              return (
                <Square
                 value = {props.squares[position]}
                 winPosition= {winPosition}
                 onClick = {() => props.onClick(position)}
                 key = {j}
                />
              );
            })}
          </div>);
      })}
    </div>
  );

}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        col: null,
        row: null
      }],
      stepNumber: 0,
      xIsNext: true, 
      ascending: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0,this.state.stepNumber +1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const row = Math.floor(i / 3);
    const col = i - row * 3;
    if (calculateWinner(squares)[3] || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{
        squares: squares,
        col: col,
        row: row
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleReverse () {
    this.setState({
      ascending: !this.state.ascending
    });
  }

  render() {
    const history = this.state.history;
    const stepNumber = this.state.stepNumber;
    const current = history[stepNumber];
    const [win1, win2, win3, winner] = calculateWinner(current.squares);
    const ascending = this.state.ascending;

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' at position : ( ' + step.row + ', ' + step.col + ' )':
        'Go to game start';
      return (
        <li key={move}>
          <button
          onClick={() => this.jumpTo(move)}
          className={` ${stepNumber === move? 'bold': ''} `}>
            { desc }
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner is ' + winner;
    } else if (current.squares.indexOf(null) === -1) {
      status = 'No one wins, a draw result';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
           squares = {current.squares}
           winPosition = {[win1, win2, win3]}
           onClick = {(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="game-header">
          {status}
          <button
          className="sort-btn"
          onClick={() => this.handleReverse()}
          >
            Asd/Dsc
          </button>
          </div>
          <ol>{ascending ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
      return [a, b, c, squares[a]];
    }
  }

  return [null, null, null, null];
}

// Some implement
// Display the location for each move in the format (col, row) in the move history list.
// Bold the currently selected item in the move list.
// Rewrite Board to use two loops to make the squares instead of hardcoding them.
// Add a toggle button that lets you sort the moves in either ascending or descending order.
// When someone wins, highlight the three squares that caused the win.
// When no one wins, display a message about the result being a draw.
