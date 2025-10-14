/* MODERN SCRIPTS - IntelligentLogistics Theme
   Modern interactive effects, animations and functionality
*/

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initNavbar();
  initScrollEffects();
  initCounters();
  initCopyButtons();
  initPrivateAccess();
  initContactForm();
  initParticlesEffect();
  
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
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
  
  // Active link highlighting based on scroll position
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.add('active');
      } else {
        document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.remove('active');
      }
    });
  });
}

// Scroll animations and effects
function initScrollEffects() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  // Set initial state for animation
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    if (el.classList.contains('fade-in')) {
      el.style.transform = 'translateY(20px)';
    } else if (el.classList.contains('fade-in-left')) {
      el.style.transform = 'translateX(-20px)';
    } else if (el.classList.contains('fade-in-right')) {
      el.style.transform = 'translateX(20px)';
    }
  });
  
  // Animate elements when scrolled into view
  window.addEventListener('scroll', animateOnScroll);
}

function animateOnScroll() {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  animatedElements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    const elementVisible = 150;
    
    if (elementTop < window.innerHeight - elementVisible) {
      el.style.opacity = '1';
      el.style.transform = 'translate(0)';
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

// Private access functionality
function initPrivateAccess() {
  const requestAccessBtn = document.getElementById('request-access-btn');
  const privatePanel = document.getElementById('private-panel');
  
  if (requestAccessBtn) {
    requestAccessBtn.addEventListener('click', () => {
      // Email request for access
      const supervisorEmail = 'supervisor@example.com';
      const instructorEmail = 'instructor@example.com';
      const subject = 'Pedido de Acesso - Intelligent Logistics';
      const body = 'Olá,\n\nGostaria de solicitar acesso à área privada do projeto Intelligent Logistics.\n\nCumprimentos,\n[Seu Nome]';
      
      window.location.href = `mailto:${supervisorEmail},${instructorEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Show message to user that email request was initiated
      if (privatePanel) {
        const infoMsg = document.createElement('div');
        infoMsg.className = 'alert alert-info';
        infoMsg.innerHTML = '<i class="bi bi-info-circle-fill"></i> Um email de pedido de acesso será aberto no seu cliente de email. Por favor complete os detalhes e envie-o para solicitar acesso à área privada.';
        
        const controlsContainer = requestAccessBtn.closest('.private-controls');
        if (controlsContainer) {
          // Remove any existing messages first
          const existingAlert = controlsContainer.querySelector('.alert');
          if (existingAlert) {
            existingAlert.remove();
          }
          
          controlsContainer.appendChild(infoMsg);
          
          setTimeout(() => {
            infoMsg.remove();
          }, 5000);
        }
      }
    });
  }
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