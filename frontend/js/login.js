// Login JavaScript - Global Medical AI Library

// Global variables
let loginAttempts = 0;
const maxLoginAttempts = 5;

// Initialize Login Page
document.addEventListener('DOMContentLoaded', function() {
    initializeLogin();
    setupEventListeners();
    checkRememberedUser();
});

// Initialize Login Components
function initializeLogin() {
    // Initialize form validation
    setupFormValidation();
    
    // Initialize password strength indicator
    setupPasswordStrength();
    
    // Check for saved credentials
    checkSavedCredentials();
}

// Setup Event Listeners
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }

    // Password visibility toggle
    const passwordToggle = document.getElementById('passwordToggle');
    if (passwordToggle) {
        passwordToggle.addEventListener('click', togglePasswordVisibility);
    }

    // Remember me checkbox
    const rememberMe = document.getElementById('rememberMe');
    if (rememberMe) {
        rememberMe.addEventListener('change', handleRememberMe);
    }

    // Forgot password link
    const forgotPasswordLink = document.getElementById('forgotPassword');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', handleForgotPassword);
    }

    // Social login buttons
    setupSocialLogin();

    // Form field validation
    setupFieldValidation();
}

// Handle Login Form Submission
async function handleLoginSubmit(event) {
    event.preventDefault();
    
    if (loginAttempts >= maxLoginAttempts) {
        showAlert('Too many login attempts. Please try again later.', 'error');
        return;
    }

    const formData = new FormData(event.target);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password'),
        remember: formData.get('remember') === 'on'
    };

    // Validate form data
    if (!validateLoginForm(loginData)) {
        return;
    }

    try {
        showLoadingOverlay('Logging in...');
        
        // Call login API
        const response = await apiRequest('/api/auth/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        if (response.success) {
            // Store authentication token
            const token = response.data.token;
            localStorage.setItem('authToken', token);
            localStorage.setItem('userRole', response.data.user.role);
            localStorage.setItem('userId', response.data.user.id);
            
            // Store user data
            if (loginData.remember) {
                localStorage.setItem('rememberedEmail', loginData.email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            // Update global auth state
            window.authToken = token;
            window.currentUser = response.data.user;

            // Show success message
            showAlert('Login successful! Redirecting...', 'success');
            
            // Redirect based on user role
            setTimeout(() => {
                redirectAfterLogin(response.data.user.role);
            }, 1500);

        } else {
            loginAttempts++;
            showAlert(response.message || 'Login failed. Please check your credentials.', 'error');
        }

    } catch (error) {
        console.error('Login error:', error);
        loginAttempts++;
        showAlert('Network error. Please try again.', 'error');
    } finally {
        hideLoadingOverlay();
    }
}

// Validate Login Form
function validateLoginForm(data) {
    const errors = [];

    if (!data.email || !data.email.trim()) {
        errors.push('Email is required');
    } else if (!isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }

    if (!data.password || !data.password.trim()) {
        errors.push('Password is required');
    } else if (data.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }

    if (errors.length > 0) {
        showAlert(errors.join('\n'), 'error');
        return false;
    }

    return true;
}

// Validate Email Format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Toggle Password Visibility
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordToggle.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        passwordInput.type = 'password';
        passwordToggle.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

// Handle Remember Me
function handleRememberMe(event) {
    const isChecked = event.target.checked;
    
    if (isChecked) {
        const emailInput = document.getElementById('email');
        if (emailInput.value) {
            localStorage.setItem('rememberedEmail', emailInput.value);
        }
    } else {
        localStorage.removeItem('rememberedEmail');
    }
}

// Check Saved Credentials
function checkSavedCredentials() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        const emailInput = document.getElementById('email');
        const rememberMe = document.getElementById('rememberMe');
        
        if (emailInput && rememberMe) {
            emailInput.value = rememberedEmail;
            rememberMe.checked = true;
        }
    }
}

// Handle Forgot Password
function handleForgotPassword(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();
    
    if (!email || !isValidEmail(email)) {
        showAlert('Please enter a valid email address to reset your password.', 'error');
        return;
    }

    // Show forgot password modal or redirect
    showForgotPasswordModal(email);
}

