// Unified catalog background: starfield + multilingual rain (sides) + animated cloud (center)
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
    // Latin, Arabic, Hindi/Devanagari, Chinese, Japanese (hiragana/katakana), Korean, Greek, Cyrillic, Thai
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

    var fontSize = 14;
    var columns, drops;
    function initRain() {
        columns = Math.floor(canvas.width / fontSize);
        drops = [];
        for (var i = 0; i < columns; i++) {
            drops[i] = Math.floor(Math.random() * -80);
        }
    }
    initRain();

    // --- Cloud ---
    var clouds = [];
    function initClouds() {
        clouds = [];
        for (var i = 0; i < 5; i++) {
            clouds.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height * 0.5,
                r: 60 + Math.random() * 90,
                speed: 0.1 + Math.random() * 0.3,
                drift: Math.random() > 0.5 ? 1 : -1,
                opacity: 0.04 + Math.random() * 0.06
            });
        }
    }
    initClouds();

    window.addEventListener('resize', function() { resize(); initStars(); initRain(); initClouds(); });

    function drawBackground() {
        // Clear with transparent (page body is black)
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Stars (full screen, subtle)
        for (var i = 0; i < stars.length; i++) {
            var s = stars[i];
            s.o += s.sp * s.dir;
            if (s.o >= 1 || s.o <= 0.2) s.dir *= -1;
            ctx.fillStyle = 'rgba(255, 255, 255, ' + s.o + ')';
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
        }

        // 2. Cloud (center, behind cards)
        for (var c = 0; c < clouds.length; c++) {
            var cl = clouds[c];
            cl.x += cl.speed * cl.drift;
            if (cl.x > canvas.width + cl.r) cl.x = -cl.r;
            if (cl.x < -cl.r) cl.x = canvas.width + cl.r;
            cl.y += Math.sin(cl.x * 0.01) * 0.1;

            var grd = ctx.createRadialGradient(cl.x, cl.y, cl.r * 0.2, cl.x, cl.y, cl.r);
            grd.addColorStop(0, 'rgba(140, 180, 255, ' + (cl.opacity + 0.04) + ')');
            grd.addColorStop(0.6, 'rgba(120, 160, 240, ' + cl.opacity + ')');
            grd.addColorStop(1, 'rgba(100, 140, 220, 0)');
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(cl.x, cl.y, cl.r, 0, Math.PI * 2);
            ctx.fill();
        }

        // 3. Multilingual rain (left + right sides only)
        ctx.font = fontSize + 'px monospace';
        var sideRatio = 0.22;
        var leftB = Math.floor(columns * sideRatio);
        var rightB = Math.floor(columns * (1 - sideRatio));

        // Fade trail for rain
        for (var i = 0; i < columns; i++) {
            if (i > leftB && i < rightB) continue;
            var x = i * fontSize;
            var y = drops[i] * fontSize;

            // Trail fade
            ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
            ctx.fillRect(x, y - fontSize, fontSize, fontSize);

            // Character
            var ch = allChars[Math.floor(Math.random() * allChars.length)];
            ctx.fillStyle = '#00FF41';
            ctx.fillText(ch, x, y);

            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(drawBackground, 40);
})();
