// Arrow animation - draws a curved arrow from subtitle to button on load
const arrowCanvas = document.getElementById('arrow-canvas');
const arrowCtx = arrowCanvas.getContext('2d');

arrowCanvas.width = window.innerWidth;
arrowCanvas.height = window.innerHeight;

let arrowProgress = 0;
const arrowDuration = 2000; // 2 second animation
const arrowStartTime = Date.now();

function drawCurvedArrow(progress) {
    arrowCtx.clearRect(0, 0, arrowCanvas.width, arrowCanvas.height);

    const centerX = arrowCanvas.width / 2;
    const centerY = arrowCanvas.height / 2;

    // Get hero container position
    const subtitle = document.querySelector('.subtitle');
    const button = document.getElementById('cta-button');

    if (!subtitle || !button) return;

    const subtitleRect = subtitle.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();

    // Start from subtitle bottom
    const startX = centerX;
    const startY = subtitleRect.bottom - arrowCanvas.height / 2 + centerY - 50;

    // End at button left side
    const endX = buttonRect.right - arrowCanvas.width / 2 + centerX + 30;
    const endY = buttonRect.top - arrowCanvas.height / 2 + centerY + buttonRect.height / 2;

    // Control point for curve (makes it curve to the right)
    const controlX = (startX + endX) / 2 + 100;
    const controlY = (startY + endY) / 2 - 50;

    arrowCtx.strokeStyle = '#FF0000';
    arrowCtx.lineWidth = 3;
    arrowCtx.lineCap = 'round';
    arrowCtx.lineJoin = 'round';

    // Draw the curved line up to progress
    arrowCtx.beginPath();
    arrowCtx.moveTo(startX, startY);

    // Calculate curve position based on progress
    let lastX = startX;
    let lastY = startY;

    for (let t = 0; t <= progress; t += 0.01) {
        // Quadratic Bézier curve formula
        const x =
            Math.pow(1 - t, 2) * startX +
            2 * (1 - t) * t * controlX +
            Math.pow(t, 2) * endX;
        const y =
            Math.pow(1 - t, 2) * startY +
            2 * (1 - t) * t * controlY +
            Math.pow(t, 2) * endY;

        arrowCtx.lineTo(x, y);
        lastX = x;
        lastY = y;
    }

    arrowCtx.stroke();

    // Draw arrowhead at the end if progress > 0
    if (progress > 0.8) {
        const headlen = 20;
        const angle = Math.atan2(lastY - controlY, lastX - controlX);

        arrowCtx.fillStyle = '#FF0000';
        arrowCtx.beginPath();
        arrowCtx.moveTo(lastX, lastY);
        arrowCtx.lineTo(
            lastX - headlen * Math.cos(angle - Math.PI / 6),
            lastY - headlen * Math.sin(angle - Math.PI / 6)
        );
        arrowCtx.lineTo(
            lastX - headlen * Math.cos(angle + Math.PI / 6),
            lastY - headlen * Math.sin(angle + Math.PI / 6)
        );
        arrowCtx.closePath();
        arrowCtx.fill();
    }
}

function animateArrow() {
    const elapsed = Date.now() - arrowStartTime;
    arrowProgress = Math.min(elapsed / arrowDuration, 1);

    drawCurvedArrow(arrowProgress);

    if (arrowProgress < 1) {
        requestAnimationFrame(animateArrow);
    }
}

// Wait for elements to be fully rendered
setTimeout(() => {
    animateArrow();
}, 300);

// Redraw on window resize
window.addEventListener('resize', () => {
    arrowCanvas.width = window.innerWidth;
    arrowCanvas.height = window.innerHeight;
    drawCurvedArrow(arrowProgress);
});
