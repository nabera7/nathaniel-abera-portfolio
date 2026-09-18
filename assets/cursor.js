// Custom large Kali Linux-style cursor drawn on canvas
(function() {
    // Hide native cursor via CSS only (no per-element JS needed)
    const style = document.createElement('style');
    style.textContent = '* { cursor: none !important; }';
    document.head.appendChild(style);

    const cursorCanvas = document.createElement('canvas');
    cursorCanvas.style.cssText = 'position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999;';
    document.body.appendChild(cursorCanvas);

    const cursorCtx = cursorCanvas.getContext('2d');
    let mouseX = -100;
    let mouseY = -100;
    let cursorVisible = false;

    function resizeCursorCanvas() {
        cursorCanvas.width = window.innerWidth;
        cursorCanvas.height = window.innerHeight;
    }
    resizeCursorCanvas();

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorVisible = true;
    });

    document.addEventListener('mouseleave', function() {
        cursorVisible = false;
    });

    document.addEventListener('mouseenter', function() {
        cursorVisible = true;
    });

    function drawCursor() {
        cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
        if (!cursorVisible) {
            requestAnimationFrame(drawCursor);
            return;
        }

        const scale = 2;
        cursorCtx.save();
        cursorCtx.translate(mouseX, mouseY);
        cursorCtx.scale(scale, scale);

        // Kali-style: white fill, black outline, sharp arrow
        cursorCtx.fillStyle = '#ffffff';
        cursorCtx.strokeStyle = '#000000';
        cursorCtx.lineWidth = 1.2;

        cursorCtx.beginPath();
        cursorCtx.moveTo(0, 0);
        cursorCtx.lineTo(0, 12);
        cursorCtx.lineTo(3.5, 10.5);
        cursorCtx.lineTo(5.5, 15);
        cursorCtx.lineTo(7.5, 13.5);
        cursorCtx.lineTo(5, 8.5);
        cursorCtx.lineTo(8, 8);
        cursorCtx.closePath();
        cursorCtx.fill();
        cursorCtx.stroke();

        cursorCtx.restore();

        requestAnimationFrame(drawCursor);
    }

    window.addEventListener('resize', resizeCursorCanvas);
    drawCursor();
})();
