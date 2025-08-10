// Signup JavaScript - Global Medical AI Library

// Global variables
let passwordStrength = 'weak';
let termsAccepted = false;

// Initialize Signup Page
document.addEventListener('DOMContentLoaded', function() {
    initializeSignup();
    setupEventListeners();
    setupPasswordValidation();
});

// Initialize Signup Components
function initializeSignup() {
    // Initialize form validation
    setupFormValidation();
    
    // Initialize password strength indicator
    setupPasswordStrengthIndicator();
    
    // Initialize role selection
    setupRoleSelection();
    
    // Initialize terms acceptance
    setupTermsAcceptance();
}

// Setup Event Listeners
function setupEventListeners() {
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignupSubmit);
    }

    // Password visibility toggle
    const passwordToggle = document.getElementById('passwordToggle');
    if (passwordToggle) {
        passwordToggle.addEventListener('click', togglePasswordVisibility);
    }

    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
    if (confirmPasswordToggle) {
        confirmPasswordToggle.addEventListener('click', toggleConfirmPasswordVisibility);
    }

    // Role selection
    const roleSelect = document.getElementById('roleSelect');
    if (roleSelect) {
        roleSelect.addEventListener('change', handleRoleChange);
    }

    // Terms and conditions
    const termsCheckbox = document.getElementById('termsCheckbox');
    if (termsCheckbox) {
        termsCheckbox.addEventListener('change', handleTermsAcceptance);
    }

    // Form field validation
    setupFieldValidation();
}

// Handle Signup Form Submission
async function handleSignupSubmit(event) {
    event.preventDefault();
    
    if (!termsAccepted) {
        showAlert('Please accept the terms and conditions to continue.', 'error');
        return;
    }

    const formData = new FormData(event.target);
    const signupData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        role: formData.get('role'),
        phone: formData.get('phone'),
        dateOfBirth: formData.get('dateOfBirth'),
        specialization: formData.get('specialization') || null,
        licenseNumber: formData.get('licenseNumber') || null,
        organization: formData.get('organization') || null
    };

    // Validate form data
    if (!validateSignupForm(signupData)) {
        return;
    }

    try {
        showLoadingOverlay('Creating your account...');
        
        // Call signup API
        const response = await apiRequest('/api/auth/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signupData)
        });

        if (response.success) {
            // Show success message
            showAlert('Account created successfully! Please check your email for verification.', 'success');
            
            // Clear form
            event.target.reset();
            
            // Redirect to login page after delay
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 2000);

        } else {
            showAlert(response.message || 'Registration failed. Please try again.', 'error');
        }

    } catch (error) {
        console.error('Signup error:', error);
        showAlert('Network error. Please try again.', 'error');
    } finally {
        hideLoadingOverlay();
    }
}

// Validate Signup Form
function validateSignupForm(data) {
    const errors = [];

    // Basic validation
    if (!data.firstName || !data.firstName.trim()) {
        errors.push('First name is required');
    } else if (data.firstName.length < 2) {
        errors.push('First name must be at least 2 characters long');
    }

    if (!data.lastName || !data.lastName.trim()) {
        errors.push('Last name is required');
    } else if (data.lastName.length < 2) {
        errors.push('Last name must be at least 2 characters long');
    }

    if (!data.email || !data.email.trim()) {
        errors.push('Email is required');
    } else if (!isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }

    if (!data.password || !data.password.trim()) {
        errors.push('Password is required');
    } else if (data.password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    } else if (passwordStrength === 'weak') {
        errors.push('Password is too weak. Please choose a stronger password.');
    }

    if (!data.confirmPassword || !data.confirmPassword.trim()) {
        errors.push('Please confirm your password');
    } else if (data.password !== data.confirmPassword) {
        errors.push('Passwords do not match');
    }

    if (!data.role || data.role === '') {
        errors.push('Please select a role');
    }

    if (!data.phone || !data.phone.trim()) {
        errors.push('Phone number is required');
    } else if (!isValidPhone(data.phone)) {
        errors.push('Please enter a valid phone number');
    }

    if (!data.dateOfBirth || !data.dateOfBirth.trim()) {
        errors.push('Date of birth is required');
    } else if (!isValidDate(data.dateOfBirth)) {
        errors.push('Please enter a valid date of birth');
    }

    // Role-specific validation
    if (data.role === 'doctor') {
        if (!data.specialization || !data.specialization.trim()) {
            errors.push('Specialization is required for doctors');
        }
        if (!data.licenseNumber || !data.licenseNumber.trim()) {
            errors.push('Medical license number is required for doctors');
        }
    }

    if (data.role === 'lab') {
        if (!data.organization || !data.organization.trim()) {
            errors.push('Organization name is required for lab technicians');
        }
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

// Validate Phone Format
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Validate Date Format
function isValidDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
        return false;
    }
    
    // Check if date is not in the future
    if (date > today) {
        return false;
    }
    
    // Check if date is not too far in the past (e.g., 150 years ago)
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 150);
    
    if (date < minDate) {
        return false;
    }
    
    return true;
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

