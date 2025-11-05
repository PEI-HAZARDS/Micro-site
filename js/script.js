/* MODERN SCRIPTS - IntelligentLogistics Theme
   Modern interactive effects, animations and functionality
*/

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initNavbar();
  initScrollEffects();
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
// auto-scroll removed: show content immediately on load instead of scrolling

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
    
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          window.requestAnimationFrame(countUp);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    observer.observe(counter);
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


// Contact form handling
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(contactForm);
      const formValues = Object.fromEntries(formData.entries());
      
      // Simple validation
      let valid = true;
      const requiredFields = contactForm.querySelectorAll('[required]');
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.classList.add('error');
        } else {
          field.classList.remove('error');
        }
      });
      
      if (!valid) {
        showFormMessage('error', 'Por favor preencha todos os campos obrigatórios.');
        return;
      }
      
      // Show loading state
      const submitBtn = contactForm.querySelector('[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="bi bi-arrow-clockwise"></i> A enviar...';
      
      // Simulate form submission (replace with actual submission)
      setTimeout(() => {
        // Success response
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
        
        showFormMessage('success', 'Mensagem enviada com sucesso! Obrigado pelo contacto.');
        contactForm.reset();
      }, 1500);
      
      function showFormMessage(type, message) {
        const messageEl = document.createElement('div');
        messageEl.className = `alert alert-${type}`;
        messageEl.innerHTML = type === 'success' 
          ? `<i class="bi bi-check-circle-fill"></i> ${message}`
          : `<i class="bi bi-x-circle-fill"></i> ${message}`;
        
        const existingMessage = contactForm.querySelector('.alert');
        if (existingMessage) {
          existingMessage.remove();
        }
        
        contactForm.appendChild(messageEl);
        
        setTimeout(() => {
          messageEl.remove();
        }, 5000);
      }
    });
  }
}

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
// fetchGitHubStats removed: not defined in this file