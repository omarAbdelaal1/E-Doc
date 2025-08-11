// Dashboard JavaScript Functionality

document.addEventListener("DOMContentLoaded", function () {
  // Initialize dashboard functionality
  initializeDashboard();

  // Initialize AI Chat functionality
  initializeAIChat();

  // Initialize form submissions
  initializeForms();

  // Initialize interactive elements
  initializeInteractiveElements();

  // Initialize mobile menu functionality
  initializeMobileMenu();
});

function initializeDashboard() {
  // Update current date and time
  updateDateTime();
  setInterval(updateDateTime, 60000); // Update every minute

  // Initialize charts placeholders
  initializeCharts();

  // Initialize search functionality
  initializeSearch();
}

function updateDateTime() {
  const now = new Date();
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const timeOptions = { hour: "2-digit", minute: "2-digit" };

  const dateString = now.toLocaleDateString("en-US", dateOptions);
  const timeString = now.toLocaleTimeString("en-US", timeOptions);

  // Update any date/time displays on the page
  const dateElements = document.querySelectorAll(".current-date");
  const timeElements = document.querySelectorAll(".current-time");

  dateElements.forEach((el) => (el.textContent = dateString));
  timeElements.forEach((el) => (el.textContent = timeString));
}

function initializeCharts() {
  // Placeholder for chart initialization
  // In a real application, you would use Chart.js, D3.js, or similar library

  const chartPlaceholders = document.querySelectorAll(".chart-placeholder");
  chartPlaceholders.forEach((placeholder) => {
    placeholder.innerHTML = `
            <div style="text-align: center; color: var(--text-muted);">
                <i class="fas fa-chart-line" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                <p>Chart will be displayed here</p>
                <small>Connect to your data source to view analytics</small>
            </div>
        `;
  });
}

function initializeSearch() {
  const searchInputs = document.querySelectorAll(".search-box input");

  searchInputs.forEach((input) => {
    input.addEventListener("input", function (e) {
      const searchTerm = e.target.value.toLowerCase();
      const table = e.target.closest(".search-box").nextElementSibling;

      if (table && table.classList.contains("patients-table")) {
        filterTable(table, searchTerm);
      }
    });
  });
}

function filterTable(table, searchTerm) {
  const rows = table.querySelectorAll("tbody tr");

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    if (text.includes(searchTerm)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}

function initializeAIChat() {
  const chatInput = document.querySelector(".chat-input input");
  const chatButton = document.querySelector(".chat-input button");
  const chatMessages = document.querySelector(".chat-messages");

  if (chatInput && chatButton && chatMessages) {
    // Send message on button click
    chatButton.addEventListener("click", sendMessage);

    // Send message on Enter key
    chatInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        sendMessage();
      }
    });

    // Add welcome message
    addMessage(
      "assistant",
      "Hello! I'm your AI medical assistant. How can I help you today?"
    );
  }
}

function sendMessage() {
  const chatInput = document.querySelector(".chat-input input");
  const message = chatInput.value.trim();

  if (message) {
    // Add user message
    addMessage("user", message);

    // Clear input
    chatInput.value = "";

    // Simulate AI response (in real app, this would call an API)
    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      addMessage("assistant", aiResponse);
    }, 1000);
  }
}

