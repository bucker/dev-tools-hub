// HTML Previewer Tool
function initHtmlPreviewer() {
    console.log('[HTML Previewer] initHtmlPreviewer called');
    const htmlInput = document.getElementById('htmlInput');
    const htmlOutput = document.getElementById('htmlOutput');
    const previewBtn = document.getElementById('htmlPreviewBtn');
    const clearBtn = document.getElementById('htmlClearBtn');
    const errorDiv = document.getElementById('htmlPreviewerError');
    const card = document.getElementById('htmlPreviewerCard');

    if (!htmlInput || !htmlOutput || !previewBtn || !clearBtn || !errorDiv || !card) {
        console.error('[HTML Previewer] One or more elements not found:', {
            htmlInput,
            htmlOutput,
            previewBtn,
            clearBtn,
            errorDiv,
            card
        });
        return;
    }

    // Show HTML Previewer section when clicking the card
    card.addEventListener('click', (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        document.getElementById('htmlPreviewer').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    function showError(msg) {
        errorDiv.textContent = msg;
        errorDiv.style.display = 'block';
        htmlOutput.srcdoc = '';
    }

    function clearError() {
        errorDiv.textContent = '';
        errorDiv.style.display = 'none';
    }

    function validateHtmlInput(input) {
        if (typeof input !== 'string' || !input.trim()) {
            return 'Please enter a valid HTML string.';
        }
        // Disallow <script> tags for safety
        if (/<script[\s>]/i.test(input)) {
            return 'Script tags are not allowed for security reasons.';
        }
        // Optionally, further validation can be added here
        return null;
    }

    previewBtn.addEventListener('click', () => {
        const input = htmlInput.value;
        const error = validateHtmlInput(input);
        if (error) {
            showError(error);
            return;
        }
        try {
            htmlOutput.srcdoc = input;
            console.log('[HTML Previewer] Preview set via button:', input);
            clearError();
        } catch (e) {
            showError('Error rendering HTML: ' + e.message);
        }
    });

    clearBtn.addEventListener('click', () => {
        htmlInput.value = '';
        htmlOutput.srcdoc = '';
        clearError();
    });

    // Optional: Live preview on input
    htmlInput.addEventListener('input', () => {
        if (!htmlInput.value.trim()) {
            htmlOutput.srcdoc = '';
            clearError();
            return;
        }
        const error = validateHtmlInput(htmlInput.value);
        if (error) {
            showError(error);
            return;
        }
        htmlOutput.srcdoc = htmlInput.value;
        console.log('[HTML Previewer] Preview set via input:', htmlInput.value);
        clearError();
    });
}

// Export for module systems
if (typeof module !== 'undefined') {
    module.exports = { initHtmlPreviewer };
} 