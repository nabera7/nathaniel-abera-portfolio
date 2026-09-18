// Creatures animation - Ant and Fly
const creaturesCanvas = document.getElementById('creatures');
const creaturesCtx = creaturesCanvas.getContext('2d');

creaturesCanvas.width = window.innerWidth;
creaturesCanvas.height = window.innerHeight;

// Ant class
class Ant {
    constructor() {
        this.x = Math.random() * creaturesCanvas.width;
        this.y = Math.random() * creaturesCanvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.speed = Math.random() * 1 + 0.5;
        this.angle = Math.random() * Math.PI * 2;
        this.size = 3;
        this.changeDirectionCounter = 0;
    }

    update() {
        this.changeDirectionCounter++;
        if (this.changeDirectionCounter > 100) {
            this.angle = Math.random() * Math.PI * 2;
            this.changeDirectionCounter = 0;
        }

        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;

        this.x += this.vx;
        this.y += this.vy;

        // Wrap around screen
        if (this.x < 0) this.x = creaturesCanvas.width;
        if (this.x > creaturesCanvas.width) this.x = 0;
        if (this.y < 0) this.y = creaturesCanvas.height;
        if (this.y > creaturesCanvas.height) this.y = 0;
    }

    draw() {
        creaturesCtx.save();
        creaturesCtx.translate(this.x, this.y);
        creaturesCtx.rotate(this.angle);

        // Head
        creaturesCtx.fillStyle = 'rgba(14, 165, 233, 0.6)';
        creaturesCtx.beginPath();
        creaturesCtx.arc(0, 0, this.size, 0, Math.PI * 2);
        creaturesCtx.fill();

        // Body segments
        for (let i = 1; i <= 3; i++) {
            creaturesCtx.fillStyle = `rgba(14, 165, 233, ${0.6 - i * 0.1})`;
            creaturesCtx.beginPath();
            creaturesCtx.arc(0, i * this.size * 1.5, this.size * 0.8, 0, Math.PI * 2);
            creaturesCtx.fill();
        }

        // Antennae
        creaturesCtx.strokeStyle = 'rgba(14, 165, 233, 0.5)';
        creaturesCtx.lineWidth = 1;
        creaturesCtx.beginPath();
        creaturesCtx.moveTo(0, -this.size);
        creaturesCtx.quadraticCurveTo(-this.size * 1.5, -this.size * 3, -this.size * 2, -this.size * 4);
        creaturesCtx.stroke();

        creaturesCtx.beginPath();
        creaturesCtx.moveTo(0, -this.size);
        creaturesCtx.quadraticCurveTo(this.size * 1.5, -this.size * 3, this.size * 2, -this.size * 4);
        creaturesCtx.stroke();

        // Legs
        creaturesCtx.strokeStyle = 'rgba(14, 165, 233, 0.5)';
        creaturesCtx.lineWidth = 1;
        for (let i = 0; i < 6; i++) {
            const legY = (i % 3) * this.size;
            const legX = (i < 3 ? -1 : 1) * this.size * 1.5;
            creaturesCtx.beginPath();
            creaturesCtx.moveTo(legX, legY);
            creaturesCtx.lineTo(legX + (i < 3 ? -2 : 2) * this.size, legY + this.size);
            creaturesCtx.stroke();
        }

        creaturesCtx.restore();
    }
}

// Fly class
class Fly {
    constructor() {
        this.x = Math.random() * creaturesCanvas.width;
        this.y = Math.random() * creaturesCanvas.height;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.speed = Math.random() * 2 + 1.5;
        this.angle = Math.random() * Math.PI * 2;
        this.size = 4;
        this.wingPhase = 0;
        this.changeDirectionCounter = 0;
    }

    update() {
        this.changeDirectionCounter++;
        if (this.changeDirectionCounter > 50) {
            this.angle = Math.random() * Math.PI * 2;
            this.changeDirectionCounter = 0;
        }

        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;

        this.x += this.vx;
        this.y += this.vy;
        this.wingPhase += 0.3;

        // Wrap around screen
        if (this.x < 0) this.x = creaturesCanvas.width;
        if (this.x > creaturesCanvas.width) this.x = 0;
        if (this.y < 0) this.y = creaturesCanvas.height;
        if (this.y > creaturesCanvas.height) this.y = 0;
    }

    draw() {
        creaturesCtx.save();
        creaturesCtx.translate(this.x, this.y);
        creaturesCtx.rotate(this.angle);

        // Body
        creaturesCtx.fillStyle = 'rgba(14, 165, 233, 0.7)';
        creaturesCtx.beginPath();
        creaturesCtx.ellipse(0, 0, this.size * 0.8, this.size * 1.5, 0, 0, Math.PI * 2);
        creaturesCtx.fill();

        // Head
        creaturesCtx.fillStyle = 'rgba(14, 165, 233, 0.8)';
        creaturesCtx.beginPath();
        creaturesCtx.arc(0, -this.size * 1.5, this.size * 0.6, 0, Math.PI * 2);
        creaturesCtx.fill();

        // Eyes
        creaturesCtx.fillStyle = 'rgba(14, 165, 233, 1)';
        creaturesCtx.beginPath();
        creaturesCtx.arc(-this.size * 0.2, -this.size * 1.8, this.size * 0.2, 0, Math.PI * 2);
        creaturesCtx.fill();
        creaturesCtx.beginPath();
        creaturesCtx.arc(this.size * 0.2, -this.size * 1.8, this.size * 0.2, 0, Math.PI * 2);
        creaturesCtx.fill();

        // Wings - animated
        const wingOffset = Math.sin(this.wingPhase) * this.size;
        creaturesCtx.strokeStyle = 'rgba(14, 165, 233, 0.5)';
        creaturesCtx.lineWidth = 2;

        // Left wing
        creaturesCtx.beginPath();
        creaturesCtx.ellipse(-this.size * 1.5, -this.size * 0.5, this.size * 1.2, this.size * 0.4, 0.3, 0, Math.PI * 2);
        creaturesCtx.stroke();

        // Right wing
        creaturesCtx.beginPath();
        creaturesCtx.ellipse(this.size * 1.5, -this.size * 0.5, this.size * 1.2, this.size * 0.4, -0.3, 0, Math.PI * 2);
        creaturesCtx.stroke();

        // Legs
        creaturesCtx.strokeStyle = 'rgba(14, 165, 233, 0.6)';
        creaturesCtx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            creaturesCtx.beginPath();
            creaturesCtx.moveTo(-this.size * 0.4, this.size * 0.3 + i * this.size * 0.6);
            creaturesCtx.lineTo(-this.size * 1.5, this.size * 0.8 + i * this.size * 0.6);
            creaturesCtx.stroke();

            creaturesCtx.beginPath();
            creaturesCtx.moveTo(this.size * 0.4, this.size * 0.3 + i * this.size * 0.6);
            creaturesCtx.lineTo(this.size * 1.5, this.size * 0.8 + i * this.size * 0.6);
            creaturesCtx.stroke();
        }

        creaturesCtx.restore();
    }
}

// Create creatures
let ant = new Ant();
let fly = new Fly();

// Animation loop
function animateCreatures() {
    creaturesCtx.clearRect(0, 0, creaturesCanvas.width, creaturesCanvas.height);

    ant.update();
    ant.draw();

    fly.update();
    fly.draw();

    requestAnimationFrame(animateCreatures);
}

// Handle window resize
window.addEventListener('resize', () => {
    creaturesCanvas.width = window.innerWidth;
    creaturesCanvas.height = window.innerHeight;
});

animateCreatures();
