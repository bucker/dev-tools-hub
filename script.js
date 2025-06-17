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

function initJsonParser() {
    const jsonInput = document.getElementById('jsonInput');
    const jsonOutput = document.getElementById('jsonOutput');
    const jsonParserCard = document.getElementById('jsonParserCard');
    if (!jsonInput || !jsonOutput || !jsonParserCard) return;

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
}

function initBase64Tool() {
    const base64Input = document.getElementById('base64Input');
    const base64Output = document.getElementById('base64Output');
    const encodeBtn = document.getElementById('encodeBtn');
    const decodeBtn = document.getElementById('decodeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const base64Card = document.getElementById('base64Card');
    
    if (!base64Input || !base64Output || !encodeBtn || !decodeBtn || !clearBtn || !copyBtn || !base64Card) return;

    // Show Base64 tool section when clicking the card
    base64Card.addEventListener('click', () => {
        document.getElementById('base64Tool').scrollIntoView({ behavior: 'smooth' });
    });

    // Function to encode text to Base64
    function encodeToBase64(text) {
        try {
            return btoa(unescape(encodeURIComponent(text)));
        } catch (error) {
            throw new Error('Failed to encode text to Base64');
        }
    }

    // Function to decode Base64 to text
    function decodeFromBase64(base64String) {
        try {
            return decodeURIComponent(escape(atob(base64String)));
        } catch (error) {
            throw new Error('Invalid Base64 string');
        }
    }

    // Function to check if string is valid Base64
    function isValidBase64(str) {
        try {
            return btoa(atob(str)) === str;
        } catch (error) {
            return false;
        }
    }

    // Function to update output
    function updateOutput(content, isError = false) {
        base64Output.textContent = content;
        base64Output.className = 'base64-result' + (isError ? ' error' : ' success');
    }

    // Encode button click handler
    encodeBtn.addEventListener('click', () => {
        const input = base64Input.value.trim();
        if (!input) {
            updateOutput('Please enter some text to encode.', true);
            return;
        }

        try {
            const encoded = encodeToBase64(input);
            updateOutput(encoded);
        } catch (error) {
            updateOutput(`Error: ${error.message}`, true);
        }
    });

    // Decode button click handler
    decodeBtn.addEventListener('click', () => {
        const input = base64Input.value.trim();
        if (!input) {
            updateOutput('Please enter a Base64 string to decode.', true);
            return;
        }

        if (!isValidBase64(input)) {
            updateOutput('Error: Invalid Base64 string', true);
            return;
        }

        try {
            const decoded = decodeFromBase64(input);
            updateOutput(decoded);
        } catch (error) {
            updateOutput(`Error: ${error.message}`, true);
        }
    });

    // Clear button click handler
    clearBtn.addEventListener('click', () => {
        base64Input.value = '';
        base64Output.textContent = '';
        base64Output.className = 'base64-result';
    });

    // Copy button click handler
    copyBtn.addEventListener('click', () => {
        const result = base64Output.textContent;
        if (!result) {
            alert('No result to copy');
            return;
        }

        navigator.clipboard.writeText(result).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = result;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        });
    });

    // Auto-detect and process on Enter key
    base64Input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            const input = base64Input.value.trim();
            if (!input) return;

            // Try to auto-detect if it's Base64 or regular text
            if (isValidBase64(input)) {
                decodeBtn.click();
            } else {
                encodeBtn.click();
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initJsonParser();
    initBase64Tool();
});

if (typeof module !== 'undefined') {
    module.exports = { initJsonParser };
}
