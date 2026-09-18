// Custom large Kali Linux-style cursor drawn on canvas
const cursorCanvas = document.createElement('canvas');
cursorCanvas.id = 'cursor-layer';
cursorCanvas.style.cssText = 'position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999;';
document.body.appendChild(cursorCanvas);

const cursorCtx = cursorCanvas.getContext('2d');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorVisible = false;

function resizeCursorCanvas() {
    cursorCanvas.width = window.innerWidth;
    cursorCanvas.height = window.innerHeight;
}
resizeCursorCanvas();

// Hide native cursor everywhere
document.body.style.cursor = 'none';
document.querySelectorAll('*').forEach(el => {
    el.style.cursor = 'none';
});

// Track mouse
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorVisible = true;
    cursorCanvas.style.display = 'block';
});

document.addEventListener('mouseleave', () => {
    cursorVisible = false;
    cursorCanvas.style.display = 'none';
});

// Keep hiding native cursor on dynamically added elements
const observer = new MutationObserver(() => {
    const els = document.querySelectorAll('*');
    for (let i = 0; i < els.length; i++) {
        els[i].style.cursor = 'none';
    }
});
observer.observe(document.body, { childList: true, subtree: true });

// Draw Kali Linux-style cursor (sharp black/white arrow, Kali-green accent)
function drawCursor() {
    cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
    if (!cursorVisible) return;

    const x = mouseX;
    const y = mouseY;
    const scale = 2;

    cursorCtx.save();
    cursorCtx.translate(x, y);
    cursorCtx.scale(scale, scale);

    // Kali-style: white outer, black border, sharp arrow
    cursorCtx.fillStyle = '#ffffff';
    cursorCtx.strokeStyle = '#000000';
    cursorCtx.lineWidth = 1.2;

    // Classic sharp arrow pointer (points up-left)
    cursorCtx.beginPath();
    cursorCtx.moveTo(0, 0);        // tip
    cursorCtx.lineTo(0, 12);       // down left edge
    cursorCtx.lineTo(3.5, 10.5);   // inner notch
    cursorCtx.lineTo(5.5, 15);     // tail
    cursorCtx.lineTo(7.5, 13.5);   // tail underside
    cursorCtx.lineTo(5, 8.5);      // inner notch bottom
    cursorCtx.lineTo(8, 8);        // right edge
    cursorCtx.closePath();
    cursorCtx.fill();
    cursorCtx.stroke();

    // Kali-green dot at the tip
    cursorCtx.fillStyle = '#00B4D8';
    cursorCtx.beginPath();
    cursorCtx.arc(0, 0, 1.5, 0, Math.PI * 2);
    cursorCtx.fill();

    cursorCtx.restore();

    requestAnimationFrame(drawCursor);
}

window.addEventListener('resize', resizeCursorCanvas);

drawCursor();
