// AI Reports JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeAIReports();
    setupTemplateSelection();
    setupFileUpload();
    loadRecentReports();
});

function initializeAIReports() {
    const reportForm = document.getElementById('report-form');
    if (reportForm) {
        reportForm.addEventListener('submit', handleReportSubmission);
    }
    checkURLParameters();
}

function checkURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const model = urlParams.get('model');
    
    if (model) {
        const aiModelSelect = document.querySelector('select[name="aiModel"]');
        if (aiModelSelect) aiModelSelect.value = model;
        
        const reportTypeSelect = document.querySelector('select[name="reportType"]');
        if (reportTypeSelect) {
            switch(model) {
                case 'diagnostic': reportTypeSelect.value = 'diagnostic'; break;
                case 'imaging': reportTypeSelect.value = 'imaging'; break;
                case 'treatment': reportTypeSelect.value = 'treatment'; break;
            }
        }
    }
}

function setupTemplateSelection() {
    const templateCards = document.querySelectorAll('.template-card');
    templateCards.forEach(card => {
        card.addEventListener('click', function() {
            templateCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            
            const template = this.dataset.template;
            const reportTypeSelect = document.querySelector('select[name="reportType"]');
            if (reportTypeSelect) reportTypeSelect.value = template;
            
            showNotification(`Template "${template}" selected`, 'success');
        });
    });
}

function setupFileUpload() {
    const fileInput = document.getElementById('file-input');
    const uploadArea = document.getElementById('upload-area');
    
    if (fileInput && uploadArea) {
        uploadArea.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
    }
}

function triggerFileUpload() {
    document.getElementById('file-input').click();
}

function handleFiles(files) {
    const container = document.getElementById('uploaded-files');
    
    Array.from(files).forEach(file => {
        if (!isValidFileType(file)) {
            showNotification(`Invalid file type: ${file.name}`, 'error');
            return;
        }
        
        const fileItem = createFileItem(file);
        container.appendChild(fileItem);
        showNotification(`File "${file.name}" uploaded successfully`, 'success');
    });
    
    updateUploadArea();
}

function isValidFileType(file) {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'application/dicom'];
    return validTypes.includes(file.type) || file.name.endsWith('.dcm');
}

