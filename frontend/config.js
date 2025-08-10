// Global Medical AI Library - Configuration File

const CONFIG = {
    // Environment Configuration
    ENVIRONMENT: 'development', // 'development', 'staging', 'production'
    DEBUG_MODE: true,
    
    // API Configuration
    API: {
        BASE_URL: 'http://localhost:8000', // Change this for production
        TIMEOUT: 30000, // 30 seconds
        RETRY_ATTEMPTS: 3,
        ENDPOINTS: {
            // Authentication
            LOGIN: '/api/auth/login/',
            REGISTER: '/api/auth/register/',
            FORGOT_PASSWORD: '/api/auth/forgot-password/',
            REFRESH_TOKEN: '/api/auth/refresh-token/',
            LOGOUT: '/api/auth/logout/',
            
            // AI Tools
            UPLOAD_IMAGE: '/api/upload-image/',
            UPLOAD_LAB: '/api/upload-lab/',
            ANALYZE_IMAGE: '/api/analyze-image/',
            ANALYZE_LAB: '/api/analyze-lab/',
            
            // Medical Assistant
            ASSISTANT: '/api/assistant/',
            CHAT_HISTORY: '/api/chat/history/',
            QUICK_ACTIONS: '/api/assistant/quick-actions/',
            
            // Reports
            REPORTS: '/api/reports/',
            REPORT_DETAIL: '/api/reports/{id}/',
            REPORT_ANNOTATE: '/api/reports/{id}/annotate/',
            REPORT_DOWNLOAD: '/api/reports/{id}/download/',
            
            // Appointments
            APPOINTMENTS: '/api/appointments/',
            SCHEDULE_APPOINTMENT: '/api/schedule-appointment/',
            APPOINTMENT_DETAIL: '/api/appointments/{id}/',
            CANCEL_APPOINTMENT: '/api/appointments/{id}/cancel/',
            
            // Dashboard
            DASHBOARD_DATA: '/api/dashboard-data/',
            CASE_COMPARATOR: '/api/case-comparator/',
            PERFORMANCE_METRICS: '/api/performance-metrics/',
            
            // User Management
            USER_PROFILE: '/api/user/profile/',
            UPDATE_PROFILE: '/api/user/profile/update/',
            CHANGE_PASSWORD: '/api/user/change-password/',
            
            // File Management
            UPLOAD_FILE: '/api/files/upload/',
            DELETE_FILE: '/api/files/{id}/',
            FILE_PREVIEW: '/api/files/{id}/preview/'
        }
    },
    
    // Authentication Configuration
    AUTH: {
        TOKEN_KEY: 'authToken',
        USER_ROLE_KEY: 'userRole',
        USER_ID_KEY: 'userId',
        REMEMBER_EMAIL_KEY: 'rememberedEmail',
        TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
        REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
        MAX_LOGIN_ATTEMPTS: 5,
        LOCKOUT_DURATION: 15 * 60 * 1000 // 15 minutes
    },
    
    // File Upload Configuration
    UPLOAD: {
        MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
        ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/tiff'],
        ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'text/csv', 'text/plain', 'application/vnd.ms-excel'],
        ALLOWED_DICOM_TYPES: ['application/dicom'],
        MAX_FILES_PER_UPLOAD: 10,
        CHUNK_SIZE: 1024 * 1024, // 1MB chunks for large files
        UPLOAD_TIMEOUT: 300000 // 5 minutes
    },
    
    // UI Configuration
    UI: {
        THEME: 'light', // 'light', 'dark', 'auto'
        LANGUAGE: 'en', // 'en', 'ar', 'es', 'fr'
        TIMEZONE: 'UTC',
        DATE_FORMAT: 'YYYY-MM-DD',
        TIME_FORMAT: 'HH:mm',
        DECIMAL_PLACES: 2,
        CURRENCY: 'USD',
        
        // Responsive Breakpoints
        BREAKPOINTS: {
            MOBILE: 768,
            TABLET: 1024,
            DESKTOP: 1200,
            LARGE_DESKTOP: 1400
        },
        
        // Animation Durations
        ANIMATIONS: {
            FAST: 200,
            NORMAL: 300,
            SLOW: 500
        },
        
        // Loading States
        LOADING: {
            MIN_DISPLAY_TIME: 500, // Minimum time to show loading
            TIMEOUT: 30000 // Loading timeout
        }
    },
    
    // Chart Configuration
    CHARTS: {
        COLORS: {
            PRIMARY: '#007bff',
            SECONDARY: '#6c757d',
            SUCCESS: '#28a745',
            DANGER: '#dc3545',
            WARNING: '#ffc107',
            INFO: '#17a2b8',
            LIGHT: '#f8f9fa',
            DARK: '#343a40'
        },
        ANIMATION_DURATION: 1000,
        RESPONSIVE: true,
        MAINTAIN_ASPECT_RATIO: false
    },
    
    // Medical Imaging Configuration
    IMAGING: {
        VIEWER: {
            ZOOM_LEVELS: [0.25, 0.5, 1, 1.5, 2, 3, 4],
            DEFAULT_ZOOM: 1,
            PAN_SENSITIVITY: 1,
            WINDOW_LEVEL: {
                DEFAULT: { width: 400, center: 40 },
                LUNG: { width: 1500, center: -600 },
                BONE: { width: 1800, center: 400 },
                BRAIN: { width: 80, center: 40 }
            }
        },
        DICOM: {
            SUPPORTED_MODALITIES: ['CT', 'MR', 'CR', 'DX', 'XA', 'US'],
            ANONYMIZATION: true,
            COMPRESSION: true
        }
    },
    
    // Error Handling Configuration
    ERRORS: {
        SHOW_DETAILS: true, // Show detailed error messages in development
        LOG_TO_CONSOLE: true,
        USER_FRIENDLY_MESSAGES: {
            NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
            SERVER_ERROR: 'Server error. Please try again later.',
            VALIDATION_ERROR: 'Please check your input and try again.',
            AUTH_ERROR: 'Authentication failed. Please log in again.',
            PERMISSION_ERROR: 'You do not have permission to perform this action.',
            NOT_FOUND_ERROR: 'The requested resource was not found.',
            TIMEOUT_ERROR: 'Request timed out. Please try again.'
        }
    },
    
    // Feature Flags
    FEATURES: {
        VOICE_INPUT: true,
        FILE_UPLOAD: true,
        REAL_TIME_UPDATES: true,
        OFFLINE_SUPPORT: false,
        PUSH_NOTIFICATIONS: false,
        SOCIAL_LOGIN: false,
        MULTI_LANGUAGE: false,
        DARK_MODE: false
    },
    
    // Development Configuration
    DEVELOPMENT: {
        MOCK_API: false, // Use mock data instead of real API calls
        LOG_LEVEL: 'debug', // 'error', 'warn', 'info', 'debug'
        PERFORMANCE_MONITORING: true,
        HOT_RELOAD: false
    }
};

