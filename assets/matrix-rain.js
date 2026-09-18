// Catalog background: starfield (full screen) + multilingual rain (side columns, fade trail)
// Stars drawn on top layer so rain fade never dims them.
(function() {
    // --- Rain canvas (bottom layer, with fade trail) ---
    var rainCanvas = document.createElement('canvas');
    rainCanvas.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;';
    document.body.insertBefore(rainCanvas, document.body.firstChild);
    var rctx = rainCanvas.getContext('2d');

    // --- Stars canvas (top layer, persistent twinkle, never faded) ---
    var starCanvas = document.createElement('canvas');
    starCanvas.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 2;';
    document.body.appendChild(starCanvas);
    var sctx = starCanvas.getContext('2d');

    function resize() {
        rainCanvas.width = window.innerWidth;
        rainCanvas.height = window.innerHeight;
        starCanvas.width = window.innerWidth;
        starCanvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // --- Stars ---
    var stars = [];
    function initStars() {
        stars = [];
        for (var i = 0; i < 200; i++) {
            stars.push({
                x: Math.random() * starCanvas.width,
                y: Math.random() * starCanvas.height,
                r: Math.random() * 1.6 + 0.4,
                o: Math.random() * 0.4 + 0.5,
                sp: Math.random() * 0.015 + 0.003,
                dir: Math.random() > 0.5 ? 1 : -1
            });
        }
    }
    initStars();

    function drawStars() {
        sctx.clearRect(0, 0, starCanvas.width, starCanvas.height);
        for (var i = 0; i < stars.length; i++) {
            var s = stars[i];
            s.o += s.sp * s.dir;
            if (s.o >= 1 || s.o <= 0.4) s.dir *= -1;
            sctx.fillStyle = 'rgba(255, 255, 255, ' + s.o + ')';
            sctx.beginPath();
            sctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            sctx.fill();
        }
    }

    // --- Multilingual rain ---
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
    function initRain() {
        columns = Math.floor(rainCanvas.width / fontSize);
        drops = [];
        for (var i = 0; i < columns; i++) {
            drops[i] = Math.floor(Math.random() * -80);
        }
    }
    initRain();

    window.addEventListener('resize', function() { resize(); initStars(); initRain(); });

    function drawRain() {
        // Fade overlay only on the side columns so center stays clear for stars
        var sideRatio = 0.22;
        var leftB = Math.floor(columns * sideRatio);
        var rightB = Math.floor(columns * (1 - sideRatio));

        rctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        // Left side fade
        rctx.fillRect(0, 0, leftB * fontSize + fontSize, rainCanvas.height);
        // Right side fade
        rctx.fillRect((rightB - 1) * fontSize, 0, rainCanvas.width - (rightB - 1) * fontSize, rainCanvas.height);

        rctx.font = fontSize + 'px monospace';

        for (var i = 0; i < columns; i++) {
            if (i > leftB && i < rightB) continue;

            var x = i * fontSize;
            var y = drops[i] * fontSize;

            rctx.fillStyle = '#00FF41';
            rctx.fillText(allChars[Math.floor(Math.random() * allChars.length)], x, y);

            if (y > rainCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(drawStars, 50);
    setInterval(drawRain, 50);
})();
