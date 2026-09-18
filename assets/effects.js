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
const STREAK_COUNT = 120;
for (let i = 0; i < STREAK_COUNT; i++) {
    streaks.push({
        angle: Math.random() * Math.PI * 2,
        dist: Math.random(),          // 0..1 radial fraction
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
    const maxR = Math.max(effectsCanvas.width, effectsCanvas.height) * 0.9;

    // acceleration ramps up hard as warp progresses (catapult feel)
    const accel = Math.pow(warpT, 1.6);

    // Precompute a few shared colors (avoid createLinearGradient per line = expensive)
    const headColor = `rgba(255, 255, 255, ${Math.min(1, 0.55 + warpT * 0.45)})`;
    const midColor = `rgba(140, 210, 255, ${Math.min(1, 0.55 + warpT * 0.45) * 0.8})`;

    for (const s of streaks) {
        // continuously accelerate outward from center
        s.dist += (0.008 + accel * 0.35);
        if (s.dist > 1.5) s.dist = 0.03;

        const r = s.dist * maxR;
        const len = s.length * maxR * (0.4 + accel * 3.5);
        const x1 = cx + Math.cos(s.angle) * r;
        const y1 = cy + Math.sin(s.angle) * r;
        const x2 = cx + Math.cos(s.angle) * (r - len);
        const y2 = cy + Math.sin(s.angle) * (r - len);

        const g = effectsCtx.createLinearGradient(x1, y1, x2, y2);
        g.addColorStop(0, headColor);
        g.addColorStop(0.4, midColor);
        g.addColorStop(1, 'rgba(56, 189, 248, 0)');

        effectsCtx.strokeStyle = g;
        effectsCtx.lineWidth = s.thickness * (0.4 + accel * 1.6);
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

// Reset on back/forward navigation (bfcache) so the page isn't stuck black
window.addEventListener('pageshow', function(e) {
    if (e.persisted) {
        warpActive = false;
        warpT = 0;
        isTransitioning = false;
        if (fadeOverlay) fadeOverlay.remove();
        fadeOverlay = null;
        const hero = document.querySelector('.hero-container');
        if (hero) { hero.style.opacity = '1'; }
        const arrow = document.getElementById('arrow-canvas');
        if (arrow) { arrow.style.opacity = '1'; }
        // Restore the button fully
        button.disabled = false;
        button.style.pointerEvents = '';
        button.style.opacity = '1';
    }
});

animate();
