// Appointments JavaScript - Global Medical AI Library

// Global variables
let appointments = [];
let doctors = [];
let timeSlots = [];
let currentUser = null;

// Initialize Appointments
document.addEventListener('DOMContentLoaded', function() {
    initializeAppointments();
    loadAppointments();
    loadDoctors();
    setupEventListeners();
});

// Initialize Appointments Components
function initializeAppointments() {
    // Initialize date picker
    setupDatePicker();
    
    // Initialize time slot generation
    generateTimeSlots();
    
    // Load user data
    loadCurrentUser();
}

// Setup Event Listeners
function setupEventListeners() {
    // Appointment form
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', handleAppointmentSubmit);
    }
    
    // Date picker
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        dateInput.addEventListener('change', handleDateChange);
    }
    
    // Doctor selection
    const doctorSelect = document.getElementById('doctorSelect');
    if (doctorSelect) {
        doctorSelect.addEventListener('change', handleDoctorChange);
    }
    
    // Time slot selection
    const timeSelect = document.getElementById('timeSelect');
    if (timeSelect) {
        timeSelect.addEventListener('change', handleTimeChange);
    }
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            filterAppointments(filter);
        });
    });
    
    // Search input
    const searchInput = document.getElementById('searchAppointments');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

// Setup Date Picker
function setupDatePicker() {
    const dateInput = document.getElementById('appointmentDate');
    if (!dateInput) return;
    
    // Set minimum date to today
    const today = new Date();
    const minDate = today.toISOString().split('T')[0];
    dateInput.min = minDate;
    
    // Set default date to today
    dateInput.value = minDate;
}

// Generate Time Slots
function generateTimeSlots() {
    timeSlots = [];
    
    // Generate slots from 8 AM to 6 PM, 30-minute intervals
    for (let hour = 8; hour < 18; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            timeSlots.push(time);
        }
    }
    
    // Populate time select
    const timeSelect = document.getElementById('timeSelect');
    if (timeSelect) {
        timeSelect.innerHTML = '<option value="">Select Time</option>';
        timeSlots.forEach(time => {
            const option = document.createElement('option');
            option.value = time;
            option.textContent = time;
            timeSelect.appendChild(option);
        });
    }
}

// Load Current User
async function loadCurrentUser() {
    try {
        // Get user from localStorage or API
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            currentUser = JSON.parse(userData);
        } else {
            // Fetch from API if not in localStorage
            const response = await apiRequest('/api/user/profile/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            if (response.success) {
                currentUser = response.data;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
        }
        
        updateUserInfo();
    } catch (error) {
        console.error('Error loading current user:', error);
    }
}

// Load Doctors
async function loadDoctors() {
    try {
        const response = await apiRequest('/api/doctors/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.success) {
            doctors = response.data;
        } else {
            // Use sample data if API fails
            loadSampleDoctors();
        }
        
        populateDoctorSelect();
    } catch (error) {
        console.error('Error loading doctors:', error);
        loadSampleDoctors();
    }
}

// Load Sample Doctors
function loadSampleDoctors() {
    doctors = [
        { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiology', availability: 'Mon-Fri' },
        { id: 2, name: 'Dr. Michael Chen', specialty: 'Neurology', availability: 'Mon-Thu' },
        { id: 3, name: 'Dr. Emily Rodriguez', specialty: 'Oncology', availability: 'Mon-Fri' },
        { id: 4, name: 'Dr. David Thompson', specialty: 'Orthopedics', availability: 'Tue-Sat' },
        { id: 5, name: 'Dr. Lisa Wang', specialty: 'Dermatology', availability: 'Mon-Fri' }
    ];
}

// Populate Doctor Select
function populateDoctorSelect() {
    const doctorSelect = document.getElementById('doctorSelect');
    if (!doctorSelect) return;
    
    doctorSelect.innerHTML = '<option value="">Select Doctor</option>';
    doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.id;
        option.textContent = `${doctor.name} - ${doctor.specialty}`;
        doctorSelect.appendChild(option);
    });
}

// Load Appointments
async function loadAppointments() {
    try {
        const response = await apiRequest('/api/appointments/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.success) {
            appointments = response.data;
        } else {
            // Use sample data if API fails
            loadSampleAppointments();
        }
        
        displayAppointments();
    } catch (error) {
        console.error('Error loading appointments:', error);
        loadSampleAppointments();
    }
}

