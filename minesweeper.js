document.addEventListener('DOMContentLoaded', startGame)

// Define your `board` object here!
var board = {cells: []}
var boardSize = 6
var numberOfBombs = 5
generateBoard()
setBombs()

// This function generates a board with boardSize x boardSize
// cells
function generateBoard() {
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
function setBombs() {
  for (var i = 0; i < numberOfBombs; i++) {
    setRandomBomb()
  }
}

//This function randomly determines where to place the bombs
function setRandomBomb () {
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

  //Display initial number of mines
  displayMineCount(numberOfBombs)

  //Check for a win
  document.addEventListener('click', checkForWin)
  document.addEventListener('contextmenu', checkForWin)

  //Check to see if a mine has been found
  document.addEventListener('contextmenu',updateMineCount)
  
  // Don't remove this function call: it makes the game work!
  lib.initBoard()
}

function updateMineCount() {
  var mineCount = 0
  for (var i = 0; i < board.cells.length; i++) {
    if (board.cells[i].isMine && !board.cells[i].isMarked) mineCount++
  }
  displayMineCount(mineCount)
}

function displayMineCount(mines) {
  var counter = document.getElementById("score")
  counter.innerHTML = "Number of unmarked mines " + mines
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

  audioClap = document.getElementById("winnoise")
  audioClap.play()

  togglePlayAgainButton()
}

function togglePlayAgainButton() {
  document.getElementById("reset").classList.toggle("invisble")
}

//This function resets the board
function resetBoard() {

  //Hide play again button
  togglePlayAgainButton()
  //Show Let'splay message
  lib.displayMessage("Let's play!")
  //Reset board
  resetCells()
  redrawBoard()
  //Add listensers back in
  var boardNode = document.getElementsByClassName('board')[0]
  lib.addListeners(boardNode)

}

function resetCells() {
  //Reset all board properties. All cells have no mines, are hidden,
  //are not maked and are unprocessed.   
  for (var i = 0; i < boardSize*boardSize; i++) {
    board.cells[i].isMine = false
    board.cells[i].hidden = true
    board.cells[i].isMarked = false 
    board.cells[i].isProcessed = false  
  }  

  //Reset the bombs
  setBombs()

  //Re-count sourrounding mines
  for (var i = 0; i < board.cells.length; i++) {
    board.cells[i].surroundingMines = countSurroundingMines(board.cells[i])
  } 
}

function redrawBoard() {
  
  var cellDivs = document.getElementsByClassName("board")[0].children

  //Redraw board. All cells are hidden, are unmarked, and have no
  //sorrounding mine count showing
  for (var i = 0; i < cellDivs.length; i++) {
    cellDivs[i].classList.add('hidden')
    cellDivs[i].classList.remove('marked')
    //cellDivs[i].classList.remove('mine')
    cellDivs[i].innerHTML = "" 
    //Add mine class if the cell has a mine
    if (board.cells[i].isMine) {
      cellDivs[i].classList.add('mine')
    } else cellDivs[i].classList.remove('mine') 
  }
  
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

