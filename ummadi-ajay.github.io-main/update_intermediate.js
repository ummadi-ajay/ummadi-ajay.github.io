const fs = require('fs');
const path = require('path');

try {
    const filePath = path.join(process.cwd(), 'programs/intermediate/index.html');
    console.log("Reading file:", filePath);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. New CSS for Intermediate (Blue Theme)
    const newCSS = `<style>
    :root {
      --primary: #0d6efd;
      --secondary: #ff6600; /* Secondary Orange for accents */
      --dark: #1d1d1f;
      --light: #ffffff;
      --bg-offset: #fbfbfd;
      --glass: rgba(255, 255, 255, 0.7);
      --glass-border: rgba(0, 0, 0, 0.1);
      --radius-xl: 24px;
      --radius-lg: 16px;
      --transition-smooth: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      --shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: var(--light);
      color: var(--dark);
      line-height: 1.6;
      scroll-behavior: smooth;
      -webkit-font-smoothing: antialiased;
      cursor: none;
    }
    @media (max-width: 991px) { body { cursor: auto; } }
    h1, h2, h3, h4, h5, h6 { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; letter-spacing: -1px; }

    /* Custom Cursor */
    .cursor-dot, .cursor-outline {
      pointer-events: none; position: fixed; top: 0; left: 0; transform: translate(-50%, -50%); border-radius: 50%; z-index: 9999;
      transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
    }
    .cursor-dot { width: 8px; height: 8px; background-color: var(--primary); }
    .cursor-outline { width: 40px; height: 40px; border: 2px solid var(--primary); opacity: 0.3; }
    @media (max-width: 991px) { .cursor-dot, .cursor-outline { display: none; } }

    /* Navbar */
    .navbar {
      backdrop-filter: blur(20px) saturate(180%); background: rgba(255, 255, 255, 0.8) !important; border-bottom: 1px solid var(--glass-border);
      padding: 1rem 2rem; transition: var(--transition-smooth);
    }
    .navbar.floating {
      margin-top: 1rem; border-radius: 100px; width: 90%; left: 5%;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); background: rgba(255, 255, 255, 0.9) !important;
    }
    .navbar-brand { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 1.6rem; color: var(--dark) !important; letter-spacing: -1px; }
    .nav-link { font-weight: 600; color: var(--dark) !important; padding: 0.5rem 1rem !important; opacity: 0.7; transition: var(--transition-smooth); }
    .nav-link:hover { opacity: 1; transform: translateY(-2px); }

    /* Buttons */
    .btn-premium {
      padding: 12px 30px; border-radius: 100px; font-weight: 700; font-size: 1rem; transition: var(--transition-smooth);
      text-decoration: none; display: inline-flex; align-items: center; gap: 10px;
    }
    .btn-primary-mw { background: var(--dark); color: var(--light); border: none; }
    .btn-primary-mw:hover { background: #000; color: var(--light); transform: translateY(-5px) scale(1.02); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); }

    /* Hero */
    .intermediate-hero {
      background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
      position: relative; color: white; text-align: center; padding: 140px 20px 120px; overflow: hidden; border-radius: 0 0 50px 50px;
    }
    .intermediate-hero::before {
      content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      background-image: radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 20%),
                        radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 20%);
      pointer-events: none;
    }
    .intermediate-hero h1 { font-size: clamp(2.5rem, 5vw, 3.5rem); font-weight: 800; margin-bottom: 1.5rem; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); letter-spacing: -2px; }
    .intermediate-hero p { font-size: 1.25rem; max-width: 700px; margin: 0 auto 2.5rem; opacity: 0.95; font-weight: 400; }
    .intermediate-hero .btn {
      background-color: var(--light); color: var(--primary); padding: 1rem 2.5rem; font-size: 1.1rem; border-radius: 50px; font-weight: 700;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); border: none; transition: transform 0.3s ease, box-shadow 0.3s ease;
      display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
    }
    .intermediate-hero .btn:hover { transform: translateY(-3px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); }

    section { padding: 80px 20px; }

    /* Card Styles */
    .program-info-item, .skill-card, .stats-card, .review-card, .pricing-card, .curriculum-item, .eligibility-content {
      background: var(--light); border-radius: var(--radius-xl); box-shadow: 0 4px 20px rgba(0,0,0,0.05);
      transition: var(--transition-smooth); border: 1px solid var(--glass-border); padding: 2rem;
    }
    .program-info-item:hover, .skill-card:hover, .stats-card:hover, .review-card:hover, .pricing-card:hover, .curriculum-item:hover {
      transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.08);
    }
    .program-info-section { background: var(--bg-offset); text-align: center; }
    .program-info-item .icon { font-size: 3rem; color: var(--primary); margin-bottom: 1rem; }
    .program-info-item h4 { font-weight: 700; margin-bottom: 0.5rem; }

    .eligibility-section { background: var(--light); }
    .eligibility-content ul li { margin-bottom: 10px; position: relative; padding-left: 25px; list-style: none; }
    .eligibility-content ul li::before { content: "✓"; position: absolute; left: 0; color: var(--primary); font-weight: bold; }

    .curriculum-header { cursor: pointer; position: relative; display: flex; align-items: center; justify-content: space-between; }
    .curriculum-header h4 { margin: 0; font-size: 1.25rem; font-weight: 700; }
    .curriculum-content { max-height: 0; overflow: hidden; transition: max-height 0.5s ease; }
    .curriculum-item.active .curriculum-content { max-height: 2000px; margin-top: 20px; }
    
    .gallery-img { width: 100%; height: 250px; object-fit: cover; border-radius: var(--radius-lg); transition: transform 0.3s ease; }
    .gallery-img:hover { transform: scale(1.02); }
    .curriculum-gallery { position: sticky; top: 100px; padding: 25px; background: var(--bg-offset); border-radius: var(--radius-xl); border: 1px solid var(--glass-border); }
    .curriculum-gallery-img { width: 100%; height: 200px; object-fit: cover; border-radius: var(--radius-lg); margin-bottom: 15px; }
    @media (max-width: 991px) { .curriculum-gallery { display: none !important; } }
    </style>`;

    // 2. New Footer and Scripts
    const newFooter = `<!-- Modern Footer -->
    <footer style="background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%); position: relative; overflow: hidden;">
        <div style="position: absolute; top: -100px; left: -100px; width: 400px; height: 400px; background: radial-gradient(circle, rgba(13, 110, 253, 0.05) 0%, transparent 70%); border-radius: 50%; z-index: 0;"></div>
        <div style="position: absolute; bottom: -150px; right: -150px; width: 500px; height: 500px; background: radial-gradient(circle, rgba(255, 102, 0, 0.04) 0%, transparent 70%); border-radius: 50%; z-index: 0;"></div>
        <div class="container py-5" style="position: relative; z-index: 1;">
            <div class="row g-5 mb-5">
                <div class="col-lg-4" data-aos="fade-up">
                    <a class="navbar-brand mb-3 d-block" href="/" style="font-size: 1.8rem; font-weight: 800; background: linear-gradient(135deg, #0d6efd, #ff6600); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">MAKERWORKS</a>
                    <p class="text-muted mb-4">Mumbai's premier engineering lab for young minds aged 8-17. Transform curiosity into innovation.</p>
                </div>
                <div class="col-lg-2"><h6 class="fw-bold mb-4" style="text-transform:uppercase;">Programs</h6><ul class="list-unstyled footer-links"><li><a href="/programs/beginner/" class="text-decoration-none">Beginner</a></li><li><a href="/programs/intermediate/" class="text-decoration-none">Intermediate</a></li><li><a href="/programs/advanced/" class="text-decoration-none">Advanced</a></li></ul></div>
            </div>
            <div class="border-top pt-4"><p class="text-muted small">© 2025 MakerWorks Lab.</p></div>
        </div>
        <style>
          .footer-links a:hover { color: #0d6efd !important; } 
        </style>
    </footer>

    <button class="btn-premium btn-primary-mw" id="backToTop" style="position: fixed; bottom: 40px; right: 40px; width: 60px; height: 60px; border-radius: 50%; opacity: 0; visibility: hidden; z-index: 1000; border: none; display: flex; align-items: center; justify-content: center;">
        <i class="bi bi-arrow-up"></i>
    </button>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            AOS.init({ duration: 1000, once: true, offset: 100 });

            const dot = document.querySelector('.cursor-dot');
            const outline = document.querySelector('.cursor-outline');
            if (dot && outline) {
                document.addEventListener('mousemove', (e) => {
                    dot.style.transform = \`translate(\${e.clientX}px, \${e.clientY}px)\`;
                    outline.style.transform = \`translate(\${e.clientX}px, \${e.clientY}px)\`;
                });
            }

            const nav = document.getElementById('mainNav');
            const btt = document.getElementById('backToTop');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    if (nav) nav.classList.add('floating');
                    if (btt) { btt.style.opacity = '1'; btt.style.visibility = 'visible'; }
                } else {
                    if (nav) nav.classList.remove('floating');
                    if (btt) { btt.style.opacity = '0'; btt.style.visibility = 'hidden'; }
                }
            });
            if (btt) btt.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
        });
    </script>
</body>
</html>`;

    // Perform Replacements
    console.log("Replacing CSS...");
    if (/<style>[\s\S]*?<\/style>/.test(content)) {
        content = content.replace(/<style>[\s\S]*?<\/style>/, newCSS);
    } else {
        console.warn("CSS block not found or already replaced.");
    }

    console.log("Replacing Footer...");
    if (/<!-- Modern Footer -->[\s\S]*?<\/html>/.test(content)) {
        content = content.replace(/<!-- Modern Footer -->[\s\S]*?<\/html>/, newFooter);
    } else if (/<footer[\s\S]*?<\/html>/.test(content)) {
        content = content.replace(/<footer[\s\S]*?<\/html>/, newFooter);
    }

    console.log("Replacing beginner-hero class...");
    content = content.replace('class="beginner-hero"', 'class="intermediate-hero"');

    // Replace hardcoded Orange icons #ff6600
    // Be careful not to replace text content, but usually colors are in style attributes or CSS.
    // In CSS it's handled by newCSS.
    // In HTML (inline styles):
    content = content.replace(/color:\s*#ff6600/g, 'color: #0d6efd');
    // Wait, some secondary accents might want to be #ff6600? 
    // For Intermediate (Blue), let's make everything Blue for consistency or stick to Blue Primary / Orange Secondary.
    // If I replace ALL #ff6600 with #0d6efd, I lose the secondary color.
    // I'll keep secondary accents if they are meant to be accents.
    // But the Stats icons etc being Orange makes it look like Beginner.
    // I'll replace color: #ff6600 with color: var(--primary) (which is Blue).
    // content = content.replace(/color:\s*#ff6600/g, 'color: var(--primary)');
    // But `style="..."` might be `style="color: #ff6600;"`.

    fs.writeFileSync(filePath, content, 'utf8');
    console.log("SUCCESS: Updated intermediate/index.html");

} catch (e) {
    console.error("ERROR:", e);
    process.exit(1);
}
