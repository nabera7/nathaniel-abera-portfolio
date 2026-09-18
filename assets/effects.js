// Effects canvas for shooting star, explosion, swirl
const effectsCanvas = document.getElementById('effects');
const effectsCtx = effectsCanvas.getContext('2d');
const button = document.getElementById('cta-button');

effectsCanvas.width = window.innerWidth;
effectsCanvas.height = window.innerHeight;

let shootingStar = null;
let explosionParticles = [];
let isTransitioning = false;

class ShootingStar {
    constructor(startX, startY) {
        this.x = startX;
        this.y = startY;
        this.vx = Math.random() * 8 + 5;
        this.vy = Math.random() * -8 - 5;
        this.length = 80;
        this.opacity = 1;
        this.life = 60;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        this.opacity = this.life / 60;
    }

    draw() {
        const gradient = effectsCtx.createLinearGradient(
            this.x - this.vx * 3,
            this.y - this.vy * 3,
            this.x,
            this.y
        );
        gradient.addColorStop(0, `rgba(14, 165, 233, 0)`);
        gradient.addColorStop(1, `rgba(14, 165, 233, ${this.opacity})`);

        effectsCtx.strokeStyle = gradient;
        effectsCtx.lineWidth = 3;
        effectsCtx.beginPath();
        effectsCtx.moveTo(
            this.x - this.vx * 3,
            this.y - this.vy * 3
        );
        effectsCtx.lineTo(this.x, this.y);
        effectsCtx.stroke();
    }

    isDead() {
        return this.life <= 0;
    }
}

class ExplosionParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 12;
        this.vy = (Math.random() - 0.5) * 12;
        this.life = 40;
        this.maxLife = 40;
        this.size = Math.random() * 4 + 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.3; // gravity
        this.life--;
    }

    draw() {
        const opacity = this.life / this.maxLife;
        effectsCtx.fillStyle = `rgba(14, 165, 233, ${opacity})`;
        effectsCtx.beginPath();
        effectsCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        effectsCtx.fill();
    }

    isDead() {
        return this.life <= 0;
    }
}

// Button click handler
button.addEventListener('click', () => {
    if (isTransitioning) return;
    isTransitioning = true;

    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Create shooting star from button
    shootingStar = new ShootingStar(centerX, centerY);

    // Create explosion particles
    for (let i = 0; i < 30; i++) {
        explosionParticles.push(new ExplosionParticle(centerX, centerY));
    }

    // Hide button
    button.style.opacity = '0';
    button.style.pointerEvents = 'none';

    // Fade to black and transition after 1.5 seconds
    setTimeout(() => {
        startSwirl();
    }, 1500);
});

let swirls = [];

class Swirl {
    constructor() {
        this.x = effectsCanvas.width / 2;
        this.y = effectsCanvas.height / 2;
        this.radius = 0;
        this.maxRadius = Math.max(effectsCanvas.width, effectsCanvas.height) * 1.5;
        this.opacity = 0.8;
        this.expandSpeed = 20;
    }

    update() {
        this.radius += this.expandSpeed;
        this.opacity -= 0.02;
    }

    draw() {
        effectsCtx.strokeStyle = `rgba(14, 165, 233, ${this.opacity})`;
        effectsCtx.lineWidth = 3;
        effectsCtx.beginPath();
        effectsCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        effectsCtx.stroke();
    }

    isDone() {
        return this.radius >= this.maxRadius || this.opacity <= 0;
    }
}

function startSwirl() {
    // Create multiple swirl rings
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            swirls.push(new Swirl());
        }, i * 100);
    }

    // Fade to black
    const fadeOverlay = document.createElement('div');
    fadeOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: black;
        opacity: 0;
        z-index: 4;
        transition: opacity 2s ease;
        pointer-events: none;
    `;
    document.body.appendChild(fadeOverlay);

    setTimeout(() => {
        fadeOverlay.style.opacity = '1';
    }, 100);

    // Redirect after transition
    setTimeout(() => {
        window.location.href = 'catalog.html';
    }, 3000);
}

// Animation loop
function animateEffects() {
    effectsCtx.clearRect(0, 0, effectsCanvas.width, effectsCanvas.height);

    // Update and draw shooting star
    if (shootingStar) {
        shootingStar.update();
        shootingStar.draw();
        if (shootingStar.isDead()) {
            shootingStar = null;
        }
    }

    // Update and draw explosion particles
    explosionParticles = explosionParticles.filter(p => !p.isDead());
    explosionParticles.forEach(p => {
        p.update();
        p.draw();
    });

    // Update and draw swirls
    swirls = swirls.filter(s => !s.isDone());
    swirls.forEach(s => {
        s.update();
        s.draw();
    });

    requestAnimationFrame(animateEffects);
}

window.addEventListener('resize', () => {
    effectsCanvas.width = window.innerWidth;
    effectsCanvas.height = window.innerHeight;
});

animateEffects();
