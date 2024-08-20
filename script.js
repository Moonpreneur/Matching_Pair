document.getElementById('how-to-play-button').addEventListener('click', function () {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('instructions-screen').style.display = 'flex';
});

document.getElementById('start-game-button').addEventListener('click', function () {
    document.getElementById('instructions-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'flex';
    startGame('first-set'); 
});

document.getElementById('reset-game-button').addEventListener('click', function () {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
    resetGame();
});

const startAudio = new Audio('audiostart.mp3');
const matchAudio = new Audio('match.mp3');
const loseAudio = new Audio('lose.mp3');
const winnAudio = new Audio('winn.mp3');
const musicAudio = new Audio('music.mp3');

let expressions = [
    { expression: "5 + 2", value: 7, color: "red" },
    { expression: "4 + 3", value: 7, color: "red" },
    { expression: "4 + 4", value: 8, color: "blue" },
    { expression: "6 + 2", value: 8, color: "blue" },
    { expression: "14 + 5", value: 19, color: "yellow" },
    { expression: "7 + 12", value: 19, color: "yellow" },
    { expression: "2 + 15", value: 17, color: "purple" },
    { expression: "10 + 7", value: 17, color: "purple" },
    { expression: "4 + 1", value: 5, color: "white" },
    { expression: "2 + 3", value: 5, color: "white" },
    { expression: "11 + 5", value: 16, color: "violet" },
    { expression: "8 + 8", value: 16, color: "violet" }
];

let setsCompleted = 0;

function startGame(setType) {
    startAudio.play();
    setTimeout(() => {
        startAudio.pause();
        musicAudio.play();
    }, 4500);

    const memoryGameContainer = document.querySelector('.memory-game');
    memoryGameContainer.className = `memory-game ${setType}`; 
    memoryGameContainer.innerHTML = '';

    expressions.sort(() => 0.5 - Math.random());

    expressions.forEach((item) => {
        const memoryCard = document.createElement('div');
        memoryCard.classList.add('memory-card', setType);

        const frontFace = document.createElement('img');
        frontFace.classList.add('frontface');
        frontFace.src = "images.png";

        const backFace = document.createElement('div');
        backFace.classList.add('backface');
        backFace.textContent = item.expression;

        memoryCard.appendChild(frontFace);
        memoryCard.appendChild(backFace);
        memoryGameContainer.appendChild(memoryCard);

        memoryCard.dataset.value = item.value;
        memoryCard.dataset.color = item.color; 
        memoryCard.addEventListener('click', flipCard);
    });

    resetBoard();
    startTimer();
}

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let movesCount = 0;
let correctMatches = 0;
let startingMinutes = 2;
let time = startingMinutes * 60;
let interval;

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');
    this.style.backgroundColor = this.dataset.color;

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.dataset.value === secondCard.dataset.value;

    if (isMatch) {
        matchAudio.play();
        hideCards();
    } else {
        unflipCards();
    }
}

function hideCards() {
    setTimeout(() => {
        firstCard.classList.add('hidden');
        secondCard.classList.add('hidden');
        correctMatches++;
        resetBoard();

        if (correctMatches === 6) {
            clearInterval(interval);
            musicAudio.pause();
            winnAudio.play();
            setsCompleted++;
            if (setsCompleted === 2) {
                showGameOverScreen(); 
            } else {
                setTimeout(transitionToSecondGame, 500); 
            }
        }
    }, 500);
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        firstCard.style.backgroundColor = ''; 
        secondCard.style.backgroundColor = '';
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
    movesCount++;
    document.querySelector('.Moves').textContent = movesCount;
}

function startTimer() {
    interval = setInterval(() => {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        document.getElementById('countdown').innerHTML = `${minutes}:${seconds}`;
        time--;

        if (time < 0) {
            musicAudio.pause();
            loseAudio.play();
            clearInterval(interval);
            showGameOverScreen();
        }
    }, 1000);
}

function showGameOverScreen() {
    const gameOverModal = document.querySelector('.GameOver');
    const overlay = document.querySelector('.overlay');

    gameOverModal.style.visibility = 'visible';
    overlay.style.visibility = 'visible';
}

function resetGame() {
    clearInterval(interval);
    time = startingMinutes * 60;
    movesCount = 0;
    correctMatches = 0;
    setsCompleted = 0;
    document.querySelector('.Moves').textContent = movesCount;
    document.getElementById('countdown').innerHTML = `2:00`;
    document.querySelector('.memory-game').innerHTML = '';
}

function transitionToSecondGame() {
    expressions = [
        { expression: "5 + 2", value: 7, color: "Indigo" },
        { expression: "4 + 3", value: 7, color: "Indigo" },
        { expression: "15+5", value: 20, color: "Magenta" },
        { expression: "5+15", value: 20, color: "Magenta" },
        { expression: "1 + 2", value: 3, color: "olive" },
        { expression: "2 + 1", value: 3, color: "olive" },
        { expression: "7 + 6", value: 13, color: "Teal" },
        { expression: "8 + 5", value: 13, color: "Teal" },
        { expression: "34 + 17", value: 51, color: "Amber" },
        { expression: "26 + 25", value: 51, color: "Amber" }
    ];
    correctMatches = 0; 
    startGame('second-set'); 
}
