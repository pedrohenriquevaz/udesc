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
    const audio = document.getElementById('background-music');
    const audioMenu = document.getElementById('background-music-menu');
    const mathQuestionDiv = document.getElementById('math-question');
    const questionText = document.getElementById('math-question-text');
    const confirmButton = document.getElementById('confirm-answer');

    let selectedCharacter = './images/actor.gif';
    let score = 0;
    let scoreInterval = null;
    let gameActive = false;
    let playerName = '';
    let gameOverInterval;
    let correctResponses = 0;

    audio.volume = 0.3;
    audioMenu.volume = 0.3;

    document.addEventListener('click', (event) => {
        if(scoreInterval > 0) {

        } else {
        audioMenu.play();   
        }
    });

    function loadLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboardList.innerHTML = '';
        leaderboard.forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `${entry.name} - ${entry.score}`;
            leaderboardList.appendChild(li);
        });
    }

    loadLeaderboard(); 

    function restartRanking() {
        localStorage.removeItem('leaderboard');
    }

    restartRankingButton.addEventListener('click', () => {
        restartRanking();
        location.reload();
    });

    characterOptions.forEach(option => {
        option.addEventListener('click', (event) => {
            selectedCharacter = event.target.getAttribute('data-character');
            characterOptions.forEach(opt => {
                opt.classList.remove('selected');
            });
            event.target.classList.add('selected');
        });
    });

    startButton.addEventListener('click', () => {
        audioMenu.pause();
        playerName = playerNameInput.value.trim();
        startGame();
    });

    function startGame() {
        if (!playerName) {
            alert("Por favor, insira seu nome!");
            return;
        }
        gameActive = true;

        audio.play();
    
        actor.src = selectedCharacter;
        startScreen.style.display = 'none';
        gameBoard.style.display = 'block';
        score = 0;
    
        scoreDisplay.textContent = `Pontuação: ${score}`;
    
        scoreInterval = setInterval(() => {
            updateScore();
        }, 1000);
    
        changeIconImage();
    
        gameOverInterval = setInterval(() => {
            gameOverVerify();
        }, 10);
    }

    actor.addEventListener('animationend', () => actor.classList.remove('jump'));

    document.addEventListener('keydown', (event) => {
        if (event.key === ' ') {
            actor.classList.add('jump');
        }
    });

    function changeIconImage() {
        const randomIndex = Math.floor(Math.random() * images.length);
        const speedClass = Math.random() > 0.5 ? 'icon-fast' : 'icon-slow';
        icon.src = `./images/${images[randomIndex]}`;
        icon.className = `icon ${speedClass}`;

        icon.style.animation = 'none';
        void icon.offsetWidth;
        icon.style.animation = '';
    }

    function updateScore() {
        score += 1;
        scoreDisplay.textContent = `Pontuação: ${score}`;
        scoreDisplay.classList.add('score-updated');
        setTimeout(() => scoreDisplay.classList.remove('score-updated'), 500);
    }

    function generateMathQuestion() {
        const number1 = Math.floor(Math.random() * 30) + 1;
        const number2 = Math.floor(Math.random() * 30) + 1;
        const operator = ['+', '-', '*'][Math.floor(Math.random() * 3)];
        currentQuestion = `${number1} ${operator} ${number2}`;
        currentAnswer = eval(currentQuestion);
    }

    function showMathQuestion() {
        questionText.textContent = currentQuestion;
        mathQuestionDiv.style.display = 'block';
    
        confirmButton.addEventListener('click', () => {
            const playerAnswer = document.getElementById('math-answer').value;
            if (parseInt(playerAnswer) === currentAnswer) {
                correctResponses++;
                score += 3;
                restartGame();
            } else {
                stopGame();
            }
        });
    }

    function resetPositions() {
        icon.style.right = '-100px';
        icon.style.left = '';
        icon.style.bottom = '0px';
        icon.style.animation = 'icon-animation 2s infinite linear'; 
        actor.style.bottom = '0px';
        actor.style.animation = '';
    }

    function removeQuestion() {
        if (mathQuestionDiv) {
            mathQuestionDiv.remove();
        }
    }

    function restartGame() {
        removeQuestion();

        gameActive = true;

        resetPositions();
    
        scoreInterval = setInterval(() => {
            updateScore();
        }, 1000);
    
        gameOverInterval = setInterval(() => {
            gameOverVerify();
        }, 10);
    }

    function showGameOver() {
        removeQuestion();

        let gameOverMessage = document.querySelector('.game-over');
        if (!gameOverMessage) {
            gameOverMessage = document.createElement('div');
            gameOverMessage.className = 'game-over';
            
            if(correctResponses === 0) 
                gameOverMessage.textContent = 'Você perdeu sem acertar nenhuma pergunta! Clique para retornar à tela inicial.';
            else {
                if(correctResponses === 1)
                    gameOverMessage.textContent = 'Você perdeu, acertando ' + correctResponses + ' pergunta! Clique para retornar à tela inicial.';
                else 
                    gameOverMessage.textContent = 'Você perdeu, acertando ' + correctResponses + ' perguntas! Clique para retornar à tela inicial.';
            }

            document.body.appendChild(gameOverMessage);
        }
    
        gameOverMessage.style.display = 'block';
        gameOverMessage.addEventListener('click', () => location.reload());
    }

    function stopGame() {
        gameActive = false;
        clearInterval(scoreInterval);
        saveLeaderboard(playerName, score);
        showGameOver();
    }

    function saveLeaderboard(name, score) {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboard.push({ name, score });
        leaderboard.sort((a, b) => b.score - a.score);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        loadLeaderboard();
    }

    function gameOverVerify() {
        const iconPosition = icon.offsetLeft;
        const actorPosition = Number(window.getComputedStyle(actor).bottom.replace('px', ''));

        if (iconPosition <= 120 && iconPosition > 0 && actorPosition < 70) {
            gameActive = false;

            icon.style.left = `${iconPosition}px`;
            icon.style.animation = 'none';

            actor.style.bottom = `${actorPosition}px`;
            actor.style.animation = 'none';

            clearInterval(gameOverInterval);
            clearInterval(scoreInterval);

            generateMathQuestion();
            showMathQuestion();
        }

        if (iconPosition < 0) {
            changeIconImage();
        }
    }
});