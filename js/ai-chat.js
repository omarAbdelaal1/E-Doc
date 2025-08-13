// AI Chat JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeAIChat();
    setupChatInput();
    loadChatHistory();
});

// Chat state
let chatHistory = [];
let currentSessionId = generateSessionId();

// Initialize AI Chat
function initializeAIChat() {
    // Auto-resize textarea
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('input', autoResizeTextarea);
        chatInput.addEventListener('keydown', handleKeyPress);
    }
}

// Setup chat input functionality
function setupChatInput() {
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.querySelector('.chat-send-btn');
    
    if (chatInput && sendBtn) {
        // Send message on button click
        sendBtn.addEventListener('click', sendMessage);
        
        // Send message on Enter key (Shift+Enter for new line)
        chatInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
}

// Handle key press events
function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

// Auto-resize textarea
function autoResizeTextarea() {
    const textarea = this;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

// Send message function
async function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessageToChat('user', message);
    
    // Clear input and reset height
    chatInput.value = '';
    chatInput.style.height = 'auto';
    
    // Show loading indicator
    showLoading(true);
    
    try {
        // Get AI response using free API
        const aiResponse = await getAIResponse(message);
        
        // Add AI response to chat
        addMessageToChat('ai', aiResponse);
        
        // Save to chat history
        saveToChatHistory(message, aiResponse);
        
    } catch (error) {
        console.error('Error getting AI response:', error);
        addMessageToChat('ai', 'I apologize, but I encountered an error. Please try again or check your internet connection.');
    } finally {
        showLoading(false);
    }
}

// Get AI response using free API (Hugging Face Inference API)
async function getAIResponse(message) {
    // Using a more reliable free API - OpenAI-compatible endpoint
    const API_URL = 'https://api.openai.com/v1/chat/completions';
    const API_KEY = 'sk-proj-your-key-here'; // Replace with your actual API key
    
    // Fallback to a simpler approach for demo purposes
    try {
        // For demo purposes, we'll use a simple response system
        // In production, you would use a real API key
        return generateSmartResponse(message);
    } catch (error) {
        console.error('API Error:', error);
        return generateFallbackResponse(message);
    }
}

// Generate smart responses based on keywords
function generateSmartResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Medical symptom patterns
    if (lowerMessage.includes('headache') || lowerMessage.includes('head pain')) {
        return "Headaches can have various causes including stress, dehydration, or underlying medical conditions. I recommend:\n\n• Rest in a quiet, dark room\n• Stay hydrated\n• Consider over-the-counter pain relievers\n• If severe or persistent, consult a healthcare provider\n\nWhen should you seek immediate medical attention for a headache?";
    }
    
    if (lowerMessage.includes('fever') || lowerMessage.includes('temperature')) {
        return "Fever is often a sign of infection. Here's what you should know:\n\n• Normal body temperature is around 98.6°F (37°C)\n• Fever above 103°F (39.4°C) may require medical attention\n• Stay hydrated and rest\n• Monitor for other symptoms\n\nWhat's your current temperature and are you experiencing any other symptoms?";
    }
    
    if (lowerMessage.includes('cough') || lowerMessage.includes('cold')) {
        return "Cough and cold symptoms are common. Here are some recommendations:\n\n• Rest and stay hydrated\n• Use honey for cough relief (adults only)\n• Consider over-the-counter medications\n• Monitor for worsening symptoms\n\nHow long have you been experiencing these symptoms?";
    }
    
    if (lowerMessage.includes('pain') || lowerMessage.includes('hurt')) {
        return "Pain can indicate various conditions. To better assist you:\n\n• Where is the pain located?\n• How severe is it (1-10 scale)?\n• When did it start?\n• What makes it better or worse?\n\nThis information will help determine if you need immediate medical attention.";
    }
    
    if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule')) {
        return "I can help you with appointment scheduling! Here are your options:\n\n• Use the Appointments section to schedule online\n• Call our office during business hours\n• Request a callback from our staff\n\nWhat type of appointment are you looking to schedule?";
    }
    
    if (lowerMessage.includes('medication') || lowerMessage.includes('medicine') || lowerMessage.includes('prescription')) {
        return "For medication-related questions:\n\n• Always consult with your healthcare provider\n• Don't stop prescribed medications without medical advice\n• Report any side effects immediately\n• Keep an updated medication list\n\nWhat specific medication question do you have?";
    }
    
    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
        return "🚨 If this is a medical emergency, please:\n\n• Call emergency services (911) immediately\n• Go to the nearest emergency room\n• Don't wait for online consultation\n\nFor urgent but non-emergency care, we can help schedule a same-day appointment.";
    }
    
    // General health advice
    if (lowerMessage.includes('healthy') || lowerMessage.includes('wellness') || lowerMessage.includes('prevention')) {
        return "Great question about health and wellness! Here are some general tips:\n\n• Maintain a balanced diet\n• Exercise regularly (150 minutes/week)\n• Get adequate sleep (7-9 hours)\n• Stay hydrated\n• Manage stress\n• Regular check-ups\n\nWhat specific aspect of health would you like to discuss?";
    }
    
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
        return "You're very welcome! I'm here to help with any medical questions or concerns you may have. Feel free to ask anything about symptoms, appointments, medications, or general health advice.";
    }
    
    // Default response
    return "I'm here to help with your medical questions! I can assist with:\n\n• Symptom assessment\n• Appointment scheduling\n• Medication information\n• General health advice\n• Emergency guidance\n\nWhat would you like to know about?";
}

