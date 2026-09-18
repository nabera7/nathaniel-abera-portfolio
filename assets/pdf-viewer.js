// PDF.js viewer: scroll + zoom, no download
(function() {
    // PDF.js from CDN
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    document.head.appendChild(script);

    script.onload = function() {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        initAll();
    };

    function initAll() {
        var viewers = document.querySelectorAll('.pdf-viewer');
        viewers.forEach(function(viewer) {
            var src = viewer.getAttribute('data-src');
            if (!src || viewer.dataset.init) return;
            viewer.dataset.init = '1';
            build(viewer, src);
        });
    }

    function build(container, url) {
        // Toolbar
        var toolbar = document.createElement('div');
        toolbar.className = 'pdf-toolbar';
        var zoomOut = document.createElement('button');
        zoomOut.textContent = '−';
        var zoomIn = document.createElement('button');
        zoomIn.textContent = '+';
        var zoomLabel = document.createElement('span');
        zoomLabel.className = 'zoom-label';
        zoomLabel.textContent = '100%';
        toolbar.appendChild(zoomOut);
        toolbar.appendChild(zoomLabel);
        toolbar.appendChild(zoomIn);

        // Scroll area
        var scroll = document.createElement('div');
        scroll.className = 'pdf-scroll';

        container.innerHTML = '';
        container.appendChild(toolbar);
        container.appendChild(scroll);

        var scale = 1.0;
        var pdfDoc = null;

        function renderAll() {
            scroll.innerHTML = '';
            var scaleNum = scale;
            for (var p = 1; p <= pdfDoc.numPages; p++) {
                (function(pageNum) {
                    pdfDoc.getPage(pageNum).then(function(page) {
                        var viewport = page.getViewport({ scale: scaleNum });
                        var canvas = document.createElement('canvas');
                        canvas.width = viewport.width;
                        canvas.height = viewport.height;
                        var ctx = canvas.getContext('2d');
                        scroll.appendChild(canvas);
                        page.render({ canvasContext: ctx, viewport: viewport });
                    });
                })(p);
            }
            zoomLabel.textContent = Math.round(scale * 100) + '%';
        }

        pdfjsLib.getDocument(url).promise.then(function(doc) {
            pdfDoc = doc;
            renderAll();
        }).catch(function(err) {
            scroll.innerHTML = '<p style="color:#fff;padding:20px;">Unable to load PDF.</p>';
        });

        zoomIn.addEventListener('click', function() {
            if (scale < 3) { scale += 0.25; renderAll(); }
        });
        zoomOut.addEventListener('click', function() {
            if (scale > 0.5) { scale -= 0.25; renderAll(); }
        });
    }
})();
