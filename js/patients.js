// Patients Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializePatients();
    initializeFilters();
    initializeStats();
    initializeModals();
    initializeSearch();
});

// Initialize patients data
function initializePatients() {
    loadPatients();
    displayPatients();
}

// Load patients from localStorage or use default data
function loadPatients() {
    let patients = localStorage.getItem('patients');
    if (!patients) {
        // Default patients data
        const defaultPatients = [
            {
                id: 1,
                name: 'Sarah Johnson',
                patientId: 'P001',
                age: 35,
                gender: 'Female',
                phone: '+1-555-0123',
                email: 'sarah.johnson@email.com',
                bloodType: 'O+',
                lastVisit: '2024-01-10',
                status: 'Active',
                diagnosis: 'Hypertension',
                assignedDoctor: 'Dr. Smith'
            },
            {
                id: 2,
                name: 'Michael Chen',
                patientId: 'P002',
                age: 42,
                gender: 'Male',
                phone: '+1-555-0124',
                email: 'michael.chen@email.com',
                bloodType: 'A-',
                lastVisit: '2024-01-08',
                status: 'Active',
                diagnosis: 'Diabetes Type 2',
                assignedDoctor: 'Dr. Johnson'
            },
            {
                id: 3,
                name: 'Emily Davis',
                patientId: 'P003',
                age: 28,
                gender: 'Female',
                phone: '+1-555-0125',
                email: 'emily.davis@email.com',
                bloodType: 'B+',
                lastVisit: '2024-01-12',
                status: 'Inactive',
                diagnosis: 'Asthma',
                assignedDoctor: 'Dr. Williams'
            },
            {
                id: 4,
                name: 'Robert Wilson',
                patientId: 'P004',
                age: 55,
                gender: 'Male',
                phone: '+1-555-0126',
                email: 'robert.wilson@email.com',
                bloodType: 'AB+',
                lastVisit: '2024-01-05',
                status: 'Active',
                diagnosis: 'Heart Disease',
                assignedDoctor: 'Dr. Brown'
            }
        ];
        localStorage.setItem('patients', JSON.stringify(defaultPatients));
        patients = JSON.stringify(defaultPatients);
    }
    return JSON.parse(patients);
}

// Display patients in the table
function displayPatients() {
    const patients = loadPatients();
    const patientsTable = document.querySelector('.dashboard-table tbody');
    
    if (!patientsTable) return;
    
    patientsTable.innerHTML = '';
    
    patients.forEach(patient => {
        const patientRow = createPatientRow(patient);
        patientsTable.appendChild(patientRow);
    });
}

// Create patient table row
function createPatientRow(patient) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <div class="patient-info">
                <div class="patient-avatar">
                    <span>${patient.name.split(' ').map(n => n[0]).join('').toUpperCase()}</span>
                </div>
                <div>
                    <h4>${patient.name}</h4>
                    <p>ID: ${patient.patientId}</p>
                </div>
            </div>
        </td>
        <td>${patient.age}</td>
        <td>${patient.gender}</td>
        <td>
            <div class="contact-info">
                <div>${patient.phone}</div>
                <div class="email">${patient.email}</div>
            </div>
        </td>
        <td>${patient.bloodType}</td>
        <td>${formatDate(patient.lastVisit)}</td>
        <td>
            <span class="status-badge ${patient.status.toLowerCase()}">
                ${patient.status}
            </span>
        </td>
        <td>${patient.diagnosis}</td>
        <td>${patient.assignedDoctor}</td>
        <td>
            <div class="table-actions">
                <button onclick="viewPatientDetails(${patient.id})" class="dashboard-btn dashboard-btn-sm dashboard-btn-outline" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="editPatient(${patient.id})" class="dashboard-btn dashboard-btn-sm dashboard-btn-outline" title="Edit Patient">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deletePatient(${patient.id})" class="dashboard-btn dashboard-btn-sm dashboard-btn-danger" title="Delete Patient">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    return row;
}

// Initialize filters
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterPatients(this.dataset.filter);
        });
    });
}

// Filter patients by status
function filterPatients(status) {
    const patients = loadPatients();
    let filteredPatients = patients;
    
    if (status !== 'all') {
        filteredPatients = patients.filter(patient => patient.status.toLowerCase() === status);
    }
    
    displayFilteredPatients(filteredPatients);
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchPatients(this.value);
        });
    }
}

// Search patients
function searchPatients(query) {
    if (!query.trim()) {
        displayPatients();
        return;
    }
    
    const patients = loadPatients();
    const filteredPatients = patients.filter(patient => 
        patient.name.toLowerCase().includes(query.toLowerCase()) ||
        patient.patientId.toLowerCase().includes(query.toLowerCase()) ||
        patient.email.toLowerCase().includes(query.toLowerCase()) ||
        patient.phone.includes(query) ||
        patient.diagnosis.toLowerCase().includes(query.toLowerCase()) ||
        patient.assignedDoctor.toLowerCase().includes(query.toLowerCase())
    );
    
    displayFilteredPatients(filteredPatients);
}

