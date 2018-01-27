document.addEventListener('DOMContentLoaded', startGame)

// Define your `board` object here!
var board = {cells: []}
generateBoard(3)
setBombs(1,3)

// This function generates a board with boardSize x boardSize
// cells
function generateBoard(boardSize) {
  for (var i = 0; i < boardSize; i++) {
    for (var j = 0; j < boardSize; j++) {
      //Add a cell
      board.cells.push({
        row: i,
        col: j,
        isMine: false,
        hidden: true
      })
    }  
  }
}

//This function sets the bombs
function setBombs(numberOfBombs, boardSize) {
  for (var i = 0; i < numberOfBombs; i++) {
    setRandomBomb(boardSize)
  }
}

//This function randomly determines where to place the bombs
function setRandomBomb (boardSize) {
  var randomCellNumber = 0
  do {
    //Get a random cell number over range 0 to boardsize squared -1
    randomCellNumber = Math.floor(Math.random()*boardSize*boardSize)
  // Check if their is a bomb at cells[randomCellNumber]. If there is try again
  } while (board.cells[randomCellNumber].isMine)
  // Set the bomb!!
  board.cells[randomCellNumber].isMine = true
}

function startGame () {
  //Count surrounding mines for each cell
  for (var i = 0; i < board.cells.length; i++) {
    board.cells[i].surroundingMines = countSurroundingMines(board.cells[i])
  }

  document.addEventListener('click', checkForWin)
  document.addEventListener('contextmenu', checkForWin)
  
  // Don't remove this function call: it makes the game work!
  lib.initBoard()
}

// Define this function to look for a win condition:
//
// 1. Are all of the cells that are NOT mines visible?
// 2. Are all of the mines marked?
function checkForWin () {
  // You can use this function call to declare a winner (once you've
  // detected that they've won, that is!)
  //   lib.displayMessage('You win!')
  for (var i = 0; i < board.cells.length; i++) {
    //check to see if there is cell with a mine and it is not marked
    if (board.cells[i].isMine) {
      if (!board.cells[i].isMarked) return
    } 
    //check to see if there is a cell that remains hidden
    else if (board.cells[i].hidden) return  
  }
  //if all cells pass both checks the player has won the game
  lib.displayMessage('You win!')
  //Show the play again button
  document.getElementById("reset").classList.toggle("invisble")
}

// Define this function to count the number of mines around the cell
// (there could be as many as 8). You don't have to get the surrounding
// cells yourself! Just use `lib.getSurroundingCells`: 
//
//   var surrounding = lib.getSurroundingCells(cell.row, cell.col)
//
// It will return cell objects in an array. You should loop through 
// them, counting the number of times `cell.isMine` is true.
function countSurroundingMines (cell) {
  //Get surrounding cells
  var surrounding = lib.getSurroundingCells(cell.row, cell.col)
  var mineCount = 0

  //Loop through surrounding cells counting number of mines
  for (var i = 0; i < surrounding.length; i++) {
    if (surrounding[i].isMine) mineCount++    
  }
  //Return the number of mines
  return mineCount
}