function addMessage(sender, text) {
  const chatMessages = document.querySelector(".chat-messages");
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;

  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.innerHTML =
    sender === "user"
      ? '<i class="fas fa-user"></i>'
      : '<i class="fas fa-robot"></i>';

  const content = document.createElement("div");
  content.className = "message-content";
  content.innerHTML = `<p>${text}</p>`;

  messageDiv.appendChild(avatar);
  messageDiv.appendChild(content);

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateAIResponse(userMessage) {
  // Simple response generation (in real app, this would be more sophisticated)
  const responses = [
    "I understand your question about that medical topic. Let me provide you with some information...",
    "Based on the symptoms you've described, I recommend consulting with a healthcare professional for proper diagnosis.",
    "That's an interesting medical case. Here are some considerations to discuss with your medical team...",
    "I can help you with that medical information. Let me break it down for you...",
    "For that type of medical analysis, I'd suggest reviewing the latest clinical guidelines and consulting with specialists.",
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

function initializeForms() {
  // Report generation form
  const reportForm = document.querySelector(".report-form");
  if (reportForm) {
    reportForm.addEventListener("submit", handleReportSubmission);
  }

  // Template selection
  const templateCards = document.querySelectorAll(".template-card");
  templateCards.forEach((card) => {
    card.addEventListener("click", function () {
      // Remove previous selection
      templateCards.forEach((c) => c.classList.remove("selected"));
      // Add selection to clicked card
      this.classList.add("selected");
    });
  });

  // File upload simulation
  const uploadArea = document.querySelector(".report-upload-area");
  if (uploadArea) {
    uploadArea.addEventListener("click", function () {
      // Simulate file selection
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".pdf,.doc,.docx,.jpg,.png,.dcm";
      input.onchange = function (e) {
        if (e.target.files.length > 0) {
          handleFileUpload(e.target.files[0]);
        }
      };
      input.click();
    });
  }
}

function handleReportSubmission(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  // Validate form
  if (!data.patientName || !data.reportType) {
    showNotification("Please fill in all required fields", "error");
    return;
  }

  // Simulate report generation
  showNotification("Generating report...", "info");

  setTimeout(() => {
    showNotification("Report generated successfully!", "success");
    // Reset form
    e.target.reset();
    // Remove template selection
    document.querySelectorAll(".template-card").forEach((card) => {
      card.classList.remove("selected");
    });
  }, 3000);
}

function handleFileUpload(file) {
  const uploadArea = document.querySelector(".report-upload-area");
  const uploadText = uploadArea.querySelector(".upload-text");

  // Show file info
  uploadText.innerHTML = `
        <h3>File Selected: ${file.name}</h3>
        <p>Size: ${(file.size / 1024 / 1024).toFixed(2)} MB</p>
        <p>Type: ${file.type || "Unknown"}</p>
    `;

  // Change upload area style
  uploadArea.style.borderColor = "var(--success)";
  uploadArea.style.background = "var(--bg-tertiary)";

  showNotification(`File "${file.name}" uploaded successfully`, "success");
}

function initializeInteractiveElements() {
  // Appointment actions
  const actionButtons = document.querySelectorAll(".action-btn");
  actionButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const action = this.classList.contains("edit") ? "edit" : "cancel";
      const appointmentInfo = this.closest(".appointment-card").querySelector(
        ".appointment-info h4"
      ).textContent;

      if (action === "edit") {
        showNotification(`Editing appointment: ${appointmentInfo}`, "info");
      } else {
        if (confirm(`Are you sure you want to cancel: ${appointmentInfo}?`)) {
          showNotification(
            `Appointment cancelled: ${appointmentInfo}`,
            "success"
          );
          this.closest(".appointment-card").remove();
        }
      }
    });
  });

  // Team member actions
  const memberActionButtons = document.querySelectorAll(".member-action-btn");
  memberActionButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const action = this.classList.contains("edit") ? "edit" : "remove";
      const memberName =
        this.closest(".team-member-card").querySelector(
          ".member-info h4"
        ).textContent;

      if (action === "edit") {
        showNotification(`Editing team member: ${memberName}`, "info");
      } else {
        if (
          confirm(
            `Are you sure you want to remove ${memberName} from the team?`
          )
        ) {
          showNotification(`Team member removed: ${memberName}`, "success");
          this.closest(".team-member-card").remove();
        }
      }
    });
  });

  // Quick action buttons
  const quickActionButtons = document.querySelectorAll(".quick-action-btn");
  quickActionButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const targetSection = this.getAttribute("href");
      if (targetSection.startsWith("#")) {
        e.preventDefault();
        scrollToSection(targetSection);
      }
    });
  });
}

function scrollToSection(sectionId) {
  const section = document.querySelector(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
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

function getNotificationIcon(type) {
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

// Add CSS animations
const style = document.createElement("style");
style.textContent = `
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
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(style);

function initializeMobileMenu() {
  const mobileToggle = document.querySelector(".dashboard-mobile-toggle");
  const sidebar = document.querySelector(".dashboard-sidebar");
  const overlay = document.querySelector(".dashboard-overlay");

  console.log("Mobile menu elements found:", {
    mobileToggle,
    sidebar,
    overlay,
  });

  if (mobileToggle && sidebar && overlay) {
    // Toggle sidebar when mobile toggle is clicked
    mobileToggle.addEventListener("click", function () {
      console.log("Mobile toggle clicked");
      sidebar.classList.toggle("active");
      overlay.classList.toggle("active");
      document.body.style.overflow = sidebar.classList.contains("active")
        ? "hidden"
        : "";
      console.log("Sidebar active:", sidebar.classList.contains("active"));
    });

    // Close sidebar when overlay is clicked
    overlay.addEventListener("click", function () {
      console.log("Overlay clicked");
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    });

    // Close sidebar when clicking on a nav link (mobile)
    const navLinks = document.querySelectorAll(".dashboard-nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 1024) {
          sidebar.classList.remove("active");
          overlay.classList.remove("active");
          document.body.style.overflow = "";
        }
      });
    });

    // Close sidebar on window resize if screen becomes larger
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1024) {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
        document.body.style.overflow = "";
      }
    });

    console.log("Mobile menu initialized successfully");
  } else {
    console.error("Mobile menu elements not found:", {
      mobileToggle,
      sidebar,
      overlay,
    });
  }
}
