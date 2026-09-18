// Unified catalog background: starfield + multilingual rain (sides), trailing effect
(function() {
    var canvas = document.createElement('canvas');
    canvas.id = 'bg-effect';
    canvas.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0;';
    document.body.insertBefore(canvas, document.body.firstChild);
    var ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // --- Stars ---
    var stars = [];
    function initStars() {
        stars = [];
        for (var i = 0; i < 150; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.4 + 0.3,
                o: Math.random() * 0.6 + 0.3,
                sp: Math.random() * 0.02 + 0.005,
                dir: Math.random() > 0.5 ? 1 : -1
            });
        }
    }
    initStars();

    // --- Multilingual rain characters ---
    var charSets = [
        '01<>{}[]()/$#@%&*+=',
        'ابتثجحخدذرزسشصضطظعغفقكلمنهوي',
        'अआइईउऊऋएऐओऔकखगघचछजझटठडढणतथदधनपफबभमयरलवशषसह',
        '的一是了我不人在他有这上们来到时大地为子中你说生国年着就那和要她出也得里后自以会家可下而过天去能对小多然于心学么之都好看起发当没成只如事把还用第样道想作种开',
        'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん',
        'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン',
        '가나다라마바사아자차카타파하',
        'αβγδεζηθικλμνξοπρστυφχψω',
        'абвгдежзиклмнопрстуфхцчшщыэюя',
        'กขคงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ',
        '日月火水木金土'
    ];
    var allChars = '';
    charSets.forEach(function(s) { allChars += s; });

    var fontSize = 16;
    var columns, drops;

    // Each drop column tracks the y-position of the current falling character head
    function initRain() {
        columns = Math.floor(canvas.width / fontSize);
        drops = [];
        for (var i = 0; i < columns; i++) {
            drops[i] = Math.floor(Math.random() * -80);
        }
    }
    initRain();

    window.addEventListener('resize', function() { resize(); initStars(); initRain(); });

    // Trail effect: we keep a fading overlay. But instead of clearing to black each
    // frame (which erases stars), we draw rain chars onto a semi-transparent black
    // rect ONLY on the side columns to create the fade trail.
    function draw() {
        // 1. Stars - draw full screen each frame (persistent, no trail)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < stars.length; i++) {
            var s = stars[i];
            s.o += s.sp * s.dir;
            if (s.o >= 1 || s.o <= 0.2) s.dir *= -1;
            ctx.fillStyle = 'rgba(255, 255, 255, ' + s.o + ')';
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
        }

        // 2. Rain on side columns with a fade trail
        var sideRatio = 0.22;
        var leftB = Math.floor(columns * sideRatio);
        var rightB = Math.floor(columns * (1 - sideRatio));

        ctx.font = fontSize + 'px monospace';

        for (var i = 0; i < columns; i++) {
            if (i > leftB && i < rightB) continue;

            var x = i * fontSize;
            var y = drops[i] * fontSize;

            // Draw a fading green streak (the trail) behind the head
            for (var t = 0; t < 12; t++) {
                var ty = y - t * fontSize;
                if (ty < 0) continue;
                var alpha = 1 - (t / 12);
                ctx.fillStyle = 'rgba(0, 255, 65, ' + (alpha * 0.7) + ')';
                var trailChar = allChars[Math.floor(Math.random() * allChars.length)];
                ctx.fillText(trailChar, x, ty);
            }

            // Bright head
            ctx.fillStyle = '#c8ffd0';
            ctx.fillText(allChars[Math.floor(Math.random() * allChars.length)], x, y);

            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = Math.floor(Math.random() * -20);
            }
            drops[i]++;
        }
    }

    setInterval(draw, 50);
})();