// Display filtered patients
function displayFilteredPatients(patients) {
    const patientsTable = document.querySelector('.dashboard-table tbody');
    if (!patientsTable) return;
    
    patientsTable.innerHTML = '';
    
    if (patients.length === 0) {
        patientsTable.innerHTML = '<tr><td colspan="11" class="no-patients">No patients found</td></tr>';
        return;
    }
    
    patients.forEach(patient => {
        const patientRow = createPatientRow(patient);
        patientsTable.appendChild(patientRow);
    });
}

// Initialize statistics
function initializeStats() {
    updateStats();
}

// Update patient statistics
function updateStats() {
    const patients = loadPatients();
    
    const totalPatients = patients.length;
    const activePatients = patients.filter(patient => patient.status === 'Active').length;
    const inactivePatients = patients.filter(patient => patient.status === 'Inactive').length;
    const newPatientsThisMonth = patients.filter(patient => {
        const lastVisit = new Date(patient.lastVisit);
        const currentMonth = new Date();
        return lastVisit.getMonth() === currentMonth.getMonth() && 
               lastVisit.getFullYear() === currentMonth.getFullYear();
    }).length;
    
    updateStatElement('total-patients', totalPatients);
    updateStatElement('active-patients', activePatients);
    updateStatElement('inactive-patients', inactivePatients);
    updateStatElement('new-patients-month', newPatientsThisMonth);
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
    // New patient modal
    const newPatientBtn = document.querySelector('.btn-primary');
    if (newPatientBtn) {
        newPatientBtn.addEventListener('click', () => showNewPatientModal());
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

// Show new patient modal
function showNewPatientModal() {
    const modal = document.getElementById('new-patient-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Show patient details modal
function viewPatientDetails(patientId) {
    const patients = loadPatients();
    const patient = patients.find(p => p.id === patientId);
    
    if (patient) {
        const modal = document.getElementById('patient-details-modal');
        if (modal) {
            // Populate modal with patient details
            modal.querySelector('.patient-name').textContent = patient.name;
            modal.querySelector('.patient-id').textContent = patient.patientId;
            modal.querySelector('.patient-age').textContent = patient.age;
            modal.querySelector('.patient-gender').textContent = patient.gender;
            modal.querySelector('.patient-phone').textContent = patient.phone;
            modal.querySelector('.patient-email').textContent = patient.email;
            modal.querySelector('.patient-blood-type').textContent = patient.bloodType;
            modal.querySelector('.patient-last-visit').textContent = formatDate(patient.lastVisit);
            modal.querySelector('.patient-status').textContent = patient.status;
            modal.querySelector('.patient-diagnosis').textContent = patient.diagnosis;
            modal.querySelector('.patient-doctor').textContent = patient.assignedDoctor;
            
            modal.style.display = 'block';
        }
    }
}

// Edit patient
function editPatient(patientId) {
    const patients = loadPatients();
    const patient = patients.find(p => p.id === patientId);
    
    if (patient) {
        // This would typically open an edit modal or navigate to edit page
        showNotification(`Editing patient: ${patient.name}`, 'info');
    }
}

// Delete patient
function deletePatient(patientId) {
    if (confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
        const patients = loadPatients();
        const patientIndex = patients.findIndex(p => p.id === patientId);
        
        if (patientIndex !== -1) {
            const patientName = patients[patientIndex].name;
            patients.splice(patientIndex, 1);
            localStorage.setItem('patients', JSON.stringify(patients));
            
            displayPatients();
            updateStats();
            showNotification(`Patient ${patientName} deleted successfully`, 'success');
        }
    }
}

// Handle new patient form submission
function handleNewPatient(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const patientData = {
        id: Date.now(),
        name: formData.get('name'),
        patientId: formData.get('patientId'),
        age: parseInt(formData.get('age')),
        gender: formData.get('gender'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        bloodType: formData.get('bloodType'),
        lastVisit: formData.get('lastVisit'),
        status: formData.get('status'),
        diagnosis: formData.get('diagnosis'),
        assignedDoctor: formData.get('assignedDoctor')
    };
    
    const patients = loadPatients();
    patients.push(patientData);
    localStorage.setItem('patients', JSON.stringify(patients));
    
    displayPatients();
    updateStats();
    
    // Close modal
    const modal = document.getElementById('new-patient-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // Reset form
    event.target.reset();
    
    showNotification('Patient added successfully', 'success');
}

// Export patients data
function exportPatients() {
    try {
        const patients = loadPatients();
        const exportData = {
            exportDate: new Date().toISOString(),
            patients: patients
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `patients-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        showNotification('Patients data exported successfully', 'success');
    } catch (error) {
        console.error('Error exporting patients:', error);
        showNotification('Error exporting patients data', 'error');
    }
}

// Import patients data
function importPatients() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const importData = JSON.parse(e.target.result);
                    if (importData.patients && Array.isArray(importData.patients)) {
                        localStorage.setItem('patients', JSON.stringify(importData.patients));
                        displayPatients();
                        updateStats();
                        showNotification('Patients data imported successfully', 'success');
                    } else {
                        showNotification('Invalid file format', 'error');
                    }
                } catch (error) {
                    console.error('Error parsing import file:', error);
                    showNotification('Error parsing import file', 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
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
