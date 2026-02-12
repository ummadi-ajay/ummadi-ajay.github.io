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
            toggler.classList.toggle('opened');
            const target = document.querySelector(toggler.getAttribute('data-bs-target'));
            if (target && typeof bootstrap !== 'undefined') {
                const bsCollapse = bootstrap.Collapse.getInstance(target) || new bootstrap.Collapse(target, { toggle: false });
                bsCollapse.toggle();
            }
        });

        document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle)').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) bsCollapse.hide();
                    toggler.classList.remove('opened');
                }
            });
        });

        // Explicitly handle dropdowns on mobile
        document.querySelectorAll('.dropdown-toggle').forEach(dropdown => {
            dropdown.addEventListener('click', function (e) {
                if (window.innerWidth < 992) {
                    e.preventDefault();
                    e.stopImmediatePropagation();

                    const menu = this.nextElementSibling;
                    if (menu && menu.classList.contains('dropdown-menu')) {
                        const isShowing = menu.classList.contains('show');

                        // Close all other open dropdowns first (both menus and buttons)
                        document.querySelectorAll('.dropdown-menu.show, .dropdown-toggle.show').forEach(el => {
                            if (el !== menu && el !== this) el.classList.remove('show');
                        });

                        // Toggle the current one
                        if (isShowing) {
                            menu.classList.remove('show');
                            this.classList.remove('show');
                        } else {
                            menu.classList.add('show');
                            this.classList.add('show');
                        }
                    }
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
                if (!navbarCollapse.contains(e.target) && !toggler.contains(e.target)) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) bsCollapse.hide();
                    toggler.classList.remove('opened');
                }
            }
        });
    }
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
