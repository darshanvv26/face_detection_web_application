// Face Recognition Web App JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

function initApp() {
    // Create floating particles
    createParticles();
    
    // Initialize video loading handler
    initVideoLoader();
    
    // Initialize stats counter animation
    initStatsAnimation();
    
    // Initialize button interactions
    initButtons();
    
    // Update time display
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

// Create floating particle effect
function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = 15 + Math.random() * 10 + 's';
        particlesContainer.appendChild(particle);
    }
}

// Handle video loading state
function initVideoLoader() {
    const videoFrame = document.querySelector('.video-frame');
    const loadingOverlay = document.querySelector('.loading-overlay');
    
    if (videoFrame && loadingOverlay) {
        // Show loading initially
        loadingOverlay.classList.remove('hidden');
        
        videoFrame.onload = function() {
            // Hide loading when video starts
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
                updateStatus('active');
            }, 500);
        };
        
        videoFrame.onerror = function() {
            updateStatus('inactive');
            const loadingText = loadingOverlay.querySelector('.loading-text');
            if (loadingText) {
                loadingText.textContent = 'Camera connection failed. Please refresh.';
            }
        };
        
        // Fallback: hide loading after 3 seconds
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
        }, 3000);
    }
}

// Update camera status indicator
function updateStatus(status) {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');
    
    if (statusDot) {
        statusDot.classList.remove('active', 'inactive');
        statusDot.classList.add(status);
    }
    
    if (statusText) {
        statusText.textContent = status === 'active' ? 'Camera Active' : 'Camera Inactive';
    }
}

// Animate stats numbers
function initStatsAnimation() {
    const statValues = document.querySelectorAll('.stat-value[data-count]');
    
    statValues.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        animateValue(stat, 0, target, 2000);
    });
}

function animateValue(element, start, end, duration) {
    const startTimestamp = performance.now();
    
    const step = (timestamp) => {
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = easeOutQuart(progress);
        const current = Math.floor(easeProgress * (end - start) + start);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };
    
    requestAnimationFrame(step);
}

function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
}

// Initialize button interactions
function initButtons() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
        // Add ripple effect on click
        btn.addEventListener('click', function(e) {
            createRipple(e, this);
        });
    });
    
    // Fullscreen button handler
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
    
    // Screenshot button handler
    const screenshotBtn = document.getElementById('screenshot-btn');
    if (screenshotBtn) {
        screenshotBtn.addEventListener('click', takeScreenshot);
    }
}

// Ripple effect for buttons
function createRipple(event, button) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = event.clientX - rect.left - size / 2 + 'px';
    ripple.style.top = event.clientY - rect.top - size / 2 + 'px';
    
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Toggle fullscreen mode
function toggleFullscreen() {
    const videoContainer = document.querySelector('.video-container');
    
    if (!document.fullscreenElement) {
        if (videoContainer.requestFullscreen) {
            videoContainer.requestFullscreen();
        } else if (videoContainer.webkitRequestFullscreen) {
            videoContainer.webkitRequestFullscreen();
        } else if (videoContainer.msRequestFullscreen) {
            videoContainer.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Take screenshot (placeholder - would need server-side implementation)
function takeScreenshot() {
    showNotification('📸 Screenshot feature coming soon!', 'info');
}

// Show notification toast
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
    `;
    
    // Add notification styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 16px 24px;
                background: var(--background-card);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                color: var(--text-primary);
                font-size: 0.95rem;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
                z-index: 1000;
                animation: slideIn 0.3s ease, slideOut 0.3s ease 2.7s forwards;
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}

// Update date and time display
function updateDateTime() {
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        const now = new Date();
        const options = { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        };
        timeElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // F - Fullscreen
    if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
    }
    
    // S - Screenshot
    if (e.key === 's' || e.key === 'S') {
        if (!e.ctrlKey && !e.metaKey) {
            takeScreenshot();
        }
    }
    
    // Escape - Exit fullscreen
    if (e.key === 'Escape' && document.fullscreenElement) {
        document.exitFullscreen();
    }
});

// Handle visibility change (pause/resume)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('App paused (tab hidden)');
    } else {
        console.log('App resumed (tab visible)');
    }
});

// Window resize handler
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Adjust layout if needed
        console.log('Window resized');
    }, 250);
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
});

// Export functions for external use
window.FaceRecognitionApp = {
    updateStatus,
    showNotification,
    toggleFullscreen,
    takeScreenshot
};
