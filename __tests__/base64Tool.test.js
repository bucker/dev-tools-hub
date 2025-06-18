/**
 * @jest-environment jsdom
 */

describe('Base64 Tool', () => {
    let base64Input;
    let base64Output;
    let encodeBtn;
    let decodeBtn;
    let clearBtn;
    let copyBtn;
    let base64Card;
    let base64Tool;
    let initBase64Tool;
    let encodeToBase64;
    let decodeFromBase64;
    let isValidBase64;

    beforeEach(() => {
        // Set up our document body
        document.body.innerHTML = `
            <div id="base64Card"></div>
            <div id="base64Tool">
                <div class="base64-container">
                    <div class="base64-input">
                        <textarea id="base64Input"></textarea>
                        <div class="base64-buttons">
                            <button id="encodeBtn">Encode to Base64</button>
                            <button id="decodeBtn">Decode from Base64</button>
                            <button id="clearBtn">Clear</button>
                        </div>
                    </div>
                    <div class="base64-output">
                        <div id="base64Output" class="base64-result"></div>
                        <button id="copyBtn">Copy Result</button>
                    </div>
                </div>
            </div>
        `;

        // Get our elements
        base64Input = document.getElementById('base64Input');
        base64Output = document.getElementById('base64Output');
        encodeBtn = document.getElementById('encodeBtn');
        decodeBtn = document.getElementById('decodeBtn');
        clearBtn = document.getElementById('clearBtn');
        copyBtn = document.getElementById('copyBtn');
        base64Card = document.getElementById('base64Card');
        base64Tool = document.getElementById('base64Tool');

        // Mock navigator.clipboard
        Object.defineProperty(navigator, 'clipboard', {
            value: {
                writeText: jest.fn().mockResolvedValue(undefined)
            },
            writable: true
        });

        // Mock document.execCommand for fallback
        document.execCommand = jest.fn().mockReturnValue(true);

        // Load the script and get functions
        const base64Module = require('../js/components/base64-tool.js');
        initBase64Tool = base64Module.initBase64Tool;
        encodeToBase64 = base64Module.encodeToBase64;
        decodeFromBase64 = base64Module.decodeFromBase64;
        isValidBase64 = base64Module.isValidBase64;

        initBase64Tool();
    });

    describe('Core Base64 Functions', () => {
        test('encodeToBase64 should encode simple text correctly', () => {
            const result = encodeToBase64('Hello World');
            expect(result).toBe('SGVsbG8gV29ybGQ=');
        });

        test('encodeToBase64 should handle special characters', () => {
            const result = encodeToBase64('Hello, World! @#$%');
            expect(result).toBe('SGVsbG8sIFdvcmxkISBAIyQl');
        });

        test('encodeToBase64 should handle Unicode characters', () => {
            const result = encodeToBase64('Hello 世界');
            expect(result).toBe('SGVsbG8g5LiW55WM');
        });

        test('encodeToBase64 should handle empty string', () => {
            const result = encodeToBase64('');
            expect(result).toBe('');
        });

        test('decodeFromBase64 should decode simple text correctly', () => {
            const result = decodeFromBase64('SGVsbG8gV29ybGQ=');
            expect(result).toBe('Hello World');
        });

        test('decodeFromBase64 should handle special characters', () => {
            const result = decodeFromBase64('SGVsbG8sIFdvcmxkISBAIyQl');
            expect(result).toBe('Hello, World! @#$%');
        });

        test('decodeFromBase64 should handle Unicode characters', () => {
            const result = decodeFromBase64('SGVsbG8g5LiW55WM');
            expect(result).toBe('Hello 世界');
        });

        test('decodeFromBase64 should handle empty string', () => {
            const result = decodeFromBase64('');
            expect(result).toBe('');
        });

        test('decodeFromBase64 should throw error for invalid Base64', () => {
            expect(() => decodeFromBase64('invalid-base64!')).toThrow('Invalid Base64 string');
        });

        test('isValidBase64 should return true for valid Base64', () => {
            expect(isValidBase64('SGVsbG8gV29ybGQ=')).toBe(true);
            expect(isValidBase64('')).toBe(true);
            expect(isValidBase64('SGVsbG8sIFdvcmxkISBAIyQl')).toBe(true);
        });

        test('isValidBase64 should return false for invalid Base64', () => {
            expect(isValidBase64('invalid-base64!')).toBe(false);
            expect(isValidBase64('SGVsbG8gV29ybGQ')).toBe(false); // Missing padding
            expect(isValidBase64('SGVsbG8gV29ybGQ===')).toBe(false); // Too much padding
        });

        test('isValidBase64 should handle edge cases', () => {
            expect(isValidBase64('SGVsbG8gV29ybGQ+')).toBe(true); // Contains +
            expect(isValidBase64('SGVsbG8gV29ybGQ/')).toBe(true); // Contains /
            expect(isValidBase64('SGVsbG8gV29ybGQ=')).toBe(true); // Contains =
        });
    });

    describe('UI Interactions', () => {
        test('should scroll to base64 tool section when clicking the card', () => {
            const mockScrollIntoView = jest.fn();
            base64Tool.scrollIntoView = mockScrollIntoView;

            base64Card.click();

            expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
        });

        test('encode button should encode text and display result', () => {
            base64Input.value = 'Hello World';
            encodeBtn.click();

            expect(base64Output.textContent).toBe('SGVsbG8gV29ybGQ=');
            expect(base64Output.className).toBe('base64-result success');
        });

        test('encode button should show error for empty input', () => {
            base64Input.value = '';
            encodeBtn.click();

            expect(base64Output.textContent).toBe('Please enter some text to encode.');
            expect(base64Output.className).toBe('base64-result error');
        });

        test('decode button should decode Base64 and display result', () => {
            base64Input.value = 'SGVsbG8gV29ybGQ=';
            decodeBtn.click();

            expect(base64Output.textContent).toBe('Hello World');
            expect(base64Output.className).toBe('base64-result success');
        });

        test('decode button should show error for empty input', () => {
            base64Input.value = '';
            decodeBtn.click();

            expect(base64Output.textContent).toBe('Please enter a Base64 string to decode.');
            expect(base64Output.className).toBe('base64-result error');
        });

        test('decode button should show error for invalid Base64', () => {
            base64Input.value = 'invalid-base64!';
            decodeBtn.click();

            expect(base64Output.textContent).toBe('Error: Invalid Base64 string');
            expect(base64Output.className).toBe('base64-result error');
        });

        test('clear button should clear input and output', () => {
            base64Input.value = 'test input';
            base64Output.textContent = 'test output';
            base64Output.className = 'base64-result success';

            clearBtn.click();

            expect(base64Input.value).toBe('');
            expect(base64Output.textContent).toBe('');
            expect(base64Output.className).toBe('base64-result');
        });

        test('copy button should copy result to clipboard', async () => {
            base64Output.textContent = 'test result';
            
            copyBtn.click();

            expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test result');
        });

        test('copy button should show alert when no result to copy', () => {
            const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
            base64Output.textContent = '';

            copyBtn.click();

            expect(alertSpy).toHaveBeenCalledWith('No result to copy');
            alertSpy.mockRestore();
        });

        test('copy button should change text temporarily after copying', async () => {
            base64Output.textContent = 'test result';
            const originalText = copyBtn.textContent;

            copyBtn.click();

            // Wait for the promise to resolve and text to change
            await new Promise(resolve => setTimeout(resolve, 10));
            
            // Check that text changes after promise resolves
            expect(copyBtn.textContent).toBe('Copied!');
            
            // Wait for timeout to restore original text
            await new Promise(resolve => setTimeout(resolve, 2100));
            expect(copyBtn.textContent).toBe(originalText);
        });

        test('should auto-detect and encode on Ctrl+Enter for regular text', () => {
            base64Input.value = 'Hello World';
            
            const keydownEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                ctrlKey: true
            });
            base64Input.dispatchEvent(keydownEvent);

            expect(base64Output.textContent).toBe('SGVsbG8gV29ybGQ=');
        });

        test('should auto-detect and decode on Ctrl+Enter for Base64 text', () => {
            base64Input.value = 'SGVsbG8gV29ybGQ=';
            
            const keydownEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                ctrlKey: true
            });
            base64Input.dispatchEvent(keydownEvent);

            expect(base64Output.textContent).toBe('Hello World');
        });

        test('should not process on Enter without Ctrl key', () => {
            base64Input.value = 'Hello World';
            
            const keydownEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                ctrlKey: false
            });
            base64Input.dispatchEvent(keydownEvent);

            expect(base64Output.textContent).toBe('');
        });

        test('should not process on Ctrl+Enter for empty input', () => {
            base64Input.value = '';
            
            const keydownEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                ctrlKey: true
            });
            base64Input.dispatchEvent(keydownEvent);

            expect(base64Output.textContent).toBe('');
        });
    });

    describe('Edge Cases', () => {
        test('should handle very long strings', () => {
            const longString = 'a'.repeat(1000);
            const result = encodeToBase64(longString);
            const decoded = decodeFromBase64(result);
            expect(decoded).toBe(longString);
        });

        test('should handle strings with only whitespace', () => {
            base64Input.value = '   ';
            encodeBtn.click();

            // The trim() function removes whitespace, so empty input error should be shown
            expect(base64Output.textContent).toBe('Please enter some text to encode.');
            expect(base64Output.className).toBe('base64-result error');
        });

        test('should handle Base64 strings with padding variations', () => {
            // Test with different padding scenarios
            expect(isValidBase64('SGVsbG8=')).toBe(true); // One padding
            expect(isValidBase64('SGVsbG8')).toBe(false); // No padding
            expect(isValidBase64('SGVsbG8==')).toBe(false); // Too much padding
        });

        test('should handle clipboard API failure gracefully', async () => {
            // Mock clipboard API to fail
            navigator.clipboard.writeText = jest.fn().mockRejectedValue(new Error('Clipboard failed'));
            
            base64Output.textContent = 'test result';
            copyBtn.click();

            // Wait for the async operation
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Should fall back to execCommand
            expect(document.execCommand).toHaveBeenCalledWith('copy');
        });
    });
}); 