// Process medical response
function processMedicalResponse(response, originalMessage) {
    // Add medical context and disclaimers
    let processedResponse = response;
    
    // Add medical disclaimer
    processedResponse += '\n\n⚠️ **Medical Disclaimer**: This information is for educational purposes only and should not replace professional medical advice. Always consult with qualified healthcare providers for diagnosis and treatment.';
    
    return processedResponse;
}

// Generate fallback response when API is unavailable
function generateFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Simple keyword-based responses for common medical queries
    if (lowerMessage.includes('diabetes') || lowerMessage.includes('diabetic')) {
        return `Diabetes is a chronic condition that affects how your body processes glucose. Common symptoms include increased thirst, frequent urination, and fatigue. There are two main types: Type 1 (insulin-dependent) and Type 2 (often lifestyle-related). Treatment typically involves diet, exercise, and medication. Always consult with your healthcare provider for personalized advice.\n\n⚠️ **Medical Disclaimer**: This information is for educational purposes only and should not replace professional medical advice.`;
    }
    
    if (lowerMessage.includes('hypertension') || lowerMessage.includes('high blood pressure')) {
        return `Hypertension (high blood pressure) is a common condition that can lead to serious health problems. It's often called the "silent killer" because it may not show symptoms. Treatment includes lifestyle changes (diet, exercise, stress management) and medications. Regular monitoring is important.\n\n⚠️ **Medical Disclaimer**: This information is for educational purposes only and should not replace professional medical advice.`;
    }
    
    if (lowerMessage.includes('mri') || lowerMessage.includes('ct scan')) {
        return `MRI (Magnetic Resonance Imaging) and CT (Computed Tomography) scans are different imaging techniques. MRI uses magnetic fields and radio waves to create detailed images of soft tissues, while CT uses X-rays for cross-sectional images. MRI is better for soft tissue, CT is faster and better for bone imaging.\n\n⚠️ **Medical Disclaimer**: This information is for educational purposes only and should not replace professional medical advice.`;
    }
    
    if (lowerMessage.includes('antibiotic') || lowerMessage.includes('side effect')) {
        return `Common side effects of antibiotics include nausea, diarrhea, stomach upset, and allergic reactions. Some may cause photosensitivity or interact with other medications. It's important to complete the full course as prescribed and report any severe side effects to your doctor.\n\n⚠️ **Medical Disclaimer**: This information is for educational purposes only and should not replace professional medical advice.`;
    }
    
    // Generic response for other queries
    return `I understand you're asking about "${message}". While I can provide general medical information, I recommend consulting with a healthcare professional for specific medical advice. You can also try rephrasing your question or ask about common conditions like diabetes, hypertension, or imaging procedures.\n\n⚠️ **Medical Disclaimer**: This information is for educational purposes only and should not replace professional medical advice.`;
}

// Add message to chat
function addMessageToChat(sender, message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    const timestamp = new Date().toLocaleTimeString();
    
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-${sender === 'user' ? 'user-md' : 'robot'}"></i>
        </div>
        <div class="message-content">
            <div class="message-text">${formatMessageText(message)}</div>
            <div class="message-time">${timestamp}</div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add to chat history
    chatHistory.push({
        sender,
        message,
        timestamp,
        sessionId: currentSessionId
    });
}

// Format message text (convert markdown-like syntax)
function formatMessageText(text) {
    // Convert **text** to <strong>text</strong>
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert *text* to <em>text</em>
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert line breaks to <br>
    text = text.replace(/\n/g, '<br>');
    
    return text;
}

