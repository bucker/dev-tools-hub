/**
 * @jest-environment jsdom
 */

const { initTextDiffTool } = require('../js/components/text-diff-tool.js');

describe('Text Diff Tool', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="textDiffCard"></div>
            <section id="textDiffTool">
                <div class="text-diff-container">
                    <div class="text-diff-inputs">
                        <div><textarea id="textDiffInputA"></textarea></div>
                        <div><textarea id="textDiffInputB"></textarea></div>
                    </div>
                    <div class="text-diff-actions">
                        <button id="textDiffCompareBtn">Compare</button>
                        <button id="textDiffClearBtn">Clear</button>
                    </div>
                    <div class="text-diff-output">
                        <div id="textDiffOutput" class="text-diff-result"></div>
                    </div>
                </div>
            </section>
        `;
    });

    test('initTextDiffTool should not throw and should wire up DOM', () => {
        expect(() => initTextDiffTool()).not.toThrow();
    });

    test('shows error message when both inputs are empty and Compare is clicked', () => {
        initTextDiffTool();
        const compareBtn = document.getElementById('textDiffCompareBtn');
        const output = document.getElementById('textDiffOutput');
        // Both inputs are empty by default
        compareBtn.click();
        expect(output.innerHTML).toBe('Please enter at least one string.');
        expect(output.className).toBe('text-diff-result error');
    });

    test('shows diff output and success class for different strings', () => {
        // Mock Diff.diffWords for predictable output
        global.Diff = {
            diffWords: (a, b) => [
                { value: 'foo', removed: true },
                { value: 'bar', added: true }
            ]
        };
        initTextDiffTool();
        const inputA = document.getElementById('textDiffInputA');
        const inputB = document.getElementById('textDiffInputB');
        const compareBtn = document.getElementById('textDiffCompareBtn');
        const output = document.getElementById('textDiffOutput');
        inputA.value = 'foo';
        inputB.value = 'bar';
        compareBtn.click();
        expect(output.innerHTML).toContain('diff-removed');
        expect(output.innerHTML).toContain('diff-added');
        expect(output.className).toBe('text-diff-result success');
        // Clean up
        delete global.Diff;
    });

    test('clear button should clear both inputs and output', () => {
        initTextDiffTool();
        const inputA = document.getElementById('textDiffInputA');
        const inputB = document.getElementById('textDiffInputB');
        const output = document.getElementById('textDiffOutput');
        const clearBtn = document.getElementById('textDiffClearBtn');
        inputA.value = 'some text';
        inputB.value = 'other text';
        output.innerHTML = 'diff result';
        output.className = 'text-diff-result success';
        clearBtn.click();
        expect(inputA.value).toBe('');
        expect(inputB.value).toBe('');
        expect(output.innerHTML).toBe('');
        expect(output.className).toBe('text-diff-result');
    });
});
