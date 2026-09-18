// Custom large green macOS-style cursor drawn on canvas
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

// Draw the cursor (green macOS-style arrow, pointing up-left)
function drawCursor() {
    cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
    if (!cursorVisible) return;

    const x = mouseX;
    const y = mouseY;
    const scale = 2.5; // large cursor

    cursorCtx.save();
    cursorCtx.translate(x, y);
    cursorCtx.scale(scale, scale);

    // Main arrow body (points up-left like macOS pointer)
    cursorCtx.fillStyle = '#00FF44';
    cursorCtx.strokeStyle = '#00CC33';
    cursorCtx.lineWidth = 1.5;

    cursorCtx.beginPath();
    cursorCtx.moveTo(0, 0);          // tip at top-left
    cursorCtx.lineTo(0, 16);         // down left side
    cursorCtx.lineTo(5, 11);         // inner notch
    cursorCtx.lineTo(8, 16);         // down to tail inner
    cursorCtx.lineTo(10, 14);        // tail tip
    cursorCtx.lineTo(6, 9);          // up to notch
    cursorCtx.lineTo(14, 8);         // right side
    cursorCtx.closePath();           // back to tip
    cursorCtx.fill();
    cursorCtx.stroke();

    cursorCtx.restore();

    requestAnimationFrame(drawCursor);
}

// Also update cursor style on dynamically added elements
const observer = new MutationObserver(() => {
    document.querySelectorAll('*').forEach(el => {
        el.style.cursor = 'none';
    });
});
observer.observe(document.body, { childList: true, subtree: true });

window.addEventListener('resize', resizeCursorCanvas);

drawCursor();