// Toggle Confirm Password Visibility
function toggleConfirmPasswordVisibility() {
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
    
    if (confirmPasswordInput.type === 'password') {
        confirmPasswordInput.type = 'text';
        confirmPasswordToggle.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        confirmPasswordInput.type = 'password';
        confirmPasswordToggle.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

// Handle Role Change
function handleRoleChange(event) {
    const selectedRole = event.target.value;
    toggleRoleSpecificFields(selectedRole);
}

// Toggle Role-Specific Fields
function toggleRoleSpecificFields(role) {
    const doctorFields = document.getElementById('doctorFields');
    const labFields = document.getElementById('labFields');
    
    // Hide all role-specific fields first
    if (doctorFields) doctorFields.style.display = 'none';
    if (labFields) labFields.style.display = 'none';
    
    // Show fields based on selected role
    switch (role) {
        case 'doctor':
            if (doctorFields) doctorFields.style.display = 'block';
            break;
        case 'lab':
            if (labFields) labFields.style.display = 'block';
            break;
    }
}

// Handle Terms Acceptance
function handleTermsAcceptance(event) {
    termsAccepted = event.target.checked;
    updateSignupButton();
}

// Update Signup Button State
function updateSignupButton() {
    const signupBtn = document.getElementById('signupBtn');
    if (signupBtn) {
        signupBtn.disabled = !termsAccepted;
    }
}

// Setup Role Selection
function setupRoleSelection() {
    const roleSelect = document.getElementById('roleSelect');
    if (roleSelect) {
        // Set default role
        roleSelect.value = 'patient';
        toggleRoleSpecificFields('patient');
    }
}

// Setup Terms Acceptance
function setupTermsAcceptance() {
    const termsCheckbox = document.getElementById('termsCheckbox');
    if (termsCheckbox) {
        termsCheckbox.checked = false;
        termsAccepted = false;
        updateSignupButton();
    }
}

// Setup Password Strength Indicator
function setupPasswordStrengthIndicator() {
    const passwordInput = document.getElementById('password');
    if (!passwordInput) return;

    passwordInput.addEventListener('input', function() {
        const strength = calculatePasswordStrength(this.value);
        passwordStrength = strength;
        updatePasswordStrengthIndicator(strength);
    });
}

// Calculate Password Strength
function calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
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

    const strengthDescription = {
        weak: 'Add numbers, symbols, and mixed case',
        medium: 'Good password strength',
        strong: 'Excellent password strength'
    };

    indicator.textContent = strengthText[strength];
    indicator.className = `password-strength ${strengthClass[strength]}`;
    
    // Update description if available
    const description = document.getElementById('passwordDescription');
    if (description) {
        description.textContent = strengthDescription[strength];
    }
}

// Setup Form Validation
function setupFormValidation() {
    const form = document.getElementById('signupForm');
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
        case 'firstName':
            if (!value) {
                errorMessage = 'First name is required';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'First name must be at least 2 characters long';
                isValid = false;
            }
            break;
            
        case 'lastName':
            if (!value) {
                errorMessage = 'Last name is required';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Last name must be at least 2 characters long';
                isValid = false;
            }
            break;
            
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
            } else if (value.length < 8) {
                errorMessage = 'Password must be at least 8 characters long';
                isValid = false;
            } else if (passwordStrength === 'weak') {
                errorMessage = 'Password is too weak';
                isValid = false;
            }
            break;
            
        case 'confirmPassword':
            const password = document.getElementById('password').value;
            if (!value) {
                errorMessage = 'Please confirm your password';
                isValid = false;
            } else if (value !== password) {
                errorMessage = 'Passwords do not match';
                isValid = false;
            }
            break;
            
        case 'phone':
            if (!value) {
                errorMessage = 'Phone number is required';
                isValid = false;
            } else if (!isValidPhone(value)) {
                errorMessage = 'Please enter a valid phone number';
                isValid = false;
            }
            break;
            
        case 'dateOfBirth':
            if (!value) {
                errorMessage = 'Date of birth is required';
                isValid = false;
            } else if (!isValidDate(value)) {
                errorMessage = 'Please enter a valid date of birth';
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

// Setup Field Validation
function setupFieldValidation() {
    const form = document.getElementById('signupForm');
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

// Setup Password Validation
function setupPasswordValidation() {
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (passwordInput && confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            const password = passwordInput.value;
            const confirmPassword = this.value;
            
            if (confirmPassword && password !== confirmPassword) {
                showFieldError(this, 'Passwords do not match');
            } else {
                clearFieldError(this);
            }
        });
    }
}
