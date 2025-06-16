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

// Form submission handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });

        // Here you would typically send the form data to a server
        // For now, we'll just show a success message
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
}

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

// JSON Parser functionality
document.addEventListener('DOMContentLoaded', function() {
    const jsonInput = document.getElementById('jsonInput');
    const jsonOutput = document.getElementById('jsonOutput');
    const jsonParserCard = document.getElementById('jsonParserCard');

    // Show JSON parser section when clicking the card
    jsonParserCard.addEventListener('click', () => {
        document.getElementById('jsonParser').scrollIntoView({ behavior: 'smooth' });
    });

    // Function to create collapsible JSON tree
    function createJsonTree(data, level = 0) {
        const container = document.createElement('div');
        container.className = 'collapsible-content';
        
        if (typeof data === 'object' && data !== null) {
            const isArray = Array.isArray(data);
            const items = isArray ? data : Object.entries(data);
            
            items.forEach((item, index) => {
                const itemContainer = document.createElement('div');
                const key = isArray ? index : item[0];
                const value = isArray ? item : item[1];
                
                const collapsible = document.createElement('div');
                collapsible.className = 'collapsible';
                
                if (typeof value === 'object' && value !== null) {
                    collapsible.innerHTML = `<span class="json-key">${key}</span>: ${isArray ? '[' : '{'}`;
                    collapsible.addEventListener('click', () => {
                        collapsible.classList.toggle('collapsed');
                        const content = collapsible.nextElementSibling;
                        content.classList.toggle('collapsed');
                    });
                    
                    itemContainer.appendChild(collapsible);
                    itemContainer.appendChild(createJsonTree(value, level + 1));
                    
                    const closingBracket = document.createElement('div');
                    closingBracket.textContent = isArray ? ']' : '}';
                    itemContainer.appendChild(closingBracket);
                } else {
                    const valueSpan = document.createElement('span');
                    valueSpan.className = typeof value === 'string' ? 'json-string' :
                                        typeof value === 'number' ? 'json-number' :
                                        typeof value === 'boolean' ? 'json-boolean' : 'json-null';
                    
                    const formattedValue = typeof value === 'string' ? `"${value}"` : value;
                    collapsible.innerHTML = `<span class="json-key">${key}</span>: ${valueSpan.outerHTML.replace('</span>', formattedValue + '</span>')}`;
                    itemContainer.appendChild(collapsible);
                }
                
                container.appendChild(itemContainer);
            });
        }
        
        return container;
    }

    // Function to format JSON
    function formatJson() {
        try {
            const input = jsonInput.value.trim();
            if (!input) {
                jsonOutput.innerHTML = '';
                return;
            }

            const parsed = JSON.parse(input);
            jsonOutput.innerHTML = '';
            jsonOutput.appendChild(createJsonTree(parsed));
        } catch (error) {
            jsonOutput.innerHTML = `<div class="error">Invalid JSON: ${error.message}</div>`;
        }
    }

    // Add input event listener
    jsonInput.addEventListener('input', formatJson);
});
