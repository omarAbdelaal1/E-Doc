// Analytics & Insights JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeAnalytics();
    initializeCharts();
    initializeStats();
    initializeTimeAnalytics();
    initializePerformanceInsights();
});

// Initialize analytics data
function initializeAnalytics() {
    loadAnalyticsData();
    updateDashboardStats();
}

// Load analytics data from localStorage or use default data
function loadAnalyticsData() {
    let analyticsData = localStorage.getItem('analyticsData');
    if (!analyticsData) {
        // Default analytics data
        const defaultData = {
            appointments: {
                total: 156,
                confirmed: 142,
                pending: 8,
                cancelled: 6,
                monthly: [45, 52, 48, 61, 55, 49, 58, 62, 59, 53, 47, 51]
            },
            patients: {
                total: 89,
                new: 23,
                returning: 66,
                demographics: {
                    ageGroups: [12, 18, 25, 32, 15, 8],
                    gender: [45, 55],
                    bloodTypes: [38, 8, 12, 4, 7, 6, 4, 11]
                }
            },
            revenue: {
                total: 125000,
                monthly: [8500, 9200, 8800, 10500, 9800, 8900, 10200, 10800, 10400, 9600, 9200, 9800],
                services: [
                    { name: 'Consultations', value: 45000, percentage: 36 },
                    { name: 'Procedures', value: 38000, percentage: 30.4 },
                    { name: 'Surgeries', value: 25000, percentage: 20 },
                    { name: 'Tests', value: 12000, percentage: 9.6 },
                    { name: 'Other', value: 5000, percentage: 4 }
                ]
            },
            performance: {
                patientSatisfaction: 4.7,
                waitTime: 12,
                appointmentCompletion: 94.2,
                doctorEfficiency: 88.5
            }
        };
        localStorage.setItem('analyticsData', JSON.stringify(defaultData));
        analyticsData = JSON.stringify(defaultData);
    }
    return JSON.parse(analyticsData);
}

// Initialize charts
function initializeCharts() {
    // Wait for Chart.js to be available
    if (typeof Chart !== 'undefined') {
        createAppointmentsChart();
        createDemographicsChart();
        createRevenueChart();
        createPerformanceChart();
    } else {
        // Fallback if Chart.js is not loaded
        setTimeout(initializeCharts, 100);
    }
}