// Load Sample Appointments
function loadSampleAppointments() {
    appointments = [
        {
            id: 1,
            patientName: 'John Doe',
            doctorName: 'Dr. Sarah Johnson',
            specialty: 'Cardiology',
            date: '2024-01-20',
            time: '09:00',
            status: 'confirmed',
            type: 'consultation'
        },
        {
            id: 2,
            patientName: 'Jane Smith',
            doctorName: 'Dr. Michael Chen',
            specialty: 'Neurology',
            date: '2024-01-22',
            time: '14:30',
            status: 'pending',
            type: 'follow-up'
        },
        {
            id: 3,
            patientName: 'Bob Wilson',
            doctorName: 'Dr. Emily Rodriguez',
            specialty: 'Oncology',
            date: '2024-01-25',
            time: '11:00',
            status: 'confirmed',
            type: 'consultation'
        }
    ];
}

// Handle Appointment Submit
async function handleAppointmentSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const appointmentData = {
        patient_id: currentUser?.id || null,
        doctor_id: formData.get('doctor'),
        date: formData.get('date'),
        time: formData.get('time'),
        type: formData.get('type'),
        reason: formData.get('reason'),
        notes: formData.get('notes')
    };
    
    // Validate form data
    if (!validateAppointmentData(appointmentData)) {
        return;
    }
    
    try {
        showLoadingOverlay('Scheduling appointment...');
        
        const response = await apiRequest('/api/schedule-appointment/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(appointmentData)
        });
        
        if (response.success) {
            showAlert('Appointment scheduled successfully!', 'success');
            
            // Reset form
            e.target.reset();
            setupDatePicker();
            
            // Reload appointments
            loadAppointments();
            
            // Show confirmation details
            showAppointmentConfirmation(response.data);
        } else {
            showAlert(response.message || 'Failed to schedule appointment', 'error');
        }
        
    } catch (error) {
        console.error('Error scheduling appointment:', error);
        showAlert('Error scheduling appointment. Please try again.', 'error');
    } finally {
        hideLoadingOverlay();
    }
}

// Validate Appointment Data
function validateAppointmentData(data) {
    if (!data.doctor_id) {
        showAlert('Please select a doctor', 'warning');
        return false;
    }
    
    if (!data.date) {
        showAlert('Please select a date', 'warning');
        return false;
    }
    
    if (!data.time) {
        showAlert('Please select a time', 'warning');
        return false;
    }
    
    if (!data.type) {
        showAlert('Please select appointment type', 'warning');
        return false;
    }
    
    if (!data.reason.trim()) {
        showAlert('Please provide a reason for the appointment', 'warning');
        return false;
    }
    
    // Check if date is in the past
    const selectedDate = new Date(data.date);
    const today = new Date();
    if (selectedDate < today) {
        showAlert('Please select a future date', 'warning');
        return false;
    }
    
    // Check if time slot is available
    if (!isTimeSlotAvailable(data.date, data.time, data.doctor_id)) {
        showAlert('This time slot is not available. Please select another time.', 'warning');
        return false;
    }
    
    return true;
}

// Check Time Slot Availability
function isTimeSlotAvailable(date, time, doctorId) {
    // Check if the slot conflicts with existing appointments
    const conflictingAppointment = appointments.find(apt => 
        apt.date === date && 
        apt.time === time && 
        apt.doctor_id === doctorId &&
        apt.status !== 'cancelled'
    );
    
    return !conflictingAppointment;
}

// Handle Date Change
function handleDateChange(e) {
    const selectedDate = e.target.value;
    updateAvailableTimeSlots(selectedDate);
}

// Handle Doctor Change
function handleDoctorChange(e) {
    const selectedDoctor = e.target.value;
    if (selectedDoctor) {
        updateAvailableTimeSlots(document.getElementById('appointmentDate').value, selectedDoctor);
    }
}

// Handle Time Change
function handleTimeChange(e) {
    // Could add additional validation here
}

