// Voice Assistant Website - Interactive JavaScript Features
// Modern developer-style interactions

document.addEventListener('DOMContentLoaded', function() {
    
    console.log('🎤 Voice Assistant Website loaded successfully');
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(13, 17, 23, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(13, 17, 23, 0.9)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    });

    // Hero typing animation
    typeWriterEffect();

    // Card hover animations
    initCardAnimations();

    // Demo terminal animation
    initDemoTerminal();

    // Form validation
    initFormValidation();

    // Download counter animation
    initCounterAnimation();

    // Alert auto-dismiss
    autoDismissAlerts();
});

// Typing effect for hero section
function typeWriterEffect() {
    const commands = [
        'Listening...',
        '"Open Chrome"',
        '✓ Opening Google Chrome',
        '"Launch VS Code"',
        '✓ Launching Visual Studio Code',
        'Ready for next command'
    ];
    
    let currentCommand = 0;
    const terminalLines = document.querySelectorAll('.terminal-line');
    
    if (terminalLines.length > 0) {
        let index = 0;
        const typeSpeed = 100;
        
        function typeWriter(text, callback) {
            let i = 0;
            function type() {
                if (i < text.length) {
                    terminalLines[index].textContent = text.slice(0, i + 1);
                    i++;
                    setTimeout(type, typeSpeed);
                } else {
                    setTimeout(callback, 1500);
                }
            }
            type();
        }
        
        function nextCommand() {
            if (currentCommand < commands.length) {
                index = currentCommand % terminalLines.length;
                typeWriter(commands[currentCommand], nextCommand);
                currentCommand++;
            }
        }
        nextCommand();
    }
}

// Card hover animations
function initCardAnimations() {
    const cards = document.querySelectorAll('.hover-card, .hover-lift');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Demo terminal pulsing effect
function initDemoTerminal() {
    const terminal = document.querySelector('.demo-terminal');
    if (terminal) {
        setInterval(() => {
            terminal.style.boxShadow = '0 0 30px rgba(9, 105, 218, 0.3)';
            setTimeout(() => {
                terminal.style.boxShadow = '0 8px 24px rgba(27, 31, 35, 0.2)';
            }, 1000);
        }, 3000);
    }
}

// Form validation with real-time feedback
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            input.addEventListener('input', function() {
                clearValidation(this);
            });
        });
        
        form.addEventListener('submit', function(e) {
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            if (!isValid) {
                e.preventDefault();
                showNotification('Please fix the errors above', 'error');
            }
        });
    });
}

function validateField(input) {
    const value = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    clearValidation(input);
    
    if (!value) {
        showFieldError(input, 'This field is required');
        return false;
    }
    
    if (input.type === 'email' && !emailRegex.test(value)) {
        showFieldError(input, 'Please enter a valid email');
        return false;
    }
    
    if (input.type === 'password' && value.length < 6) {
        showFieldError(input, 'Password must be at least 6 characters');
        return false;
    }
    
    return true;
}

function showFieldError(input, message) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    
    let feedback = input.parentNode.querySelector('.invalid-feedback');
    if (!feedback) {
        feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        input.parentNode.appendChild(feedback);
    }
    feedback.textContent = message;
}

function clearValidation(input) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    const feedback = input.parentNode.querySelector('.invalid-feedback');
    if (feedback) feedback.remove();
}

// Counter animation for stats
function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-counter]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-counter'));
    const increment = target / 100;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 20);
}

// Auto-dismiss alerts
function autoDismissAlerts() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : 'success'} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after animation
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Fake voice demo for demo section
function initVoiceDemo() {
    const voiceButton = document.getElementById('voice-demo-btn');
    if (voiceButton) {
        voiceButton.addEventListener('click', function() {
            const status = document.getElementById('voice-status');
            const command = document.getElementById('demo-command');
            
            status.textContent = 'Listening...';
            status.className = 'text-warning';
            
            setTimeout(() => {
                status.textContent = '"Open Notepad" recognized';
                status.className = 'text-primary';
                command.textContent = 'Opening Notepad...';
                
                setTimeout(() => {
                    status.textContent = 'Ready';
                    status.className = 'text-success';
                    command.textContent = '';
                }, 1500);
            }, 2000);
        });
    }
}

// Service Worker for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate__animated', 'animate__fadeInUp');
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Copy to clipboard for code blocks
document.querySelectorAll('pre code').forEach(block => {
    block.addEventListener('click', function() {
        navigator.clipboard.writeText(this.textContent).then(() => {
            showNotification('Copied to clipboard!', 'success');
        });
    });
});

// Mobile menu toggle enhancement
const navbarToggler = document.querySelector('.navbar-toggler');
if (navbarToggler) {
    navbarToggler.addEventListener('click', function() {
        document.body.classList.toggle('navbar-open');
    });
}

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
    });
}

console.log('🎯 All interactive features initialized');