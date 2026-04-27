// ============================================================
//  Find Missing Person — Theme Manager (Day / Night)
// ============================================================

(function () {
    const STORAGE_KEY = 'findthem_theme';
    const LIGHT = 'light';
    const DARK  = 'dark';

    /** Apply theme to <html> element */
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);

        // Update every toggle button on the page
        document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
            btn.innerHTML = theme === LIGHT
                ? '<i class="fas fa-moon"></i>'
                : '<i class="fas fa-sun"></i>';
            btn.title = theme === LIGHT ? 'Switch to Dark Mode' : 'Switch to Light Mode';
        });
    }

    /** Toggle between light and dark */
    window.toggleTheme = function () {
        const current = document.documentElement.getAttribute('data-theme') || DARK;
        applyTheme(current === DARK ? LIGHT : DARK);
    };

    /** Load saved preference (default: dark) */
    function init() {
        const saved = localStorage.getItem(STORAGE_KEY) || DARK;
        applyTheme(saved);
    }

    // Run immediately so there's no flash
    init();

    // Also re-apply after DOM is ready (for button icon)
    document.addEventListener('DOMContentLoaded', () => {
        const saved = localStorage.getItem(STORAGE_KEY) || DARK;
        applyTheme(saved);
    });
})();
