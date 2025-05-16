// Utility function to add animation classes with delay
export const animateElement = (element, animationClass, delay = 0) => {
  if (!element) return;
  
  setTimeout(() => {
    element.classList.add(animationClass);
  }, delay);
};

// Animate elements as they scroll into view
export const setupScrollAnimations = () => {
  const animateOnScroll = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const animation = element.dataset.animation || 'animate-fade-in';
        const delay = parseInt(element.dataset.delay || '0', 10);
        
        animateElement(element, animation, delay);
        observer.unobserve(element);
      }
    });
  };
  
  const observer = new IntersectionObserver(animateOnScroll, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  });
  
  document.querySelectorAll('[data-animate="true"]').forEach(element => {
    observer.observe(element);
    // Hide the element initially
    element.style.opacity = '0';
  });
};

// Animate numbers counting up
export const animateCounters = () => {
  const counters = document.querySelectorAll('[data-counter]');
  
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target || '0', 10);
    const duration = parseInt(counter.dataset.duration || '1000', 10);
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateCounter();
          counterObserver.unobserve(entry.target);
        }
      });
    });
    
    counterObserver.observe(counter);
  });
};

// Parallax effect for backgrounds
export const setupParallax = () => {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  const handleScroll = () => {
    const scrollY = window.scrollY;
    
    parallaxElements.forEach(element => {
      const speed = parseFloat(element.dataset.speed || '0.1');
      const offset = scrollY * speed;
      element.style.transform = `translateY(${offset}px)`;
    });
  };
  
  window.addEventListener('scroll', handleScroll);
};

// Smooth scroll to anchors
export const setupSmoothScroll = () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      
      window.scrollTo({
        top: target.offsetTop,
        behavior: 'smooth'
      });
    });
  });
};

// Toast notifications
export const showToast = (message, type = 'info', duration = 3000) => {
  // Create toast container if it doesn't exist
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
    
    // Add styles to container
    Object.assign(toastContainer.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: '1000',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    });
  }
  
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type} animate-slide-in-right`;
  toast.innerText = message;
  
  // Style toast
  Object.assign(toast.style, {
    padding: '12px 16px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    opacity: '0',
    transition: 'all 0.3s ease'
  });
  
  // Set background color based on type
  const colors = {
    info: '#eff6ff',
    success: '#ecfdf5',
    warning: '#fffbeb',
    error: '#fef2f2'
  };
  
  const textColors = {
    info: '#1e3a8a',
    success: '#065f46',
    warning: '#92400e',
    error: '#991b1b'
  };
  
  toast.style.backgroundColor = colors[type] || colors.info;
  toast.style.color = textColors[type] || textColors.info;
  
  // Add to container
  toastContainer.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.style.opacity = '1';
  }, 10);
  
  // Remove after duration
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 300);
  }, duration);
  
  return toast;
};

// Typewriter effect
export const typewriter = (element, text, speed = 50) => {
  if (!element) return;
  
  let i = 0;
  element.textContent = '';
  
  const type = () => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  };
  
  type();
};

// Initialize all animations
export const initializeAnimations = () => {
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupOnLoad);
  } else {
    setupOnLoad();
  }
  
  function setupOnLoad() {
    setupScrollAnimations();
    animateCounters();
    setupParallax();
    setupSmoothScroll();
    
    // Animate elements that are visible on page load
    document.querySelectorAll('[data-animate="true"][data-onload="true"]').forEach(element => {
      const animation = element.dataset.animation || 'animate-fade-in';
      const delay = parseInt(element.dataset.delay || '0', 10);
      animateElement(element, animation, delay);
    });
  }
}; 