// Home Page JavaScript Functionality

document.addEventListener("DOMContentLoaded", function () {
  // Initialize home page functionality
  initializeHomePage();
});

function initializeHomePage() {
  // Initialize contact form
  initializeContactForm();

  // Initialize smooth scrolling for navigation
  initializeSmoothScrolling();

  // Initialize mobile menu toggle
  initializeMobileMenu();

  // Initialize AI models preview
  initializeAIModelsPreview();
}

function initializeContactForm() {
  const contactForm = document.querySelector(".contact-form form");
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmission);
  }
}

function handleContactSubmission(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  // Validate form
  if (!data.name || !data.email || !data.message) {
    showHomeNotification("Please fill in all required fields", "error");
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    showHomeNotification("Please enter a valid email address", "error");
    return;
  }

  // Simulate form submission
  showHomeNotification("Sending message...", "info");

  setTimeout(() => {
    showHomeNotification(
      "Message sent successfully! We'll get back to you soon.",
      "success"
    );
    // Reset form
    e.target.reset();
  }, 2000);
}

function initializeSmoothScrolling() {
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        // Update active navigation link
        updateActiveNavLink(this);
      }
    });
  });
}

function updateActiveNavLink(clickedLink) {
  // Remove active class from all nav links
  document.querySelectorAll("nav a").forEach((link) => {
    link.classList.remove("active");
  });

  // Add active class to clicked link
  clickedLink.classList.add("active");
}

function initializeMobileMenu() {
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const navMenu =
    document.querySelector("nav .nav-links") ||
    document.querySelector("nav .nav-menu");

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      this.classList.toggle("active");
    });

    // Close mobile menu when clicking on a link
    const mobileNavLinks = navMenu.querySelectorAll("a");
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", function () {
        navMenu.classList.remove("active");
        mobileMenuToggle.classList.remove("active");
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (e) {
      if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        navMenu.classList.remove("active");
        mobileMenuToggle.classList.remove("active");
      }
    });
  }
}

function initializeAIModelsPreview() {
  // Add hover effects and interactions for AI model cards
  const modelCards = document.querySelectorAll(".model-card");

  modelCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px)";
      this.style.boxShadow = "var(--shadow-xl)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "var(--shadow-md)";
    });

    // Add click effect for locked models
    card.addEventListener("click", function () {
      if (this.querySelector(".model-status.locked")) {
        showHomeNotification("Please sign in to access this AI model", "info");
      }
    });
  });
}

function showHomeNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `home-notification home-notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getHomeNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--${
          type === "error" ? "error" : type === "success" ? "success" : "info"
        });
        color: var(--text-light);
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;

  // Add close button functionality
  const closeBtn = notification.querySelector(".notification-close");
  closeBtn.addEventListener("click", () => {
    notification.remove();
  });

  // Add to page
  document.body.appendChild(notification);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}

function getHomeNotificationIcon(type) {
  switch (type) {
    case "success":
      return "check-circle";
    case "error":
      return "exclamation-circle";
    case "warning":
      return "exclamation-triangle";
    default:
      return "info-circle";
  }
}

// Add scroll-based animations
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  // Observe sections for animation
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => {
    observer.observe(section);
  });
}

// Initialize scroll animations when page loads
window.addEventListener("load", function () {
  initializeScrollAnimations();
});

// Add CSS animations
const homeStyle = document.createElement("style");
homeStyle.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .home-notification-close {
        background: none;
        border: none;
        color: inherit;
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    }
    
    .home-notification-close:hover {
        opacity: 0.8;
    }
    
    .section {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .section.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .model-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .feature-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .feature-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-lg);
    }
    
    .community-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .community-card:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-lg);
    }
`;
document.head.appendChild(homeStyle);
