function initMarkdownPreviewer() {
    const markdownInput = document.getElementById('markdownInput');
    const markdownOutput = document.getElementById('markdownOutput');
    const markdownPreviewerCard = document.getElementById('markdownPreviewerCard');

    if (markdownPreviewerCard) {
        markdownPreviewerCard.addEventListener('click', () => {
            document.getElementById('markdownPreviewer').scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (markdownInput && markdownOutput) {
        markdownInput.addEventListener('input', () => {
            const markdownText = markdownInput.value;
            if (window.marked) {
                const dirtyHtml = window.marked.parse(markdownText, { gfm: true, breaks: true });
                markdownOutput.innerHTML = dirtyHtml;
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', initMarkdownPreviewer);

if (typeof module !== 'undefined') {
    module.exports = { initMarkdownPreviewer };
} 