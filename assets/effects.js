// Effects canvas for warp-speed transition
const effectsCanvas = document.getElementById('effects');
const effectsCtx = effectsCanvas.getContext('2d');
const button = document.getElementById('cta-button');

effectsCanvas.width = window.innerWidth;
effectsCanvas.height = window.innerHeight;

let isTransitioning = false;
let warpActive = false;
let warpT = 0; // 0 → 1

// Warp streaks (each has an angle + a distance that continuously grows)
const streaks = [];
const STREAK_COUNT = 350;
for (let i = 0; i < STREAK_COUNT; i++) {
    streaks.push({
        angle: Math.random() * Math.PI * 2,
        dist: Math.random(),          // 0..1 radial fraction
        speed: 0.02 + Math.random() * 0.05,
        length: 0.12 + Math.random() * 0.3,
        thickness: 1 + Math.random() * 2.5
    });
}

function startWarp() {
    warpActive = true;
    warpT = 0;

    // Hide the content (fade in place, no move)
    const hero = document.querySelector('.hero-container');
    if (hero) {
        hero.style.transition = 'opacity 0.4s ease';
        hero.style.opacity = '0';
    }
    // Hide the arrow canvas
    const arrow = document.getElementById('arrow-canvas');
    if (arrow) {
        arrow.style.transition = 'opacity 0.3s ease';
        arrow.style.opacity = '0';
    }
    button.disabled = true;
    button.style.pointerEvents = 'none';
}

button.addEventListener('click', (e) => {
    e.preventDefault();
    if (isTransitioning) return;
    isTransitioning = true;
    startWarp();
});

function drawWarp() {
    const cx = effectsCanvas.width / 2;
    const cy = effectsCanvas.height / 2;
    const maxR = Math.max(effectsCanvas.width, effectsCanvas.height) * 0.8;

    // advance each streak outward
    for (const s of streaks) {
        s.dist += s.speed * (0.5 + warpT * 2);
        if (s.dist > 1.15) s.dist = 0.1 + Math.random() * 0.1;

        const r = s.dist * maxR;
        const len = s.length * maxR * (0.3 + warpT * 2.2);
        const x1 = cx + Math.cos(s.angle) * r;
        const y1 = cy + Math.sin(s.angle) * r;
        const x2 = cx + Math.cos(s.angle) * (r - len);
        const y2 = cy + Math.sin(s.angle) * (r - len);

        const alpha = Math.min(1, 0.5 + warpT * 0.5);
        const g = effectsCtx.createLinearGradient(x1, y1, x2, y2);
        g.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        g.addColorStop(0.5, `rgba(140, 210, 255, ${alpha * 0.7})`);
        g.addColorStop(1, `rgba(56, 189, 248, 0)`);

        effectsCtx.strokeStyle = g;
        effectsCtx.lineWidth = s.thickness * (0.5 + warpT * 1.2);
        effectsCtx.lineCap = 'round';
        effectsCtx.beginPath();
        effectsCtx.moveTo(x1, y1);
        effectsCtx.lineTo(x2, y2);
        effectsCtx.stroke();
    }
}

// A fade overlay we create once, reuse
let fadeOverlay = null;
function beginFadeAndNavigate() {
    if (!fadeOverlay) {
        fadeOverlay = document.createElement('div');
        fadeOverlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000; opacity: 0; z-index: 5; pointer-events: none; transition: opacity 0.6s ease;';
        document.body.appendChild(fadeOverlay);
    }
    fadeOverlay.style.opacity = '1';
    setTimeout(() => {
        window.location.href = 'catalog.html';
    }, 650);
}

function animate() {
    if (warpActive) {
        warpT += 0.02;
        if (warpT >= 1) {
            warpT = 1;
            warpActive = false;
            // warp reached peak — fade out and navigate
            beginFadeAndNavigate();
        }
        effectsCtx.clearRect(0, 0, effectsCanvas.width, effectsCanvas.height);
        drawWarp();
    } else if (warpT > 0) {
        // keep drawing the completed warp briefly until fade completes
        effectsCtx.clearRect(0, 0, effectsCanvas.width, effectsCanvas.height);
        drawWarp();
    } else {
        effectsCtx.clearRect(0, 0, effectsCanvas.width, effectsCanvas.height);
    }

    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    effectsCanvas.width = window.innerWidth;
    effectsCanvas.height = window.innerHeight;
});

animate();
