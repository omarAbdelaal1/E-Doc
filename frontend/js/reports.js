// Reports JavaScript - Global Medical AI Library

// Global variables
let reports = [];
let currentUser = null;
let selectedReport = null;
let filters = {
    status: 'all',
    dateRange: 'all',
    doctor: 'all',
    patient: 'all'
};

// Initialize Reports
document.addEventListener('DOMContentLoaded', function() {
    initializeReports();
    loadReports();
    loadCurrentUser();
    setupEventListeners();
});

// Initialize Reports Components
function initializeReports() {
    // Initialize filters
    setupFilters();
    
    // Initialize search functionality
    setupSearch();
    
    // Initialize export functionality
    setupExport();
}

// Setup Event Listeners
function setupEventListeners() {
    // Filter controls
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', handleFilterChange);
    }
    
    const dateFilter = document.getElementById('dateFilter');
    if (dateFilter) {
        dateFilter.addEventListener('change', handleFilterChange);
    }
    
    const doctorFilter = document.getElementById('doctorFilter');
    if (doctorFilter) {
        doctorFilter.addEventListener('change', handleFilterChange);
    }
    
    // Search input
    const searchInput = document.getElementById('searchReports');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Export button
    const exportBtn = document.getElementById('exportReports');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportReports);
    }
    
    // Clear filters button
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }
}

