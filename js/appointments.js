// Appointments Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeAppointments();
    initializeFilters();
    initializeCalendar();
    initializeStats();
    initializeModals();
});

// Initialize appointments data
function initializeAppointments() {
    loadAppointments();
        displayAppointments();
}

// Load appointments from localStorage or use default data
function loadAppointments() {
    let appointments = localStorage.getItem('appointments');
    if (!appointments) {
        // Default appointments data
        const defaultAppointments = [
        {
            id: 1,
                patientName: 'Sarah Johnson',
                patientId: 'P001',
                date: '2024-01-15',
            time: '09:00',
                duration: 30,
                type: 'Consultation',
                status: 'Confirmed',
                doctor: 'Dr. Smith',
                notes: 'Follow-up consultation'
        },
        {
            id: 2,
                patientName: 'Michael Chen',
                patientId: 'P002',
                date: '2024-01-15',
                time: '10:30',
                duration: 45,
                type: 'Procedure',
                status: 'Pending',
                doctor: 'Dr. Johnson',
                notes: 'Annual checkup'
        },
        {
            id: 3,
                patientName: 'Emily Davis',
                patientId: 'P003',
                date: '2024-01-16',
                time: '14:00',
                duration: 60,
                type: 'Surgery',
                status: 'Confirmed',
                doctor: 'Dr. Williams',
                notes: 'Minor surgery'
            }
        ];
        localStorage.setItem('appointments', JSON.stringify(defaultAppointments));
        appointments = JSON.stringify(defaultAppointments);
    }
    return JSON.parse(appointments);
}

// Display appointments in the list
function displayAppointments() {
    const appointments = loadAppointments();
    const appointmentsList = document.querySelector('.appointments-list');
    
    if (!appointmentsList) return;
    
    appointmentsList.innerHTML = '';
    
    appointments.forEach(appointment => {
        const appointmentCard = createAppointmentCard(appointment);
        appointmentsList.appendChild(appointmentCard);
    });
}

// Create appointment card element
function createAppointmentCard(appointment) {
    const card = document.createElement('div');
    card.className = 'appointment-card';
    card.innerHTML = `
        <div class="appointment-header">
            <div class="appointment-time">
                <i class="fas fa-clock"></i>
                <span>${appointment.time}</span>
            </div>
            <div class="appointment-status ${appointment.status.toLowerCase()}">
                ${appointment.status}
            </div>
        </div>
        <div class="appointment-body">
            <h4>${appointment.patientName}</h4>
            <p class="patient-id">ID: ${appointment.patientId}</p>
            <p class="appointment-type">
                <i class="fas fa-stethoscope"></i>
                ${appointment.type}
            </p>
            <p class="appointment-doctor">
                <i class="fas fa-user-md"></i>
                ${appointment.doctor}
            </p>
            <p class="appointment-notes">${appointment.notes}</p>
        </div>
        <div class="appointment-actions">
            <button onclick="editAppointment(${appointment.id})" class="btn btn-sm btn-outline">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button onclick="cancelAppointment(${appointment.id})" class="btn btn-sm btn-danger">
                <i class="fas fa-times"></i> Cancel
            </button>
        </div>
    `;
    return card;
}

// Initialize filters
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterAppointments(this.dataset.filter);
        });
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchAppointments(this.value);
        });
    }
}

// Filter appointments by status
function filterAppointments(status) {
    const appointments = loadAppointments();
    let filteredAppointments = appointments;
    
    if (status !== 'all') {
        filteredAppointments = appointments.filter(apt => apt.status.toLowerCase() === status);
    }
    
    displayFilteredAppointments(filteredAppointments);
}

// Search appointments
function searchAppointments(query) {
    if (!query.trim()) {
        displayAppointments();
        return;
    }
    
    const appointments = loadAppointments();
    const filteredAppointments = appointments.filter(apt => 
        apt.patientName.toLowerCase().includes(query.toLowerCase()) ||
        apt.patientId.toLowerCase().includes(query.toLowerCase()) ||
        apt.doctor.toLowerCase().includes(query.toLowerCase())
    );
    
    displayFilteredAppointments(filteredAppointments);
}

// Display filtered appointments
function displayFilteredAppointments(appointments) {
    const appointmentsList = document.querySelector('.appointments-list');
    if (!appointmentsList) return;
    
    appointmentsList.innerHTML = '';
    
    if (appointments.length === 0) {
        appointmentsList.innerHTML = '<div class="no-appointments">No appointments found</div>';
        return;
    }
    
    appointments.forEach(appointment => {
        const appointmentCard = createAppointmentCard(appointment);
        appointmentsList.appendChild(appointmentCard);
    });
}

