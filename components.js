/**
 * MakerWorks Component Loader
 * Dynamically loads shared HTML components (navbar, footer) into pages.
 */

async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`Failed to load ${componentPath}`);
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
        }

        // After loading, update active state for navbar
        if (elementId === 'navbar-placeholder') {
            updateActiveNavLink();
            initializeNavbarLogic();
        }
        return true;
    } catch (error) {
        console.error('Error loading component:', error);
        return false;
    }
}

function updateActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        // Check if the link matches the current path
        if (currentPath === linkPath || (linkPath !== '/' && currentPath.startsWith(linkPath))) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

function initializeNavbarLogic() {
    const nav = document.getElementById('mainNav');
    const btt = document.getElementById('backToTop');

    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                nav.classList.add('floating');
                if (btt) {
                    btt.style.opacity = '1';
                    btt.style.visibility = 'visible';
                }
            } else {
                nav.classList.remove('floating');
                if (btt) {
                    btt.style.opacity = '0';
                    btt.style.visibility = 'hidden';
                }
            }
        });
    }

    if (btt) {
        btt.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Handle mobile nav collapse on link click
    const navbarCollapse = document.getElementById('navbarMain');
    const toggler = document.getElementById('navbarToggler') || document.querySelector('.navbar-toggler');

    if (navbarCollapse && toggler) {
        toggler.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = toggler.classList.toggle('opened');
            const navBase = document.getElementById('mainNav');
            const target = document.querySelector(toggler.getAttribute('data-bs-target'));

            if (navBase) navBase.classList.toggle('mobile-header-active', isOpen);
            document.body.classList.toggle('no-scroll', isOpen);

            if (target && typeof bootstrap !== 'undefined') {
                const bsCollapse = bootstrap.Collapse.getInstance(target) || new bootstrap.Collapse(target, { toggle: false });
                bsCollapse.toggle();

                if (!isOpen) {
                    document.querySelectorAll('.dropdown-menu.show, .dropdown-toggle.show').forEach(el => {
                        el.classList.remove('show');
                    });
                }
            }
        });

        document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle)').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) bsCollapse.hide();
                    toggler.classList.remove('opened');
                    document.body.classList.remove('no-scroll');
                    const navBase = document.getElementById('mainNav');
                    if (navBase) navBase.classList.remove('mobile-header-active');
                }
            });
        });

        // Desktop: Manually initialize Bootstrap Dropdowns since data-bs-toggle was removed
        if (window.innerWidth >= 992 && typeof bootstrap !== 'undefined') {
            document.querySelectorAll('.dropdown-toggle').forEach(el => {
                new bootstrap.Dropdown(el);
            });
        }

        // Mobile: Explicitly handle dropdowns
        document.querySelectorAll('.dropdown-toggle').forEach(dropdown => {
            dropdown.addEventListener('click', function (e) {
                if (window.innerWidth < 992) {
                    e.preventDefault();
                    e.stopPropagation();

                    const menu = this.nextElementSibling;
                    if (menu && menu.classList.contains('dropdown-menu')) {
                        const isShowing = menu.classList.contains('show');

                        // Close all others
                        document.querySelectorAll('.dropdown-menu.show, .dropdown-toggle.show').forEach(el => {
                            if (el !== menu && el !== this) el.classList.remove('show');
                        });

                        // Toggle current
                        menu.classList.toggle('show', !isShowing);
                        this.classList.toggle('show', !isShowing);
                    }
                }
            });
        });

        // Advanced Close: Smart Tap Background
        navbarCollapse.addEventListener('click', (e) => {
            if (e.target === navbarCollapse) {
                const openDropdown = document.querySelector('.dropdown-menu.show');
                if (openDropdown) {
                    // Alternative: Close the folder first if user taps the background
                    document.querySelectorAll('.dropdown-menu.show, .dropdown-toggle.show').forEach(el => {
                        el.classList.remove('show');
                    });
                } else {
                    // Close the entire menu if everything is already collapsed
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) bsCollapse.hide();
                    toggler.classList.remove('opened');
                    document.body.classList.remove('no-scroll');
                    const navBase = document.getElementById('mainNav');
                    if (navBase) navBase.classList.remove('mobile-header-active');
                }
            }
        });

        // Close dropdowns if user clicks any other link in the menu
        document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle)').forEach(link => {
            link.addEventListener('click', () => {
                document.querySelectorAll('.dropdown-menu.show, .dropdown-toggle.show').forEach(el => {
                    el.classList.remove('show');
                });
            });
        });

        // Ensure sub-links (dropdown items) also close the menu on click
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth < 992) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) bsCollapse.hide();
                    toggler.classList.remove('opened');
                    document.body.classList.remove('no-scroll');
                    const navBase = document.getElementById('mainNav');
                    if (navBase) navBase.classList.remove('mobile-header-active');
                }
            });
        });

        // Close menu/dropdowns when clicking outside the entire navbar area
        document.addEventListener('click', (e) => {
            if (window.innerWidth < 992) {
                const navContainer = document.querySelector('.navbar-ultra');
                if (!navContainer.contains(e.target) && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) bsCollapse.hide();
                    toggler.classList.remove('opened');
                    document.body.classList.remove('no-scroll');
                    if (navContainer) navContainer.classList.remove('mobile-header-active');
                }
            }
        });
    }
    console.log('MakerWorks Navbar Logic 5.0 Initialized');
}

// Automatically load components when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const navPlaceholder = document.getElementById('navbar-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (navPlaceholder) {
        loadComponent('navbar-placeholder', '/components/navbar.html');
    }
    if (footerPlaceholder) {
        loadComponent('footer-placeholder', '/components/footer.html');
    }

    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }
});
