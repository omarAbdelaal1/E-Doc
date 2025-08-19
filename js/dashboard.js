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

  // Initialize quick actions
  initializeQuickActions();

  // Initialize recent activities
  initializeRecentActivities();

  // Initialize appointments preview
  initializeAppointmentsPreview();
});

function initializeDashboard() {
  // Update current date and time
  updateDateTime();
  setInterval(updateDateTime, 60000); // Update every minute

  // Initialize charts placeholders
  initializeCharts();

  // Initialize search functionality
  initializeSearch();

  // Initialize stats with real-time updates
  initializeStats();
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
  }
}

function sendMessage() {
  const chatInput = document.querySelector(".chat-input input");
  const message = chatInput.value.trim();

  if (!message) return;

  // Add user message
  addChatMessage("user", message);

  // Clear input
  chatInput.value = "";

  // Simulate AI response
  setTimeout(() => {
    const aiResponse = generateAIResponse(message);
    addChatMessage("ai", aiResponse);
  }, 1000);
}

function addChatMessage(sender, message) {
  const chatMessages = document.querySelector(".chat-messages");
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}-message`;

  const icon = sender === "user" ? "fa-user-md" : "fa-robot";
  const timestamp = new Date().toLocaleTimeString();

  messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas ${icon}"></i>
        </div>
        <div class="message-content">
            <div class="message-text">${message}</div>
            <div class="message-time">${timestamp}</div>
        </div>
    `;

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateAIResponse(message) {
  const responses = [
    "I understand your question about medical procedures. Let me provide you with some information...",
    "Based on the symptoms you've described, here are some considerations...",
    "This is an interesting medical case. Let me analyze the information...",
    "I can help you with that medical query. Here's what I found...",
    "For this type of medical question, I recommend consulting the latest guidelines...",
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

function initializeForms() {
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      handleFormSubmission(this);
    });
  });
}

function handleFormSubmission(form) {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  // Simulate form processing
  console.log("Form submitted:", data);

  // Show success message
  showNotification("Form submitted successfully!", "success");

  // Reset form
  form.reset();
}

function initializeInteractiveElements() {
  // Initialize dropdowns
  initializeDropdowns();

  // Initialize modals
  initializeModals();

  // Initialize mobile menu
  initializeMobileMenu();
}

function initializeDropdowns() {
  const dropdowns = document.querySelectorAll(".dashboard-user-dropdown");

  dropdowns.forEach((dropdown) => {
    const button = dropdown.previousElementSibling;

    button.addEventListener("click", function (e) {
      e.stopPropagation();
      dropdown.classList.toggle("show");
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", function () {
    dropdowns.forEach((dropdown) => dropdown.classList.remove("show"));
  });
}

function initializeModals() {
  const modals = document.querySelectorAll(".modal");
  const closeButtons = document.querySelectorAll(".close");

  closeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const modal = this.closest(".modal");
      modal.style.display = "none";
    });
  });

  // Close modal when clicking outside
  window.addEventListener("click", function (event) {
    modals.forEach((modal) => {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  });
}

function initializeMobileMenu() {
  const mobileToggle = document.querySelector(".dashboard-mobile-toggle");
  const sidebar = document.querySelector(".dashboard-sidebar");
  const overlay = document.querySelector(".dashboard-overlay");

  // Only proceed if we're on a dashboard page
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener("click", function () {
      sidebar.classList.toggle("active");
      if (overlay) {
        overlay.classList.toggle("active");
      }
    });

    if (overlay) {
      overlay.addEventListener("click", function () {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
      });
    }

    document.addEventListener("click", function (e) {
      if (window.innerWidth <= 1024) {
        if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
          sidebar.classList.remove("active");
          if (overlay) {
            overlay.classList.remove("active");
          }
        }
      }
    });
  }
}

// Initialize Quick Actions
function initializeQuickActions() {
  // Setup quick action buttons
  const quickActionBtns = document.querySelectorAll(
    ".quick-actions .dashboard-btn"
  );

  quickActionBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const action = this.textContent.trim();
      handleQuickAction(action);
    });
  });
}