// Show/hide loading indicator
function showLoading(show) {
    const loading = document.getElementById('chat-loading');
    if (loading) {
        loading.classList.toggle('hidden', !show);
    }
}

// Use suggestion
function useSuggestion(suggestion) {
    const chatInput = document.getElementById('chat-input');
    chatInput.value = suggestion;
    chatInput.focus();
    autoResizeTextarea.call(chatInput);
}

// Clear chat
function clearChat() {
    if (confirm('Are you sure you want to clear the current chat session?')) {
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.innerHTML = `
            <div class="message ai-message">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="message-text">
                        Chat cleared. How can I help you today?
                    </div>
                    <div class="message-time">Just now</div>
                </div>
            </div>
        `;
        
        // Clear chat history for current session
        chatHistory = chatHistory.filter(msg => msg.sessionId !== currentSessionId);
        currentSessionId = generateSessionId();
        
        // Update chat history display
        updateChatHistoryDisplay();
    }
}

// Export chat
function exportChat() {
    const chatData = {
        sessionId: currentSessionId,
        timestamp: new Date().toISOString(),
        messages: chatHistory.filter(msg => msg.sessionId === currentSessionId)
    };
    
    const dataStr = JSON.stringify(chatData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `chat-export-${currentSessionId}.json`;
    link.click();
}

// Save to chat history
function saveToChatHistory(userMessage, aiResponse) {
    const sessionHistory = {
        sessionId: currentSessionId,
        timestamp: new Date().toISOString(),
        userMessage,
        aiResponse
    };
    
    // Save to localStorage
    const savedHistory = JSON.parse(localStorage.getItem('edoc_chat_history') || '[]');
    savedHistory.push(sessionHistory);
    
    // Keep only last 50 sessions
    if (savedHistory.length > 50) {
        savedHistory.splice(0, savedHistory.length - 50);
    }
    
    localStorage.setItem('edoc_chat_history', JSON.stringify(savedHistory));
    
    // Update display
    updateChatHistoryDisplay();
}

// Load chat history
function loadChatHistory() {
    const savedHistory = JSON.parse(localStorage.getItem('edoc_chat_history') || '[]');
    updateChatHistoryDisplay(savedHistory);
}

// Update chat history display
function updateChatHistoryDisplay(history = null) {
    const historyContainer = document.getElementById('chat-history');
    if (!historyContainer) return;
    
    const savedHistory = history || JSON.parse(localStorage.getItem('edoc_chat_history') || '[]');
    
    // Clear existing items except current session
    const currentSessionItem = historyContainer.querySelector('.history-item.active');
    historyContainer.innerHTML = '';
    if (currentSessionItem) {
        historyContainer.appendChild(currentSessionItem);
    }
    
    // Add recent sessions
    const recentSessions = savedHistory.slice(-10).reverse();
    recentSessions.forEach(session => {
        if (session.sessionId !== currentSessionId) {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <i class="fas fa-comment"></i>
                <span>${session.userMessage.substring(0, 30)}${session.userMessage.length > 30 ? '...' : ''}</span>
                <small>${new Date(session.timestamp).toLocaleDateString()}</small>
            `;
            historyItem.onclick = () => loadSession(session.sessionId);
            historyContainer.appendChild(historyItem);
        }
    });
}

// Load specific session
function loadSession(sessionId) {
    const savedHistory = JSON.parse(localStorage.getItem('edoc_chat_history') || '[]');
    const session = savedHistory.find(s => s.sessionId === sessionId);
    
    if (session) {
        currentSessionId = sessionId;
        
        // Clear current chat
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.innerHTML = '';
        
        // Add session messages
        addMessageToChat('user', session.userMessage);
        addMessageToChat('ai', session.aiResponse);
        
        // Update active session in history
        updateActiveSession(sessionId);
    }
}

// Update active session
function updateActiveSession(sessionId) {
    const historyItems = document.querySelectorAll('.history-item');
    historyItems.forEach(item => {
        item.classList.remove('active');
        if (item.onclick && item.onclick.toString().includes(sessionId)) {
            item.classList.add('active');
        }
    });
}

// Generate session ID
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Quick action functions
function generateReport() {
    alert('Report generation feature will be implemented in the AI Reports section.');
}

function scheduleFollowUp() {
    alert('Follow-up scheduling feature will be implemented in the Appointments section.');
}

function addToNotes() {
    alert('Notes feature will be implemented in the Patient Management section.');
}

// Utility function to check if element exists
function elementExists(selector) {
    return document.querySelector(selector) !== null;
}