// Setup Filters
function setupFilters() {
    // Populate status filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.innerHTML = `
            <option value="all">All Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="reviewed">Reviewed</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
        `;
    }
    
    // Populate date filter
    const dateFilter = document.getElementById('dateFilter');
    if (dateFilter) {
        dateFilter.innerHTML = `
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
        `;
    }
}

// Setup Search
function setupSearch() {
    // Search functionality is handled in handleSearch function
}

// Setup Export
function setupExport() {
    // Export functionality is handled in exportReports function
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

// Load Reports
async function loadReports() {
    try {
        const response = await apiRequest('/api/reports/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.success) {
            reports = response.data;
        } else {
            // Use sample data if API fails
            loadSampleReports();
        }
        
        displayReports();
        populateDoctorFilter();
    } catch (error) {
        console.error('Error loading reports:', error);
        loadSampleReports();
    }
}

// Load Sample Reports
function loadSampleReports() {
    reports = [
        {
            id: 1,
            patientName: 'John Doe',
            patientId: 'P001',
            doctorName: 'Dr. Sarah Johnson',
            specialty: 'Cardiology',
            reportType: 'ECG Analysis',
            date: '2024-01-15',
            status: 'pending',
            priority: 'high',
            summary: 'Abnormal ECG patterns detected, requires immediate review',
            findings: 'ST elevation in leads II, III, aVF',
            recommendations: 'Immediate cardiology consultation recommended',
            annotations: []
        },
        {
            id: 2,
            patientName: 'Jane Smith',
            patientId: 'P002',
            doctorName: 'Dr. Michael Chen',
            specialty: 'Neurology',
            reportType: 'MRI Brain Scan',
            date: '2024-01-14',
            status: 'reviewed',
            priority: 'medium',
            summary: 'Normal brain MRI findings',
            findings: 'No significant abnormalities detected',
            recommendations: 'Continue current treatment plan',
            annotations: [
                {
                    id: 1,
                    doctor: 'Dr. Michael Chen',
                    date: '2024-01-14',
                    comment: 'MRI findings are within normal limits',
                    type: 'review'
                }
            ]
        },
        {
            id: 3,
            patientName: 'Bob Wilson',
            patientId: 'P003',
            doctorName: 'Dr. Emily Rodriguez',
            specialty: 'Oncology',
            reportType: 'Blood Test Results',
            date: '2024-01-13',
            status: 'approved',
            priority: 'low',
            summary: 'Blood counts within normal range',
            findings: 'WBC: 7.2, RBC: 4.8, Hemoglobin: 14.2',
            recommendations: 'Continue monitoring as scheduled',
            annotations: [
                {
                    id: 2,
                    doctor: 'Dr. Emily Rodriguez',
                    date: '2024-01-13',
                    comment: 'Results are stable, no changes needed',
                    type: 'approval'
                }
            ]
        }
    ];
}

// Populate Doctor Filter
function populateDoctorFilter() {
    const doctorFilter = document.getElementById('doctorFilter');
    if (!doctorFilter) return;
    
    // Get unique doctors from reports
    const doctors = [...new Set(reports.map(report => report.doctorName))];
    
    doctorFilter.innerHTML = '<option value="all">All Doctors</option>';
    doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor;
        option.textContent = doctor;
        doctorFilter.appendChild(option);
    });
}

// Handle Filter Change
function handleFilterChange() {
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const doctorFilter = document.getElementById('doctorFilter');
    
    if (statusFilter) filters.status = statusFilter.value;
    if (dateFilter) filters.dateRange = dateFilter.value;
    if (doctorFilter) filters.doctor = doctorFilter.value;
    
    applyFilters();
}

// Apply Filters
function applyFilters() {
    let filteredReports = [...reports];
    
    // Filter by status
    if (filters.status !== 'all') {
        filteredReports = filteredReports.filter(report => report.status === filters.status);
    }
    
    // Filter by date range
    if (filters.dateRange !== 'all') {
        const today = new Date();
        const startDate = getStartDate(filters.dateRange, today);
        
        filteredReports = filteredReports.filter(report => {
            const reportDate = new Date(report.date);
            return reportDate >= startDate;
        });
    }
    
    // Filter by doctor
    if (filters.doctor !== 'all') {
        filteredReports = filteredReports.filter(report => report.doctorName === filters.doctor);
    }
    
    displayFilteredReports(filteredReports);
}

// Get Start Date for Filter
function getStartDate(dateRange, today) {
    switch (dateRange) {
        case 'today':
            return new Date(today.getFullYear(), today.getMonth(), today.getDate());
        case 'week':
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            return weekStart;
        case 'month':
            return new Date(today.getFullYear(), today.getMonth(), 1);
        case 'quarter':
            const quarter = Math.floor(today.getMonth() / 3);
            return new Date(today.getFullYear(), quarter * 3, 1);
        case 'year':
            return new Date(today.getFullYear(), 0, 1);
        default:
            return new Date(0);
    }
}

// Handle Search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (!searchTerm) {
        applyFilters();
        return;
    }
    
    const filteredReports = reports.filter(report => 
        report.patientName.toLowerCase().includes(searchTerm) ||
        report.patientId.toLowerCase().includes(searchTerm) ||
        report.doctorName.toLowerCase().includes(searchTerm) ||
        report.reportType.toLowerCase().includes(searchTerm) ||
        report.summary.toLowerCase().includes(searchTerm)
    );
    
    displayFilteredReports(filteredReports);
}

// Display Reports
function displayReports() {
    displayFilteredReports(reports);
}

// Display Filtered Reports
function displayFilteredReports(filteredReports) {
    const reportsContainer = document.getElementById('reportsList');
    if (!reportsContainer) return;
    
    reportsContainer.innerHTML = '';
    
    if (filteredReports.length === 0) {
        reportsContainer.innerHTML = `
            <div class="no-reports">
                <i class="fas fa-file-medical"></i>
                <p>No reports found</p>
            </div>
        `;
        return;
    }
    
    filteredReports.forEach(report => {
        const reportCard = createReportCard(report);
        reportsContainer.appendChild(reportCard);
    });
}

// Create Report Card
function createReportCard(report) {
    const card = document.createElement('div');
    card.className = `report-card ${report.status} priority-${report.priority}`;
    
    const statusClass = getStatusClass(report.status);
    const statusIcon = getStatusIcon(report.status);
    const priorityClass = getPriorityClass(report.priority);
    
    card.innerHTML = `
        <div class="report-header">
            <div class="report-info">
                <h4>${report.reportType}</h4>
                <p class="patient-info">${report.patientName} (${report.patientId})</p>
            </div>
            <div class="report-meta">
                <div class="report-status ${statusClass}">
                    <i class="${statusIcon}"></i>
                    <span>${report.status}</span>
                </div>
                <div class="report-priority ${priorityClass}">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>${report.priority}</span>
                </div>
            </div>
        </div>
        <div class="report-details">
            <div class="detail-item">
                <i class="fas fa-user-md"></i>
                <span>${report.doctorName}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-stethoscope"></i>
                <span>${report.specialty}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-calendar"></i>
                <span>${formatDate(report.date)}</span>
            </div>
        </div>
        <div class="report-summary">
            <p><strong>Summary:</strong> ${report.summary}</p>
        </div>
        <div class="report-actions">
            ${getReportActions(report)}
        </div>
    `;
    
    return card;
}

// Get Status Class
function getStatusClass(status) {
    switch (status) {
        case 'pending': return 'status-pending';
        case 'reviewed': return 'status-reviewed';
        case 'approved': return 'status-approved';
        case 'rejected': return 'status-rejected';
        default: return 'status-default';
    }
}

// Get Status Icon
function getStatusIcon(status) {
    switch (status) {
        case 'pending': return 'fas fa-clock';
        case 'reviewed': return 'fas fa-eye';
        case 'approved': return 'fas fa-check-circle';
        case 'rejected': return 'fas fa-times-circle';
        default: return 'fas fa-question-circle';
    }
}

// Get Priority Class
function getPriorityClass(priority) {
    switch (priority) {
        case 'high': return 'priority-high';
        case 'medium': return 'priority-medium';
        case 'low': return 'priority-low';
        default: return 'priority-default';
    }
}

// Get Report Actions
function getReportActions(report) {
    let actions = '';
    
    // View report
    actions += `
        <button class="btn btn-outline btn-sm" onclick="viewReport(${report.id})">
            <i class="fas fa-eye"></i> View
        </button>
    `;
    
    // Download report
    actions += `
        <button class="btn btn-outline btn-sm" onclick="downloadReport(${report.id})">
            <i class="fas fa-download"></i> Download
        </button>
    `;
    
    // Add annotations (for doctors)
    if (currentUser && currentUser.role === 'doctor') {
        actions += `
            <button class="btn btn-primary btn-sm" onclick="addAnnotation(${report.id})">
                <i class="fas fa-comment-medical"></i> Annotate
            </button>
        `;
    }
    
    // Approve/Reject (for doctors)
    if (currentUser && currentUser.role === 'doctor' && report.status === 'pending') {
        actions += `
            <button class="btn btn-success btn-sm" onclick="approveReport(${report.id})">
                <i class="fas fa-check"></i> Approve
            </button>
            <button class="btn btn-danger btn-sm" onclick="rejectReport(${report.id})">
                <i class="fas fa-times"></i> Reject
            </button>
        `;
    }
    
    return actions;
}

// View Report
function viewReport(reportId) {
    const report = reports.find(r => r.id === reportId);
    if (report) {
        selectedReport = report;
        showReportModal(report);
    }
}

// Download Report
function downloadReport(reportId) {
    const report = reports.find(r => r.id === reportId);
    if (report) {
        // This would typically generate and download a PDF report
        showAlert(`Downloading report for ${report.patientName}`, 'info');
    }
}

// Add Annotation
function addAnnotation(reportId) {
    const report = reports.find(r => r.id === reportId);
    if (report) {
        showAnnotationModal(report);
    }
}

// Approve Report
async function approveReport(reportId) {
    if (!confirm('Are you sure you want to approve this report?')) return;
    
    try {
        const response = await apiRequest(`/api/reports/${reportId}/approve/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.success) {
            showAlert('Report approved successfully!', 'success');
            loadReports();
        } else {
            showAlert(response.message || 'Failed to approve report', 'error');
        }
    } catch (error) {
        console.error('Error approving report:', error);
        showAlert('Error approving report', 'error');
    }
}

