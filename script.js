// Player Factory
const Player = (sign) => {
    this.sign = sign

    const getSign = () => {
      return sign
    };
  
    return { getSign }
  }
  
// GameBoard Module
const GameBoardModule = (() => {

    const BOARD_SIZE = 9
   const gameBoard = ['','','','','','','','','']

   const isValidMove = (index) => {
        if (gameBoard[index] === ""){
            return true
        }
        return false
   }

   const setMove = (index, sign) => {
    gameBoard[index] = sign
   }

   const getMove = (index) => {
    return gameBoard[index]
   }
   
   const resetGameBoard = () => {
    for (let i = 0; i < gameBoard.length; i++){
        gameBoard[i] = ""
    }
   }

    return {
        setMove, getMove, resetGameBoard, isValidMove, BOARD_SIZE
    };
  })();


// DISPLAY CONTROLLER MODULE
const displayController = (()=>{
   const renderBoard =  () => {
    const gameBoardContainer = document.getElementById('gameBoardContainer')
    // remove any existing children
    while (gameBoardContainer.firstChild) {
        gameBoardContainer.removeChild(gameBoardContainer.firstChild);
    }
    //
    let index = 0;
    for (let i = 0; i < GameBoardModule.BOARD_SIZE; i++){
        const boardElement = document.createElement('div')
        boardElement.classList = "gameBoardItem"
        boardElement.dataset.index = index
        boardElement.addEventListener('click', e =>{        
            TicTacToeModule.playRound(e)
        })        
        gameBoardContainer.appendChild(boardElement)
        index++
    }
    updateBoard()
   }

   const updateBoard = () =>{
    // get all the boardElements
    const boardElementArray = Array.from(document.querySelectorAll('.gameBoardItem'))
    // for each element in the array, append the value in the array to the element in the boardElementArray
    let j = 0
    for (let i = 0; i < GameBoardModule.BOARD_SIZE ; i++){
        boardElementArray[j].textContent = GameBoardModule.getMove(i)
        j++
    }
    return 
   }


   

return {renderBoard, updateBoard}
})();

// TIC-TAC-TOE GAME LOGIC MODULE
const TicTacToeModule = (() => {
    // Element that pops up on win/draw
    const resultContainer = document.getElementById('resultContainer')
    // H1 inside the popup that displays the game status
    const displayGameResult = document.getElementById('displayGameResult')

    // render the board
    displayController.renderBoard()
    // create two player objects
    const playerOne = Player("X")
    const playerTwo = Player("O")
    // tracks current round for 'X' / "O"
    let round = 2

   const playRound = e => {
    // get and save the index of the target index
    let index = e.target.dataset.index
    console.log(index)
    // check and make sure index of move is not already taken
    if (GameBoardModule.isValidMove(index)){
        console.log('move is valid')
        // get the current player
        let sign = getCurrentPlayer()
        // add the move (index on the board and current player sign to the array)
        GameBoardModule.setMove(index, sign)
        // update the UI 
        displayController.updateBoard()
        
        // check for win
        if (checkWin()){
            displayGameResult.textContent = `${getCurrentPlayer()} is the winner`
            showGameResultContainer()
        }
        // check for draw
        if (checkDraw()){
            displayGameResult.textContent = "Draw"
            showGameResultContainer()
        }
        // increment the round
        round++
    }
   }

   const checkWin = () => {
        const winConditions = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ]

        let winner = false
        let temp = []

        winConditions.forEach(element =>{
            for (let i = 0; i < element.length; i++){
                let index = element[i]
                temp.push(GameBoardModule.getMove(index)) 
            }
            const allEqual = arr => arr.every( v => {
                if (v === arr[0] && arr[0] !== ""){
                    return true
                }
            })
            if (allEqual(temp) === true && temp.length > 2){
                winner = true
            }
            temp = []
        })
        return winner
   }

    const checkDraw = () => {
        for (let i = 0; i <GameBoardModule.BOARD_SIZE; i++){
            if (GameBoardModule.getMove(i) === ""){
                return false
            }
        }
        return true
   }

   const restartGamePopUP = document.getElementById('restartGamePopUp')
   restartGamePopUP.onclick = () => {
    hideGameResultContainer()
    resetGameState()
   }

   const restartGame = document.getElementById('restartGame')
   restartGame.onclick = () => {
    resetGameState()
   }

   const resetGameState = () => {
     // reset the array
     GameBoardModule.resetGameBoard()
     displayController.renderBoard()
     // render a new board
     // reset the round number
     round = 2
   }

   const showGameResultContainer = ()=> {
    resultContainer.style.display = "block"
   }

   const hideGameResultContainer = ()=> {
    resultContainer.style.display = "none"
    }

   const getCurrentPlayer = () => {
    return round % 2 === 0 ? playerOne.getSign() : playerTwo.getSign()
   }
   
   return {
    getCurrentPlayer, playRound
   }
})();
