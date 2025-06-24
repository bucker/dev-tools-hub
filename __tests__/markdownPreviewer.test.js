const { initMarkdownPreviewer } = require('../js/components/markdown-previewer.js');

// Mock marked library
window.marked = {
    parse: jest.fn(markdown => `parsed: ${markdown}`),
};

describe('Markdown Previewer', () => {
    let markdownInput;
    let markdownOutput;
    let markdownPreviewerCard;

    beforeEach(() => {
        // Set up our document body
        document.body.innerHTML = `
            <div id="markdownPreviewerCard"></div>
            <section id="markdownPreviewer">
                <textarea id="markdownInput"></textarea>
                <div id="markdownOutput"></div>
            </section>
        `;

        markdownInput = document.getElementById('markdownInput');
        markdownOutput = document.getElementById('markdownOutput');
        markdownPreviewerCard = document.getElementById('markdownPreviewerCard');
        
        initMarkdownPreviewer();
    });

    afterEach(() => {
        document.body.innerHTML = '';
        jest.clearAllMocks();
    });

    test('should scroll to the markdown previewer section when card is clicked', () => {
        const scrollIntoViewMock = jest.fn();
        document.getElementById('markdownPreviewer').scrollIntoView = scrollIntoViewMock;

        markdownPreviewerCard.click();

        expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    test('should update preview on input', () => {
        const testMarkdown = '# Hello';
        markdownInput.value = testMarkdown;
        markdownInput.dispatchEvent(new Event('input'));

        expect(window.marked.parse).toHaveBeenCalledWith(testMarkdown, { gfm: true, breaks: true });
        expect(markdownOutput.innerHTML).toBe(`parsed: ${testMarkdown}`);
    });

    test('should not throw error if elements are not found', () => {
        document.body.innerHTML = ''; // no elements
        expect(() => {
            initMarkdownPreviewer();
        }).not.toThrow();
    });
}); 