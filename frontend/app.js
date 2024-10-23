const cells = document.querySelectorAll(".cell");
let currentPlayer = 'X';
let gameState = [' ',' ',' ',' ',' ',' ',' ',' ',' ']
const statusDisplay = document.getElementById('status');
const winningState = [
    [0,1,2],[3,4,5],[6,7,8], // horizontal
    [0,3,6],[1,4,7],[2,5,8], // vertical
    [0,4,8],[2,4,6] // diagonal
];

function handleCellClick(event){
    const clickedCell = event.target;
    const clickedIndex = parseInt(clickedCell.getAttribute('data-index'));
    if(gameState[clickedIndex] != ' ' || checkWinner()){
        return;
    }

    gameState[clickedIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    if(checkWinner()){
        statusDisplay.textContent = `Status: Player '${currentPlayer}' has won!`;
        return;
    }
    if(gameState.every(cell => cell != ' ')){
        statusDisplay.textContent = "Status: It's a draw!";
        return;
    }

    // currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    sendStateToBackend()

}

function checkWinner(){
    let roundWon = false;
    for(let i = 0 ; i < winningState.length ; i++){
        const [a,b,c] = winningState[i];
        if(gameState[a] === ' ' || gameState[b] === ' ' || gameState[c] === ' '){
            continue;
        }
        if(gameState[a] === gameState[b] && gameState[a] === gameState[c]){
            roundWon = true;
            break;
        }
    }
    return roundWon;
}
    
function getAvailableMoves(state){
    let availableMoves = [];
    state.forEach((cell, index) =>{
        if(cell === ' '){
            availableMoves.push(index);
        }
    });
    return availableMoves;
}

function updateState(){
    const state = document.querySelectorAll('.cell');
    gameState.forEach((val, index) => {
        state[index].innerHTML = val;
    })
}

async function sendStateToBackend(){
    const availableMoves = getAvailableMoves(gameState);
    try{
        const res = await fetch('http://127.0.0.1:5000/api/make-move', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                state: gameState,
                available_moves: availableMoves
            })
        })
        if(!res.ok){
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        console.log('AI selected move:', data.action);

        if(data.action !== undefined){
            gameState[data.action] = 'O';
            updateState();
            if(checkWinner()){
                statusDisplay.textContent = `Player 'O' has won!`;
            }
        }
    }
    catch(error){
        console.error('Error during fetch:', error);
    }
}

function clearBoard(){
    gameState = [' ',' ',' ',' ',' ',' ',' ',' ',' '];
    updateState();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
clearBtn = document.getElementById('clear-btn');
clearBtn.addEventListener('click', clearBoard);