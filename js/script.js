document.addEventListener('DOMContentLoaded', () => {
    const actor = document.querySelector('.actor');
    const icon = document.querySelector('.icon');
    const images = ["fench.png", "js.png", "java.png", "php.png", "postgresql.png"];
    const gameBoard = document.querySelector('.game-board');
    const startScreen = document.querySelector('.start-screen');
    const startButton = document.getElementById('start-button');
    const characterOptions = document.querySelectorAll('.character-option');
    let selectedCharacter = './images/actor.gif';

    characterOptions.forEach(option => {
        option.addEventListener('click', (event) => {
            selectedCharacter = event.target.getAttribute('data-character');

            characterOptions.forEach(opt => {
                opt.classList.remove('selected');
            });
    
            event.target.classList.add('selected');
        });
    });
    
    let score = 0;
    let scoreInterval = null; 
    let gameActive = false;
    
    function startGame() {
        actor.src = selectedCharacter; 
        startScreen.style.display = 'none'; 
        gameBoard.style.display = 'block';  

        score = 0;

        const scoreDisplay = document.createElement('div');
        scoreDisplay.className = 'score';
        scoreDisplay.textContent = `Score: ${score}`;

        document.body.appendChild(scoreDisplay);   
        scoreDisplay.textContent = `Score: ${score}`;

        scoreInterval = setInterval(() => {
            score += 1;
            scoreDisplay.textContent = `Score: ${score}`;
        }, 1000);
    }


    function updateScore() {
        score += 1;
        const scoreDisplay = document.querySelector('.score');
        scoreDisplay.textContent = `Score: ${score}`;
        scoreDisplay.classList.add('score-updated');
        setTimeout(() => scoreDisplay.classList.remove('score-updated'), 500);
    }

    setInterval(updateScore, 1000); 

    const scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'score';
    scoreDisplay.textContent = `Score: ${score}`;
    document.body.appendChild(scoreDisplay);

    function changeiconImage() {
        const randomIndex = Math.floor(Math.random() * images.length);
        const speedClass = Math.random() > 0.5 ? 'icon-fast' : 'icon-slow';
        icon.src = `./images/${images[randomIndex]}`;
        icon.className = `icon ${speedClass}`; // Altera a velocidade
    }

    startButton.addEventListener('click', startGame);

    actor.addEventListener('animationend', () => {
        actor.classList.remove('jump');
    });

    document.addEventListener('keydown', (event) => {  
        if (event.key === ' ') {
            actor.classList.add('jump');
        }
    });

    function showGameOver() {
        let gameOverMessage = document.querySelector('.game-over');
        if (!gameOverMessage) {
            gameOverMessage = document.createElement('div');
            gameOverMessage.className = 'game-over';
            gameOverMessage.textContent = 'Você perdeu! Clique para retornar à tela inicial.';
            document.body.appendChild(gameOverMessage);
        }
    
        gameOverMessage.style.display = 'block';
    
        gameOverMessage.addEventListener('click', () => {
            location.reload();
        });
    }

    function stopGame() {
        gameActive = false;
        clearInterval(scoreInterval); // Para o contador de pontuação
        showGameOver(); // Exibe a mensagem de Game Over
    }

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
            showGameOver();
            stopGame();
            clearInterval(gameOver);
        } 
        
        if (iconPosition < 0) {
            changeiconImage();
        }

    }, 10);
});