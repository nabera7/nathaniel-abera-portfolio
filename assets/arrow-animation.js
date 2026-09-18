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

    // Start flush at the RIGHT SIDE of the subtitle, vertically centered
    const startX = subtitleRect.right + 4;
    const startY = subtitleRect.top + subtitleRect.height / 2;

    // End at the RIGHT side of the button, vertically centered
    const endX = buttonRect.right + 10;
    const endY = buttonRect.top + buttonRect.height / 2;

    // Cubic Bézier control points:
    //  c1 extends horizontally right from the start (so the arrow exits
    //     straight out of the side, not angled up/down)
    //  c2 guides the curve down into the button from the right
    const c1x = startX + 70;
    const c1y = startY;
    const c2x = endX + 40;
    const c2y = endY;

    arrowCtx.strokeStyle = '#FF0000';
    arrowCtx.lineWidth = 3;
    arrowCtx.lineCap = 'round';
    arrowCtx.lineJoin = 'round';

    // Draw the curved line up to progress
    arrowCtx.beginPath();
    arrowCtx.moveTo(startX, startY);

    let lastX = startX;
    let lastY = startY;

    for (let t = 0; t <= progress; t += 0.01) {
        // Cubic Bézier curve formula
        const u = 1 - t;
        const x = u*u*u*startX + 3*u*u*t*c1x + 3*u*t*t*c2x + t*t*t*endX;
        const y = u*u*u*startY + 3*u*u*t*c1y + 3*u*t*t*c2y + t*t*t*endY;

        arrowCtx.lineTo(x, y);
        lastX = x;
        lastY = y;
    }

    arrowCtx.stroke();

    // Draw arrowhead at the end if progress > 0
    if (progress > 0.8) {
        const headlen = 18;
        // Angle based on the tangent of the curve near the end
        const prevT = Math.max(0, progress - 0.05);
        const u2 = 1 - prevT;
        const prevX = u2*u2*u2*startX + 3*u2*u2*prevT*c1x + 3*u2*prevT*prevT*c2x + prevT*prevT*prevT*endX;
        const prevY = u2*u2*u2*startY + 3*u2*u2*prevT*c1y + 3*u2*prevT*prevT*c2y + prevT*prevT*prevT*endY;
        const angle = Math.atan2(lastY - prevY, lastX - prevX);

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