// Initialize calendar with free API integration
function initializeCalendar() {
    const calendarContainer = document.querySelector('.calendar-container');
    if (calendarContainer) {
        calendarContainer.innerHTML = `
            <div class="calendar-header">
                <button class="btn btn-sm btn-outline" onclick="previousMonth()">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <h3 id="current-month">January 2024</h3>
                <button class="btn btn-sm btn-outline" onclick="nextMonth()">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            <div class="calendar-grid">
                <div class="calendar-weekdays">
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
            </div>
                <div class="calendar-days" id="calendar-days">
                    <!-- Calendar days will be populated here -->
            </div>
        </div>
            <div class="calendar-legend">
                <div class="legend-item">
                    <span class="legend-color available"></span>
                    <span>Available</span>
            </div>
                <div class="legend-item">
                    <span class="legend-color booked"></span>
                    <span>Booked</span>
            </div>
                <div class="legend-item">
                    <span class="legend-color today"></span>
                    <span>Today</span>
            </div>
        </div>
        `;
        generateCalendarDays();
        loadCalendarEvents();
    }
}

// Load calendar events from free API
async function loadCalendarEvents() {
    try {
        // Using a free calendar API (example with Google Calendar API)
        // For demo purposes, we'll simulate calendar data
        const events = await fetchCalendarEvents();
        displayCalendarEvents(events);
    } catch (error) {
        console.error('Error loading calendar events:', error);
        // Fallback to local data
        displayCalendarEvents(getLocalCalendarEvents());
    }
}

// Fetch calendar events from free API
async function fetchCalendarEvents() {
    // Using a free calendar API - you can integrate with:
    // 1. Google Calendar API (free tier available)
    // 2. Outlook Calendar API (free tier available)
    // 3. CalDAV servers (free)
    
    // For demo purposes, returning simulated data
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    date: '2024-01-15',
                    type: 'appointment',
                    title: 'Dr. Smith - Cardiology',
                    time: '09:00'
                },
                {
                    date: '2024-01-16',
                    type: 'appointment',
                    title: 'Dr. Johnson - Neurology',
                    time: '14:30'
                },
                {
                    date: '2024-01-18',
                    type: 'surgery',
                    title: 'Dr. Williams - Orthopedics',
                    time: '11:00'
                }
            ]);
        }, 500);
    });
}

// Get local calendar events
function getLocalCalendarEvents() {
    const appointments = loadAppointments();
    return appointments.map(apt => ({
        date: apt.date,
        type: 'appointment',
        title: `${apt.doctor} - ${apt.type}`,
        time: apt.time
    }));
}

// Display calendar events
function displayCalendarEvents(events) {
    const calendarDays = document.getElementById('calendar-days');
    if (!calendarDays) return;
    
    // Add event indicators to calendar days
    const dayElements = calendarDays.querySelectorAll('.calendar-day');
    dayElements.forEach(dayElement => {
        const date = dayElement.dataset.date;
        if (date) {
            const dayEvents = events.filter(event => event.date === date);
            if (dayEvents.length > 0) {
                dayElement.classList.add('has-events');
                dayElement.title = dayEvents.map(event => `${event.time} - ${event.title}`).join('\n');
            }
        }
    });
}

// Generate calendar days
function generateCalendarDays() {
    const calendarDays = document.getElementById('calendar-days');
    if (!calendarDays) return;
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    calendarDays.innerHTML = '';
    
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        if (date.getMonth() === currentMonth) {
            dayElement.classList.add('current-month');
        }
        
        if (date.toDateString() === currentDate.toDateString()) {
            dayElement.classList.add('today');
        }
        
        dayElement.textContent = date.getDate();
        dayElement.onclick = () => selectDate(date);
        
        calendarDays.appendChild(dayElement);
    }
}

// Select date
function selectDate(date) {
    const selectedDate = date.toISOString().split('T')[0];
    showNewAppointmentModal(selectedDate);
}

// Initialize statistics
function initializeStats() {
    updateStats();
}

