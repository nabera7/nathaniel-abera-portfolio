// UFO + periodic shooting star animation (in front of background, behind content)
(function() {
    var canvas = document.createElement('canvas');
    canvas.id = 'ufo-layer';
    canvas.style.cssText = 'position: fixed; top: 0; left: 0; pointer-events: none; z-index: 4;';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // --- UFO ---
    var ufo = null;
    var ufoOffscreenTimer = null;

    function spawnUfo() {
        // Random side to enter from
        var fromLeft = Math.random() > 0.5;
        var y = Math.random() * canvas.height * 0.7 + canvas.height * 0.1;
        ufo = {
            x: fromLeft ? -60 : canvas.width + 60,
            y: y,
            vx: (fromLeft ? 1 : -1) * (1.5 + Math.random() * 2.5),
            vy: (Math.random() - 0.5) * 1.2,
            wobble: Math.random() * Math.PI * 2,
            size: 18 + Math.random() * 14,
            beamPhase: Math.random() * Math.PI * 2
        };
    }

    function drawUfo(u) {
        ctx.save();
        ctx.translate(u.x, u.y);

        var wob = Math.sin(u.wobble) * 3;
        var s = u.size;

        // Beam (fading light cone below the UFO)
        var beamOpacity = 0.10 + Math.abs(Math.sin(u.beamPhase)) * 0.12;
        var beamGrad = ctx.createLinearGradient(0, s * 0.4, 0, s * 3.2);
        beamGrad.addColorStop(0, 'rgba(120, 240, 120, ' + beamOpacity + ')');
        beamGrad.addColorStop(1, 'rgba(120, 240, 120, 0)');
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(-s * 0.35, s * 0.3);
        ctx.lineTo(s * 0.35, s * 0.3);
        ctx.lineTo(s * 0.9, s * 3.2);
        ctx.lineTo(-s * 0.9, s * 3.2);
        ctx.closePath();
        ctx.fill();

        // Dome (translucent top)
        ctx.fillStyle = 'rgba(150, 230, 255, 0.85)';
        ctx.beginPath();
        ctx.arc(0, wob - s * 0.1, s * 0.5, Math.PI, 0);
        ctx.closePath();
        ctx.fill();

        // Alien inside dome
        ctx.fillStyle = '#7dff6a';
        ctx.beginPath();
        ctx.arc(0, wob - s * 0.12, s * 0.18, 0, Math.PI * 2);
        ctx.fill();
        // Alien eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-s * 0.07, wob - s * 0.16, s * 0.04, 0, Math.PI * 2);
        ctx.arc(s * 0.07, wob - s * 0.16, s * 0.04, 0, Math.PI * 2);
        ctx.fill();

        // Saucer body
        ctx.fillStyle = '#b8c8d8';
        ctx.beginPath();
        ctx.ellipse(0, wob, s, s * 0.28, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#8ba3b5';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Lights around the rim (blinking)
        for (var i = 0; i < 6; i++) {
            var ang = (i / 6) * Math.PI * 2;
            var lx = Math.cos(ang) * s * 0.75;
            var blink = Math.sin(u.beamPhase * 2 + i) > 0;
            ctx.fillStyle = blink ? '#ffff88' : '#6699cc';
            ctx.beginPath();
            ctx.arc(lx, wob + Math.sin(ang) * s * 0.1, s * 0.07, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    // --- Shooting stars ---
    var shots = [];
    var nextShot = Date.now() + 3000 + Math.random() * 4000; // first in 3-7s

    function spawnShootingStar() {
        var x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
        var y = Math.random() * canvas.height * 0.4;
        var angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.5; // diagonal
        var speed = 6 + Math.random() * 5;
        shots.push({
            x: x, y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1.0,
            decay: 0.015 + Math.random() * 0.02,
            trail: []
        });
    }

    function drawShootingStar(s) {
        s.trail.unshift({ x: s.x, y: s.y });
        if (s.trail.length > 25) s.trail.pop();

        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.02;
        s.life -= s.decay;

        // Trail
        for (var i = 0; i < s.trail.length; i++) {
            var a = s.life * (1 - i / s.trail.length);
            ctx.fillStyle = 'rgba(180, 220, 255, ' + a + ')';
            ctx.beginPath();
            ctx.arc(s.trail[i].x, s.trail[i].y, 2 * (1 - i / s.trail.length), 0, Math.PI * 2);
            ctx.fill();
        }
        // Head
        ctx.fillStyle = 'rgba(255, 255, 255, ' + Math.max(0, s.life) + ')';
        ctx.beginPath();
        ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    var last = Date.now();

    function loop() {
        var now = Date.now();
        // Periodic shooting star
        if (now >= nextShot) {
            spawnShootingStar();
            nextShot = now + 5000 + Math.random() * 7000;
        }
        // Spawn UFO periodically (if none active)
        if (!ufo && now >= (ufoOffscreenTimer || 0)) {
            spawnUfo();
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw UFO
        if (ufo) {
            ufo.x += ufo.vx;
            ufo.y += ufo.vy + Math.sin(ufo.wobble) * 0.3;
            ufo.wobble += 0.04;
            ufo.beamPhase += 0.08;
            drawUfo(ufo);

            // Check if off screen (fully)
            var margin = 120;
            if (ufo.vx > 0 && ufo.x > canvas.width + margin) {
                ufo = null;
                ufoOffscreenTimer = now + 4000 + Math.random() * 6000; // come back in 4-10s
            } else if (ufo.vx < 0 && ufo.x < -margin) {
                ufo = null;
                ufoOffscreenTimer = now + 4000 + Math.random() * 6000;
            }
        }

        // Draw shooting stars
        for (var i = shots.length - 1; i >= 0; i--) {
            drawShootingStar(shots[i]);
            if (shots[i].life <= 0) {
                shots.splice(i, 1);
            }
        }

        requestAnimationFrame(loop);
    }

    loop();
})();
