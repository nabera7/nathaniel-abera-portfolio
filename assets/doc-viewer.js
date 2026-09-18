// Collapsible PDF viewer: only one open at a time, toggle prompt text
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        var toggles = document.querySelectorAll('.doc-toggle');
        toggles.forEach(function(toggle) {
            toggle.addEventListener('click', function() {
                var panel = toggle.nextElementSibling;
                var isOpen = panel.classList.contains('open');
                var prompt = toggle.querySelector('.view-prompt');

                // Close all panels and reset their prompts
                document.querySelectorAll('.doc-panel.open').forEach(function(p) {
                    p.classList.remove('open');
                    var t = p.previousElementSibling;
                    if (t) {
                        var pr = t.querySelector('.view-prompt');
                        if (pr) pr.textContent = 'Click to View';
                    }
                });

                // Open the clicked one (if it wasn't already open)
                if (!isOpen) {
                    panel.classList.add('open');
                    if (prompt) prompt.textContent = 'Click to Close';
                } else {
                    if (prompt) prompt.textContent = 'Click to View';
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