// Reject Report
async function rejectReport(reportId) {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;
    
    try {
        const response = await apiRequest(`/api/reports/${reportId}/reject/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reason: reason })
        });
        
        if (response.success) {
            showAlert('Report rejected successfully!', 'success');
            loadReports();
        } else {
            showAlert(response.message || 'Failed to reject report', 'error');
        }
    } catch (error) {
        console.error('Error rejecting report:', error);
        showAlert('Error rejecting report', 'error');
    }
}

// Show Report Modal
function showReportModal(report) {
    // This would typically show a modal with detailed report information
    const modalContent = `
        <div class="report-modal">
            <h3>${report.reportType} Report</h3>
            <div class="report-details-full">
                <p><strong>Patient:</strong> ${report.patientName} (${report.patientId})</p>
                <p><strong>Doctor:</strong> ${report.doctorName}</p>
                <p><strong>Specialty:</strong> ${report.specialty}</p>
                <p><strong>Date:</strong> ${formatDate(report.date)}</p>
                <p><strong>Status:</strong> ${report.status}</p>
                <p><strong>Priority:</strong> ${report.priority}</p>
            </div>
            <div class="report-content">
                <h4>Summary</h4>
                <p>${report.summary}</p>
                <h4>Findings</h4>
                <p>${report.findings}</p>
                <h4>Recommendations</h4>
                <p>${report.recommendations}</p>
            </div>
            ${report.annotations.length > 0 ? `
                <div class="report-annotations">
                    <h4>Doctor Annotations</h4>
                    ${report.annotations.map(annotation => `
                        <div class="annotation">
                            <p><strong>${annotation.doctor}</strong> - ${formatDate(annotation.date)}</p>
                            <p>${annotation.comment}</p>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
    
    showModal('Report Details', modalContent);
}

// Show Annotation Modal
function showAnnotationModal(report) {
    const modalContent = `
        <div class="annotation-form">
            <form id="annotationForm">
                <div class="form-group">
                    <label for="annotationType">Annotation Type</label>
                    <select id="annotationType" required>
                        <option value="review">Review Comment</option>
                        <option value="correction">Correction</option>
                        <option value="additional">Additional Information</option>
                        <option value="approval">Approval Note</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="annotationComment">Comment</label>
                    <textarea id="annotationComment" rows="4" required placeholder="Enter your annotation..."></textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Add Annotation</button>
                    <button type="button" class="btn btn-outline" onclick="closeModal()">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    showModal('Add Annotation', modalContent);
    
    // Setup form submission
    const form = document.getElementById('annotationForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitAnnotation(report.id);
        });
    }
}

// Submit Annotation
async function submitAnnotation(reportId) {
    const type = document.getElementById('annotationType').value;
    const comment = document.getElementById('annotationComment').value;
    
    if (!comment.trim()) {
        showAlert('Please enter a comment', 'warning');
        return;
    }
    
    try {
        const response = await apiRequest(`/api/reports/${reportId}/annotate/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                type: type,
                comment: comment
            })
        });
        
        if (response.success) {
            showAlert('Annotation added successfully!', 'success');
            closeModal();
            loadReports();
        } else {
            showAlert(response.message || 'Failed to add annotation', 'error');
        }
    } catch (error) {
        console.error('Error adding annotation:', error);
        showAlert('Error adding annotation', 'error');
    }
}

// Clear Filters
function clearFilters() {
    filters = {
        status: 'all',
        dateRange: 'all',
        doctor: 'all',
        patient: 'all'
    };
    
    // Reset filter controls
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const doctorFilter = document.getElementById('doctorFilter');
    
    if (statusFilter) statusFilter.value = 'all';
    if (dateFilter) dateFilter.value = 'all';
    if (doctorFilter) doctorFilter.value = 'all';
    
    // Clear search
    const searchInput = document.getElementById('searchReports');
    if (searchInput) searchInput.value = '';
    
    // Display all reports
    displayReports();
}

// Export Reports
function exportReports() {
    try {
        const exportData = {
            exportDate: new Date().toISOString(),
            filters: filters,
            reports: reports
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `reports-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        showAlert('Reports exported successfully', 'success');
    } catch (error) {
        console.error('Error exporting reports:', error);
        showAlert('Error exporting reports', 'error');
    }
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

// Show Modal (placeholder function)
function showModal(title, content) {
    // This would typically show a modal with the given title and content
    showAlert(`Modal: ${title}`, 'info');
}

// Close Modal (placeholder function)
function closeModal() {
    // This would typically close the current modal
    showAlert('Modal closed', 'info');
}
