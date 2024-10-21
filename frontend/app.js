const cells = document.querySelectorAll(".cell");
let currentPlayer = 'X';
let gameState = ['','','','','','','','','']
const statusDisplay = document.getElementById('status');
const winningState = [
    [0,1,2],[3,4,5],[6,7,8], // horizontal
    [0,3,6],[1,4,7],[2,5,8], // vertical
    [0,4,8],[2,4,6] // diagonal
];

function handleCellClick(event){
    const clickedCell = event.target;
    const clickedIndex = parseInt(clickedCell.getAttribute('data-index'));
    if(gameState[clickedIndex] != '' || checkWinner()){
        return;
    }

    gameState[clickedIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    if(checkWinner()){
        statusDisplay.textContent = `Player '${currentPlayer}' has won!`;
        return;
    }
    if(gameState.every(cell => cell != '')){
        statusDisplay.textContent = "It's a draw!";
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkWinner(){
    let roundWon = false;
    for(let i = 0 ; i < winningState.length ; i++){
        const [a,b,c] = winningState[i];
        if(gameState[a] === '' || gameState[b] === '' || gameState[c] === ''){
            continue;
        }
        if(gameState[a] === gameState[b] && gameState[a] === gameState[c]){
            roundWon = true;
            break;
        }
    }
    return roundWon;
}


cells.forEach(cell => cell.addEventListener('click', handleCellClick));