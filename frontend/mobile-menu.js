(function () {
    function createMobileMenu() {
        if (document.querySelector('.fm-mobile-topbar')) return;

        document.body.classList.add('fm-mobile-active');

        const topbar = document.createElement('div');
        topbar.className = 'fm-mobile-topbar';
        topbar.innerHTML = `
            <a class="fm-mobile-brand" href="/index.html" aria-label="Home">
                <i class="fas fa-search-location"></i>
                <span>Find Missing Person</span>
            </a>
            <button type="button" class="fm-mobile-hamburger" aria-label="Open menu" id="fmOpenMenuBtn">
                <i class="fas fa-bars"></i>
            </button>
        `;

        const backdrop = document.createElement('div');
        backdrop.className = 'fm-mobile-backdrop';
        backdrop.id = 'fmMobileBackdrop';

        const sidebar = document.createElement('aside');
        sidebar.className = 'fm-mobile-sidebar';
        sidebar.id = 'fmMobileSidebar';
        sidebar.innerHTML = `
            <div class="fm-mobile-menu-head">
                <strong>Menu</strong>
                <button type="button" class="fm-mobile-close" aria-label="Close menu" id="fmCloseMenuBtn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="fm-mobile-menu-list">
                <div class="fm-mobile-lang-row">
                    <span class="fm-mobile-lang-label">🌐 Language</span>
                    <select class="fm-mobile-lang-select" id="fmMobileLanguage" aria-label="Mobile language selector"></select>
                </div>
                <a class="fm-mobile-link" href="/user/dashboard.html">
                    <span>Dashboard</span>
                </a>
                <a class="fm-mobile-link" href="#" aria-label="Notifications">
                    <span>🔔 Notifications</span>
                    <span class="fm-notif-badge">1</span>
                </a>
                <a class="fm-mobile-link" href="/user/report.html">
                    <span>Report / Upload</span>
                </a>
                <button type="button" class="fm-mobile-action" id="fmLogoutBtn">
                    <span>Logout</span>
                </button>
            </div>
        `;

        document.body.appendChild(topbar);
        document.body.appendChild(backdrop);
        document.body.appendChild(sidebar);

        const openBtn = document.getElementById('fmOpenMenuBtn');
        const closeBtn = document.getElementById('fmCloseMenuBtn');
        const logoutBtn = document.getElementById('fmLogoutBtn');
        const mobileLanguage = document.getElementById('fmMobileLanguage');
        const pageLanguageSelector = document.getElementById('languageSelector');

        function openMenu() {
            sidebar.classList.add('open');
            backdrop.classList.add('open');
            document.body.classList.add('fm-mobile-locked');
        }

        function closeMenu() {
            sidebar.classList.remove('open');
            backdrop.classList.remove('open');
            document.body.classList.remove('fm-mobile-locked');
        }

        openBtn.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
        backdrop.addEventListener('click', closeMenu);

        sidebar.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', closeMenu);
        });

        if (logoutBtn) {
            logoutBtn.addEventListener('click', function () {
                if (typeof window.logout === 'function') {
                    window.logout();
                    return;
                }
                localStorage.removeItem('token');
                closeMenu();
                window.location.href = '/login.html';
            });
        }

        if (mobileLanguage) {
            if (pageLanguageSelector) {
                mobileLanguage.innerHTML = pageLanguageSelector.innerHTML;
                mobileLanguage.value = pageLanguageSelector.value || localStorage.getItem('preferredLanguage') || 'en';
            } else {
                mobileLanguage.innerHTML = '<option value="en">🌐 English</option><option value="am">🇪🇹 አማርኛ</option>';
                mobileLanguage.value = localStorage.getItem('preferredLanguage') || 'en';
            }

            mobileLanguage.addEventListener('change', function () {
                const nextLang = mobileLanguage.value;

                if (pageLanguageSelector) {
                    pageLanguageSelector.value = nextLang;
                    pageLanguageSelector.dispatchEvent(new Event('change', { bubbles: true }));
                }

                if (typeof window.changeLanguage === 'function') {
                    window.changeLanguage(nextLang);
                } else {
                    localStorage.setItem('preferredLanguage', nextLang);
                }
            });
        }

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closeMenu();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', createMobileMenu);
})();
