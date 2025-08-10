// Global Medical AI Library - Authentication JavaScript

document.addEventListener('DOMContentLoaded', function() {
    setupAuthForms();
    setupSocialAuth();
});

// Setup Authentication Forms
function setupAuthForms() {
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

// Handle Signup
async function handleSignup(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Store original button text
    submitBtn.setAttribute('data-original-text', originalText);
    
    try {
        // Validate form
        if (!validateSignupForm(form)) {
            return;
        }
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Creating Account...';
        
        // Collect form data
        const formData = {
            firstName: form.querySelector('#firstName').value.trim(),
            lastName: form.querySelector('#lastName').value.trim(),
            email: form.querySelector('#email').value.trim().toLowerCase(),
            phone: form.querySelector('#phone').value.trim(),
            role: form.querySelector('#role').value,
            specialty: form.querySelector('#specialty').value,
            institution: form.querySelector('#institution').value.trim(),
            password: form.querySelector('#password').value,
            termsAccept: form.querySelector('#termsAccept').checked,
            newsletter: form.querySelector('#newsletter').checked,
            dataSharing: form.querySelector('#dataSharing').checked
        };
        
        // Call signup API
        const response = await MedicalAI.apiRequest('/api/auth/register/', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        // Show success message
        MedicalAI.showAlert('Account created successfully! Please check your email for verification.', 'success');
        
        // Redirect to login page after a short delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        
    } catch (error) {
        console.error('Signup error:', error);
        MedicalAI.showAlert(error.message || 'Failed to create account. Please try again.', 'error');
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Store original button text
    submitBtn.setAttribute('data-original-text', originalText);
    
    try {
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Signing In...';
        
        // Collect form data
        const formData = {
            email: form.querySelector('#email').value.trim().toLowerCase(),
            password: form.querySelector('#password').value,
            rememberMe: form.querySelector('#rememberMe')?.checked || false
        };
        
        // Call login API
        const response = await MedicalAI.apiRequest('/api/auth/login/', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        // Store auth token
        localStorage.setItem('authToken', response.token);
        
        // Update global auth state
        window.authToken = response.token;
        window.currentUser = response.user;
        
        // Show success message
        MedicalAI.showAlert('Login successful! Welcome back.', 'success');
        
        // Redirect to dashboard or intended page
        const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || 'dashboard.html';
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 1000);
        
    } catch (error) {
        console.error('Login error:', error);
        MedicalAI.showAlert(error.message || 'Login failed. Please check your credentials.', 'error');
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// Validate Signup Form
function validateSignupForm(form) {
    const errors = [];
    
    // Required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'role', 'password'];
    requiredFields.forEach(field => {
        const input = form.querySelector(`#${field}`);
        if (!input.value.trim()) {
            errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });
    
    // Email validation
    const email = form.querySelector('#email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        errors.push('Please enter a valid email address');
        form.querySelector('#email').classList.add('error');
    }
    
    // Phone validation
    const phone = form.querySelector('#phone').value.trim();
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (phone && !phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
        errors.push('Please enter a valid phone number');
        form.querySelector('#phone').classList.add('error');
    }
    
    // Password validation
    const password = form.querySelector('#password').value;
    const confirmPassword = form.querySelector('#confirmPassword').value;
    
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
        form.querySelector('#password').classList.add('error');
    }
    
    if (password !== confirmPassword) {
        errors.push('Passwords do not match');
        form.querySelector('#confirmPassword').classList.add('error');
    }
    
    // Terms acceptance
    if (!form.querySelector('#termsAccept').checked) {
        errors.push('You must accept the Terms of Service');
    }
    
    // Show errors if any
    if (errors.length > 0) {
        MedicalAI.showAlert(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

// Setup Social Authentication
function setupSocialAuth() {
    const googleSignup = document.getElementById('googleSignup');
    const microsoftSignup = document.getElementById('microsoftSignup');
    const googleLogin = document.getElementById('googleLogin');
    const microsoftLogin = document.getElementById('microsoftLogin');
    
    if (googleSignup) {
        googleSignup.addEventListener('click', () => initiateSocialAuth('google', 'signup'));
    }
    
    if (microsoftSignup) {
        microsoftSignup.addEventListener('click', () => initiateSocialAuth('microsoft', 'signup'));
    }
    
    if (googleLogin) {
        googleLogin.addEventListener('click', () => initiateSocialAuth('google', 'login'));
    }
    
    if (microsoftLogin) {
        microsoftLogin.addEventListener('click', () => initiateSocialAuth('microsoft', 'login'));
    }
}

// Initiate Social Authentication
async function initiateSocialAuth(provider, action) {
    try {
        // Show loading overlay
        const loadingOverlay = MedicalAI.showLoadingOverlay(`Connecting to ${provider}...`);
        
        // Redirect to OAuth provider
        const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`);
        const clientId = getClientId(provider);
        const scope = 'openid email profile';
        
        const authUrl = `${getAuthUrl(provider)}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&state=${action}`;
        
        // Store action in session storage for callback handling
        sessionStorage.setItem('authAction', action);
        sessionStorage.setItem('authProvider', provider);
        
        // Redirect to OAuth provider
        window.location.href = authUrl;
        
    } catch (error) {
        console.error(`${provider} auth error:`, error);
        MedicalAI.showAlert(`Failed to connect to ${provider}. Please try again.`, 'error');
    }
}

// Get OAuth Client ID
function getClientId(provider) {
    const clientIds = {
        google: 'your-google-client-id.apps.googleusercontent.com',
        microsoft: 'your-microsoft-client-id'
    };
    return clientIds[provider] || '';
}

// Get OAuth Authorization URL
function getAuthUrl(provider) {
    const authUrls = {
        google: 'https://accounts.google.com/o/oauth2/v2/auth',
        microsoft: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
    };
    return authUrls[provider] || '';
}

// Handle OAuth Callback
async function handleOAuthCallback(code, state) {
    try {
        const provider = sessionStorage.getItem('authProvider');
        const action = sessionStorage.getItem('authAction');
        
        // Clear session storage
        sessionStorage.removeItem('authProvider');
        sessionStorage.removeItem('authAction');
        
        // Exchange code for token
        const response = await MedicalAI.apiRequest('/api/auth/oauth/callback/', {
            method: 'POST',
            body: JSON.stringify({
                code,
                provider,
                action
            })
        });
        
        if (response.token) {
            // Store auth token
            localStorage.setItem('authToken', response.token);
            
            // Update global auth state
            window.authToken = response.token;
            window.currentUser = response.user;
            
            // Show success message
            MedicalAI.showAlert(`${action === 'signup' ? 'Account created' : 'Login'} successful via ${provider}!`, 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            throw new Error('Failed to authenticate');
        }
        
    } catch (error) {
        console.error('OAuth callback error:', error);
        MedicalAI.showAlert('Authentication failed. Please try again.', 'error');
        
        // Redirect back to appropriate page
        const redirectPage = state === 'signup' ? 'signup.html' : 'login.html';
        setTimeout(() => {
            window.location.href = redirectPage;
        }, 2000);
    }
}

// Password Reset Request
async function requestPasswordReset(email) {
    try {
        const response = await MedicalAI.apiRequest('/api/auth/password-reset/', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
        
        MedicalAI.showAlert('Password reset instructions sent to your email.', 'success');
        return true;
        
    } catch (error) {
        console.error('Password reset error:', error);
        MedicalAI.showAlert(error.message || 'Failed to send password reset email.', 'error');
        return false;
    }
}

// Password Reset
async function resetPassword(token, newPassword) {
    try {
        const response = await MedicalAI.apiRequest('/api/auth/password-reset/confirm/', {
            method: 'POST',
            body: JSON.stringify({
                token,
                new_password: newPassword
            })
        });
        
        MedicalAI.showAlert('Password reset successful! You can now login with your new password.', 'success');
        return true;
        
    } catch (error) {
        console.error('Password reset error:', error);
        MedicalAI.showAlert(error.message || 'Failed to reset password.', 'error');
        return false;
    }
}

// Email Verification
async function verifyEmail(token) {
    try {
        const response = await MedicalAI.apiRequest('/api/auth/verify-email/', {
            method: 'POST',
            body: JSON.stringify({ token })
        });
        
        MedicalAI.showAlert('Email verified successfully! You can now login.', 'success');
        return true;
        
    } catch (error) {
        console.error('Email verification error:', error);
        MedicalAI.showAlert(error.message || 'Failed to verify email.', 'error');
        return false;
    }
}

// Resend Verification Email
async function resendVerificationEmail(email) {
    try {
        const response = await MedicalAI.apiRequest('/api/auth/resend-verification/', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
        
        MedicalAI.showAlert('Verification email sent! Please check your inbox.', 'success');
        return true;
        
    } catch (error) {
        console.error('Resend verification error:', error);
        MedicalAI.showAlert(error.message || 'Failed to send verification email.', 'error');
        return false;
    }
}

// Check if user is authenticated
function isAuthenticated() {
    return !!localStorage.getItem('authToken');
}

// Get current user
function getCurrentUser() {
    const token = localStorage.getItem('authToken');
    if (token) {
        try {
            // Decode JWT token (basic implementation)
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }
    return null;
}

// Check if user has specific role
function hasRole(role) {
    const user = getCurrentUser();
    return user && user.role === role;
}

// Check if user has specific permission
function hasPermission(permission) {
    const user = getCurrentUser();
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
}

// Export functions for use in other modules
window.Auth = {
    handleSignup,
    handleLogin,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    resendVerificationEmail,
    isAuthenticated,
    getCurrentUser,
    hasRole,
    hasPermission,
    initiateSocialAuth
};
