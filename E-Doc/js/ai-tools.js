// AI Tools JavaScript - Global Medical AI Library

// Global variables
let selectedImages = [];
let selectedLabFiles = [];
let cornerstoneEnabled = false;

// Initialize AI Tools
document.addEventListener('DOMContentLoaded', function() {
    initializeAITools();
    setupEventListeners();
    initializeCornerstone();
});

// Initialize AI Tools Components
function initializeAITools() {
    // Initialize file upload areas
    setupImageUpload();
    setupLabUpload();
    
    // Initialize Cornerstone for medical image viewing
    if (typeof cornerstone !== 'undefined') {
        initializeCornerstone();
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Image analysis button
    const analyzeImagesBtn = document.getElementById('analyzeImages');
    if (analyzeImagesBtn) {
        analyzeImagesBtn.addEventListener('click', analyzeImages);
    }
    
    // Lab analysis button
    const analyzeLabBtn = document.getElementById('analyzeLab');
    if (analyzeLabBtn) {
        analyzeLabBtn.addEventListener('click', analyzeLabData);
    }
    
    // File input listeners
    const imageInput = document.getElementById('imageInput');
    if (imageInput) {
        imageInput.addEventListener('change', handleImageSelection);
    }
    
    const labInput = document.getElementById('labInput');
    if (labInput) {
        labInput.addEventListener('change', handleLabFileSelection);
    }
}

// Setup Image Upload
function setupImageUpload() {
    const uploadArea = document.getElementById('imageUploadArea');
    if (!uploadArea) return;
    
    // Drag and drop functionality
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        const files = Array.from(e.dataTransfer.files);
        handleImageFiles(files);
    });
    
    // Click to browse
    uploadArea.addEventListener('click', function() {
        document.getElementById('imageInput').click();
    });
}

// Setup Lab Upload
function setupLabUpload() {
    const uploadArea = document.getElementById('labUploadArea');
    if (!uploadArea) return;
    
    // Drag and drop functionality
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        const files = Array.from(e.dataTransfer.files);
        handleLabFiles(files);
    });
    
    // Click to browse
    uploadArea.addEventListener('click', function() {
        document.getElementById('labInput').click();
    });
}

// Handle Image Selection
function handleImageSelection(e) {
    const files = Array.from(e.target.files);
    handleImageFiles(files);
}

// Handle Lab File Selection
function handleLabFileSelection(e) {
    const files = Array.from(e.target.files);
    handleLabFiles(files);
}

// Handle Image Files
function handleImageFiles(files) {
    const validFiles = files.filter(file => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/dcm', 'application/dicom'];
        return validTypes.includes(file.type) || file.name.toLowerCase().endsWith('.dcm');
    });
    
    if (validFiles.length === 0) {
        showAlert('Please select valid image files (JPG, PNG, DICOM)', 'error');
        return;
    }
    
    selectedImages = validFiles;
    displayImagePreviews(validFiles);
    updateAnalyzeButton();
}

// Handle Lab Files
function handleLabFiles(files) {
    const validFiles = files.filter(file => {
        const validTypes = ['text/csv', 'application/pdf', 'text/plain'];
        return validTypes.includes(file.type) || 
               file.name.toLowerCase().endsWith('.csv') || 
               file.name.toLowerCase().endsWith('.pdf') ||
               file.name.toLowerCase().endsWith('.txt');
    });
    
    if (validFiles.length === 0) {
        showAlert('Please select valid lab files (CSV, PDF, TXT)', 'error');
        return;
    }
    
    selectedLabFiles = validFiles;
    displayLabFilePreviews(validFiles);
    updateLabAnalyzeButton();
}

// Display Image Previews
function displayImagePreviews(files) {
    const previewSection = document.getElementById('imagePreview');
    const previewGrid = document.getElementById('previewGrid');
    
    if (!previewSection || !previewGrid) return;
    
    previewGrid.innerHTML = '';
    
    files.forEach((file, index) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        
        if (file.type.includes('image') && !file.name.toLowerCase().endsWith('.dcm')) {
            // Regular image preview
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.alt = file.name;
            img.className = 'preview-image';
            
            previewItem.appendChild(img);
        } else {
            // DICOM or other file type
            const icon = document.createElement('i');
            icon.className = 'fas fa-file-medical preview-icon';
            
            previewItem.appendChild(icon);
        }
        
        const fileName = document.createElement('p');
        fileName.textContent = file.name;
        fileName.className = 'preview-filename';
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-file-btn';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.onclick = () => removeImage(index);
        
        previewItem.appendChild(fileName);
        previewItem.appendChild(removeBtn);
        previewGrid.appendChild(previewItem);
    });
    
    previewSection.style.display = 'block';
}

