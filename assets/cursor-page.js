// Reliable custom cursor via canvas (works over everything)
(function() {
    // Hide native cursor
    var style = document.createElement('style');
    style.id = 'hide-native-cursor';
    style.textContent = 'html, body, canvas, div, button, img, a, p, h1, h2, * { cursor: none !important; } html:active, body:active, *:active { cursor: none !important; }';
    document.head.appendChild(style);
    document.body.style.cursor = 'none';
    document.documentElement.style.cursor = 'none';

    function stripCursors() {
        var all = document.querySelectorAll('*');
        for (var i = 0; i < all.length; i++) {
            all[i].style.cursor = 'none';
        }
    }
    stripCursors();
    setInterval(stripCursors, 500);

    // Load cursor images
    var normalImg = new Image();
    normalImg.src = 'assets/cursor_normal2.png';
    var clickImg = new Image();
    clickImg.src = 'assets/cursor_effect_no.png';

    var canvas = document.createElement('canvas');
    canvas.style.cssText = 'position: fixed; top: 0; left: 0; pointer-events: none; z-index: 99999;';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    var mx = -100, my = -100;
    var isDown = false;
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
        if (downTimer) clearTimeout(downTimer);
        downTimer = setTimeout(function() { isDown = false; }, 120);
    });
    document.addEventListener('mouseleave', function() { mx = -100; my = -100; });

    var hotX = 22, hotY = 0;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (mx < 0 || my < 0) {
            requestAnimationFrame(draw);
            return;
        }
        var img = isDown ? clickImg : normalImg;
        if (img.complete && img.naturalWidth > 0) {
            ctx.drawImage(img, mx - hotX, my - hotY);
        }
        requestAnimationFrame(draw);
    }

    draw();
})();
