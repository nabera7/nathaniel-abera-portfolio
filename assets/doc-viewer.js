// Collapsible PDF viewer: only one open at a time
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        var toggles = document.querySelectorAll('.doc-toggle');
        toggles.forEach(function(toggle) {
            toggle.addEventListener('click', function() {
                var panel = toggle.nextElementSibling;
                var isOpen = panel.classList.contains('open');

                // Close all panels
                document.querySelectorAll('.doc-panel.open').forEach(function(p) {
                    p.classList.remove('open');
                });

                // Open the clicked one (if it wasn't already open)
                if (!isOpen) {
                    panel.classList.add('open');
                }
            });
        });
    });

    // Prevent right-click download on PDF viewers
    document.addEventListener('contextmenu', function(e) {
        if (e.target.closest('.pdf-viewer') || e.target.closest('.repo-frame') || e.target.tagName === 'IFRAME') {
            e.preventDefault();
        }
    });
})();