// Update Available Time Slots
function updateAvailableTimeSlots(date, doctorId = null) {
    const timeSelect = document.getElementById('timeSelect');
    if (!timeSelect) return;
    
    // Reset time selection
    timeSelect.value = '';
    
    // Get all time slots
    const allTimeSlots = [...timeSlots];
    
    // Filter out unavailable slots
    const availableSlots = allTimeSlots.filter(time => {
        if (!date) return true;
        
        // Check if slot conflicts with existing appointments
        const conflictingAppointment = appointments.find(apt => 
            apt.date === date && 
            apt.time === time && 
            (doctorId ? apt.doctor_id === doctorId : true) &&
            apt.status !== 'cancelled'
        );
        
        return !conflictingAppointment;
    });
    
    // Update time select options
    timeSelect.innerHTML = '<option value="">Select Time</option>';
    availableSlots.forEach(time => {
        const option = document.createElement('option');
        option.value = time;
        option.textContent = time;
        timeSelect.appendChild(option);
    });
    
    // Disable if no available slots
    if (availableSlots.length === 0) {
        timeSelect.disabled = true;
        timeSelect.innerHTML = '<option value="">No available slots</option>';
    } else {
        timeSelect.disabled = false;
    }
}

// Display Appointments
function displayAppointments() {
    const appointmentsContainer = document.getElementById('appointmentsList');
    if (!appointmentsContainer) return;
    
    appointmentsContainer.innerHTML = '';
    
    if (appointments.length === 0) {
        appointmentsContainer.innerHTML = `
            <div class="no-appointments">
                <i class="fas fa-calendar-times"></i>
                <p>No appointments found</p>
            </div>
        `;
        return;
    }
    
    appointments.forEach(appointment => {
        const appointmentCard = createAppointmentCard(appointment);
        appointmentsContainer.appendChild(appointmentCard);
    });
}

// Create Appointment Card
function createAppointmentCard(appointment) {
    const card = document.createElement('div');
    card.className = `appointment-card ${appointment.status}`;
    
    const statusClass = getStatusClass(appointment.status);
    const statusIcon = getStatusIcon(appointment.status);
    
    card.innerHTML = `
        <div class="appointment-header">
            <div class="appointment-info">
                <h4>${appointment.patientName}</h4>
                <p class="specialty">${appointment.specialty}</p>
            </div>
            <div class="appointment-status ${statusClass}">
                <i class="${statusIcon}"></i>
                <span>${appointment.status}</span>
            </div>
        </div>
        <div class="appointment-details">
            <div class="detail-item">
                <i class="fas fa-user-md"></i>
                <span>${appointment.doctorName}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-calendar"></i>
                <span>${formatDate(appointment.date)}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-clock"></i>
                <span>${appointment.time}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-stethoscope"></i>
                <span>${appointment.type}</span>
            </div>
        </div>
        <div class="appointment-actions">
            ${getAppointmentActions(appointment)}
        </div>
    `;
    
    return card;
}

// Get Status Class
function getStatusClass(status) {
    switch (status) {
        case 'confirmed': return 'status-confirmed';
        case 'pending': return 'status-pending';
        case 'cancelled': return 'status-cancelled';
        case 'completed': return 'status-completed';
        default: return 'status-default';
    }
}

// Get Status Icon
function getStatusIcon(status) {
    switch (status) {
        case 'confirmed': return 'fas fa-check-circle';
        case 'pending': return 'fas fa-clock';
        case 'cancelled': return 'fas fa-times-circle';
        case 'completed': return 'fas fa-check-double';
        default: return 'fas fa-question-circle';
    }
}

// Get Appointment Actions
function getAppointmentActions(appointment) {
    let actions = '';
    
    if (appointment.status === 'pending') {
        actions += `
            <button class="btn btn-success btn-sm" onclick="confirmAppointment(${appointment.id})">
                <i class="fas fa-check"></i> Confirm
            </button>
        `;
    }
    
    if (appointment.status === 'confirmed' || appointment.status === 'pending') {
        actions += `
            <button class="btn btn-warning btn-sm" onclick="rescheduleAppointment(${appointment.id})">
                <i class="fas fa-calendar-alt"></i> Reschedule
            </button>
            <button class="btn btn-danger btn-sm" onclick="cancelAppointment(${appointment.id})">
                <i class="fas fa-times"></i> Cancel
            </button>
        `;
    }
    
    actions += `
        <button class="btn btn-outline btn-sm" onclick="viewAppointmentDetails(${appointment.id})">
            <i class="fas fa-eye"></i> View
        </button>
    `;
    
    return actions;
}

