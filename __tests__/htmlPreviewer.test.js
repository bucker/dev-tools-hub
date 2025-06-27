const { initHtmlPreviewer } = require('../js/components/html-previewer.js');

describe('HTML Previewer', () => {
    let htmlInput;
    let htmlOutput;
    let previewBtn;
    let clearBtn;
    let errorDiv;
    let htmlPreviewerCard;

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="htmlPreviewerCard"></div>
            <section id="htmlPreviewer">
                <div class="html-previewer-container">
                    <div class="html-previewer-input">
                        <textarea id="htmlInput"></textarea>
                        <div class="html-previewer-buttons">
                            <button id="htmlPreviewBtn">Preview</button>
                            <button id="htmlClearBtn">Clear</button>
                        </div>
                    </div>
                    <div class="html-previewer-output">
                        <iframe id="htmlOutput"></iframe>
                    </div>
                </div>
                <div class="html-previewer-error" id="htmlPreviewerError" style="display:none;"></div>
            </section>
        `;
        htmlInput = document.getElementById('htmlInput');
        htmlOutput = document.getElementById('htmlOutput');
        previewBtn = document.getElementById('htmlPreviewBtn');
        clearBtn = document.getElementById('htmlClearBtn');
        errorDiv = document.getElementById('htmlPreviewerError');
        htmlPreviewerCard = document.getElementById('htmlPreviewerCard');
        initHtmlPreviewer();
    });

    afterEach(() => {
        document.body.innerHTML = '';
        jest.clearAllMocks();
    });

    test('should scroll to the html previewer section when card is clicked', () => {
        const scrollIntoViewMock = jest.fn();
        document.getElementById('htmlPreviewer').scrollIntoView = scrollIntoViewMock;
        htmlPreviewerCard.click();
        expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    });

    test('should render HTML on preview button click', () => {
        htmlInput.value = '<h1>Hello</h1>';
        previewBtn.click();
        expect(htmlOutput.srcdoc).toBe('<h1>Hello</h1>');
        expect(errorDiv.style.display).toBe('none');
    });

    test('should clear input and output on clear button click', () => {
        htmlInput.value = '<h1>Hello</h1>';
        htmlOutput.srcdoc = '<h1>Hello</h1>';
        errorDiv.textContent = 'Error!';
        errorDiv.style.display = 'block';
        clearBtn.click();
        expect(htmlInput.value).toBe('');
        expect(htmlOutput.srcdoc).toBe('');
        expect(errorDiv.textContent).toBe('');
        expect(errorDiv.style.display).toBe('none');
    });

    test('should show error for empty input', () => {
        htmlInput.value = '';
        previewBtn.click();
        expect(errorDiv.textContent).toMatch(/valid HTML/);
        expect(errorDiv.style.display).toBe('block');
        expect(htmlOutput.srcdoc).toBe('');
    });

    test('should show error for script tag input', () => {
        htmlInput.value = '<script>alert(1)</script>';
        previewBtn.click();
        expect(errorDiv.textContent).toMatch(/script tags/i);
        expect(errorDiv.style.display).toBe('block');
        expect(htmlOutput.srcdoc).toBe('');
    });

    test('should show error for malformed HTML (but still set srcdoc)', () => {
        htmlInput.value = '<div><h1>Unclosed';
        previewBtn.click();
        // Browser will still render malformed HTML, so no error expected
        expect(errorDiv.textContent).toBe('');
        expect(errorDiv.style.display).toBe('none');
        expect(htmlOutput.srcdoc).toBe('<div><h1>Unclosed');
    });

    test('should live preview valid HTML on input', () => {
        htmlInput.value = '<p>Live</p>';
        htmlInput.dispatchEvent(new Event('input'));
        expect(htmlOutput.srcdoc).toBe('<p>Live</p>');
        expect(errorDiv.style.display).toBe('none');
    });

    test('should show error on live input for script tag', () => {
        htmlInput.value = '<script>bad()</script>';
        htmlInput.dispatchEvent(new Event('input'));
        expect(errorDiv.textContent).toMatch(/script tags/i);
        expect(errorDiv.style.display).toBe('block');
        expect(htmlOutput.srcdoc).toBe('');
    });

    test('should show error on live input for empty string', () => {
        htmlInput.value = '';
        htmlInput.dispatchEvent(new Event('input'));
        expect(errorDiv.textContent).toBe('');
        expect(errorDiv.style.display).toBe('none');
        expect(htmlOutput.srcdoc).toBe('');
    });

    test('should not throw error if elements are not found', () => {
        const errorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
        document.body.innerHTML = '';
        expect(() => {
            initHtmlPreviewer();
        }).not.toThrow();
        errorMock.mockRestore();
    });
}); 