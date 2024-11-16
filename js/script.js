document.addEventListener('DOMContentLoaded', () => {
    const actor = document.querySelector('.actor');
    const icon = document.querySelector('.icon');
    const gameBoard = document.querySelector('.game-board');
    const startScreen = document.querySelector('.start-screen');
    const startButton = document.getElementById('start-button');
    const restartRankingButton = document.getElementById('restart-ranking-button');
    const characterOptions = document.querySelectorAll('.character-option');
    const playerNameInput = document.getElementById('player-name');
    const scoreDisplay = document.getElementById('score-display');
    const leaderboardList = document.getElementById('leaderboard-list');

    const images = ["fench.png", "js.png", "java.png", "php.png", "postgresql.png"];
    let selectedCharacter = './images/actor.gif';
    let score = 0;
    let scoreInterval = null;
    let gameActive = false;
    let playerName = '';

    function loadLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboardList.innerHTML = '';
        leaderboard.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `${entry.name} - ${entry.score}`;
            leaderboardList.appendChild(li);
        });
    }

    function saveLeaderboard(name, score) {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboard.push({ name, score });
        leaderboard.sort((a, b) => b.score - a.score); // Sort by score in descending order
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        loadLeaderboard();
    }

    characterOptions.forEach(option => {
        option.addEventListener('click', (event) => {
            selectedCharacter = event.target.getAttribute('data-character');
            characterOptions.forEach(opt => {
                opt.classList.remove('selected');
            });
            event.target.classList.add('selected');
        });
    });

    function startGame() {
        if (!playerName) {
            alert("Por favor, insira seu nome!");
            return;
        }

        actor.src = selectedCharacter;
        startScreen.style.display = 'none';
        gameBoard.style.display = 'block';
        score = 0;

        scoreDisplay.textContent = `Score: ${score}`;

        scoreInterval = setInterval(() => {
            score += 1;
            scoreDisplay.textContent = `Score: ${score}`;
        }, 1000);
    }

    function restartRanking() {
        localStorage.removeItem('leaderboard');
    }

    restartRankingButton.addEventListener('click', () => {
        restartRanking();
        location.reload();
    });

    function updateScore() {
        score += 1;
        scoreDisplay.textContent = `Score: ${score}`;
        scoreDisplay.classList.add('score-updated');
        setTimeout(() => scoreDisplay.classList.remove('score-updated'), 500);
    }

    function stopGame() {
        gameActive = false;
        clearInterval(scoreInterval);
        saveLeaderboard(playerName, score);
        showGameOver();
    }

    function showGameOver() {
        let gameOverMessage = document.querySelector('.game-over');
        if (!gameOverMessage) {
            gameOverMessage = document.createElement('div');
            gameOverMessage.className = 'game-over';
            gameOverMessage.textContent = 'Você perdeu! Clique para retornar à tela inicial.';
            document.body.appendChild(gameOverMessage);
        }

        gameOverMessage.style.display = 'block';
        gameOverMessage.addEventListener('click', () => location.reload());
    }

    function changeiconImage() {
        const randomIndex = Math.floor(Math.random() * images.length);
        const speedClass = Math.random() > 0.5 ? 'icon-fast' : 'icon-slow';
        icon.src = `./images/${images[randomIndex]}`;
        icon.className = `icon ${speedClass}`;
    }

    startButton.addEventListener('click', () => {
        playerName = playerNameInput.value.trim();
        startGame();
    });

    actor.addEventListener('animationend', () => actor.classList.remove('jump'));

    document.addEventListener('keydown', (event) => {
        if (event.key === ' ') {
            actor.classList.add('jump');
        }
    });

    const gameOver = setInterval(() => {
        const iconPosition = icon.offsetLeft;
        const actorPosition = Number(window.getComputedStyle(actor).bottom.replace('px', ''));

        if (iconPosition <= 120 && iconPosition > 0 && actorPosition < 70) {
            icon.style.animation = 'none';
            icon.style.left = `${iconPosition}px`;

            actor.style.animation = 'none';
            actor.style.bottom = `${actorPosition}px`;

            clearInterval(gameOver);
            clearInterval(scoreInterval);
            stopGame();
        }

        if (iconPosition < 0) {
            changeiconImage();
        }
    }, 10);

    loadLeaderboard(); 
});