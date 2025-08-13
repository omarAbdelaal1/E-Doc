// Team Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeTeam();
    initializeStats();
    initializeCollaborationTools();
    initializePerformanceMetrics();
    initializeModals();
});

// Initialize team data
function initializeTeam() {
    loadTeamMembers();
    displayTeamMembers();
}

// Load team members from localStorage or use default data
function loadTeamMembers() {
    let teamMembers = localStorage.getItem('teamMembers');
    if (!teamMembers) {
        // Default team data
        const defaultTeam = [
            {
                id: 1,
                name: 'Dr. Sarah Johnson',
                role: 'Chief Medical Officer',
                specialty: 'Cardiology',
                email: 'sarah.johnson@edoc.com',
                phone: '+1-555-0101',
                avatar: 'SJ',
                status: 'Active',
                experience: '15 years',
                patients: 45,
                rating: 4.9,
                availability: 'Mon-Fri',
                department: 'Cardiology'
            },
            {
                id: 2,
                name: 'Dr. Michael Chen',
                role: 'Senior Neurologist',
                specialty: 'Neurology',
                email: 'michael.chen@edoc.com',
                phone: '+1-555-0102',
                avatar: 'MC',
                status: 'Active',
                experience: '12 years',
                patients: 38,
                rating: 4.8,
                availability: 'Mon-Thu',
                department: 'Neurology'
            },
            {
                id: 3,
                name: 'Dr. Emily Rodriguez',
                role: 'Oncologist',
                specialty: 'Oncology',
                email: 'emily.rodriguez@edoc.com',
                phone: '+1-555-0103',
                avatar: 'ER',
                status: 'Active',
                experience: '10 years',
                patients: 32,
                rating: 4.7,
                availability: 'Mon-Fri',
                department: 'Oncology'
            },
            {
                id: 4,
                name: 'Dr. David Thompson',
                role: 'Orthopedic Surgeon',
                specialty: 'Orthopedics',
                email: 'david.thompson@edoc.com',
                phone: '+1-555-0104',
                avatar: 'DT',
                status: 'Active',
                experience: '18 years',
                patients: 52,
                rating: 4.9,
                availability: 'Tue-Sat',
                department: 'Orthopedics'
            },
            {
                id: 5,
                name: 'Dr. Lisa Wang',
                role: 'Dermatologist',
                specialty: 'Dermatology',
                email: 'lisa.wang@edoc.com',
                phone: '+1-555-0105',
                avatar: 'LW',
                status: 'Active',
                experience: '8 years',
                patients: 28,
                rating: 4.6,
                availability: 'Mon-Fri',
                department: 'Dermatology'
            },
            {
                id: 6,
                name: 'Dr. James Wilson',
                role: 'Pediatrician',
                specialty: 'Pediatrics',
                email: 'james.wilson@edoc.com',
                phone: '+1-555-0106',
                avatar: 'JW',
                status: 'Active',
                experience: '14 years',
                patients: 41,
                rating: 4.8,
                availability: 'Mon-Fri',
                department: 'Pediatrics'
            }
        ];
        localStorage.setItem('teamMembers', JSON.stringify(defaultTeam));
        teamMembers = JSON.stringify(defaultTeam);
    }
    return JSON.parse(teamMembers);
}

// Display team members in the grid
function displayTeamMembers() {
    const teamMembers = loadTeamMembers();
    const teamGrid = document.querySelector('.team-grid');
    
    if (!teamGrid) return;
    
    teamGrid.innerHTML = '';
    
    teamMembers.forEach(member => {
        const memberCard = createTeamMemberCard(member);
        teamGrid.appendChild(memberCard);
    });
}

