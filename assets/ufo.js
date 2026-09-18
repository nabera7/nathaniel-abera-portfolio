// UFOs + periodic shooting stars (in front of background, behind content)
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

    // Content keep-out zone (the hero content lives centered here)
    function keepoutZone() {
        // Center of screen; content roughly spans this area
        var cx = canvas.width / 2;
        var cy = canvas.height * 0.42;
        return { cx: cx, cy: cy, rx: canvas.width * 0.30, ry: canvas.height * 0.34 };
    }

    // --- UFOs (up to 2) ---
    var ufos = [];
    var nextUfoAt = Date.now() + 2000;

    function spawnUfo() {
        var fromLeft = Math.random() > 0.5;
        var y = Math.random() * canvas.height * 0.85 + canvas.height * 0.05;
        ufos.push({
            x: fromLeft ? -70 : canvas.width + 70,
            y: y,
            vx: (fromLeft ? 1 : -1) * (1.2 + Math.random() * 2.0),
            vy: (Math.random() - 0.5) * 1.0,
            wobble: Math.random() * Math.PI * 2,
            size: 18 + Math.random() * 14,
            beamPhase: Math.random() * Math.PI * 2,
            alive: true
        });
    }

    function drawUfo(u) {
        ctx.save();
        ctx.translate(u.x, u.y);
        var wob = Math.sin(u.wobble) * 3;
        var s = u.size;

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

        ctx.fillStyle = 'rgba(150, 230, 255, 0.85)';
        ctx.beginPath();
        ctx.arc(0, wob - s * 0.1, s * 0.5, Math.PI, 0);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#7dff6a';
        ctx.beginPath();
        ctx.arc(0, wob - s * 0.12, s * 0.18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-s * 0.07, wob - s * 0.16, s * 0.04, 0, Math.PI * 2);
        ctx.arc(s * 0.07, wob - s * 0.16, s * 0.04, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#b8c8d8';
        ctx.beginPath();
        ctx.ellipse(0, wob, s, s * 0.28, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#8ba3b5';
        ctx.lineWidth = 1.5;
        ctx.stroke();

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

    // --- Shooting stars (up to 2 concurrent, longer trails) ---
    var shots = [];
    var nextShot = Date.now() + 2000 + Math.random() * 2000;

    function spawnShootingStar() {
        var edge = Math.floor(Math.random() * 4);
        var x, y, baseAngle;
        if (edge === 0) { x = Math.random() * canvas.width; y = -10; baseAngle = Math.PI/2 + (Math.random()-0.5)*1.0; }
        else if (edge === 1) { x = -10; y = Math.random()*canvas.height*0.6; baseAngle = Math.PI/2 - (Math.PI/4 + Math.random()*Math.PI/5); }
        else if (edge === 2) { x = canvas.width+10; y = Math.random()*canvas.height*0.6; baseAngle = Math.PI/2 + (Math.PI/4 + Math.random()*Math.PI/5); }
        else { x = Math.random()*canvas.width; y = -10; baseAngle = Math.PI/2 + (Math.random()-0.5)*1.0; }

        var speed = 6 + Math.random() * 5;
        shots.push({
            x: x, y: y,
            vx: Math.cos(baseAngle) * speed,
            vy: Math.sin(baseAngle) * speed,
            life: 1.0,
            decay: 0.010 + Math.random() * 0.012, // slower decay = longer life
            trail: []
        });
    }

    function drawShootingStar(s) {
        s.trail.unshift({ x: s.x, y: s.y });
        if (s.trail.length > 40) s.trail.pop(); // longer trail
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.015;
        s.life -= s.decay;
        for (var i = 0; i < s.trail.length; i++) {
            var a = s.life * (1 - i / s.trail.length);
            ctx.fillStyle = 'rgba(180, 220, 255, ' + a + ')';
            ctx.beginPath();
            ctx.arc(s.trail[i].x, s.trail[i].y, 2.2 * (1 - i / s.trail.length), 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.fillStyle = 'rgba(255, 255, 255, ' + Math.max(0, s.life) + ')';
        ctx.beginPath();
        ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    function loop() {
        var now = Date.now();
        var zone = keepoutZone();

        // Spawn UFOs (maintain up to 2)
        if (ufos.length < 2 && now >= nextUfoAt) {
            spawnUfo();
            if (ufos.length < 2) {
                nextUfoAt = now + 3000 + Math.random() * 5000;
            }
        }

        // Spawn shooting stars (up to 2 concurrent)
        if (shots.length < 2 && now >= nextShot) {
            spawnShootingStar();
            nextShot = now + 4000 + Math.random() * 6000;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // UFOs with steering around content keep-out zone
        for (var i = ufos.length - 1; i >= 0; i--) {
            var u = ufos[i];
            u.x += u.vx;
            u.y += u.vy + Math.sin(u.wobble) * 0.3;
            u.wobble += 0.04;
            u.beamPhase += 0.08;

            // Steer up/down to avoid the center content zone
            var inX = u.x > zone.cx - zone.rx && u.x < zone.cx + zone.rx;
            var inY = u.y > zone.cy - zone.ry && u.y < zone.cy + zone.ry;
            if (inX && inY) {
                // push vertically out of the zone (go around)
                var dyTop = zone.cy - zone.ry - u.y;
                var dyBottom = zone.cy + zone.ry - u.y;
                // steer toward nearest vertical edge
                if (Math.abs(dyTop) < Math.abs(dyBottom)) {
                    u.vy = -Math.abs(u.vy) - 0.5; // go up
                } else {
                    u.vy = Math.abs(u.vy) + 0.5;  // go down
                }
            } else {
                // relax steering back to gentle drift
                u.vy *= 0.98;
            }

            drawUfo(u);
            var margin = 130;
            if ((u.vx > 0 && u.x > canvas.width + margin) || (u.vx < 0 && u.x < -margin) || u.y < -margin || u.y > canvas.height + margin) {
                ufos.splice(i, 1);
                nextUfoAt = now + 5000 + Math.random() * 7000;
            }
        }

        // Shooting stars
        for (var j = shots.length - 1; j >= 0; j--) {
            drawShootingStar(shots[j]);
            if (shots[j].life <= 0) shots.splice(j, 1);
        }

        requestAnimationFrame(loop);
    }

    loop();
})();
