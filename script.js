let userScore = 0;
let botScore = 0;
let target = Infinity;
let isUserBatting = true;
let isGameOver = false;

const emojis = ["✊", "☝️", "✌️", "🤟", "🖖", "✋", "🤙"]; // 0 to 6

function playRound(userMove) {
    if (isGameOver) return;

    const botMove = Math.floor(Math.random() * 7);
    
    // UI Elements
    const userHand = document.getElementById('user-hand');
    const botHand = document.getElementById('bot-hand');
    const statusText = document.getElementById('game-status');

    // 1. Trigger Animation
    userHand.classList.add('shake');
    botHand.classList.add('shake');

    setTimeout(() => {
        // 2. Remove animation and Show Moves
        userHand.classList.remove('shake');
        botHand.classList.remove('shake');
        
        userHand.innerText = emojis[userMove];
        botHand.innerText = emojis[botMove];
        document.getElementById('user-move').innerText = userMove;
        document.getElementById('bot-move').innerText = botMove;

        // 3. Core Logic
        if (isUserBatting) {
            handleUserBatting(userMove, botMove);
        } else {
            handleBotBatting(userMove, botMove);
        }
    }, 500);
}

function handleUserBatting(user, bot) {
    if (user === bot) {
        alert("OUT! Your turn to bowl.");
        target = userScore + 1;
        document.getElementById('target').innerText = target;
        isUserBatting = false;
        userScore = 0; // Reset temp score for bot's turn tracking
        document.getElementById('user-score').innerText = 0;
        document.getElementById('game-status').innerText = "You are Bowling";
    } else {
        userScore += user;
        document.getElementById('user-score').innerText = userScore;
    }
}

function handleBotBatting(user, bot) {
    if (user === bot) {
        checkWinner("You Win! 🏆");
    } else {
        botScore += bot;
        document.getElementById('user-score').innerText = botScore;
        
        if (botScore >= target) {
            checkWinner("Bot Wins! 🤖");
        }
    }
}

function checkWinner(message) {
    document.getElementById('game-status').innerText = message;
    isGameOver = true;
    document.getElementById('reset-btn').style.display = "inline-block";
}

function resetGame() {
    location.reload(); // Simple way to reset everything
}