// Create team member card
function createTeamMemberCard(member) {
    const card = document.createElement('div');
    card.className = 'team-member-card';
    card.innerHTML = `
        <div class="member-header">
            <div class="member-avatar">
                <span>${member.avatar}</span>
            </div>
            <div class="member-status ${member.status.toLowerCase()}">
                <span class="status-dot"></span>
                ${member.status}
            </div>
        </div>
        <div class="member-body">
            <h4>${member.name}</h4>
            <p class="member-role">${member.role}</p>
            <p class="member-specialty">
                <i class="fas fa-stethoscope"></i>
                ${member.specialty}
            </p>
            <p class="member-experience">
                <i class="fas fa-clock"></i>
                ${member.experience}
            </p>
            <div class="member-stats">
                <div class="stat-item">
                    <span class="stat-value">${member.patients}</span>
                    <span class="stat-label">Patients</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">${member.rating}</span>
                    <span class="stat-label">Rating</span>
                </div>
            </div>
        </div>
        <div class="member-actions">
            <button onclick="viewMemberDetails(${member.id})" class="btn btn-sm btn-outline">
                <i class="fas fa-eye"></i> View
            </button>
            <button onclick="editMember(${member.id})" class="btn btn-sm btn-outline">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button onclick="contactMember(${member.id})" class="btn btn-sm btn-primary">
                <i class="fas fa-envelope"></i> Contact
            </button>
        </div>
    `;
    return card;
}

// Initialize statistics
function initializeStats() {
    updateTeamStats();
}

// Update team statistics
function updateTeamStats() {
    const teamMembers = loadTeamMembers();
    
    const totalMembers = teamMembers.length;
    const activeMembers = teamMembers.filter(member => member.status === 'Active').length;
    const totalPatients = teamMembers.reduce((sum, member) => sum + member.patients, 0);
    const avgRating = (teamMembers.reduce((sum, member) => sum + member.rating, 0) / teamMembers.length).toFixed(1);
    
    updateStatElement('total-team-members', totalMembers);
    updateStatElement('active-members', activeMembers);
    updateStatElement('total-patients', totalPatients);
    updateStatElement('avg-rating', avgRating);
}

// Update individual stat element
function updateStatElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

// Initialize collaboration tools
function initializeCollaborationTools() {
    const toolItems = document.querySelectorAll('.tool-item');
    toolItems.forEach(tool => {
        tool.addEventListener('click', function() {
            const toolType = this.dataset.tool;
            openCollaborationTool(toolType);
        });
    });
}

// Open collaboration tool
function openCollaborationTool(toolType) {
    switch (toolType) {
        case 'chat':
            showNotification('Opening team chat...', 'info');
            // This would typically open a chat interface
            break;
        case 'video-call':
            showNotification('Initiating video call...', 'info');
            // This would typically open a video call interface
            break;
        case 'file-sharing':
            showNotification('Opening file sharing...', 'info');
            // This would typically open a file sharing interface
            break;
        case 'calendar':
            showNotification('Opening shared calendar...', 'info');
            // This would typically open a shared calendar
            break;
        case 'task-management':
            showNotification('Opening task management...', 'info');
            // This would typically open a task management interface
            break;
        case 'knowledge-base':
            showNotification('Opening knowledge base...', 'info');
            // This would typically open a knowledge base
            break;
    }
}

// Initialize performance metrics
function initializePerformanceMetrics() {
    updatePerformanceMetrics();
}

// Update performance metrics
function updatePerformanceMetrics() {
    const teamMembers = loadTeamMembers();
    
    // Calculate department performance
    const departmentStats = {};
    teamMembers.forEach(member => {
        if (!departmentStats[member.department]) {
            departmentStats[member.department] = {
                members: 0,
                totalPatients: 0,
                totalRating: 0
            };
        }
        departmentStats[member.department].members++;
        departmentStats[member.department].totalPatients += member.patients;
        departmentStats[member.department].totalRating += member.rating;
    });
    
    // Update department performance display
    const performanceContainer = document.querySelector('.performance-metrics');
    if (performanceContainer) {
        const metricsContent = performanceContainer.querySelector('.metrics-content');
        if (metricsContent) {
            metricsContent.innerHTML = '';
            
            Object.entries(departmentStats).forEach(([department, stats]) => {
                const avgRating = (stats.totalRating / stats.members).toFixed(1);
                const metricElement = createMetricElement(department, stats, avgRating);
                metricsContent.appendChild(metricElement);
            });
        }
    }
}