// Filter Appointments
function filterAppointments(filter) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    event.target.classList.add('active');
    
    let filteredAppointments = [];
    
    switch (filter) {
        case 'all':
            filteredAppointments = appointments;
            break;
        case 'upcoming':
            filteredAppointments = appointments.filter(apt => 
                new Date(apt.date) >= new Date() && apt.status !== 'cancelled'
            );
            break;
        case 'pending':
            filteredAppointments = appointments.filter(apt => apt.status === 'pending');
            break;
        case 'confirmed':
            filteredAppointments = appointments.filter(apt => apt.status === 'confirmed');
            break;
        case 'completed':
            filteredAppointments = appointments.filter(apt => apt.status === 'completed');
            break;
        case 'cancelled':
            filteredAppointments = appointments.filter(apt => apt.status === 'cancelled');
            break;
        default:
            filteredAppointments = appointments;
    }
    
    displayFilteredAppointments(filteredAppointments);
}

// Display Filtered Appointments
function displayFilteredAppointments(filteredAppointments) {
    const appointmentsContainer = document.getElementById('appointmentsList');
    if (!appointmentsContainer) return;
    
    appointmentsContainer.innerHTML = '';
    
    if (filteredAppointments.length === 0) {
        appointmentsContainer.innerHTML = `
            <div class="no-appointments">
                <i class="fas fa-calendar-times"></i>
                <p>No appointments found for this filter</p>
            </div>
        `;
        return;
    }
    
    filteredAppointments.forEach(appointment => {
        const appointmentCard = createAppointmentCard(appointment);
        appointmentsContainer.appendChild(appointmentCard);
    });
}

// Handle Search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (!searchTerm) {
        displayAppointments();
        return;
    }
    
    const filteredAppointments = appointments.filter(appointment => 
        appointment.patientName.toLowerCase().includes(searchTerm) ||
        appointment.doctorName.toLowerCase().includes(searchTerm) ||
        appointment.specialty.toLowerCase().includes(searchTerm) ||
        appointment.type.toLowerCase().includes(searchTerm)
    );
    
    displayFilteredAppointments(filteredAppointments);
}

// Confirm Appointment
async function confirmAppointment(appointmentId) {
    if (!confirm('Are you sure you want to confirm this appointment?')) return;
    
    try {
        const response = await apiRequest(`/api/appointments/${appointmentId}/confirm/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.success) {
            showAlert('Appointment confirmed successfully!', 'success');
            loadAppointments();
        } else {
            showAlert(response.message || 'Failed to confirm appointment', 'error');
        }
    } catch (error) {
        console.error('Error confirming appointment:', error);
        showAlert('Error confirming appointment', 'error');
    }
}

// Reschedule Appointment
function rescheduleAppointment(appointmentId) {
    // This would typically open a modal or navigate to reschedule page
    showAlert(`Rescheduling appointment ${appointmentId}`, 'info');
}

// Cancel Appointment
async function cancelAppointment(appointmentId) {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
        const response = await apiRequest(`/api/appointments/${appointmentId}/cancel/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.success) {
            showAlert('Appointment cancelled successfully!', 'success');
            loadAppointments();
        } else {
            showAlert(response.message || 'Failed to cancel appointment', 'error');
        }
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        showAlert('Error cancelling appointment', 'error');
    }
}

// View Appointment Details
function viewAppointmentDetails(appointmentId) {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (appointment) {
        showAppointmentDetailsModal(appointment);
    }
}

// Show Appointment Confirmation
function showAppointmentConfirmation(appointmentData) {
    // This would typically show a modal with confirmation details
    showAlert(`Appointment confirmed for ${appointmentData.date} at ${appointmentData.time}`, 'success');
}

// Show Appointment Details Modal
function showAppointmentDetailsModal(appointment) {
    // This would typically show a modal with detailed appointment information
    showAlert(`Viewing details for appointment ${appointment.id}`, 'info');
}

// Update User Info
function updateUserInfo() {
    if (!currentUser) return;
    
    const userInfoElement = document.getElementById('userInfo');
    if (userInfoElement) {
        userInfoElement.innerHTML = `
            <div class="user-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="user-details">
                <h4>${currentUser.name}</h4>
                <p>${currentUser.role}</p>
            </div>
        `;
    }
}

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Export Appointments
function exportAppointments() {
    try {
        const exportData = {
            exportDate: new Date().toISOString(),
            appointments: appointments
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `appointments-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        showAlert('Appointments exported successfully', 'success');
    } catch (error) {
        console.error('Error exporting appointments:', error);
        showAlert('Error exporting appointments', 'error');
    }
}