function createFileItem(file) {
    const fileItem = document.createElement('div');
    fileItem.className = 'uploaded-file-item';
    
    const fileIcon = file.type.includes('pdf') ? 'fa-file-pdf' : 
                    file.type.includes('word') ? 'fa-file-word' : 
                    file.type.includes('image') ? 'fa-file-image' : 'fa-file';
    
    fileItem.innerHTML = `
        <div class="file-info">
            <i class="fas ${fileIcon}"></i>
            <div class="file-details">
                <span class="file-name">${file.name}</span>
                <span class="file-size">${formatFileSize(file.size)}</span>
            </div>
        </div>
        <div class="file-actions">
            <button class="file-action-btn" onclick="removeFile(this)" title="Remove">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    return fileItem;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function updateUploadArea() {
    const uploadedFiles = document.querySelectorAll('.uploaded-file-item');
    const uploadArea = document.getElementById('upload-area');
    uploadArea.style.display = uploadedFiles.length > 0 ? 'none' : 'flex';
}

function removeFile(button) {
    const fileItem = button.closest('.uploaded-file-item');
    const fileName = fileItem.querySelector('.file-name').textContent;
    
    if (confirm(`Remove "${fileName}"?`)) {
        fileItem.remove();
        updateUploadArea();
        showNotification(`File "${fileName}" removed`, 'success');
    }
}

function handleReportSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    if (!validateReportForm(data)) return;
    
    const generateBtn = document.getElementById('generate-btn');
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    generateBtn.disabled = true;
    
    setTimeout(() => {
        const report = generateAIReport(data);
        saveReport(report);
        showNotification('AI Report generated successfully!', 'success');
        e.target.reset();
        document.querySelectorAll('.template-card').forEach(card => card.classList.remove('selected'));
        generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate AI Report';
        generateBtn.disabled = false;
        showReportPreview(report);
    }, 3000);
}

function validateReportForm(data) {
    if (!data.patientName.trim()) {
        showNotification('Patient name is required', 'error');
        return false;
    }
    if (!data.reportType) {
        showNotification('Report type is required', 'error');
        return false;
    }
    const uploadedFiles = document.querySelectorAll('.uploaded-file-item');
    if (uploadedFiles.length === 0) {
        showNotification('Please upload at least one file', 'error');
        return false;
    }
    return true;
}

function generateAIReport(data) {
    const reportId = 'RPT' + Date.now();
    const timestamp = new Date().toISOString();
    
    let content = '';
    switch(data.reportType) {
        case 'consultation':
            content = `<h2>General Consultation Report</h2><p><strong>Patient:</strong> ${data.patientName}</p><p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p><h3>Clinical Assessment</h3><p>Based on the provided medical data and AI analysis, this consultation report provides a comprehensive overview of the patient's current health status.</p>`;
            break;
        case 'diagnostic':
            content = `<h2>Diagnostic Report</h2><p><strong>Patient:</strong> ${data.patientName}</p><p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p><h3>Diagnostic Analysis</h3><p>Advanced AI diagnostic analysis has been performed on the provided medical data to identify potential conditions and provide differential diagnoses.</p>`;
            break;
        case 'treatment':
            content = `<h2>Treatment Plan Report</h2><p><strong>Patient:</strong> ${data.patientName}</p><p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p><h3>Treatment Analysis</h3><p>AI-powered treatment planning has analyzed the patient's condition and generated evidence-based treatment recommendations.</p>`;
            break;
        case 'imaging':
            content = `<h2>Medical Imaging Report</h2><p><strong>Patient:</strong> ${data.patientName}</p><p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p><h3>Imaging Analysis</h3><p>Advanced computer vision AI has analyzed the provided medical images to identify anatomical structures and potential abnormalities.</p>`;
            break;
        default:
            content = `<h2>Medical Report</h2><p><strong>Patient:</strong> ${data.patientName}</p><p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p><h3>Report Summary</h3><p>AI analysis has been completed on the provided medical data to generate this comprehensive report.</p>`;
    }
    
    return {
        id: reportId,
        patientName: data.patientName,
        patientId: data.patientId || 'N/A',
        reportType: data.reportType,
        aiModel: data.aiModel,
        priority: data.priority,
        department: data.department,
        notes: data.notes,
        content: content,
        status: 'completed',
        timestamp: timestamp,
        generatedBy: 'Dr. John Doe'
    };
}

function saveReport(report) {
    const savedReports = JSON.parse(localStorage.getItem('edoc_reports') || '[]');
    savedReports.unshift(report);
    if (savedReports.length > 100) savedReports.splice(100);
    localStorage.setItem('edoc_reports', JSON.stringify(savedReports));
    loadRecentReports();
}

function loadRecentReports() {
    const container = document.getElementById('recent-reports');
    if (!container) return;
    
    const savedReports = JSON.parse(localStorage.getItem('edoc_reports') || '[]');
    const recentReports = savedReports.slice(0, 5);
    
    container.innerHTML = '';
    
    if (recentReports.length === 0) {
        container.innerHTML = '<p class="no-reports">No reports generated yet. Create your first AI report above.</p>';
        return;
    }
    
    recentReports.forEach(report => {
        const reportItem = createReportItem(report);
        container.appendChild(reportItem);
    });
}

