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
  initDetailPageNavigation();
  
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

// Contact form functionality
// ======= CONFIGURAÇÃO =======
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxsisjvxNTJYM3Mo9mRSL0SFWrlB8k24fVPFZv4aeeGOttE95RlJagMokY0gEiKukee4g/exec";
// ======= FORMULÁRIO DE CONTACTO =======
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Obter dados do formulário
      const formData = new FormData(contactForm);
      const formValues = Object.fromEntries(formData.entries());
      
      // Validação simples
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
      
      // Mostrar estado de envio
      const submitBtn = contactForm.querySelector('[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="bi bi-arrow-clockwise"></i> A enviar...';
      
      try {
        // Enviar dados para o Apps Script
        const response = await fetch(SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues)
        });

        // Interpretar resposta
        const result = await response.json();

        if (result.status === "OK") {
          showFormMessage('success', 'Mensagem enviada com sucesso! Obrigado pelo contacto.');
          contactForm.reset();
        } else {
          showFormMessage('error', 'Erro ao enviar: ' + result.message);
        }

      } catch (error) {
        console.error('Erro ao enviar para o Apps Script:', error);
        showFormMessage('error', 'Ocorreu um erro. Tente novamente mais tarde.');
      } finally {
        // Restaurar botão
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }

      // Função auxiliar para mensagens
      function showFormMessage(type, message) {
        const messageEl = document.createElement('div');
        messageEl.className = `alert alert-${type}`;
        messageEl.innerHTML = type === 'success' 
          ? `<i class="bi bi-check-circle-fill"></i> ${message}`
          : `<i class="bi bi-x-circle-fill"></i> ${message}`;
        
        const existingMessage = contactForm.querySelector('.alert');
        if (existingMessage) existingMessage.remove();
        
        contactForm.appendChild(messageEl);
        
        setTimeout(() => {
          messageEl.remove();
        }, 5000);
      }
    });
  }
}

// Inicializar o formulário ao carregar a página
document.addEventListener('DOMContentLoaded', initContactForm);


// Decorative particles effect
function initParticlesEffect() {
  const particlesContainer = document.querySelector('.particles-container');
  
  if (!particlesContainer) return;
  
  // Create particles
  for (let i = 0; i < 80; i++) {
    createParticle();
  }
  
  function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    
    // Random size
    const size = Math.random() * 10 + 1;
    
    // Random opacity
    const opacity = Math.random() * 0.5 + 0.1;
    
    // Random animation duration
    const duration = Math.random() * 8 + 5;
    
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

async function fetchGitHubStats(owner, repo) {
  const commitsRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits`
  );
  const commits = await commitsRes.json();

  const issuesRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues?state=closed`
  );
  const issues = await issuesRes.json();

  const releasesRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/releases`
  );
  const releases = await releasesRes.json();

  document.getElementById("commits").dataset.target = commits.length;
  document.getElementById("issues").dataset.target = issues.length;
  document.getElementById("releases").dataset.target = releases.length;

  animateCounters();
}

function animateCounters() {
  const counters = document.querySelectorAll(".counter");
  counters.forEach((counter) => {
    const updateCount = () => {
      const target = +counter.dataset.target;
      const current = +counter.innerText;
      const increment = target / (counter.dataset.duration / 50);
      if (current < target) {
        counter.innerText = Math.ceil(current + increment);
        setTimeout(updateCount, 50);
      } else {
        counter.innerText = target;
      }
    };
    updateCount();
  });
}

fetchGitHubStats("Paul-Y5", "SPORTSLINK");