function handleQuickAction(action) {
  switch (action) {
    case "Generate Report":
      window.location.href = "ai-reports.html";
      break;
    case "New Appointment":
      window.location.href = "appointments.html";
      break;
    case "Add Patient":
      window.location.href = "patients.html";
      break;
    case "AI Assistant":
      window.location.href = "ai-chat.html";
      break;
    default:
      console.log("Quick action:", action);
  }
}

// Initialize Recent Activities
function initializeRecentActivities() {
  const activitiesContainer = document.getElementById("recent-activities");
  if (!activitiesContainer) return;

  // Load activities from localStorage or use default
  const activities = loadActivities();

  // Display activities
  displayActivities(activities);

  // Update activities periodically
  setInterval(() => {
    updateActivities();
  }, 30000); // Update every 30 seconds
}

function loadActivities() {
  const savedActivities = localStorage.getItem("edoc_recent_activities");
  if (savedActivities) {
    return JSON.parse(savedActivities);
  }

  // Default activities
  return [
    {
      type: "patient_checkin",
      text: "Patient Sarah Johnson checked in",
      time: "2 minutes ago",
      icon: "fa-user-check",
      priority: "high",
    },
    {
      type: "ai_report",
      text: "AI Report generated for Case #1234",
      time: "15 minutes ago",
      icon: "fa-file-medical",
      priority: "medium",
    },
    {
      type: "appointment",
      text: "Appointment scheduled for tomorrow",
      time: "1 hour ago",
      icon: "fa-calendar-check",
      priority: "medium",
    },
    {
      type: "patient_update",
      text: "Patient records updated for Michael Brown",
      time: "2 hours ago",
      icon: "fa-user-edit",
      priority: "low",
    },
    {
      type: "ai_model",
      text: "Diagnostic AI model updated to v2.1.3",
      time: "3 hours ago",
      icon: "fa-brain",
      priority: "low",
    },
  ];
}

function displayActivities(activities) {
  const container = document.getElementById("recent-activities");
  if (!container) return;

  container.innerHTML = "";

  activities.forEach((activity) => {
    const activityDiv = document.createElement("div");
    activityDiv.className = `activity-item ${activity.priority}`;
    activityDiv.innerHTML = `
            <div class="activity-icon">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-text">${activity.text}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `;

    // Add click handler for interactive activities
    if (activity.type === "ai_report") {
      activityDiv.addEventListener("click", () => {
        window.location.href = "ai-reports.html";
      });
    } else if (activity.type === "appointment") {
      activityDiv.addEventListener("click", () => {
        window.location.href = "appointments.html";
      });
    } else if (activity.type === "patient_checkin") {
      activityDiv.addEventListener("click", () => {
        window.location.href = "patients.html";
      });
    }

    container.appendChild(activityDiv);
  });
}

function updateActivities() {
  const activities = loadActivities();

  // Add new random activity occasionally
  if (Math.random() > 0.7) {
    const newActivity = generateRandomActivity();
    activities.unshift(newActivity);

    // Keep only last 10 activities
    if (activities.length > 10) {
      activities.pop();
    }

    // Save to localStorage
    localStorage.setItem("edoc_recent_activities", JSON.stringify(activities));

    // Update display
    displayActivities(activities);
  }
}

function generateRandomActivity() {
  const activityTypes = [
    {
      type: "ai_chat",
      text: "AI Chat session completed",
      icon: "fa-comments",
      priority: "medium",
    },
    {
      type: "patient_consultation",
      text: "Consultation completed for new patient",
      icon: "fa-stethoscope",
      priority: "high",
    },
    {
      type: "report_review",
      text: "Medical report reviewed and approved",
      icon: "fa-check-circle",
      priority: "medium",
    },
    {
      type: "team_meeting",
      text: "Team meeting scheduled for tomorrow",
      icon: "fa-users",
      priority: "low",
    },
  ];

  const randomType =
    activityTypes[Math.floor(Math.random() * activityTypes.length)];
  const timeOptions = [
    "5 minutes ago",
    "10 minutes ago",
    "20 minutes ago",
    "30 minutes ago",
  ];
  const randomTime =
    timeOptions[Math.floor(Math.random() * timeOptions.length)];

  return {
    ...randomType,
    time: randomTime,
  };
}

