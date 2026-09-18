// Starfield animation
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];

class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 1.5;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.direction = Math.random() > 0.5 ? 1 : -1;
    }

    update() {
        this.opacity += this.twinkleSpeed * this.direction;
        if (this.opacity >= 1 || this.opacity <= 0.2) {
            this.direction *= -1;
        }
    }

    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize stars
function initStars() {
    stars = [];
    for (let i = 0; i < 150; i++) {
        stars.push(new Star());
    }
}

// Animation loop
function animateStarfield() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    stars.forEach(star => {
        star.update();
        star.draw();
    });
    
    requestAnimationFrame(animateStarfield);
}

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

initStars();
animateStarfield();