// Show Forgot Password Modal
function showForgotPasswordModal(email) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Reset Password</h3>
                <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <p>We'll send a password reset link to:</p>
                <p class="email-display">${email}</p>
                <button class="btn btn-primary" onclick="sendPasswordReset('${email}')">
                    Send Reset Link
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Send Password Reset
async function sendPasswordReset(email) {
    try {
        showLoadingOverlay('Sending reset link...');
        
        const response = await apiRequest('/api/auth/forgot-password/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (response.success) {
            showAlert('Password reset link sent to your email!', 'success');
            document.querySelector('.modal-overlay').remove();
        } else {
            showAlert(response.message || 'Failed to send reset link.', 'error');
        }

    } catch (error) {
        console.error('Password reset error:', error);
        showAlert('Network error. Please try again.', 'error');
    } finally {
        hideLoadingOverlay();
    }
}

// Setup Social Login
function setupSocialLogin() {
    const socialButtons = document.querySelectorAll('.social-login-btn');
    
    socialButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const provider = this.getAttribute('data-provider');
            handleSocialLogin(provider);
        });
    });
}

// Handle Social Login
function handleSocialLogin(provider) {
    showAlert(`Redirecting to ${provider} login...`, 'info');
    
    // In a real implementation, this would redirect to OAuth provider
    // For now, we'll simulate the process
    setTimeout(() => {
        showAlert(`${provider} login is not implemented yet. Please use email/password login.`, 'warning');
    }, 1000);
}

// Setup Form Validation
function setupFormValidation() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Validate Individual Field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    let isValid = true;
    let errorMessage = '';

    switch (fieldName) {
        case 'email':
            if (!value) {
                errorMessage = 'Email is required';
                isValid = false;
            } else if (!isValidEmail(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
            break;
            
        case 'password':
            if (!value) {
                errorMessage = 'Password is required';
                isValid = false;
            } else if (value.length < 6) {
                errorMessage = 'Password must be at least 6 characters long';
                isValid = false;
            }
            break;
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

// Show Field Error
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
    field.classList.add('error');
}

// Clear Field Error
function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.classList.remove('error');
}

// Setup Password Strength
function setupPasswordStrength() {
    const passwordInput = document.getElementById('password');
    if (!passwordInput) return;

    passwordInput.addEventListener('input', function() {
        const strength = calculatePasswordStrength(this.value);
        updatePasswordStrengthIndicator(strength);
    });
}

// Calculate Password Strength
function calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 2) return 'weak';
    if (score <= 3) return 'medium';
    return 'strong';
}

// Update Password Strength Indicator
function updatePasswordStrengthIndicator(strength) {
    const indicator = document.getElementById('passwordStrength');
    if (!indicator) return;

    const strengthText = {
        weak: 'Weak',
        medium: 'Medium',
        strong: 'Strong'
    };

    const strengthClass = {
        weak: 'strength-weak',
        medium: 'strength-medium',
        strong: 'strength-strong'
    };

    indicator.textContent = strengthText[strength];
    indicator.className = `password-strength ${strengthClass[strength]}`;
}

// Redirect After Login
function redirectAfterLogin(userRole) {
    let redirectUrl = '/dashboard.html';
    
    // Role-based redirects
    switch (userRole) {
        case 'doctor':
            redirectUrl = '/dashboard.html';
            break;
        case 'patient':
            redirectUrl = '/ai-tools.html';
            break;
        case 'lab':
            redirectUrl = '/reports.html';
            break;
        case 'admin':
            redirectUrl = '/dashboard.html';
            break;
        default:
            redirectUrl = '/dashboard.html';
    }
    
    window.location.href = redirectUrl;
}

// Setup Field Validation
function setupFieldValidation() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    // Real-time validation
    const inputs = form.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                clearFieldError(this);
            }
        });
    });
}

// Check Remembered User
function checkRememberedUser() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
        const emailInput = document.getElementById('email');
        const rememberMe = document.getElementById('rememberMe');
        
        if (emailInput && rememberMe) {
            emailInput.value = rememberedEmail;
            rememberMe.checked = true;
        }
    }
}
