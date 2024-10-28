document.addEventListener('DOMContentLoaded', () => {
    const actor = document.querySelector('.actor');
    const icon = document.querySelector('.icon');
    const images = ["fench.png", "js.png", "java.png", "php.png", , "postgresql.png"];
    const gameBoard = document.querySelector('.game-board');
    const startScreen = document.querySelector('.start-screen');
    const startButton = document.getElementById('start-button');
    const characterOptions = document.querySelectorAll('.character-option');
    let selectedCharacter = './images/actor.gif';

    characterOptions.forEach(option => {
        option.addEventListener('click', (event) => {
            selectedCharacter = event.target.getAttribute('data-character');

/*             characterOptions.forEach(opt => {
                opt.classList.remove('selected');
            }); */
    
            event.target.classList.add('selected');
        });
    });
    
    function startGame() {
        actor.src = selectedCharacter; 
        startScreen.style.display = 'none'; 
        gameBoard.style.display = 'block'; 
    }

    function changeiconImage() {
        const randomIndex = Math.floor(Math.random() * images.length);
        icon.src = `./images/${images[randomIndex]}`;
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


    const gameOver = setInterval(() => {
        const iconPosition = icon.offsetLeft;
        const actorPosition = Number(window.getComputedStyle(actor).bottom.replace('px', ''));

        if (iconPosition <= 120 && iconPosition > 0 && actorPosition < 70) {

            icon.style.animation = 'none';
            icon.style.left = `${iconPosition}px`;

            actor.style.animation = 'none';
            actor.style.bottom = `${actorPosition}px`;

            clearInterval(gameOver);
        } 
        
        if (iconPosition < 0) {
            changeiconImage();
        }

    }, 10);
});