// Create appointments chart
function createAppointmentsChart() {
    const ctx = document.getElementById('appointments-chart');
    if (!ctx) return;
    
    const data = loadAnalyticsData();
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Appointments',
                data: data.appointments.monthly,
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Create demographics chart
function createDemographicsChart() {
    const ctx = document.getElementById('demographics-chart');
    if (!ctx) return;
    
    const data = loadAnalyticsData();
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['18-25', '26-35', '36-45', '46-55', '56-65', '65+'],
            datasets: [{
                data: data.patients.demographics.ageGroups,
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Create revenue chart
function createRevenueChart() {
    const ctx = document.getElementById('revenue-chart');
    if (!ctx) return;
    
    const data = loadAnalyticsData();
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Revenue ($)',
                data: data.revenue.monthly,
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                borderColor: '#36A2EB',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Create performance chart
function createPerformanceChart() {
    const ctx = document.getElementById('performance-chart');
    if (!ctx) return;
    
    const data = loadAnalyticsData();
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Patient Satisfaction', 'Wait Time', 'Appointment Completion', 'Doctor Efficiency'],
            datasets: [{
                label: 'Performance Metrics',
                data: [
                    data.performance.patientSatisfaction * 20, // Convert to percentage
                    100 - (data.performance.waitTime / 30 * 100), // Invert wait time
                    data.performance.appointmentCompletion,
                    data.performance.doctorEfficiency
                ],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: '#FF6384',
                borderWidth: 2,
                pointBackgroundColor: '#FF6384'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        }
    });
}

// Initialize statistics
function initializeStats() {
    updateDashboardStats();
}

// Update dashboard statistics
function updateDashboardStats() {
    const data = loadAnalyticsData();
    
    updateStatElement('total-appointments', data.appointments.total);
    updateStatElement('total-patients', data.patients.total);
    updateStatElement('total-revenue', formatCurrency(data.revenue.total));
    updateStatElement('patient-satisfaction', data.performance.patientSatisfaction);
    
    // Animate numbers
    animateNumberChange('total-appointments', data.appointments.total);
    animateNumberChange('total-patients', data.patients.total);
    animateNumberChange('total-revenue', data.revenue.total);
    animateNumberChange('patient-satisfaction', data.performance.patientSatisfaction);
}

// Update individual stat element
function updateStatElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        if (id === 'total-revenue') {
            element.textContent = formatCurrency(value);
        } else if (id === 'patient-satisfaction') {
            element.textContent = value.toFixed(1);
        } else {
            element.textContent = value;
        }
    }
}

// Animate number changes
function animateNumberChange(elementId, finalValue) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startValue = 0;
    const duration = 1000;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = Math.floor(startValue + (finalValue - startValue) * progress);
        
        if (elementId === 'total-revenue') {
            element.textContent = formatCurrency(currentValue);
        } else if (elementId === 'patient-satisfaction') {
            element.textContent = (currentValue / 100).toFixed(1);
        } else {
            element.textContent = currentValue;
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Initialize time analytics
function initializeTimeAnalytics() {
    updateTimeAnalytics();
}

// Update time analytics
function updateTimeAnalytics() {
    const data = loadAnalyticsData();
    
    // Update time-based metrics
    const timeMetrics = document.querySelectorAll('.time-metric');
    timeMetrics.forEach(metric => {
        const metricType = metric.dataset.metric;
        let value = '';
        
        switch (metricType) {
            case 'peak-hours':
                value = '9:00 AM - 11:00 AM';
                break;
            case 'avg-wait-time':
                value = `${data.performance.waitTime} minutes`;
                break;
            case 'busiest-day':
                value = 'Wednesday';
                break;
            case 'completion-rate':
                value = `${data.performance.appointmentCompletion}%`;
                break;
        }
        
        if (value) {
            metric.textContent = value;
        }
    });
}

// Initialize performance insights
function initializePerformanceInsights() {
    updatePerformanceInsights();
}

// Update performance insights
function updatePerformanceInsights() {
    const data = loadAnalyticsData();
    
    const insightsContainer = document.querySelector('.performance-insights');
    if (!insightsContainer) return;
    
    const insights = generateInsights(data);
    
    insightsContainer.innerHTML = '';
    insights.forEach(insight => {
        const insightElement = createInsightElement(insight);
        insightsContainer.appendChild(insightElement);
    });
}

// Generate insights based on data
function generateInsights(data) {
    const insights = [];
    
    // Appointment insights
    if (data.appointments.confirmed / data.appointments.total > 0.9) {
        insights.push({
            type: 'positive',
            title: 'High Confirmation Rate',
            description: 'Excellent appointment confirmation rate of ' + 
                        Math.round(data.appointments.confirmed / data.appointments.total * 100) + '%'
        });
    }
    
    // Revenue insights
    const avgRevenue = data.revenue.monthly.reduce((a, b) => a + b, 0) / data.revenue.monthly.length;
    if (avgRevenue > 10000) {
        insights.push({
            type: 'positive',
            title: 'Strong Revenue Performance',
            description: 'Average monthly revenue of ' + formatCurrency(avgRevenue)
        });
    }
    
    // Patient satisfaction insights
    if (data.performance.patientSatisfaction >= 4.5) {
        insights.push({
            type: 'positive',
            title: 'High Patient Satisfaction',
            description: 'Patient satisfaction score of ' + data.performance.patientSatisfaction + '/5.0'
        });
    }
    
    // Wait time insights
    if (data.performance.waitTime > 15) {
        insights.push({
            type: 'warning',
            title: 'Wait Time Alert',
            description: 'Average wait time of ' + data.performance.waitTime + ' minutes - consider optimization'
        });
    }
    
    return insights;
}

// Create insight element
function createInsightElement(insight) {
    const element = document.createElement('div');
    element.className = `insight-item ${insight.type}`;
    element.innerHTML = `
        <div class="insight-icon">
            <i class="fas ${insight.type === 'positive' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
        </div>
        <div class="insight-content">
            <h4>${insight.title}</h4>
            <p>${insight.description}</p>
        </div>
    `;
    return element;
}

// Export analytics data
function exportAnalytics() {
    try {
        const data = loadAnalyticsData();
        const exportData = {
            exportDate: new Date().toISOString(),
            analytics: data
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        showNotification('Analytics data exported successfully', 'success');
    } catch (error) {
        console.error('Error exporting analytics:', error);
        showNotification('Error exporting analytics data', 'error');
    }
}

// Generate PDF report
function generatePDFReport() {
    showNotification('PDF report generation started...', 'info');
    
    // Simulate PDF generation
    setTimeout(() => {
        showNotification('PDF report generated successfully', 'success');
    }, 2000);
}

// Refresh analytics data
function refreshAnalytics() {
    showNotification('Refreshing analytics data...', 'info');
    
    // Simulate data refresh
    setTimeout(() => {
        updateDashboardStats();
        updateTimeAnalytics();
        updatePerformanceInsights();
        showNotification('Analytics data refreshed successfully', 'success');
    }, 1000);
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
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
