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
    const allLinks = document.querySelectorAll('.navbar-nav .nav-link, .navbar-nav .dropdown-item');

    allLinks.forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
    });

    allLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (!linkPath || linkPath === '#') return;

        // Check if the link matches current path exactly or as a path prefix
        const isMatch = (currentPath === linkPath) || 
                        (linkPath !== '/' && currentPath.startsWith(linkPath));

        if (isMatch) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');

            // If inside a dropdown, highlight the parent dropdown toggle as well
            const parentDropdown = link.closest('.nav-item.dropdown');
            if (parentDropdown) {
                const toggle = parentDropdown.querySelector('.dropdown-toggle');
                if (toggle) {
                    toggle.classList.add('active');
                }
            }
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

    // Handle mobile nav collapse
    const navbarCollapse = document.getElementById('navbarMain');
    const toggler = document.getElementById('navbarToggler') || document.querySelector('.navbar-toggler');
    const navBase = document.getElementById('mainNav');

    if (navbarCollapse && toggler) {
        navbarCollapse.addEventListener('show.bs.collapse', () => {
            document.body.classList.add('no-scroll');
            toggler.classList.add('opened');
            if (navBase) navBase.classList.add('mobile-header-active');
        });

        navbarCollapse.addEventListener('hidden.bs.collapse', () => {
            document.body.classList.remove('no-scroll');
            toggler.classList.remove('opened');
            if (navBase) navBase.classList.remove('mobile-header-active');
            // Reset any open submenus
            document.querySelectorAll('.dropdown-menu.show, .dropdown-toggle.show').forEach(el => {
                el.classList.remove('show');
            });
        });
    }

    // Close mobile drawer when clicking any link that navigates
    document.querySelectorAll('.navbar-nav a:not(.dropdown-toggle)').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 1200 && navbarCollapse && navbarCollapse.classList.contains('show')) {
                if (typeof bootstrap !== 'undefined') {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) bsCollapse.hide();
                }
            }
        });
    });

    // Desktop Hover Handling (Responsive with Delay)
    if (typeof bootstrap !== 'undefined') {
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            let timer;
            dropdown.addEventListener('mouseenter', function () {
                if (window.innerWidth >= 1200) {
                    clearTimeout(timer);
                    let toggle = this.querySelector('.dropdown-toggle');
                    if (toggle) {
                        const instance = bootstrap.Dropdown.getOrCreateInstance(toggle);
                        instance.show();
                    }
                }
            });
            dropdown.addEventListener('mouseleave', function () {
                if (window.innerWidth >= 1200) {
                    timer = setTimeout(() => {
                        let toggle = this.querySelector('.dropdown-toggle');
                        if (toggle) {
                            const instance = bootstrap.Dropdown.getOrCreateInstance(toggle);
                            instance.hide();
                        }
                    }, 180);
                }
            });
        });
    }

    // Close menu when clicking outside the navbar container
    document.addEventListener('click', (e) => {
        if (window.innerWidth < 1200 && navbarCollapse && navbarCollapse.classList.contains('show')) {
            const navContainer = document.querySelector('.navbar-ultra');
            if (navContainer && !navContainer.contains(e.target)) {
                if (typeof bootstrap !== 'undefined') {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) bsCollapse.hide();
                }
            }
        }
    });
}
console.log('MakerWorks Navbar Logic 5.0 Initialized');

// Automatically load components when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Dynamically determine the base path from this script's URL
    const scripts = document.getElementsByTagName('script');
    let basePath = '';
    for (let script of scripts) {
        let src = script.getAttribute('src') || '';
        if (src.includes('components.js')) {
            basePath = src.split('components.js')[0];
            break;
        }
    }

    const navPlaceholder = document.getElementById('navbar-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (navPlaceholder) {
        loadComponent('navbar-placeholder', basePath + 'components/navbar.html?t=' + new Date().getTime());
    }
    if (footerPlaceholder) {
        loadComponent('footer-placeholder', basePath + 'components/footer.html?t=' + new Date().getTime());
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
