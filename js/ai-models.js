// AI Models JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeAIModels();
    setupModelCategories();
    setupModelActions();
});

// Initialize AI Models
function initializeAIModels() {
    // Initialize model status indicators
    updateModelStatuses();
    
    // Setup search functionality
    setupModelSearch();
    
    // Initialize model metrics
    updateModelMetrics();
}

// Setup model categories
function setupModelCategories() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const modelCards = document.querySelectorAll('.model-card');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Update active category button
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter model cards
            filterModelsByCategory(category);
        });
    });
}

// Filter models by category
function filterModelsByCategory(category) {
    const modelCards = document.querySelectorAll('.model-card');
    
    modelCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease-in';
        } else {
            card.style.display = 'none';
        }
    });
}

// Setup model actions
function setupModelActions() {
    // Launch model buttons
    const launchBtns = document.querySelectorAll('[onclick*="launchModel"]');
    launchBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const modelType = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            launchModel(modelType);
        });
    });
    
    // View details buttons
    const detailsBtns = document.querySelectorAll('[onclick*="viewModelDetails"]');
    detailsBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const modelType = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            viewModelDetails(modelType);
        });
    });
}

// Launch AI model
function launchModel(modelType) {
    const modelInfo = getModelInfo(modelType);
    
    if (!modelInfo) {
        alert('Model information not found.');
        return;
    }
    
    // Show loading state
    const launchBtn = document.querySelector(`[onclick*="launchModel('${modelType}')"]`);
    const originalText = launchBtn.innerHTML;
    launchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Launching...';
    launchBtn.disabled = true;
    
    // Simulate model launch
    setTimeout(() => {
        // Reset button
        launchBtn.innerHTML = originalText;
        launchBtn.disabled = false;
        
        // Redirect to appropriate page based on model type
        switch(modelType) {
            case 'diagnostic':
                window.location.href = 'ai-reports.html?model=diagnostic';
                break;
            case 'imaging':
                window.location.href = 'ai-reports.html?model=imaging';
                break;
            case 'treatment':
                window.location.href = 'ai-reports.html?model=treatment';
                break;
            case 'drug-interaction':
                window.location.href = 'ai-chat.html?model=drug-interaction';
                break;
            case 'research':
                window.location.href = 'ai-chat.html?model=research';
                break;
            case 'symptom':
                window.location.href = 'ai-chat.html?model=symptom';
                break;
            default:
                window.location.href = 'ai-reports.html';
        }
    }, 2000);
}

