/* Goals:
    Build an interactive Tic-Tac-Toe game

    Store the gameboard as an array inside of a Gameboard object  -- DONE

Tips:
  1. Use as little global code as possible
  2. Try putting as many items inside factory functions as possible
  3. If a single instance of something is needed (like the gameboard, the displayController, etc)
      then wrap the factory inside an IIFE (module pattern) so it cannot be reused
       to create additional instances
  4. Focus on getting the game working in console first
    4a. Check for all winning 3-in-a-rows and ties
  5. Once the game works in console, create an object that will handle the display/DOM logic
  6. Write a function that will render the contents of the gameboard array to the webpage
  7. Write the functions that will allow players to add marks to a specific spot on the board
    by interacting with the appropriate DOM elements 
    7a. Don't forget the logic that keeps players from playing in spots that are already taken
  8. Clean up the interace that allows players to put in their names, include a button to start/restart the game
    8a. Add a display element that shows the results upon game end
*/

/* MISC notes:

-- We can have a function provide a numerical value and type of player piece (X or O) to the gameboard. Based on this numerical value, set the space on the gameboard to the player piece

*/

// Create the Gameboard object
const gameBoard = (function () {
    let board = ['','','','','','','','',''];

    // function to get the marker in the current slot
    function getSlot(slot) {
        return board[slot -1];
    }

    // function to set the marker in the current slot
    function setMarker(slot, marker){
        if (getSlot(slot) == '') {
            board[slot-1] = marker;
            return true;
        }
        else {
            return 'Slot already taken';
        }
    }

    // function to reset the board
    function resetBoard(){
        board = ['','','','','','','','',''];
    }

    // function to get the board
    function getBoard(){
        return board;
    }    

    return {getBoard, resetBoard, getSlot, setMarker};
    
})();

// function to create the player object
function Player(markerValue){

    let playerMarker = markerValue;

    return {playerMarker};
}


// Create a gameController object
const gameController = (function() {

    let player1 = Player("X");
    let player2 = Player("O");
    let players = [player1, player2];

    let winCondition1 = [1,2,3];
    let winCondition2 = [4,5,6];
    let winCondition3 = [7,8,9];

    let winCondition4 = [1,4,7];
    let winCondition5 = [2,5,8];
    let winCondition6 = [3,6,9];
    
    let winCondition7 = [1,5,9];
    let winCondition8 = [3,5,7];

    let allWinConditions = [winCondition1, winCondition2, winCondition3, winCondition4, winCondition4, winCondition5, winCondition6, winCondition7, winCondition8];

    let winHappened;

    let gameStatus;

    // initially player 1's turn
    let currentTurn;

    // CurrentPlayersTurn
    let CurrentPlayersTurn;

    // function to check if a player win happened
    function evaluatePlayerWin(){
        if(gameStatus == 'Complete'){
            return true;
        }
        return false;
    }

    // function to start the game
    function startGame(){
        currentTurn = 1;
        CurrentPlayersTurn = player1;
        setGameStatus("In Progress");
        console.log("Player 1's turn");
    }

    // function to repeat the last turn

    // function to change the currentTurn
    function changeTurn(){
        if(!evaluatePlayerWin()){
            if(currentTurn == 1){
                CurrentPlayersTurn = players[1];
                currentTurn = 2;
                console.log(`Player ${currentTurn}'s turn`);
            }
            else{
                currentTurn = 1;
                CurrentPlayersTurn = players[0];
                console.log(`Player ${currentTurn}'s turn`);
                return `Player {currentTurn}'s turn`;
            }
        }
        else{
            return 'The game ended';
        }
    }   

    // function to restart the game
    function restartGame(){
        gameBoard.resetBoard();
        CurrentPlayersTurn = players[0];
        currentTurn = 1;
        setGameStatus('');

    }

    // function to check if a win condition has occurred
    function checkWinCondition(currentWinCondition){
        let currentValue = gameBoard.getSlot(currentWinCondition[0]);

        console.log(`CurrentValue = ${currentValue}`);

        if(currentValue != '' && currentValue !== undefined){
            for(let i = 0; i < currentWinCondition.length; i++){
                let slotValue = gameBoard.getSlot(currentWinCondition[i]);
                if(slotValue == '' || slotValue=== undefined){
                    return false;
                }
                else if(slotValue != currentValue){
                    return false;
                }
                console.log(`checkWinCondition: gameBoard.getSlot(${currentWinCondition[i]}) == ${currentValue}`);
            }
            return true;
        }        
        return false;
    }

    // function to evaluate all win conditions
    function checkWin(){
        winHappened =  allWinConditions.some(checkWinCondition);
        return winHappened;
    }

    // function to check for a draw
    function checkDraw(){
        for(let i = 0; i < gameBoard.getBoard().length; i++){
            let slotValue = gameBoard.getSlot(i);
            if(slotValue == '' || slotValue === undefined){
                console.log(`Draw check: slot ${i} is null. Not a draw!`);
                return false;
            }
        }
        return true;
    }

    // function to return gameStatus
    function getGameStatus(){
        return gameStatus;
    }

    // function to set the gameStatus
    function setGameStatus(status){
        gameStatus = status;
    }

    // function for the player's turn
    function PlayerTurn(slot){
        let playerDecision = gameBoard.setMarker(slot, CurrentPlayersTurn.playerMarker);

        if(checkWin() || checkDraw()){
            setGameStatus("Complete");
            console.log('Game has completed!');
        };

        if(playerDecision != true){
            return playerDecision;
        }
        else if (gameStatus != "Complete"){
            changeTurn();
        };        
    }

    return {startGame, restartGame, changeTurn, PlayerTurn};

})();


gameController.startGame();