// Update appointment statistics
function updateStats() {
    const appointments = loadAppointments();
    
    const totalAppointments = appointments.length;
    const confirmedAppointments = appointments.filter(apt => apt.status === 'Confirmed').length;
    const pendingAppointments = appointments.filter(apt => apt.status === 'Pending').length;
    const cancelledAppointments = appointments.filter(apt => apt.status === 'Cancelled').length;
    
    updateStatElement('total-appointments', totalAppointments);
    updateStatElement('confirmed-appointments', confirmedAppointments);
    updateStatElement('pending-appointments', pendingAppointments);
    updateStatElement('cancelled-appointments', cancelledAppointments);
}

// Update individual stat element
function updateStatElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// Initialize modals
function initializeModals() {
    // New appointment modal
    const newAppointmentBtn = document.querySelector('.btn-primary');
    if (newAppointmentBtn) {
        newAppointmentBtn.addEventListener('click', () => showNewAppointmentModal());
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

// Show new appointment modal
function showNewAppointmentModal(selectedDate = '') {
    const modal = document.getElementById('new-appointment-modal');
    if (modal) {
        if (selectedDate) {
            const dateInput = modal.querySelector('input[type="date"]');
            if (dateInput) dateInput.value = selectedDate;
        }
        modal.style.display = 'block';
    }
}

// Show edit appointment modal
function editAppointment(appointmentId) {
    const appointments = loadAppointments();
    const appointment = appointments.find(apt => apt.id === appointmentId);
    
    if (appointment) {
        const modal = document.getElementById('edit-appointment-modal');
        if (modal) {
            // Populate form fields
            const form = modal.querySelector('form');
            if (form) {
                form.querySelector('[name="patientName"]').value = appointment.patientName;
                form.querySelector('[name="patientId"]').value = appointment.patientId;
                form.querySelector('[name="date"]').value = appointment.date;
                form.querySelector('[name="time"]').value = appointment.time;
                form.querySelector('[name="duration"]').value = appointment.duration;
                form.querySelector('[name="type"]').value = appointment.type;
                form.querySelector('[name="doctor"]').value = appointment.doctor;
                form.querySelector('[name="notes"]').value = appointment.notes;
                form.dataset.appointmentId = appointmentId;
            }
            modal.style.display = 'block';
        }
    }
}

// Cancel appointment
function cancelAppointment(appointmentId) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        const appointments = loadAppointments();
        const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId);
        
        if (appointmentIndex !== -1) {
            appointments[appointmentIndex].status = 'Cancelled';
            localStorage.setItem('appointments', JSON.stringify(appointments));
            displayAppointments();
            updateStats();
            showNotification('Appointment cancelled successfully', 'success');
        }
    }
}

// Handle new appointment form submission
function handleNewAppointment(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const appointmentData = {
        id: Date.now(),
        patientName: formData.get('patientName'),
        patientId: formData.get('patientId'),
        date: formData.get('date'),
        time: formData.get('time'),
        duration: parseInt(formData.get('duration')),
        type: formData.get('type'),
        status: 'Pending',
        doctor: formData.get('doctor'),
        notes: formData.get('notes')
    };
    
    const appointments = loadAppointments();
    appointments.push(appointmentData);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    displayAppointments();
    updateStats();
    
    // Close modal
    const modal = document.getElementById('new-appointment-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // Reset form
    event.target.reset();
    
    showNotification('Appointment scheduled successfully', 'success');
}

// Handle edit appointment form submission
function handleEditAppointment(event) {
    event.preventDefault();
    
    const appointmentId = parseInt(event.target.dataset.appointmentId);
    const formData = new FormData(event.target);
    
    const appointments = loadAppointments();
    const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId);
    
    if (appointmentIndex !== -1) {
        appointments[appointmentIndex] = {
            ...appointments[appointmentIndex],
            patientName: formData.get('patientName'),
            patientId: formData.get('patientId'),
            date: formData.get('date'),
            time: formData.get('time'),
            duration: parseInt(formData.get('duration')),
            type: formData.get('type'),
            doctor: formData.get('doctor'),
            notes: formData.get('notes')
        };
        
        localStorage.setItem('appointments', JSON.stringify(appointments));
        displayAppointments();
        
        // Close modal
        const modal = document.getElementById('edit-appointment-modal');
        if (modal) {
            modal.style.display = 'none';
        }
        
        showNotification('Appointment updated successfully', 'success');
    }
}

// Calendar navigation functions
function previousMonth() {
    // Implementation for previous month
    console.log('Previous month clicked');
}

function nextMonth() {
    // Implementation for next month
    console.log('Next month clicked');
}

// Utility function to show notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
