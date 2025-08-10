// AI Assistant JavaScript - Global Medical AI Library

// Global variables
let chatHistory = [];
let isTyping = false;
let currentConversationId = null;

// Initialize AI Assistant
document.addEventListener('DOMContentLoaded', function() {
    initializeAssistant();
    loadChatHistory();
    setupEventListeners();
});

// Initialize AI Assistant Components
function initializeAssistant() {
    // Initialize chat interface
    setupChatInterface();
    
    // Load user preferences
    loadUserPreferences();
    
    // Initialize typing indicators
    setupTypingIndicators();
}

// Setup Event Listeners
function setupEventListeners() {
    // Chat input form
    const chatForm = document.getElementById('chatForm');
    if (chatForm) {
        chatForm.addEventListener('submit', handleChatSubmit);
    }
    
    // Chat input field
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('input', handleChatInput);
        chatInput.addEventListener('keydown', handleChatKeydown);
    }
    
    // Quick action buttons
    setupQuickActions();
    
    // Voice input button
    const voiceBtn = document.getElementById('voiceBtn');
    if (voiceBtn) {
        voiceBtn.addEventListener('click', toggleVoiceInput);
    }
    
    // Clear chat button
    const clearChatBtn = document.getElementById('clearChatBtn');
    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', clearChat);
    }
    
    // Export chat button
    const exportChatBtn = document.getElementById('exportChatBtn');
    if (exportChatBtn) {
        exportChatBtn.addEventListener('click', exportChat);
    }
}

// Setup Chat Interface
function setupChatInterface() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        // Add welcome message
        addMessage({
            type: 'assistant',
            content: 'Hello! I\'m your AI Medical Assistant. I can help you with clinical questions, treatment recommendations, medical literature research, and more. How can I assist you today?',
            timestamp: new Date()
        });
    }
}

// Setup Quick Actions
function setupQuickActions() {
    const quickActions = document.querySelectorAll('.quick-action');
    quickActions.forEach(action => {
        action.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            if (question) {
                sendMessage(question);
            }
        });
    });
}

// Setup Typing Indicators
function setupTypingIndicators() {
    // This would be used to show when the AI is "typing"
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'none';
    }
}

// Handle Chat Submit
function handleChatSubmit(e) {
    e.preventDefault();
    
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (message && !isTyping) {
        sendMessage(message);
        chatInput.value = '';
    }
}

// Handle Chat Input
function handleChatInput(e) {
    const chatInput = e.target;
    const sendBtn = document.getElementById('sendBtn');
    
    if (sendBtn) {
        sendBtn.disabled = !chatInput.value.trim();
    }
}

// Handle Chat Keydown
function handleChatKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleChatSubmit(e);
    }
}

// Send Message
async function sendMessage(content) {
    if (!content.trim() || isTyping) return;
    
    // Add user message to chat
    const userMessage = {
        type: 'user',
        content: content,
        timestamp: new Date()
    };
    
    addMessage(userMessage);
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Call AI API
        const response = await apiRequest('/api/assistant/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                message: content,
                conversation_id: currentConversationId,
                context: getConversationContext()
            })
        });
        
        if (response.success) {
            // Add AI response to chat
            const aiMessage = {
                type: 'assistant',
                content: response.data.response,
                timestamp: new Date(),
                sources: response.data.sources || [],
                confidence: response.data.confidence || null
            };
            
            addMessage(aiMessage);
            
            // Update conversation ID if provided
            if (response.data.conversation_id) {
                currentConversationId = response.data.conversation_id;
            }
            
            // Save to chat history
            saveToChatHistory(userMessage, aiMessage);
            
        } else {
            // Show error message
            const errorMessage = {
                type: 'assistant',
                content: 'I apologize, but I encountered an error processing your request. Please try again.',
                timestamp: new Date(),
                isError: true
            };
            
            addMessage(errorMessage);
        }
        
    } catch (error) {
        console.error('Error sending message:', error);
        
        // Show error message
        const errorMessage = {
            type: 'assistant',
            content: 'I apologize, but I\'m unable to respond at the moment. Please check your connection and try again.',
            timestamp: new Date(),
            isError: true
        };
        
        addMessage(errorMessage);
    } finally {
        hideTypingIndicator();
        scrollToBottom();
    }
}

// Add Message to Chat
function addMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;
    
    const messageElement = createMessageElement(message);
    chatMessages.appendChild(messageElement);
    
    // Add to chat history
    chatHistory.push(message);
    
    // Limit chat history to prevent memory issues
    if (chatHistory.length > 100) {
        chatHistory = chatHistory.slice(-50);
    }
}