// Environment-specific overrides
if (CONFIG.ENVIRONMENT === 'production') {
    CONFIG.DEBUG_MODE = false;
    CONFIG.API.BASE_URL = 'https://your-production-api.com';
    CONFIG.ERRORS.SHOW_DETAILS = false;
    CONFIG.DEVELOPMENT.MOCK_API = false;
    CONFIG.DEVELOPMENT.LOG_LEVEL = 'error';
}

if (CONFIG.ENVIRONMENT === 'staging') {
    CONFIG.API.BASE_URL = 'https://your-staging-api.com';
    CONFIG.DEVELOPMENT.LOG_LEVEL = 'warn';
}

// Utility functions for configuration
const ConfigUtils = {
    // Get API endpoint URL
    getApiUrl: (endpoint) => {
        return CONFIG.API.BASE_URL + endpoint;
    },
    
    // Check if feature is enabled
    isFeatureEnabled: (feature) => {
        return CONFIG.FEATURES[feature] === true;
    },
    
    // Get environment variable
    getEnv: (key) => {
        return CONFIG[key] || null;
    },
    
    // Check if in development mode
    isDevelopment: () => {
        return CONFIG.ENVIRONMENT === 'development';
    },
    
    // Check if in production mode
    isProduction: () => {
        return CONFIG.ENVIRONMENT === 'production';
    },
    
    // Get responsive breakpoint
    getBreakpoint: () => {
        const width = window.innerWidth;
        if (width < CONFIG.UI.BREAKPOINTS.MOBILE) return 'mobile';
        if (width < CONFIG.UI.BREAKPOINTS.TABLET) return 'tablet';
        if (width < CONFIG.UI.BREAKPOINTS.DESKTOP) return 'desktop';
        return 'large-desktop';
    },
    
    // Get user-friendly error message
    getUserFriendlyError: (errorType) => {
        return CONFIG.ERRORS.USER_FRIENDLY_MESSAGES[errorType] || 'An unexpected error occurred.';
    }
};

// Export configuration for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, ConfigUtils };
} else {
    // Browser environment
    window.CONFIG = CONFIG;
    window.ConfigUtils = ConfigUtils;
}

// Log configuration in development mode
if (CONFIG.DEVELOPMENT.LOG_LEVEL === 'debug') {
    console.log('Configuration loaded:', CONFIG);
}
