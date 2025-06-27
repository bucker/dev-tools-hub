// Smooth scrolling for navigation links
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

// Add scroll-based animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-out');
    observer.observe(section);
});

// Add CSS for fade animations
const style = document.createElement('style');
style.textContent = `
    .fade-out {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    .fade-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Import and initialize components
    if (typeof initJsonParser === 'function') {
        initJsonParser();
    }
    if (typeof initBase64Tool === 'function') {
        initBase64Tool();
    }
    if (typeof initTimestampConverter === 'function') {
        initTimestampConverter();
    }
    if (typeof initJwtDecoder === 'function') {
        initJwtDecoder();
    }
    if (typeof initTextDiffTool === 'function') {
        initTextDiffTool();
    }
    if (typeof initMarkdownPreviewer === 'function') {
        initMarkdownPreviewer();
    }
    if (typeof initHtmlPreviewer === 'function') {
        initHtmlPreviewer();
    }
});

// Floating Back to Cards button logic
const backToCardsBtn = document.getElementById('backToCardsBtn');
const toolsSection = document.getElementById('tools');

if (backToCardsBtn && toolsSection) {
    function checkToolsSectionInView() {
        const rect = toolsSection.getBoundingClientRect();
        // Show button if top of tools section is above viewport by 100px or more
        if (rect.bottom < 100) {
            backToCardsBtn.style.display = 'block';
        } else {
            backToCardsBtn.style.display = 'none';
        }
    }
    window.addEventListener('scroll', checkToolsSectionInView);
    window.addEventListener('resize', checkToolsSectionInView);
    checkToolsSectionInView();
    backToCardsBtn.addEventListener('click', function() {
        toolsSection.scrollIntoView({ behavior: 'smooth' });
    });
} 