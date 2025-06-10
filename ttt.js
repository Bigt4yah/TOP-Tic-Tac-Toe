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

    let playerMarker;

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
        playerMarker = player1.playerMarker;
        setGameStatus("In Progress");
        //console.log("Player 1's turn");
    }

    // function to repeat the last turn

    // function to change the currentTurn
    function changeTurn(){
        if(!evaluatePlayerWin()){
            if(currentTurn == 1){
                CurrentPlayersTurn = players[1];
                currentTurn = 2;
                playerMarker = player2.playerMarker;
                console.log(`Player ${currentTurn}'s turn`);
            }
            else{
                currentTurn = 1;
                CurrentPlayersTurn = players[0];
                playerMarker = player1.playerMarker;
                console.log(`Player ${currentTurn}'s turn`);
                //return `Player {currentTurn}'s turn`;
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

        //console.log(`CurrentValue = ${currentValue}`);

        if(currentValue != '' && currentValue !== undefined){
            for(let i = 0; i < currentWinCondition.length; i++){
                let slotValue = gameBoard.getSlot(currentWinCondition[i]);
                if(slotValue == '' || slotValue=== undefined){
                    return false;
                }
                else if(slotValue != currentValue){
                    return false;
                }
                //console.log(`checkWinCondition: gameBoard.getSlot(${currentWinCondition[i]}) == ${currentValue}`);
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
                //console.log(`Draw check: slot ${i} is null. Not a draw!`);
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

        if(gameStatus == 'Complete'){
            return false;
        }

        let playerDecision = gameBoard.setMarker(slot, CurrentPlayersTurn.playerMarker);

        if(checkWin() || checkDraw()){
            setGameStatus("Complete");
            console.log('Game has completed!');
            return gameStatus;
        };

        if(playerDecision != true){
            return playerDecision;
        }
        else if (gameStatus != "Complete"){
            changeTurn();
            return true;
        };        
    }

    // function to retrieve the player marker -- to be used in the gameDisplayController
    function getPlayerMarker(){
        return playerMarker;
    }

    return {startGame, restartGame, changeTurn, PlayerTurn, getPlayerMarker};

})();


// Create the displayController object
const gameDisplayController = (function(){

    // Start Button element
    const startBtn = document.querySelector("#startBtn");

    // Restart Button element
    const restartBtn = document.querySelector("#restartBtn");

    // game-container element
    const gameContainer = document.querySelector("#game-container");

    // Players -- element to display player names
    const playerMsg = document.querySelector("#player-container");

    // winner msg -- element to display the winner
    const winnerMsg = document.querySelector("#winner-msg");

    // Player1 Form
    const player1Form = document.querySelector("#player1-form");
    const player1Submit = document.querySelector("#addPlayer1Name");
    let player1Name;
    let player1Set = false;
    
    player1Form.addEventListener("submit", (e) => {
        e.preventDefault();
        player1Name = document.querySelector("#player1Name").value;

        hideElement(player1Form);

        player1Set = true;

        if(player2Set){
            let playerHeader = player1Name + ' vs ' + player2Name;
            playerMsg.textContent = playerHeader;
            startGame();
        }
    })

    // Player2 Form
    const player2Form = document.querySelector("#player2-form");
    const player2Submit = document.querySelector("#addPlayer2Name");
    let player2Name;
    let player2Set = false;

    player2Form.addEventListener("submit", (e) => {
        e.preventDefault();
        player2Name = document.querySelector("#player2Name").value;

        hideElement(player2Form);
        player2Set = true;

        if(player1Set){
            let playerHeader = player1Name + ' vs ' + player2Name;
            playerMsg.textContent = playerHeader;
            startGame();
        }

    })

    // Function to hide forms
    function hideElement(element){
        if (element.style.display != "none"){
            element.style.display = "none";
        }
    }

    
    // function to generate board
    function GenerateGameBoard(){
        const board = document.createElement('table');

        let rows = 1;
        let cells;
        let newCells = 1;
        while(rows < 4){
            let newRow = document.createElement('tr');

            // set properties of new row element
            newRow.style.borderStyle = 'solid';
            newRow.style.borderWidth = '1px';
            newRow.style.borderColor = 'black';
            newRow.style.borderCollapse = 'collapse';

            // set cells variable to 1 -- used to loop through and create 3 cells per row
            cells = 1;

            while(cells < 4){
                // Create new td element
                let newCell = document.createElement('td');

                // create variable to hold the newCells value (used for incrementing the id value)
                let newCellValue = newCells;

                // set the id of the newCell
                let newID = `cell-${newCellValue}`;
                newCell.id = newID;

                // set properties of new td element
                newCell.style.minHeight = '10px';
                newCell.style.minWidth = '10px';
                newCell.style.borderStyle = 'solid';
                newCell.style.borderWidth = '1px';
                newCell.style.borderColor = 'black';
                newCell.style.borderCollapse = 'collapse';

                // placeholder text within the new cell
                newCell.innerText = '';

                // add event listener to each cell
                newCell.addEventListener("click", playerMove);

                // append the newCell to the newRow
                newRow.appendChild(newCell);

                // increment variables
                cells += 1;
                newCells +=1;
            }
            // append newRow to board
            board.appendChild(newRow);

            // increment variables
            rows++;
        }

        // Set properties of new table element
        board.id = 'gameBoardTable';
        board.style.minHeight = '100px';
        board.style.minWidth = '100px';
        board.style.maxHeight = '500px';
        board.style.maxWidth = '500px';
        board.style.borderStyle = 'solid';
        board.style.borderWidth = '2px';
        board.style.borderColor = 'black';
        gameContainer.appendChild(board);
    }

    // Function to restart the game -- to be added to the Restart Button
    function restartGame(){
        gameController.restartGame();

        const board = document.querySelector("#gameBoardTable");
        gameContainer.removeChild(board);
        winnerMsg.innerText = '';
        startGame();
    }

    // Add event to Restart Button
    restartBtn.addEventListener("click", restartGame);

    // Function to start the game -- to be added to the Start Button
    function startGame(){
        if(player1Name == '' || player1Name === undefined){
            player1Name = 'Player1';
            player1Set = true;
        }

        if(player2Name == '' || player2Name === undefined){
            player2Name = 'Player2';
            player2Set = true;
        }

        let playerHeader = player1Name + ' vs ' + player2Name;
        playerMsg.textContent = playerHeader;

        // hide the start button
        hideElement(startBtn);
        hideElement(player1Form);
        hideElement(player2Form);

        // Generate the gameboard
        GenerateGameBoard();

        // start the game using the gameController
        gameController.startGame();
    }

    // Add event to Start Button
    startBtn.addEventListener("click", startGame);

    // Function to get the substring returned after a specific character
    function getCellNumber(strToLookFor, myStr){
        const parts = myStr.split(strToLookFor);
        if(parts.length < 1){
            return `The string ${strToLookFor} cannot be found in ${myStr}`;
        }
        return parts[1];
    }

    // Function for cells in the table to listen for to place a marker in the table
    function playerMove(e){
        // get the ID of the element
        let elementID = e.target.id;

        // get the targeted Slot based off the ID of the element, looking for a hyphen
        let targetSlot = parseInt(getCellNumber('-', elementID));

        // get the player marker that needs to go in the element
        let playerMarker = gameController.getPlayerMarker();        

        // Make Player's Turn on the gameController
        let validMove = gameController.PlayerTurn(targetSlot);

        if(validMove == true){
            // set the element innerText to the playerMarker
            e.target.innerText = playerMarker;
        }
        else if(validMove == 'Complete'){
            e.target.innerText = playerMarker;
            if(playerMarker =='X'){
                winnerMsg.innerText = `${player1Name} wins!`;
            }
            else{
                winnerMsg.innerText = `${player2Name} wins!`;
            }
        }
    }

})();