// Display Lab File Previews
function displayLabFilePreviews(files) {
    const previewSection = document.getElementById('labPreview');
    const previewGrid = document.getElementById('labPreviewGrid');
    
    if (!previewSection || !previewGrid) return;
    
    previewGrid.innerHTML = '';
    
    files.forEach((file, index) => {
        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';
        
        const icon = document.createElement('i');
        icon.className = getFileIcon(file.name);
        
        const fileName = document.createElement('p');
        fileName.textContent = file.name;
        fileName.className = 'preview-filename';
        
        const fileSize = document.createElement('span');
        fileSize.textContent = formatFileSize(file.size);
        fileSize.className = 'preview-filesize';
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-file-btn';
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.onclick = () => removeLabFile(index);
        
        previewItem.appendChild(icon);
        previewItem.appendChild(fileName);
        previewItem.appendChild(fileSize);
        previewItem.appendChild(removeBtn);
        previewGrid.appendChild(previewItem);
    });
    
    previewSection.style.display = 'block';
}

// Get File Icon
function getFileIcon(filename) {
    if (filename.toLowerCase().endsWith('.csv')) {
        return 'fas fa-file-csv preview-icon';
    } else if (filename.toLowerCase().endsWith('.pdf')) {
        return 'fas fa-file-pdf preview-icon';
    } else {
        return 'fas fa-file-text preview-icon';
    }
}

// Remove Image
function removeImage(index) {
    selectedImages.splice(index, 1);
    displayImagePreviews(selectedImages);
    updateAnalyzeButton();
    
    if (selectedImages.length === 0) {
        document.getElementById('imagePreview').style.display = 'none';
    }
}

// Remove Lab File
function removeLabFile(index) {
    selectedLabFiles.splice(index, 1);
    displayLabFilePreviews(selectedLabFiles);
    updateLabAnalyzeButton();
    
    if (selectedLabFiles.length === 0) {
        document.getElementById('labPreview').style.display = 'none';
    }
}

// Update Analyze Button
function updateAnalyzeButton() {
    const analyzeBtn = document.getElementById('analyzeImages');
    if (analyzeBtn) {
        analyzeBtn.disabled = selectedImages.length === 0;
    }
}

// Update Lab Analyze Button
function updateLabAnalyzeButton() {
    const analyzeBtn = document.getElementById('analyzeLab');
    if (analyzeBtn) {
        analyzeBtn.disabled = selectedLabFiles.length === 0;
    }
}

// Initialize Cornerstone
function initializeCornerstone() {
    if (typeof cornerstone === 'undefined') {
        console.warn('Cornerstone.js not loaded');
        return;
    }
    
    cornerstoneEnabled = true;
    
    // Initialize Cornerstone tools
    if (typeof cornerstoneTools !== 'undefined') {
        cornerstoneTools.init({
            showSVGCursors: true
        });
    }
}

// Analyze Images with AI
async function analyzeImages() {
    if (selectedImages.length === 0) {
        showAlert('Please select images to analyze', 'warning');
        return;
    }
    
    try {
        showLoadingOverlay('Analyzing images with AI...');
        
        // Show loading spinner
        const loadingSpinner = document.getElementById('imageLoading');
        if (loadingSpinner) {
            loadingSpinner.style.display = 'block';
        }
        
        // Prepare form data
        const formData = new FormData();
        selectedImages.forEach((file, index) => {
            formData.append(`image_${index}`, file);
        });
        
        // Call AI API
        const response = await apiRequest('/api/upload-image/', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.success) {
            displayImageResults(response.data);
        } else {
            showAlert(response.message || 'Analysis failed', 'error');
        }
        
    } catch (error) {
        console.error('Error analyzing images:', error);
        showAlert('Error analyzing images. Please try again.', 'error');
    } finally {
        hideLoadingOverlay();
        
        // Hide loading spinner
        const loadingSpinner = document.getElementById('imageLoading');
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
    }
}

// Analyze Lab Data with AI
async function analyzeLabData() {
    if (selectedLabFiles.length === 0) {
        showAlert('Please select lab files to analyze', 'warning');
        return;
    }
    
    try {
        showLoadingOverlay('Analyzing lab data with AI...');
        
        // Show loading spinner
        const loadingSpinner = document.getElementById('labLoading');
        if (loadingSpinner) {
            loadingSpinner.style.display = 'block';
        }
        
        // Prepare form data
        const formData = new FormData();
        selectedLabFiles.forEach((file, index) => {
            formData.append(`lab_file_${index}`, file);
        });
        
        // Call AI API
        const response = await apiRequest('/api/upload-lab/', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.success) {
            displayLabResults(response.data);
        } else {
            showAlert(response.message || 'Analysis failed', 'error');
        }
        
    } catch (error) {
        console.error('Error analyzing lab data:', error);
        showAlert('Error analyzing lab data. Please try again.', 'error');
    } finally {
        hideLoadingOverlay();
        
        // Hide loading spinner
        const loadingSpinner = document.getElementById('labLoading');
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
    }
}

