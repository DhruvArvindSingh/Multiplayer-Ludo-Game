// TITLE JS

function textShadow(precision, size, color) {
    let value = '';
    let offset = 0;
    const length = size * (1 / precision) - 1;
    
    for (let i = 0; i <= length; i++) {
        offset += precision;
        const shadow = `${offset}px ${offset}px ${color}`;
        value += (i === 0) ? shadow : `, ${shadow}`;
    }
    
    return value;
}

// Apply the text-shadow dynamically
document.querySelectorAll('.playful span').forEach((span, index) => {
    let color, shadowColor, delay;
    
    if (index % 2 === 1) {
        color = '#ED625C';
        shadowColor = '#F2A063';
        delay = '0.3s';
    } else if (index % 3 === 2) {
        color = '#FFD913';
        shadowColor = '#6EC0A9';
        delay = '0.15s';
    } else if (index % 5 === 4) {
        color = '#555BFF';
        shadowColor = '#E485F8';
      delay = '0.4s';
    } else if (index % 7 === 6 || index % 11 === 10) {
        color = '#FF9C55';
        shadowColor = '#FF5555';
        delay = '0.25s';
    } else {
        color = '#5362F6';
        shadowColor = '#E485F8';
        delay = '0s';
    }
    
    span.style.color = color;
    span.style.textShadow = textShadow(0.25, 6, shadowColor);
    span.style.animationDelay = delay;
});


// GAME JS

function start() {
    window.location.href = "start_game";
}