// View model details
function viewModelDetails(modelType) {
    const modelInfo = getModelInfo(modelType);
    
    if (!modelInfo) {
        alert('Model information not found.');
        return;
    }
    
    // Populate modal
    document.getElementById('model-modal-title').textContent = modelInfo.title;
    document.getElementById('model-modal-body').innerHTML = `
        <div class="model-details">
            <div class="model-detail-section">
                <h4>Description</h4>
                <p>${modelInfo.description}</p>
            </div>
            
            <div class="model-detail-section">
                <h4>Technical Specifications</h4>
                <div class="specs-grid">
                    <div class="spec-item">
                        <span class="spec-label">Model Type:</span>
                        <span class="spec-value">${modelInfo.specs.type}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Training Data:</span>
                        <span class="spec-value">${modelInfo.specs.trainingData}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Last Updated:</span>
                        <span class="spec-value">${modelInfo.specs.lastUpdated}</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">API Version:</span>
                        <span class="spec-value">${modelInfo.specs.apiVersion}</span>
                    </div>
                </div>
            </div>
            
            <div class="model-detail-section">
                <h4>Performance Metrics</h4>
                <div class="metrics-grid">
                    ${Object.entries(modelInfo.metrics).map(([key, value]) => `
                        <div class="metric-item">
                            <span class="metric-label">${key}:</span>
                            <span class="metric-value">${value}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="model-detail-section">
                <h4>Use Cases</h4>
                <ul class="use-cases">
                    ${modelInfo.useCases.map(useCase => `<li>${useCase}</li>`).join('')}
                </ul>
            </div>
            
            <div class="model-detail-section">
                <h4>Limitations</h4>
                <ul class="limitations">
                    ${modelInfo.limitations.map(limitation => `<li>${limitation}</li>`).join('')}
                </ul>
            </div>
        </div>
        
        <div class="model-actions">
            <button class="dashboard-btn dashboard-btn-primary" onclick="launchModel('${modelType}')">
                <i class="fas fa-play"></i>
                Launch Model
            </button>
            <button class="dashboard-btn dashboard-btn-outline" onclick="closeModelModal()">
                <i class="fas fa-times"></i>
                Close
            </button>
        </div>
    `;
    
    // Show modal
    document.getElementById('model-details-modal').style.display = 'block';
}

// Get model information
function getModelInfo(modelType) {
    const modelData = {
        diagnostic: {
            title: 'Diagnostic AI Assistant',
            description: 'Advanced diagnostic assistance using machine learning algorithms trained on millions of medical cases. This model provides preliminary assessments and differential diagnoses based on patient symptoms and medical history.',
            specs: {
                type: 'Deep Learning (Transformer)',
                trainingData: '2.5M+ medical cases',
                lastUpdated: '2024-01-15',
                apiVersion: 'v2.1.3'
            },
            metrics: {
                'Accuracy': '94.2%',
                'Response Time': '2.3s',
                'False Positive Rate': '3.1%',
                'False Negative Rate': '2.7%'
            },
            useCases: [
                'Preliminary diagnosis',
                'Differential diagnosis',
                'Symptom analysis',
                'Risk assessment',
                'Referral recommendations'
            ],
            limitations: [
                'Not a replacement for professional medical judgment',
                'Limited to trained data scope',
                'May not recognize rare conditions',
                'Requires clinical validation'
            ]
        },
        imaging: {
            title: 'Medical Imaging Analyzer',
            description: 'Computer vision AI for analyzing X-rays, MRIs, CT scans, and ultrasound images with high accuracy. Uses convolutional neural networks trained on extensive medical imaging datasets.',
            specs: {
                type: 'Convolutional Neural Network (CNN)',
                trainingData: '500K+ medical images',
                lastUpdated: '2024-01-20',
                apiVersion: 'v3.0.1'
            },
            metrics: {
                'Accuracy': '96.8%',
                'Processing Time': '5.1s',
                'Sensitivity': '95.2%',
                'Specificity': '97.1%'
            },
            useCases: [
                'X-ray analysis',
                'MRI interpretation',
                'CT scan evaluation',
                'Ultrasound assessment',
                'Pathology detection'
            ],
            limitations: [
                'Image quality dependent',
                'Limited to trained modalities',
                'Requires radiologist review',
                'May miss subtle findings'
            ]
        },
        treatment: {
            title: 'Treatment Planner',
            description: 'AI-powered treatment recommendations based on patient history and current medical guidelines. Integrates evidence-based medicine with personalized patient factors.',
            specs: {
                type: 'Machine Learning (Ensemble)',
                trainingData: '1.8M+ treatment protocols',
                lastUpdated: '2024-01-18',
                apiVersion: 'v2.0.5'
            },
            metrics: {
                'Success Rate': '89.5%',
                'Update Frequency': 'Daily',
                'Guideline Compliance': '94.7%',
                'Personalization Score': '87.3%'
            },
            useCases: [
                'Treatment planning',
                'Medication recommendations',
                'Dosage optimization',
                'Contraindication checking',
                'Follow-up scheduling'
            ],
            limitations: [
                'Based on available guidelines',
                'May not cover all scenarios',
                'Requires clinical judgment',
                'Limited to trained conditions'
            ]
        },
        'drug-interaction': {
            title: 'Drug Interaction Checker',
            description: 'Real-time drug interaction analysis and contraindication checking for patient safety. Comprehensive database with up-to-date pharmaceutical information.',
            specs: {
                type: 'Knowledge Graph + ML',
                trainingData: '50K+ drugs, 100K+ interactions',
                lastUpdated: 'Real-time',
                apiVersion: 'v1.9.2'
            },
            metrics: {
                'Database Size': '50K+ Drugs',
                'Response Time': '0.8s',
                'Coverage': '98.7%',
                'Update Frequency': 'Real-time'
            },
            useCases: [
                'Drug interaction checking',
                'Contraindication analysis',
                'Dosage verification',
                'Allergy screening',
                'Polypharmacy assessment'
            ],
            limitations: [
                'Limited to known interactions',
                'May not include new drugs',
                'Individual variations exist',
                'Requires clinical validation'
            ]
        },
        research: {
            title: 'Medical Research Assistant',
            description: 'AI-powered research tool for analyzing medical literature and clinical trial data. Provides insights and summaries from vast medical knowledge base.',
            specs: {
                type: 'Natural Language Processing (NLP)',
                trainingData: '2M+ medical papers',
                lastUpdated: 'Real-time',
                apiVersion: 'v2.2.0'
            },
            metrics: {
                'Papers Analyzed': '2M+',
                'Update Frequency': 'Real-time',
                'Response Time': '3.2s',
                'Relevance Score': '91.4%'
            },
            useCases: [
                'Literature review',
                'Clinical trial analysis',
                'Evidence synthesis',
                'Research gap identification',
                'Citation analysis'
            ],
            limitations: [
                'Limited to published data',
                'May not include latest research',
                'Quality varies by source',
                'Requires expert interpretation'
            ]
        },
        symptom: {
            title: 'Symptom Checker',
            description: 'Intelligent symptom analysis and preliminary assessment based on patient-reported symptoms. Uses natural language processing and medical knowledge graphs.',
            specs: {
                type: 'NLP + Knowledge Graph',
                trainingData: '1.2M+ symptom cases',
                lastUpdated: '2024-01-12',
                apiVersion: 'v1.8.7'
            },
            metrics: {
                'Accuracy': '91.3%',
                'Coverage': '500+ Conditions',
                'Response Time': '1.5s',
                'User Satisfaction': '88.9%'
            },
            useCases: [
                'Symptom assessment',
                'Condition screening',
                'Urgency evaluation',
                'Referral guidance',
                'Patient education'
            ],
            limitations: [
                'Not a diagnostic tool',
                'Limited to common conditions',
                'Requires medical evaluation',
                'May cause anxiety'
            ]
        }
    };
    
    return modelData[modelType];
}

// Close model modal
function closeModelModal() {
    document.getElementById('model-details-modal').style.display = 'none';
}

// Update model statuses
function updateModelStatuses() {
    const statusIndicators = document.querySelectorAll('.model-status');
    
    statusIndicators.forEach(status => {
        // Simulate random status updates
        if (Math.random() > 0.95) {
            status.textContent = 'Updating...';
            status.className = 'model-status updating';
            
            setTimeout(() => {
                status.textContent = 'Active';
                status.className = 'model-status active';
            }, 3000);
        }
    });
}

// Setup model search
function setupModelSearch() {
    const searchInput = document.querySelector('.dashboard-search input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterModelsBySearch(searchTerm);
        });
    }
}

// Filter models by search
function filterModelsBySearch(searchTerm) {
    const modelCards = document.querySelectorAll('.model-card');
    
    modelCards.forEach(card => {
        const title = card.querySelector('.model-title').textContent.toLowerCase();
        const description = card.querySelector('.model-description').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Update model metrics
function updateModelMetrics() {
    // Simulate real-time metric updates
    setInterval(() => {
        const metricValues = document.querySelectorAll('.metric-value');
        
        metricValues.forEach(metric => {
            if (metric.textContent.includes('%')) {
                const currentValue = parseFloat(metric.textContent);
                const variation = (Math.random() - 0.5) * 0.2; // ±0.1%
                const newValue = Math.max(0, Math.min(100, currentValue + variation));
                metric.textContent = newValue.toFixed(1) + '%';
            }
        });
    }, 30000); // Update every 30 seconds
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('model-details-modal');
    if (event.target === modal) {
        closeModelModal();
    }
});

// Close modal with escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModelModal();
    }
});

// Add fade-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
