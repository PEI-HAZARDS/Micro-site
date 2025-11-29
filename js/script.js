/* MODERN SCRIPTS - IntelligentLogistics Theme
   Modern interactive effects, animations and functionality
*/

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize all components
  initNavbar();
  initScrollEffects();
  await initRepoStats();        // <-- await to ensure stats are loaded before counters
  initCounters();
  initCopyButtons();
  initContactForm();
  initParticlesEffect();
  initDetailPageNavigation();
  // initTeamImages() removed (not defined) to avoid runtime errors
  
  // Initial check if private panel is active in CSS
  const privatePanel = document.getElementById('private-panel');
  if (privatePanel && getComputedStyle(privatePanel).visibility === 'visible') {
    privatePanel.classList.add('active');
  }

  // Trigger initial animations
  animateOnScroll();
  
});

// Navbar functionality (mobile toggle, scroll behavior)
function initNavbar() {
  const header = document.querySelector('.header');
  const mobileToggle = document.querySelector('.nav-mobile-toggle');
  const mobileNav = document.querySelector('.nav-mobile');
  const mobileClose = document.querySelector('.nav-mobile-close');
  const navOverlay = document.querySelector('.nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Toggle mobile menu
  if (mobileToggle && mobileNav && mobileClose && navOverlay) {
    mobileToggle.addEventListener('click', () => {
      mobileNav.classList.add('active');
      navOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    
    function closeMobileNav() {
      mobileNav.classList.remove('active');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
    
    mobileClose.addEventListener('click', closeMobileNav);
    navOverlay.addEventListener('click', closeMobileNav);
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileNav.classList.contains('active')) {
          closeMobileNav();
        }
      });
    });
  }
  
  // Header scroll behavior
  if (header) {
    // Consolidated scroll handler (single listener to improve performance)
    function handleScroll() {
      // Header compact state
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Active link highlighting based on scroll position
      const sections = document.querySelectorAll('section[id]');
      const scrollY = window.pageYOffset;

      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        const link = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (!link) return;

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Trigger scroll animations in a single place
      if (typeof animateOnScroll === 'function') animateOnScroll();
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
  }
}

// Scroll animations and effects
function initScrollEffects() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  // Prefer IntersectionObserver to toggle visibility as elements enter/leave
  // the viewport. This will add/remove the `.is-revealed` class which the
  // stylesheet uses to run fade/slide animations.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
        } else {
          entry.target.classList.remove('is-revealed');
        }
      });
    }, { threshold: 0.15 });

    animatedElements.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers: show everything (no intersection support)
    animatedElements.forEach(el => {
      el.classList.add('is-revealed');
    });
  }
}

// Auto-scroll effect to reveal content

function animateOnScroll() {
  // No-op when IntersectionObserver is available (observer handles toggling).
  if ('IntersectionObserver' in window) return;

  // Fallback for older browsers without IntersectionObserver
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  animatedElements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    const elementVisible = 150;
    if (elementTop < window.innerHeight - elementVisible) {
      el.classList.add('is-revealed');
    } else {
      el.classList.remove('is-revealed');
    }
  });
}

// Animated counters
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = parseInt(counter.getAttribute('data-duration') || '2000');
    let startTime = null;
    
    function countUp(timestamp) {
      if (!startTime) startTime = timestamp;
      
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const value = Math.floor(percentage * target);
      counter.textContent = value;
      
      if (percentage < 1) {
        window.requestAnimationFrame(countUp);
      } else {
        counter.textContent = target;
      }
    }
    
    // Start animation immediately instead of waiting for intersection
    window.requestAnimationFrame(countUp);
  });
}

// Copy button functionality for code snippets
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', () => {
      const codeBlock = button.closest('.card').querySelector('.repo-clone');
      
      if (codeBlock) {
        navigator.clipboard.writeText(codeBlock.textContent.trim())
          .then(() => {
            button.classList.add('copied');
            button.querySelector('.copy-text').textContent = 'Copiado!';
            
            setTimeout(() => {
              button.classList.remove('copied');
              button.querySelector('.copy-text').textContent = 'Copiar';
            }, 2000);
          })
          .catch(err => {
            console.error('Failed to copy text: ', err);
          });
      }
    });
  });
}


// Contact form functionality
// ======= CONFIGURAÇÃO =======
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxsisjvxNTJYM3Mo9mRSL0SFWrlB8k24fVPFZv4aeeGOttE95RlJagMokY0gEiKukee4g/exec";

