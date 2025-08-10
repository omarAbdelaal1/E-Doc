// Global Medical AI Library - Main JavaScript

// Global variables
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    setupNavigation();
    setupMobileMenu();
    setupPasswordToggles();
    setupPasswordStrength();
    checkAuthStatus();
    setupGlobalEventListeners();
}

// Navigation Setup
function setupNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}

// Mobile Menu Setup
function setupMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('show');
            }
        });
    }
}

// Password Toggle Setup
function setupPasswordToggles() {
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// Password Strength Setup
function setupPasswordStrength() {
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            checkPasswordStrength(this.value);
        });
    }
}

// Check Password Strength
function checkPasswordStrength(password) {
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!strengthFill || !strengthText) return;
    
    let strength = 0;
    let feedback = '';
    
    // Length check
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    
    // Character variety checks
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    // Cap at 100%
    strength = Math.min(strength, 100);
    
    // Update UI
    strengthFill.className = 'strength-fill';
    if (strength <= 25) {
        strengthFill.classList.add('weak');
        feedback = 'Weak password';
    } else if (strength <= 50) {
        strengthFill.classList.add('fair');
        feedback = 'Fair password';
    } else if (strength <= 75) {
        strengthFill.classList.add('good');
        feedback = 'Good password';
    } else {
        strengthFill.classList.add('strong');
        feedback = 'Strong password';
    }
    
    strengthText.textContent = feedback;
}

// Authentication Status Check
function checkAuthStatus() {
    if (authToken) {
        // Validate token with backend
        validateToken(authToken);
    } else {
        updateUIForUnauthenticatedUser();
    }
}

// Validate Token
async function validateToken(token) {
    try {
        const response = await fetch('/api/auth/validate/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const userData = await response.json();
            currentUser = userData;
            updateUIForAuthenticatedUser(userData);
        } else {
            // Token invalid, clear it
            localStorage.removeItem('authToken');
            authToken = null;
            updateUIForUnauthenticatedUser();
        }
    } catch (error) {
        console.error('Token validation error:', error);
        localStorage.removeItem('authToken');
        authToken = null;
        updateUIForUnauthenticatedUser();
    }
}

// Update UI for Authenticated User
function updateUIForAuthenticatedUser(user) {
    const authLinks = document.querySelectorAll('.auth-links');
    const userMenu = document.querySelector('.user-menu');
    
    authLinks.forEach(link => link.style.display = 'none');
    if (userMenu) userMenu.style.display = 'block';
    
    // Update user info in header
    const userNameElement = document.querySelector('.user-name');
    if (userNameElement) {
        userNameElement.textContent = user.name || user.email;
    }
    
    // Show role-specific features
    showRoleSpecificFeatures(user.role);
}

// Update UI for Unauthenticated User
function updateUIForUnauthenticatedUser() {
    const authLinks = document.querySelectorAll('.auth-links');
    const userMenu = document.querySelector('.user-menu');
    
    authLinks.forEach(link => link.style.display = 'block');
    if (userMenu) userMenu.style.display = 'none';
    
    // Hide role-specific features
    hideRoleSpecificFeatures();
}

// Show Role-Specific Features
function showRoleSpecificFeatures(role) {
    const roleElements = document.querySelectorAll(`[data-role="${role}"]`);
    roleElements.forEach(element => {
        element.style.display = 'block';
    });
}

// Hide Role-Specific Features
function hideRoleSpecificFeatures() {
    const roleElements = document.querySelectorAll('[data-role]');
    roleElements.forEach(element => {
        element.style.display = 'none';
    });
}

// Global Event Listeners
function setupGlobalEventListeners() {
    // Handle logout
    document.addEventListener('click', function(e) {
        if (e.target.matches('.logout-btn')) {
            e.preventDefault();
            logout();
        }
    });
    
    // Handle form submissions
    document.addEventListener('submit', function(e) {
        if (e.target.matches('form')) {
            handleFormSubmission(e);
        }
    });
}

// Handle Form Submission
function handleFormSubmission(e) {
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Processing...';
    }
    
    // Re-enable button after a delay (forms will handle their own submission)
    setTimeout(() => {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = submitBtn.getAttribute('data-original-text') || 'Submit';
        }
    }, 5000);
}

// Logout Function
function logout() {
    localStorage.removeItem('authToken');
    authToken = null;
    currentUser = null;
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Show Loading Overlay
function showLoadingOverlay(message = 'Loading...') {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
        <div class="loading-modal">
            <div class="loading-spinner"></div>
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
}

// Hide Loading Overlay
function hideLoadingOverlay(overlay) {
    if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
    }
}

// Show Alert
function showAlert(message, type = 'info', duration = 5000) {
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.className = 'alert-close';
    closeBtn.style.cssText = 'float: right; background: none; border: none; font-size: 1.5rem; cursor: pointer;';
    closeBtn.onclick = () => alert.remove();
    
    alert.appendChild(closeBtn);
    
    // Insert at top of page
    const container = document.querySelector('.container') || document.body;
    container.insertBefore(alert, container.firstChild);
    
    // Auto-remove after duration
    if (duration > 0) {
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, duration);
    }
    
    return alert;
}

// API Request Helper
async function apiRequest(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    // Add auth token if available
    if (authToken) {
        defaultOptions.headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };
    
    try {
        const response = await fetch(url, finalOptions);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// File Upload Helper
async function uploadFile(file, endpoint, onProgress = null) {
    const formData = new FormData();
    formData.append('file', file);
    
    const xhr = new XMLHttpRequest();
    
    return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
            if (onProgress && e.lengthComputable) {
                const percentComplete = (e.loaded / e.total) * 100;
                onProgress(percentComplete);
            }
        });
        
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response);
                } catch (error) {
                    reject(new Error('Invalid JSON response'));
                }
            } else {
                reject(new Error(`Upload failed with status: ${xhr.status}`));
            }
        });
        
        xhr.addEventListener('error', () => {
            reject(new Error('Upload failed'));
        });
        
        xhr.open('POST', endpoint);
        
        // Add auth token if available
        if (authToken) {
            xhr.setRequestHeader('Authorization', `Bearer ${authToken}`);
        }
        
        xhr.send(formData);
    });
}

// Utility Functions
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for use in other modules
window.MedicalAI = {
    apiRequest,
    uploadFile,
    showAlert,
    showLoadingOverlay,
    hideLoadingOverlay,
    formatDate,
    formatFileSize,
    debounce,
    throttle,
    logout,
    currentUser: () => currentUser,
    isAuthenticated: () => !!authToken
};
