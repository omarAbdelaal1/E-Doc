# Global Medical AI Library - Frontend

A comprehensive frontend application for a medical AI platform that provides tools for medical image analysis, lab test interpretation, AI-powered medical assistance, and comprehensive reporting and dashboard functionality.

## 🚀 Features

### Core Functionality
- **AI Tools**: Upload and analyze medical images (X-ray, MRI, CT) and lab test data
- **Medical Assistant**: AI-powered chat interface for medical queries
- **Reports Management**: View, filter, and manage patient reports
- **Appointments**: Schedule and manage medical appointments
- **Dashboard**: Interactive analytics and performance metrics
- **User Authentication**: Role-based access control (Doctor, Patient, Lab Technician, Admin)

### Technical Features
- **Responsive Design**: Mobile-first approach using CSS Grid and Flexbox
- **Real-time Updates**: Live data updates and notifications
- **File Upload**: Drag & drop support for medical images and documents
- **Interactive Charts**: Data visualization using Chart.js
- **Medical Image Viewer**: Cornerstone.js integration for DICOM images
- **Form Validation**: Comprehensive client-side validation
- **Error Handling**: User-friendly error messages and loading states

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Charts**: Chart.js for data visualization
- **Medical Imaging**: Cornerstone.js for DICOM image viewing
- **Styling**: Custom CSS with responsive design
- **Icons**: Font Awesome for UI icons
- **Backend Integration**: RESTful API calls using Fetch API

## 📁 Project Structure

```
ML4/
├── index.html                 # Homepage
├── ai-tools.html             # AI Tools page
├── assistant.html            # Medical AI Assistant
├── reports.html              # Reports management
├── appointments.html         # Appointment booking
├── dashboard.html            # Analytics dashboard
├── login.html               # User login
├── signup.html              # User registration
├── css/
│   └── styles.css           # Main stylesheet
├── js/
│   ├── main.js              # Global JavaScript functions
│   ├── auth.js              # Authentication utilities
│   ├── login.js             # Login page logic
│   ├── signup.js            # Signup page logic
│   ├── ai-tools.js          # AI Tools functionality
│   ├── assistant.js         # Chat assistant logic
│   ├── reports.js           # Reports management
│   ├── appointments.js      # Appointment handling
│   └── dashboard.js         # Dashboard charts and data
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for development)
- Backend API server (Django + MySQL)

### Installation

1. **Clone or download** the project files to your local machine

2. **Set up a local web server** (one of these options):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open your browser** and navigate to:
   ```
   http://localhost:8000
   ```

### Backend Setup

The frontend expects a Django backend with the following API endpoints:

#### Authentication Endpoints
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `POST /api/auth/forgot-password/` - Password reset

#### Core API Endpoints
- `POST /api/upload-image/` - Medical image upload and analysis
- `POST /api/upload-lab/` - Lab data upload and interpretation
- `POST /api/assistant/` - AI medical assistant chat
- `GET /api/reports/` - Fetch patient reports
- `POST /api/schedule-appointment/` - Book appointments
- `GET /api/dashboard-data/` - Dashboard analytics
- `GET /api/case-comparator/` - Case comparison data

## 🔧 Configuration

### API Base URL
Update the API base URL in `js/main.js`:
```javascript
const API_BASE_URL = 'http://your-backend-domain.com';
```

### Authentication
The application uses JWT tokens stored in localStorage:
- `authToken`: JWT authentication token
- `userRole`: User role (doctor, patient, lab, admin)
- `userId`: Unique user identifier

## 📱 Pages Overview

### 1. Homepage (`index.html`)
- Hero section explaining AI capabilities
- Quick navigation to major features
- Responsive navigation menu

### 2. AI Tools (`ai-tools.html`)
- Medical image upload (X-ray, MRI, CT)
- Lab data upload (CSV, PDF, text)
- AI analysis results display
- Cornerstone.js image viewer integration

### 3. Medical Assistant (`assistant.html`)
- AI-powered chat interface
- Voice input support
- Quick action buttons
- Chat history management

### 4. Reports (`reports.html`)
- Patient report listing
- Advanced filtering and search
- Report viewing and download
- Doctor annotations (for medical staff)

### 5. Appointments (`appointments.html`)
- Appointment booking form
- Date and time selection
- Doctor selection
- Upcoming appointments list

### 6. Dashboard (`dashboard.html`)
- Key performance indicators
- Interactive charts (Chart.js)
- Consultation analytics
- Case comparison tools

### 7. Authentication (`login.html`, `signup.html`)
- User login and registration
- Role-based form fields
- Password strength validation
- Social login support (placeholder)

## 🎨 Customization

### Styling
- Main styles are in `css/styles.css`
- Color scheme and variables are defined at the top
- Responsive breakpoints: 768px, 1024px, 1200px

### JavaScript
- Global functions in `js/main.js`
- Page-specific logic in individual JS files
- Utility functions for API calls, validation, and UI updates

### Adding New Features
1. Create HTML page with proper structure
2. Add corresponding JavaScript file
3. Update navigation in `index.html`
4. Add styles to `css/styles.css`

## 🔒 Security Features

- **Input Validation**: Client-side form validation
- **XSS Protection**: Sanitized user input
- **CSRF Protection**: Token-based authentication
- **Rate Limiting**: Login attempt restrictions
- **Secure Storage**: LocalStorage for non-sensitive data

## 📊 Data Flow

1. **User Input** → Form validation
2. **API Request** → Backend processing
3. **Response Handling** → Error handling and success states
4. **UI Update** → Dynamic content rendering
5. **State Management** → Local storage and session data

## 🧪 Testing

### Manual Testing
- Test all form submissions
- Verify responsive design on different screen sizes
- Check error handling with invalid inputs
- Test file upload functionality

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🚀 Deployment

### Production Considerations
- Minify CSS and JavaScript files
- Optimize images and assets
- Enable HTTPS
- Set up proper CORS headers
- Configure CDN for static assets

### Environment Variables
```javascript
// Production settings
const PRODUCTION = true;
const API_BASE_URL = 'https://your-production-api.com';
const DEBUG_MODE = false;
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the code comments
- Open an issue on the repository

## 🔮 Future Enhancements

- **Real-time Notifications**: WebSocket integration
- **Offline Support**: Service Worker implementation
- **Progressive Web App**: PWA features
- **Multi-language Support**: Internationalization
- **Advanced Analytics**: More detailed reporting
- **Mobile App**: React Native or Flutter version

## 📚 Additional Resources

- [Chart.js Documentation](https://www.chartjs.org/)
- [Cornerstone.js Documentation](https://cornerstonejs.org/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Medical Imaging Standards](https://www.dicomstandard.org/)

---

**Note**: This frontend is designed to work with a Django + MySQL backend. Ensure your backend implements the required API endpoints and follows the expected data format for seamless integration.