function createReportItem(report) {
    const reportItem = document.createElement('div');
    reportItem.className = 'report-item';
    
    const statusClass = report.status === 'completed' ? 'success' : 'pending';
    const timestamp = new Date(report.timestamp).toLocaleDateString();
    
    reportItem.innerHTML = `
        <div class="report-info">
            <h4>${report.patientName} - ${report.reportType}</h4>
            <p><i class="fas fa-calendar"></i> ${timestamp}</p>
            <p><i class="fas fa-user-md"></i> ${report.generatedBy}</p>
        </div>
        <div class="report-status">
            <span class="status-badge ${statusClass}">${report.status}</span>
        </div>
        <div class="report-actions">
            <button class="dashboard-btn dashboard-btn-outline dashboard-btn-sm" onclick="viewReport('${report.id}')">
                <i class="fas fa-eye"></i> View
            </button>
            <button class="dashboard-btn dashboard-btn-outline dashboard-btn-sm" onclick="downloadReport('${report.id}')">
                <i class="fas fa-download"></i> Download
            </button>
        </div>
    `;
    
    return reportItem;
}

function viewReport(reportId) {
    const savedReports = JSON.parse(localStorage.getItem('edoc_reports') || '[]');
    const report = savedReports.find(r => r.id === reportId);
    if (report) showReportPreview(report);
}

function downloadReport(reportId) {
    const savedReports = JSON.parse(localStorage.getItem('edoc_reports') || '[]');
    const report = savedReports.find(r => r.id === reportId);
    
    if (report) {
        const content = `E-Doc AI Report\n===============\n\nPatient: ${report.patientName}\nReport Type: ${report.reportType}\nDate: ${new Date(report.timestamp).toLocaleDateString()}\nGenerated By: ${report.generatedBy}\n\n${report.content}`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `report-${report.id}.txt`;
        link.click();
        URL.revokeObjectURL(url);
        showNotification('Report downloaded successfully', 'success');
    }
}

function showReportPreview(report) {
    const modal = document.getElementById('report-preview-modal');
    const content = document.getElementById('report-preview-content');
    if (modal && content) {
        content.innerHTML = report.content;
        modal.style.display = 'block';
    }
}

function previewReport() {
    const formData = new FormData(document.getElementById('report-form'));
    const data = Object.fromEntries(formData);
    if (!validateReportForm(data)) return;
    const previewReport = generateAIReport(data);
    showReportPreview(previewReport);
}

function saveAsDraft() {
    const formData = new FormData(document.getElementById('report-form'));
    const data = Object.fromEntries(formData);
    if (!data.patientName.trim() || !data.reportType) {
        showNotification('Please fill in required fields before saving as draft', 'error');
        return;
    }
    const draftReport = { ...data, id: 'DRAFT' + Date.now(), status: 'draft', timestamp: new Date().toISOString(), generatedBy: 'Dr. John Doe' };
    const savedDrafts = JSON.parse(localStorage.getItem('edoc_drafts') || '[]');
    savedDrafts.unshift(draftReport);
    localStorage.setItem('edoc_drafts', JSON.stringify(savedDrafts));
    showNotification('Report saved as draft successfully', 'success');
}

function showNewReportModal() {
    const modal = document.getElementById('new-report-modal');
    if (modal) modal.style.display = 'block';
}

function quickReport(type) {
    const modal = document.getElementById('new-report-modal');
    if (modal) modal.style.display = 'none';
    
    const reportTypeSelect = document.querySelector('select[name="reportType"]');
    if (reportTypeSelect) reportTypeSelect.value = type;
    
    document.querySelectorAll('.template-card').forEach(card => {
        card.classList.remove('selected');
        if (card.dataset.template === type) card.classList.add('selected');
    });
    
    document.getElementById('report-form').scrollIntoView({ behavior: 'smooth' });
    showNotification(`Quick ${type} report setup completed`, 'success');
}

function importReports() {
    showNotification('Import functionality will be implemented in future updates', 'info');
}

function viewAllReports() {
    showNotification('Full reports view will be implemented in future updates', 'info');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

// Modal close functionality
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) modal.style.display = 'none';
    });
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => modal.style.display = 'none');
    }
});

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('close')) {
        const modal = event.target.closest('.modal');
        if (modal) modal.style.display = 'none';
    }
});
