// Matrix-style raining green code on the sides of the catalog
(function() {
    var canvas = document.createElement('canvas');
    canvas.id = 'matrix-rain';
    canvas.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0;';
    document.body.insertBefore(canvas, document.body.firstChild);
    var ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    var fontSize = 14;
    var columns;
    var drops;
    var chars = '01アカサタナハマヤラワガザダバパイキシチニヒミリギジヂビピウクスツヌフムユルグズヅブプ<>{}[]()/$#@%&*+=';

    function init() {
        columns = Math.floor(canvas.width / fontSize);
        drops = [];
        for (var i = 0; i < columns; i++) {
            drops[i] = Math.floor(Math.random() * -50);
        }
    }
    init();
    window.addEventListener('resize', function() { resize(); init(); });

    function draw() {
        // Semi-transparent black for fade trail
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00FF41';
        ctx.font = fontSize + 'px monospace';

        for (var i = 0; i < columns; i++) {
            // Only rain on left and right side columns (about 20% each side)
            var sideRatio = 0.2;
            var leftBoundary = Math.floor(columns * sideRatio);
            var rightBoundary = Math.floor(columns * (1 - sideRatio));
            if (i > leftBoundary && i < rightBoundary) continue;

            var char = chars[Math.floor(Math.random() * chars.length)];
            var x = i * fontSize;
            var y = drops[i] * fontSize;

            ctx.fillText(char, x, y);

            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(draw, 33);
})();
