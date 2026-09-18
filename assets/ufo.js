// UFO + periodic shooting stars + peeking waving alien
// (in front of background, behind content)
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

    // ===== UFO =====
    var ufo = null;
    var ufoSpawnAt = Date.now() + 2500; // first UFO shortly after load

    function spawnUfo() {
        var fromLeft = Math.random() > 0.5;
        var y = Math.random() * canvas.height * 0.7 + canvas.height * 0.1;
        ufo = {
            x: fromLeft ? -80 : canvas.width + 80,
            y: y,
            vx: (fromLeft ? 1 : -1) * (2 + Math.random() * 2.5),
            vy: (Math.random() - 0.5) * 1.2,
            wobble: Math.random() * Math.PI * 2,
            size: 26 + Math.random() * 16,
            beamPhase: Math.random() * Math.PI * 2
        };
    }

    function drawUfo(u) {
        ctx.save();
        ctx.translate(u.x, u.y);
        var wob = Math.sin(u.wobble) * 3;
        var s = u.size;

        // Beam
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

        // Dome
        ctx.fillStyle = 'rgba(150, 230, 255, 0.85)';
        ctx.beginPath();
        ctx.arc(0, wob - s * 0.1, s * 0.5, Math.PI, 0);
        ctx.closePath();
        ctx.fill();

        // Alien inside (bigger head)
        ctx.fillStyle = '#7dff6a';
        ctx.beginPath();
        ctx.arc(0, wob - s * 0.12, s * 0.22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-s * 0.08, wob - s * 0.16, s * 0.05, 0, Math.PI * 2);
        ctx.arc(s * 0.08, wob - s * 0.16, s * 0.05, 0, Math.PI * 2);
        ctx.fill();

        // Saucer body
        ctx.fillStyle = '#b8c8d8';
        ctx.beginPath();
        ctx.ellipse(0, wob, s, s * 0.28, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#8ba3b5';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Rim lights
        for (var i = 0; i < 7; i++) {
            var ang = (i / 7) * Math.PI * 2;
            var lx = Math.cos(ang) * s * 0.8;
            var blink = Math.sin(u.beamPhase * 2 + i) > 0;
            ctx.fillStyle = blink ? '#ffff88' : '#6699cc';
            ctx.beginPath();
            ctx.arc(lx, wob + Math.sin(ang) * s * 0.1, s * 0.08, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    // ===== Shooting stars =====
    var shots = [];
    var nextShot = Date.now() + 2000 + Math.random() * 2000;

    function spawnShootingStar() {
        var edge = Math.floor(Math.random() * 4); // 0/3=top, 1=left, 2=right
        var x, y, baseAngle;
        if (edge === 0 || edge === 3) {
            x = Math.random() * canvas.width;
            y = -10;
            baseAngle = Math.PI / 2 + (Math.random() - 0.5) * 1.0;
        } else if (edge === 1) {
            x = -10;
            y = Math.random() * canvas.height * 0.6;
            baseAngle = Math.PI / 2 - (Math.PI / 4 + Math.random() * Math.PI / 5);
        } else {
            x = canvas.width + 10;
            y = Math.random() * canvas.height * 0.6;
            baseAngle = Math.PI / 2 + (Math.PI / 4 + Math.random() * Math.PI / 5);
        }
        var speed = 6 + Math.random() * 5;
        shots.push({
            x: x, y: y,
            vx: Math.cos(baseAngle) * speed,
            vy: Math.sin(baseAngle) * speed,
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
        for (var i = 0; i < s.trail.length; i++) {
            var a = s.life * (1 - i / s.trail.length);
            ctx.fillStyle = 'rgba(180, 220, 255, ' + a + ')';
            ctx.beginPath();
            ctx.arc(s.trail[i].x, s.trail[i].y, 2 * (1 - i / s.trail.length), 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = 'rgba(255, 255, 255, ' + Math.max(0, s.life) + ')';
        ctx.beginPath();
        ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    // ===== Peeking waving alien =====
    var peeker = null;
    var nextPeek = Date.now() + 7000; // a few seconds after load

    function spawnPeeker() {
        peeker = {
            x: Math.random() * canvas.width * 0.7 + canvas.width * 0.15,
            baseY: canvas.height,
            progress: 0,
            phase: 'up',
            wave: Math.random() * Math.PI * 2,
            waveFrames: 0,
            size: 30 + Math.random() * 14
        };
    }

    function drawPeeker(p) {
        var rise = p.progress;
        var y = p.baseY - rise * p.size * 3.4;
        ctx.save();
        ctx.translate(p.x, y);
        var s = p.size;

        // Head
        ctx.fillStyle = '#7dff6a';
        ctx.beginPath();
        ctx.ellipse(0, s * 0.1, s * 0.8, s * 0.95, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eyes (big, looking at viewer)
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(-s * 0.3, -s * 0.1, s * 0.17, s * 0.22, 0, 0, Math.PI * 2);
        ctx.ellipse(s * 0.3, -s * 0.1, s * 0.17, s * 0.22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(-s * 0.33, -s * 0.17, s * 0.05, 0, Math.PI * 2);
        ctx.arc(s * 0.27, -s * 0.17, s * 0.05, 0, Math.PI * 2);
        ctx.fill();

        // Mouth
        ctx.strokeStyle = '#1a4d13';
        ctx.lineWidth = s * 0.07;
        ctx.beginPath();
        ctx.arc(0, s * 0.32, s * 0.2, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();

        // Waving arm + hand
        var wave = Math.sin(p.wave) * 0.5;
        var handX = s * 0.95;
        var handY = -s * 0.2 + wave * s * 0.5;
        ctx.strokeStyle = '#7dff6a';
        ctx.lineWidth = s * 0.18;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(s * 0.72, s * 0.2);
        ctx.lineTo(handX, handY);
        ctx.stroke();
        ctx.fillStyle = '#7dff6a';
        ctx.beginPath();
        ctx.arc(handX, handY, s * 0.15, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    // ===== Main loop =====
    function loop() {
        var now = Date.now();

        if (now >= nextShot) {
            spawnShootingStar();
            nextShot = now + 5000 + Math.random() * 7000;
        }
        if (!ufo && now >= ufoSpawnAt) {
            spawnUfo();
        }
        if (!peeker && now >= nextPeek) {
            spawnPeeker();
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // UFO
        if (ufo) {
            ufo.x += ufo.vx;
            ufo.y += ufo.vy + Math.sin(ufo.wobble) * 0.3;
            ufo.wobble += 0.04;
            ufo.beamPhase += 0.08;
            drawUfo(ufo);
            var margin = 130;
            if ((ufo.vx > 0 && ufo.x > canvas.width + margin) || (ufo.vx < 0 && ufo.x < -margin)) {
                ufo = null;
                ufoSpawnAt = now + 7000 + Math.random() * 8000;
            }
        }

        // Shooting stars
        for (var i = shots.length - 1; i >= 0; i--) {
            drawShootingStar(shots[i]);
            if (shots[i].life <= 0) shots.splice(i, 1);
        }

        // Peeker
        if (peeker) {
            if (peeker.phase === 'up') {
                peeker.progress += 0.04;
                if (peeker.progress >= 1) peeker.phase = 'wave';
            } else if (peeker.phase === 'wave') {
                peeker.wave += 0.15;
                peeker.waveFrames++;
                if (peeker.waveFrames > 70) peeker.phase = 'down';
            } else {
                peeker.progress -= 0.05;
                if (peeker.progress <= 0) {
                    peeker = null;
                    nextPeek = now + 15000 + Math.random() * 15000;
                }
            }
            drawPeeker(peeker);
        }

        requestAnimationFrame(loop);
    }

    loop();
})();