// Display Image Analysis Results
function displayImageResults(results) {
    const resultsSection = document.getElementById('imageResults');
    const resultsContent = document.getElementById('imageResultsContent');
    
    if (!resultsSection || !resultsContent) return;
    
    resultsContent.innerHTML = '';
    
    if (results.diagnoses && results.diagnoses.length > 0) {
        results.diagnoses.forEach((diagnosis, index) => {
            const resultCard = document.createElement('div');
            resultCard.className = 'result-card';
            
            resultCard.innerHTML = `
                <div class="result-header">
                    <h4>Image ${index + 1} Analysis</h4>
                    <span class="confidence-score">${diagnosis.confidence}% Confidence</span>
                </div>
                <div class="result-content">
                    <div class="diagnosis-item">
                        <strong>Primary Diagnosis:</strong> ${diagnosis.primary_diagnosis}
                    </div>
                    <div class="diagnosis-item">
                        <strong>Secondary Findings:</strong> ${diagnosis.secondary_findings || 'None detected'}
                    </div>
                    <div class="diagnosis-item">
                        <strong>Recommendations:</strong> ${diagnosis.recommendations || 'No specific recommendations'}
                    </div>
                    <div class="diagnosis-item">
                        <strong>Risk Level:</strong> 
                        <span class="risk-level risk-${diagnosis.risk_level || 'low'}">${diagnosis.risk_level || 'Low'}</span>
                    </div>
                </div>
                <div class="result-actions">
                    <button class="btn btn-outline btn-sm" onclick="viewDetailedResults(${index})">
                        <i class="fas fa-search"></i> Detailed View
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="downloadReport(${index})">
                        <i class="fas fa-download"></i> Download Report
                    </button>
                </div>
            `;
            
            resultsContent.appendChild(resultCard);
        });
    } else {
        resultsContent.innerHTML = `
            <div class="no-results">
                <i class="fas fa-info-circle"></i>
                <p>No analysis results available</p>
            </div>
        `;
    }
    
    resultsSection.style.display = 'block';
}

// Display Lab Analysis Results
function displayLabResults(results) {
    const resultsSection = document.getElementById('labResults');
    const resultsContent = document.getElementById('labResultsContent');
    
    if (!resultsSection || !resultsContent) return;
    
    resultsContent.innerHTML = '';
    
    if (results.interpretation) {
        const resultCard = document.createElement('div');
        resultCard.className = 'result-card';
        
        resultCard.innerHTML = `
            <div class="result-header">
                <h4>Lab Test Interpretation</h4>
                <span class="confidence-score">${results.confidence || 'N/A'}% Confidence</span>
            </div>
            <div class="result-content">
                <div class="interpretation-item">
                    <strong>Overall Assessment:</strong> ${results.interpretation.overall_assessment}
                </div>
                <div class="interpretation-item">
                    <strong>Key Findings:</strong> ${results.interpretation.key_findings || 'No significant findings'}
                </div>
                <div class="interpretation-item">
                    <strong>Trends:</strong> ${results.interpretation.trends || 'No trend data available'}
                </div>
                <div class="interpretation-item">
                    <strong>Recommendations:</strong> ${results.interpretation.recommendations || 'No specific recommendations'}
                </div>
            </div>
            <div class="result-actions">
                <button class="btn btn-outline btn-sm" onclick="viewLabDetailedResults()">
                    <i class="fas fa-search"></i> Detailed View
                </button>
                <button class="btn btn-outline btn-sm" onclick="downloadLabReport()">
                    <i class="fas fa-download"></i> Download Report
                </button>
            </div>
        `;
        
        resultsContent.appendChild(resultCard);
    } else {
        resultsContent.innerHTML = `
            <div class="no-results">
                <i class="fas fa-info-circle"></i>
                <p>No lab analysis results available</p>
            </div>
        `;
    }
    
    resultsSection.style.display = 'block';
}

// View Detailed Results
function viewDetailedResults(imageIndex) {
    // This would typically open a modal or navigate to a detailed results page
    showAlert(`Viewing detailed results for image ${imageIndex + 1}`, 'info');
}

// Download Report
function downloadReport(imageIndex) {
    // This would typically generate and download a PDF report
    showAlert(`Downloading report for image ${imageIndex + 1}`, 'info');
}

// View Lab Detailed Results
function viewLabDetailedResults() {
    showAlert('Viewing detailed lab analysis results', 'info');
}

// Download Lab Report
function downloadLabReport() {
    showAlert('Downloading lab analysis report', 'info');
}

// Clear All Results
function clearResults() {
    // Clear image results
    const imageResults = document.getElementById('imageResults');
    if (imageResults) {
        imageResults.style.display = 'none';
    }
    
    // Clear lab results
    const labResults = document.getElementById('labResults');
    if (labResults) {
        labResults.style.display = 'none';
    }
    
    // Clear file selections
    selectedImages = [];
    selectedLabFiles = [];
    
    // Clear previews
    const imagePreview = document.getElementById('imagePreview');
    if (imagePreview) {
        imagePreview.style.display = 'none';
    }
    
    const labPreview = document.getElementById('labPreview');
    if (labPreview) {
        labPreview.style.display = 'none';
    }
    
    // Reset buttons
    updateAnalyzeButton();
    updateLabAnalyzeButton();
}

// Reset Form
function resetForm() {
    clearResults();
    
    // Reset file inputs
    const imageInput = document.getElementById('imageInput');
    if (imageInput) {
        imageInput.value = '';
    }
    
    const labInput = document.getElementById('labInput');
    if (labInput) {
        labInput.value = '';
    }
    
    showAlert('Form reset successfully', 'success');
}