// Initialize Appointments Preview
function initializeAppointmentsPreview() {
  const appointmentsContainer = document.getElementById("appointments-preview");
  if (!appointmentsContainer) return;

  // Load appointments
  const appointments = loadAppointments();

  // Display appointments
  displayAppointmentsPreview(appointments);
}

function loadAppointments() {
  const savedAppointments = localStorage.getItem("edoc_appointments");
  if (savedAppointments) {
    return JSON.parse(savedAppointments);
  }

  // Default appointments
  return [
    {
      id: "APT001",
      patientName: "Sarah Johnson",
      type: "General Checkup",
      date: "Today",
      time: "2:00 PM",
      status: "confirmed",
    },
    {
      id: "APT002",
      patientName: "Michael Brown",
      type: "Follow-up",
      date: "Tomorrow",
      time: "10:00 AM",
      status: "confirmed",
    },
    {
      id: "APT003",
      patientName: "Emily Davis",
      type: "Consultation",
      date: "Tomorrow",
      time: "3:30 PM",
      status: "pending",
    },
  ];
}

function displayAppointmentsPreview(appointments) {
  const container = document.getElementById("appointments-preview");
  if (!container) return;

  container.innerHTML = "";

  appointments.slice(0, 3).forEach((appointment) => {
    const appointmentDiv = document.createElement("div");
    appointmentDiv.className = `appointment-preview-item ${appointment.status}`;
    appointmentDiv.innerHTML = `
            <div class="appointment-info">
                <h4>${appointment.patientName} - ${appointment.type}</h4>
                <p><i class="fas fa-clock"></i> ${appointment.date}, ${appointment.time}</p>
                <p><i class="fas fa-user"></i> Patient ID: ${appointment.id}</p>
            </div>
            <div class="appointment-status">
                <span class="status-badge ${appointment.status}">${appointment.status}</span>
            </div>
        `;

    // Add click handler
    appointmentDiv.addEventListener("click", () => {
      window.location.href = "appointments.html";
    });

    container.appendChild(appointmentDiv);
  });
}

// Initialize Stats
function initializeStats() {
  // Update stats periodically
  setInterval(() => {
    updateStats();
  }, 60000); // Update every minute
}

function updateStats() {
  // Simulate real-time stat updates
  const statNumbers = document.querySelectorAll(".stat-number");

  statNumbers.forEach((stat) => {
    const currentValue = parseInt(stat.textContent);
    const variation = Math.floor(Math.random() * 3) - 1; // ±1
    const newValue = Math.max(0, currentValue + variation);

    // Animate the change
    animateNumberChange(stat, currentValue, newValue);
  });
}

function animateNumberChange(element, from, to) {
  const duration = 1000;
  const start = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);

    const current = Math.floor(from + (to - from) * progress);
    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Utility Functions
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${
              type === "success"
                ? "check-circle"
                : type === "error"
                ? "exclamation-circle"
                : "info-circle"
            }"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;

  // Add to page
  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => notification.classList.add("show"), 100);

  // Auto-hide after 5 seconds
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 5000);

  // Close button functionality
  const closeBtn = notification.querySelector(".notification-close");
  closeBtn.addEventListener("click", () => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  });
}

// Export functions for global access
window.generateReport = function () {
  window.location.href = "ai-reports.html";
};

window.newAppointment = function () {
  window.location.href = "appointments.html";
};

window.addPatient = function () {
  window.location.href = "patients.html";
};

window.openAIChat = function () {
  window.location.href = "ai-chat.html";
};
