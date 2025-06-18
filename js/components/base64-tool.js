// Core Base64 utility functions (exported for testing)
function encodeToBase64(text) {
    try {
        return btoa(unescape(encodeURIComponent(text)));
    } catch (error) {
        throw new Error('Failed to encode text to Base64');
    }
}

function decodeFromBase64(base64String) {
    try {
        return decodeURIComponent(escape(atob(base64String)));
    } catch (error) {
        throw new Error('Invalid Base64 string');
    }
}

function isValidBase64(str) {
    try {
        return btoa(atob(str)) === str;
    } catch (error) {
        return false;
    }
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

// Export for module systems
if (typeof module !== 'undefined') {
    module.exports = { 
        initBase64Tool, 
        encodeToBase64, 
        decodeFromBase64, 
        isValidBase64 
    };
} 