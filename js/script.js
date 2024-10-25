document.addEventListener('DOMContentLoaded', () => {
    const actor = document.querySelector('.actor');

    actor.addEventListener('animationend', () => {
        actor.classList.remove('jump');
    });

    document.addEventListener('keydown', function(event) {
        console.log('Tecla pressionada:', event.key); 

      
        if (event.key === ' ') {
            actor.classList.add('jump');
        }
    });
});