// Create metric element
function createMetricElement(department, stats, avgRating) {
    const element = document.createElement('div');
    element.className = 'metric-item';
    element.innerHTML = `
        <div class="metric-header">
            <h4>${department}</h4>
            <span class="metric-count">${stats.members} members</span>
        </div>
        <div class="metric-stats">
            <div class="metric-stat">
                <span class="stat-value">${stats.totalPatients}</span>
                <span class="stat-label">Total Patients</span>
            </div>
            <div class="metric-stat">
                <span class="stat-value">${avgRating}</span>
                <span class="stat-label">Avg Rating</span>
            </div>
        </div>
    `;
    return element;
}

// Initialize modals
function initializeModals() {
    // New member modal
    const newMemberBtn = document.querySelector('.btn-primary');
    if (newMemberBtn) {
        newMemberBtn.addEventListener('click', () => showNewMemberModal());
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

// Show new member modal
function showNewMemberModal() {
    const modal = document.getElementById('new-member-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Show member details modal
function viewMemberDetails(memberId) {
    const teamMembers = loadTeamMembers();
    const member = teamMembers.find(m => m.id === memberId);
    
    if (member) {
        const modal = document.getElementById('member-details-modal');
        if (modal) {
            // Populate modal with member details
            modal.querySelector('.member-name').textContent = member.name;
            modal.querySelector('.member-role').textContent = member.role;
            modal.querySelector('.member-specialty').textContent = member.specialty;
            modal.querySelector('.member-email').textContent = member.email;
            modal.querySelector('.member-phone').textContent = member.phone;
            modal.querySelector('.member-experience').textContent = member.experience;
            modal.querySelector('.member-patients').textContent = member.patients;
            modal.querySelector('.member-rating').textContent = member.rating;
            modal.querySelector('.member-availability').textContent = member.availability;
            modal.querySelector('.member-department').textContent = member.department;
            
            modal.style.display = 'block';
        }
    }
}

// Edit team member
function editMember(memberId) {
    const teamMembers = loadTeamMembers();
    const member = teamMembers.find(m => m.id === memberId);
    
    if (member) {
        // This would typically open an edit modal or navigate to edit page
        showNotification(`Editing team member: ${member.name}`, 'info');
    }
}

// Contact team member
function contactMember(memberId) {
    const teamMembers = loadTeamMembers();
    const member = teamMembers.find(m => m.id === memberId);
    
    if (member) {
        // This would typically open a contact interface
        showNotification(`Opening contact options for ${member.name}`, 'info');
    }
}

// Handle new member form submission
function handleNewMember(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const memberData = {
        id: Date.now(),
        name: formData.get('name'),
        role: formData.get('role'),
        specialty: formData.get('specialty'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        avatar: generateAvatar(formData.get('name')),
        status: formData.get('status'),
        experience: formData.get('experience'),
        patients: parseInt(formData.get('patients')) || 0,
        rating: parseFloat(formData.get('rating')) || 5.0,
        availability: formData.get('availability'),
        department: formData.get('department')
    };
    
    const teamMembers = loadTeamMembers();
    teamMembers.push(memberData);
    localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
    
    displayTeamMembers();
    updateTeamStats();
    updatePerformanceMetrics();
    
    // Close modal
    const modal = document.getElementById('new-member-modal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // Reset form
    event.target.reset();
    
    showNotification('Team member added successfully', 'success');
}

// Generate avatar initials from name
function generateAvatar(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

// Export team data
function exportTeam() {
    try {
        const teamMembers = loadTeamMembers();
        const exportData = {
            exportDate: new Date().toISOString(),
            teamMembers: teamMembers
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `team-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        showNotification('Team data exported successfully', 'success');
    } catch (error) {
        console.error('Error exporting team data:', error);
        showNotification('Error exporting team data', 'error');
    }
}

// Import team data
function importTeam() {
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
                    if (importData.teamMembers && Array.isArray(importData.teamMembers)) {
                        localStorage.setItem('teamMembers', JSON.stringify(importData.teamMembers));
                        displayTeamMembers();
                        updateTeamStats();
                        updatePerformanceMetrics();
                        showNotification('Team data imported successfully', 'success');
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
