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
        // Remove any existing listeners by cloning (optional but safe)
        // const newToggler = toggler.cloneNode(true);
        // toggler.parentNode.replaceChild(newToggler, toggler);

        toggler.addEventListener('click', (e) => {
            e.stopPropagation();
            // Check if BS collapse is defined
            if (typeof bootstrap !== 'undefined') {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse, { toggle: false });
                bsCollapse.toggle();

                const isOpen = !navbarCollapse.classList.contains('show'); // Logic inverted because toggle happens async/after
                // Note: Manually tracking state is safer

                setTimeout(() => {
                    const isNowOpen = navbarCollapse.classList.contains('show');
                    document.body.classList.toggle('no-scroll', isNowOpen);
                    toggler.classList.toggle('opened', isNowOpen);
                    const navBase = document.getElementById('mainNav');
                    if (navBase) navBase.classList.toggle('mobile-header-active', isNowOpen);
                }, 350); // Wait for transition
            }
        });
    }

    document.querySelectorAll('.navbar-nav .nav-link:not(.dropdown-toggle)').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 1200 && navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) bsCollapse.hide();
                toggler.classList.remove('opened');
                document.body.classList.remove('no-scroll');
                const navBase = document.getElementById('mainNav');
                if (navBase) navBase.classList.remove('mobile-header-active');
            }
        });
    });

    /* 
    Manual initialization removed to prevent double-triggering with data-bs-toggle.
    Bootstrap handles this automatically.
    */

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
                    }, 200);
                }
            });
        });
    }

    // Mobile Click Handling - REMOVED (Handled by Bootstrap data-bs-toggle)

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
            if (window.innerWidth < 1200) {
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
        if (window.innerWidth < 1200) {
            const navContainer = document.querySelector('.navbar-ultra');
            if (navContainer && !navContainer.contains(e.target) && navbarCollapse.classList.contains('show')) {
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