// Create Message Element
function createMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.type}`;
    
    if (message.isError) {
        messageDiv.classList.add('error');
    }
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    
    if (message.type === 'user') {
        avatar.innerHTML = '<i class="fas fa-user"></i>';
    } else {
        avatar.innerHTML = '<i class="fas fa-robot"></i>';
    }
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    // Add message text
    const text = document.createElement('p');
    text.textContent = message.content;
    content.appendChild(text);
    
    // Add sources if available
    if (message.sources && message.sources.length > 0) {
        const sourcesDiv = document.createElement('div');
        sourcesDiv.className = 'message-sources';
        sourcesDiv.innerHTML = '<strong>Sources:</strong>';
        
        const sourcesList = document.createElement('ul');
        message.sources.forEach(source => {
            const sourceItem = document.createElement('li');
            sourceItem.innerHTML = `<a href="${source.url}" target="_blank">${source.title}</a>`;
            sourcesList.appendChild(sourceItem);
        });
        
        sourcesDiv.appendChild(sourcesList);
        content.appendChild(sourcesDiv);
    }
    
    // Add confidence score if available
    if (message.confidence !== null) {
        const confidenceDiv = document.createElement('div');
        confidenceDiv.className = 'message-confidence';
        confidenceDiv.innerHTML = `<strong>Confidence:</strong> ${message.confidence}%`;
        content.appendChild(confidenceDiv);
    }
    
    // Add timestamp
    const timestamp = document.createElement('div');
    timestamp.className = 'message-timestamp';
    timestamp.textContent = formatTime(message.timestamp);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    messageDiv.appendChild(timestamp);
    
    return messageDiv;
}

// Show Typing Indicator
function showTypingIndicator() {
    isTyping = true;
    
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'flex';
        scrollToBottom();
    }
}

// Hide Typing Indicator
function hideTypingIndicator() {
    isTyping = false;
    
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'none';
    }
}

// Scroll to Bottom
function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Get Conversation Context
function getConversationContext() {
    // Return last few messages for context
    return chatHistory.slice(-5).map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
    }));
}

// Load Chat History
function loadChatHistory() {
    try {
        const savedHistory = localStorage.getItem('chatHistory');
        if (savedHistory) {
            chatHistory = JSON.parse(savedHistory).map(msg => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
            }));
            
            // Display saved messages
            chatHistory.forEach(message => {
                addMessage(message);
            });
        }
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
}

// Save to Chat History
function saveToChatHistory(userMessage, aiMessage) {
    try {
        const historyToSave = [...chatHistory, userMessage, aiMessage];
        localStorage.setItem('chatHistory', JSON.stringify(historyToSave));
    } catch (error) {
        console.error('Error saving chat history:', error);
    }
}

// Load User Preferences
function loadUserPreferences() {
    try {
        const preferences = localStorage.getItem('assistantPreferences');
        if (preferences) {
            const prefs = JSON.parse(preferences);
            
            // Apply theme preference
            if (prefs.theme) {
                document.body.setAttribute('data-theme', prefs.theme);
            }
            
            // Apply other preferences
            if (prefs.autoScroll !== undefined) {
                // Apply auto-scroll preference
            }
        }
    } catch (error) {
        console.error('Error loading user preferences:', error);
    }
}

// Toggle Voice Input
function toggleVoiceInput() {
    const voiceBtn = document.getElementById('voiceBtn');
    if (!voiceBtn) return;
    
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        if (voiceBtn.classList.contains('listening')) {
            stopVoiceRecognition();
        } else {
            startVoiceRecognition();
        }
    } else {
        showAlert('Voice input is not supported in your browser', 'warning');
    }
}

// Start Voice Recognition
function startVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = function() {
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) {
            voiceBtn.classList.add('listening');
            voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
        }
        
        showAlert('Listening... Speak now', 'info');
    };
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        const chatInput = document.getElementById('chatInput');
        
        if (chatInput) {
            chatInput.value = transcript;
            chatInput.dispatchEvent(new Event('input'));
        }
    };
    
    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        showAlert('Voice recognition error: ' + event.error, 'error');
        stopVoiceRecognition();
    };
    
    recognition.onend = function() {
        stopVoiceRecognition();
    };
    
    recognition.start();
}

// Stop Voice Recognition
function stopVoiceRecognition() {
    const voiceBtn = document.getElementById('voiceBtn');
    if (voiceBtn) {
        voiceBtn.classList.remove('listening');
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    }
}

// Clear Chat
function clearChat() {
    if (confirm('Are you sure you want to clear the chat history? This action cannot be undone.')) {
        const chatMessages = document.getElementById('chatMessages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
        }
        
        chatHistory = [];
        localStorage.removeItem('chatHistory');
        
        // Add welcome message back
        addMessage({
            type: 'assistant',
            content: 'Hello! I\'m your AI Medical Assistant. I can help you with clinical questions, treatment recommendations, medical literature research, and more. How can I assist you today?',
            timestamp: new Date()
        });
        
        showAlert('Chat history cleared', 'success');
    }
}

// Export Chat
function exportChat() {
    try {
        const chatData = {
            exportDate: new Date().toISOString(),
            conversation: chatHistory
        };
        
        const dataStr = JSON.stringify(chatData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        showAlert('Chat exported successfully', 'success');
    } catch (error) {
        console.error('Error exporting chat:', error);
        showAlert('Error exporting chat', 'error');
    }
}

// Format Time
function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Quick Actions
function askAboutSymptoms() {
    sendMessage('What are the common symptoms of diabetes?');
}

function askAboutTreatment() {
    sendMessage('What are the current treatment options for hypertension?');
}

function askAboutMedication() {
    sendMessage('What are the side effects of common blood pressure medications?');
}

function askAboutDiagnosis() {
    sendMessage('How is pneumonia typically diagnosed?');
}

// Handle window focus to refresh chat if needed
window.addEventListener('focus', function() {
    // Could refresh chat or check for new messages
});

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // Page became visible, could refresh chat
    }
});
