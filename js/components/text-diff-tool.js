// Text Diff Check Tool
// Requires: jsdiff (Diff) from CDN, e.g. https://cdnjs.cloudflare.com/ajax/libs/jsdiff/8.0.2/diff.min.js

function initTextDiffTool() {
    const inputA = document.getElementById('textDiffInputA');
    const inputB = document.getElementById('textDiffInputB');
    const compareBtn = document.getElementById('textDiffCompareBtn');
    const clearBtn = document.getElementById('textDiffClearBtn');
    const output = document.getElementById('textDiffOutput');
    const card = document.getElementById('textDiffCard');
    if (!inputA || !inputB || !compareBtn || !clearBtn || !output || !card) return;

    // Show Text Diff tool section when clicking the card
    card.addEventListener('click', () => {
        document.getElementById('textDiffTool').scrollIntoView({ behavior: 'smooth' });
    });

    function updateOutput(html, isError = false) {
        output.innerHTML = html;
        output.className = 'text-diff-result' + (isError ? ' error' : ' success');
    }

    function validateInputs(a, b) {
        if (typeof a !== 'string' || typeof b !== 'string') return 'Both inputs must be strings.';
        if (!a && !b) return 'Please enter at least one string.';
        return null;
    }

    function colorDiff(a, b) {
        if (typeof Diff === 'undefined' || !Diff.diffWords) {
            return '<span class="error">Diff library not loaded. Please check your internet connection.</span>';
        }
        const diff = Diff.diffWords(a, b);
        return diff.map(part => {
            let cls = part.added ? 'diff-added' : part.removed ? 'diff-removed' : 'diff-unchanged';
            return `<span class="${cls}">${escapeHtml(part.value)}</span>`;
        }).join('');
    }

    function escapeHtml(str) {
        return str.replace(/[&<>"']/g, function(tag) {
            const chars = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            };
            return chars[tag] || tag;
        });
    }

    compareBtn.addEventListener('click', () => {
        const a = inputA.value;
        const b = inputB.value;
        const error = validateInputs(a, b);
        if (error) {
            updateOutput(error, true);
            return;
        }
        try {
            const html = colorDiff(a, b);
            // If colorDiff returns the "Diff library not loaded" error, treat as error
            if (html.includes('Diff library not loaded')) {
                updateOutput(html, true);
            } else {
                updateOutput(html, false);
            }
        } catch (e) {
            updateOutput('Error: ' + e.message, true);
        }
    });

    clearBtn.addEventListener('click', () => {
        inputA.value = '';
        inputB.value = '';
        output.innerHTML = '';
        output.className = 'text-diff-result';
    });
}

// Export for module systems
if (typeof module !== 'undefined') {
    module.exports = { initTextDiffTool };
} 