// ======= FORMULÁRIO DE CONTACTO =======
function initContactForm() {
  const contactForm = document.getElementById("contact-form");

  if (!contactForm || contactForm.dataset.initialized) return;
  contactForm.dataset.initialized = "true"; // evita duplicação

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const formValues = Object.fromEntries(formData.entries());

    const submitBtn = contactForm.querySelector('[type="submit"]');
    if (submitBtn.disabled) return; // bloqueia segundo clique

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="bi bi-arrow-clockwise"></i> A enviar...';

    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      showFormMessage("success", "Mensagem enviada com sucesso!");
      contactForm.reset();
    } catch (error) {
      showFormMessage("error", "Erro ao enviar. Tente novamente.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = "Enviar";
    }
  });

  function showFormMessage(type, message) {
    const existingMessage = contactForm.querySelector(".alert");
    if (existingMessage) existingMessage.remove();

    const messageEl = document.createElement("div");
    messageEl.className = `alert alert-${type}`;
    messageEl.innerHTML = message;
    contactForm.appendChild(messageEl);
    setTimeout(() => messageEl.remove(), 5000);
  }
}

// Inicializar o formulário ao carregar a página
document.addEventListener('DOMContentLoaded', initContactForm);

// Decorative particles effect
function initParticlesEffect() {
  const particlesContainer = document.querySelector('.particles-container');
  
  if (!particlesContainer) return;
  
  // Create particles
  for (let i = 0; i < 50; i++) {
    createParticle();
  }
  
  function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    
    // Random size
    const size = Math.random() * 5 + 1;
    
    // Random opacity
    const opacity = Math.random() * 0.5 + 0.1;
    
    // Random animation duration
    const duration = Math.random() * 20 + 10;
    
    // Apply styles
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.opacity = opacity;
    particle.style.animationDuration = `${duration}s`;
    
    particlesContainer.appendChild(particle);
  }
}

// Detail page navigation (prevent opening in new tab)
function initDetailPageNavigation() {
  // Links from index to detail pages - replace current page instead of opening new tab
  const projectDetailLinks = document.querySelectorAll('.project-details-link');
  
  projectDetailLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.replace(this.getAttribute('href'));
    });
  });
  
  // Back links from detail pages
  const backLinks = document.querySelectorAll('.back-link');
  
  backLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // If there is a history to go back to, use it
      e.preventDefault();
      
      if (window.history && window.history.length > 1) {
        window.history.back();
        return;
      }
      
      // fallback: replace location in same tab (no new tab)
      const href = this.getAttribute('href') || '/index.html';
      window.location.replace(href);
    });
  });
}

// Mobile nav toggle / close behaviour (idempotent: safe to add)
(function initMobileNavToggle(){
  document.addEventListener('click', (e) => {
    const panel = document.querySelector('.nav-mobile');
    const overlay = document.querySelector('.nav-overlay');
    if (!panel || !overlay) return;

    // open
    if (e.target.closest('.nav-mobile-toggle')) {
      panel.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      return;
    }

    // close triggers: close button, overlay click, link click inside panel
    if (e.target.closest('.nav-mobile-close') || e.target.closest('.nav-overlay') || e.target.closest('.nav-mobile .nav-link')) {
      panel.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      return;
    }
  });

  // close with Escape
  window.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      const panel = document.querySelector('.nav-mobile');
      const overlay = document.querySelector('.nav-overlay');
      if (panel && panel.classList.contains('active')) {
        panel.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });
})();

// New: fetch repository stats from GitHub and populate counters
async function initRepoStats() {
  try {
    const res = await fetch(
      "https://pei-hazards.github.io/Micro-site/stats.json"
    );
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    const totals = data.totals || {}; // <- novo: total agregado

    const commitsEl = document.getElementById("commits");
    const issuesEl = document.getElementById("issues");
    const releasesEl = document.getElementById("releases");

    if (commitsEl) {
      commitsEl.setAttribute("data-target", String(totals.commits || 0));
      commitsEl.textContent = "0";
    }
    if (issuesEl) {
      issuesEl.setAttribute("data-target", String(totals.issues_closed || 0));
      issuesEl.textContent = "0";
    }
    if (releasesEl) {
      releasesEl.setAttribute("data-target", String(totals.releases || 0));
      releasesEl.textContent = "0";
    }

  } catch (e) {
    console.error("Erro a carregar stats.json", e);

    // Set defaults if stats.json fails to load
    const commitsEl = document.getElementById("commits");
    const issuesEl = document.getElementById("issues");
    const releasesEl = document.getElementById("releases");

    if (commitsEl) {
      commitsEl.setAttribute("data-target", "0");
      commitsEl.textContent = "0";
    }
    if (issuesEl) {
      issuesEl.setAttribute("data-target", "0");
      issuesEl.textContent = "0";
    }
    if (releasesEl) {
      releasesEl.setAttribute("data-target", "0");
      releasesEl.textContent = "0";
    }
  }
}
