document.addEventListener('DOMContentLoaded', () => {
    const actor = document.querySelector('.actor');

    actor.addEventListener('animationend', () => {
        actor.classList.remove('jump');
    });

    document.addEventListener('keydown', function(event) {  
        if (event.key === ' ') {
            actor.classList.add('jump');
        }
    });
});
