document.addEventListener('DOMContentLoaded', () => {
    const actor = document.querySelector('.actor');
    const icon = document.querySelector('.icon');
    const images = ["fench.png", "js.png", "java.png", "php.png", , "postgresql.png"];
    
    function changeiconImage() {
        const randomIndex = Math.floor(Math.random() * images.length);
        icon.src = `./images/${images[randomIndex]}`;
    }

    actor.addEventListener('animationend', () => {
        actor.classList.remove('jump');
    });

    document.addEventListener('keydown', (event) => {  
        if (event.key === ' ') {
            actor.classList.add('jump');
        }
    });

    // Intervalo para verificar o estado do jogo e a troca de imagem da icon
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
        
        if (iconPosition <= -10) {
            changeiconImage();
        }

    }, 10);
});