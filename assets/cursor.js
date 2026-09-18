// Reliable custom cursor via canvas (works over everything)
(function() {
    // Hide native cursor - aggressive multi-layer approach
    var style = document.createElement('style');
    style.id = 'hide-native-cursor';
    style.textContent = 'html, body, canvas, div, button, img, a, p, h1, h2, * { cursor: none !important; } html:active, body:active, *:active { cursor: none !important; }';
    document.head.appendChild(style);
    document.body.style.cursor = 'none';
    document.documentElement.style.cursor = 'none';

    // Load cursor images
    var normalImg = new Image();
    normalImg.src = 'assets/cursor_normal2.png';
    var clickImg = new Image();
    clickImg.src = 'assets/cursor_effect_no.png';

    // Create cursor canvas at top z-index
    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position: fixed; top: 0; left: 0; pointer-events: none; z-index: 99999;';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    var mx = -100, my = -100;
    var isDown = false;
    var overButton = false;
    var downTimer = null;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('mousemove', function(e) {
        mx = e.clientX;
        my = e.clientY;
    });
    document.addEventListener('mousedown', function() { 
        isDown = true; 
        if (downTimer) clearTimeout(downTimer);
    });
    document.addEventListener('mouseup', function() { 
        // Keep effect visible briefly after click so it's noticeable
        if (downTimer) clearTimeout(downTimer);
        downTimer = setTimeout(function() { isDown = false; }, 120);
    });

    // Also show effect cursor when hovering the CTA button
    document.addEventListener('mouseover', function(e) {
        if (e.target && e.target.id === 'cta-button') {
            overButton = true;
        }
    });
    document.addEventListener('mouseout', function(e) {
        if (e.target && e.target.id === 'cta-button') {
            overButton = false;
        }
    });
    document.addEventListener('mouseleave', function() { mx = -100; my = -100; });

    // Hotspot: (22, 0) from the .cur files
    var hotX = 0, hotY = 0;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (mx < 0 || my < 0) {
            requestAnimationFrame(draw);
            return;
        }
        var img = (isDown || overButton) ? clickImg : normalImg;
        if (img.complete && img.naturalWidth > 0) {
            ctx.drawImage(img, mx - hotX, my - hotY);
        }
        requestAnimationFrame(draw);
    }

    // Start when images ready
    draw();
})();
