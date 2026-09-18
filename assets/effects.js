// Effects canvas for warp-speed transition
const effectsCanvas = document.getElementById('effects');
const effectsCtx = effectsCanvas.getContext('2d');
const button = document.getElementById('cta-button');

effectsCanvas.width = window.innerWidth;
effectsCanvas.height = window.innerHeight;

let isTransitioning = false;
let warpProgress = 0; // 0 -> 1
let warpRunning = false;

// Star-shaped streak lines radiating from center (hyperspace/warp)
const warpStars = [];
const WARP_COUNT = 300;
for (let i = 0; i < WARP_COUNT; i++) {
    warpStars.push({
        angle: Math.random() * Math.PI * 2,
        dist: Math.random(),          // starting radius fraction
        speed: 0.015 + Math.random() * 0.035,
        length: 0.1 + Math.random() * 0.25,
        thickness: 1 + Math.random() * 2.5,
        hueShift: Math.random()
    });
}

function drawWarp() {
    const cx = effectsCanvas.width / 2;
    const cy = effectsCanvas.height / 2;
    const maxR = Math.max(effectsCanvas.width, effectsCanvas.height) * 0.75;

    // Fading trail (stretch lines get longer as we accelerate)
    effectsCtx.clearRect(0, 0, effectsCanvas.width, effectsCanvas.height);

    for (const s of warpStars) {
        // Each star moves outward; dist represents how far along it is
        const r = s.dist * maxR;
        const streakLen = s.length * maxR * (0.3 + warpProgress * 1.5);
        const x1 = cx + Math.cos(s.angle) * r;
        const y1 = cy + Math.sin(s.angle) * r;
        const x2 = cx + Math.cos(s.angle) * (r - streakLen);
        const y2 = cy + Math.sin(s.angle) * (r - streakLen);

        // Color interpolates from white-center to blue-ish tail as we warp
        const alpha = Math.min(1, 0.4 + warpProgress * 0.6);
        const g = effectsCtx.createLinearGradient(x1, y1, x2, y2);
        g.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        g.addColorStop(0.5, `rgba(120, 200, 255, ${alpha * 0.7})`);
        g.addColorStop(1, `rgba(56, 189, 248, 0)`);

        effectsCtx.strokeStyle = g;
        effectsCtx.lineWidth = s.thickness * (0.7 + warpProgress * 0.8);
        effectsCtx.lineCap = 'round';
        effectsCtx.beginPath();
        effectsCtx.moveTo(x1, y1);
        effectsCtx.lineTo(x2, y2);
        effectsCtx.stroke();
    }
}

function startWarp() {
    warpRunning = true;
    warpProgress = 0;

    // Hide the content (fade the hero out as warp begins)
    const hero = document.querySelector('.hero-container');
    if (hero) {
        hero.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        hero.style.opacity = '0';
        hero.style.transform += ' scale(0.9)';
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

// Animation loop
function animateEffects() {
    if (warpRunning) {
        warpProgress += 0.018;
        if (warpProgress >= 1) {
            warpProgress = 1;
            warpRunning = false;
            // Warp complete — navigate
            setTimeout(() => {
                window.location.href = 'catalog.html';
            }, 250);
        }
    }

    if (warpProgress > 0) {
        drawWarp();
    } else {
        effectsCtx.clearRect(0, 0, effectsCanvas.width, effectsCanvas.height);
    }

    requestAnimationFrame(animateEffects);
}

window.addEventListener('resize', () => {
    effectsCanvas.width = window.innerWidth;
    effectsCanvas.height = window.innerHeight;
});

animateEffects();

// cache-bust v2

