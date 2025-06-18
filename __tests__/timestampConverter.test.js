/**
 * @jest-environment jsdom
 */

describe('Timestamp Converter', () => {
    let timestampInput;
    let datetimeInput;
    let timestampResult;
    let timestampCard;
    let initTimestampConverter;

    beforeEach(() => {
        // Set up our document body with text input for datetime to work better with jsdom
        document.body.innerHTML = `
            <div id="timestampCard"></div>
            <div id="timestampConverter">
                <div class="timestamp-converter-container">
                    <div class="timestamp-input-section">
                        <div class="timestamp-input-group">
                            <input type="text" id="timestampInput" placeholder="e.g., 1640995200 or 1640995200000">
                        </div>
                        <div class="timestamp-input-group">
                            <input type="text" id="datetimeInput" placeholder="YYYY-MM-DDTHH:mm:ss">
                        </div>
                        <div class="timestamp-buttons">
                            <button id="currentTimeBtn" class="timestamp-btn">Current Time</button>
                            <button id="timestampClearBtn" class="timestamp-btn clear">Clear</button>
                            <button id="timestampCopyBtn" class="timestamp-btn secondary">Copy Result</button>
                        </div>
                    </div>
                    <div class="timestamp-output-section">
                        <div id="timestampResult" class="timestamp-result"></div>
                    </div>
                </div>
            </div>
        `;

        // Get our elements
        timestampInput = document.getElementById('timestampInput');
        datetimeInput = document.getElementById('datetimeInput');
        timestampResult = document.getElementById('timestampResult');
        timestampCard = document.getElementById('timestampCard');

        // Load the script and call initTimestampConverter
        initTimestampConverter = require('../js/components/timestamp-converter.js').initTimestampConverter;
        initTimestampConverter();
    });

    describe('UNIX Timestamp to DateTime Conversion', () => {
        test('should convert valid UNIX timestamp (seconds) to datetime', () => {
            const timestamp = '1640995200'; // 2022-01-01 12:00:00 UTC
            timestampInput.value = timestamp;
            timestampInput.dispatchEvent(new Event('input'));

            expect(timestampResult.textContent).toContain('UNIX Timestamp (seconds): 1640995200');
            expect(timestampResult.textContent).toContain('UNIX Timestamp (milliseconds): 1640995200000');
            expect(timestampResult.textContent).toContain('UTC:');
            expect(timestampResult.textContent).toContain('Local:');
            expect(timestampResult.textContent).toContain('ISO:');
            expect(timestampResult.className).toContain('success');
        });

        test('should convert valid UNIX timestamp (milliseconds) to datetime', () => {
            const timestamp = '1640995200000'; // 2022-01-01 12:00:00 UTC
            timestampInput.value = timestamp;
            timestampInput.dispatchEvent(new Event('input'));

            expect(timestampResult.textContent).toContain('UNIX Timestamp (seconds): 1640995200');
            expect(timestampResult.textContent).toContain('UNIX Timestamp (milliseconds): 1640995200000');
            expect(timestampResult.className).toContain('success');
        });

        test('should handle zero timestamp', () => {
            const timestamp = '0'; // Unix epoch
            timestampInput.value = timestamp;
            timestampInput.dispatchEvent(new Event('input'));

            expect(timestampResult.textContent).toContain('UNIX Timestamp (seconds): 0');
            expect(timestampResult.textContent).toContain('UNIX Timestamp (milliseconds): 0');
            expect(timestampResult.className).toContain('success');
        });

        test('should handle very large timestamp', () => {
            const timestamp = '9999999999999'; // Far future
            timestampInput.value = timestamp;
            timestampInput.dispatchEvent(new Event('input'));

            expect(timestampResult.textContent).toContain('UNIX Timestamp (seconds): 9999999999');
            expect(timestampResult.textContent).toContain('UNIX Timestamp (milliseconds): 9999999999999');
            expect(timestampResult.className).toContain('success');
        });

        test('should show error for negative timestamp', () => {
            const timestamp = '-1640995200';
            timestampInput.value = timestamp;
            timestampInput.dispatchEvent(new Event('input'));

            expect(timestampResult.textContent).toContain('Error: Invalid timestamp format');
            expect(timestampResult.className).toContain('error');
        });

        test('should show error for non-numeric input', () => {
            const timestamp = 'invalid';
            timestampInput.value = timestamp;
            timestampInput.dispatchEvent(new Event('input'));

            expect(timestampResult.textContent).toContain('Error: Invalid timestamp format');
            expect(timestampResult.className).toContain('error');
        });

        test('should show error for empty input', () => {
            timestampInput.value = '';
            timestampInput.dispatchEvent(new Event('input'));

            expect(timestampResult.textContent).toBe('');
            expect(timestampResult.className).toBe('timestamp-result');
        });

        test('should show error for timestamp too large', () => {
            const timestamp = '99999999999999'; // Too large
            timestampInput.value = timestamp;
            timestampInput.dispatchEvent(new Event('input'));

            expect(timestampResult.textContent).toContain('Error: Invalid timestamp format');
            expect(timestampResult.className).toContain('error');
        });
    });

    describe('DateTime to UNIX Timestamp Conversion', () => {
        test('should convert valid datetime to UNIX timestamp', () => {
            const datetime = '2022-01-01T12:00:00';
            datetimeInput.value = datetime;
            datetimeInput.dispatchEvent(new Event('input'));

            expect(timestampResult.textContent).toContain('UNIX Timestamp (seconds):');
            expect(timestampResult.textContent).toContain('UNIX Timestamp (milliseconds):');
            expect(timestampResult.className).toContain('success');
        });

        test('should handle ISO datetime format', () => {
            const datetime = '2022-01-01T12:00:00.000Z';
            datetimeInput.value = datetime;
            datetimeInput.dispatchEvent(new Event('input'));

            expect(timestampResult.textContent).toContain('UNIX Timestamp (seconds):');
            expect(timestampResult.textContent).toContain('UNIX Timestamp (milliseconds):');
            expect(timestampResult.className).toContain('success');
        });

        test('should show error for invalid datetime format', () => {
            const datetime = 'invalid-date';
            datetimeInput.value = datetime;
            datetimeInput.dispatchEvent(new Event('input'));

            expect(timestampResult.textContent).toContain('Error: Invalid date format');
            expect(timestampResult.className).toContain('error');
        });

        test('should show error for empty datetime input', () => {
            datetimeInput.value = '';
            datetimeInput.dispatchEvent(new Event('input'));

            expect(timestampResult.textContent).toBe('');
            expect(timestampResult.className).toBe('timestamp-result');
        });
    });

    describe('Current Time Functionality', () => {
        test('should set current time when current time button is clicked', () => {
            const currentTimeBtn = document.getElementById('currentTimeBtn');
            const now = new Date();
            const expectedUnix = Math.floor(now.getTime() / 1000);

            currentTimeBtn.click();

            expect(timestampInput.value).toBe(expectedUnix.toString());
            expect(timestampResult.textContent).toContain('UNIX Timestamp (seconds):');
            expect(timestampResult.textContent).toContain('UNIX Timestamp (milliseconds):');
            expect(timestampResult.className).toContain('success');
        });

        test('should update both inputs when current time is set', () => {
            const currentTimeBtn = document.getElementById('currentTimeBtn');
            
            currentTimeBtn.click();

            expect(timestampInput.value).not.toBe('');
            expect(datetimeInput.value).not.toBe('');
        });
    });

    describe('Clear Functionality', () => {
        test('should clear all inputs and result when clear button is clicked', () => {
            const clearBtn = document.getElementById('timestampClearBtn');
            
            // Set some values first
            timestampInput.value = '1640995200';
            datetimeInput.value = '2022-01-01T12:00:00';
            timestampResult.textContent = 'Some result';
            timestampResult.className = 'timestamp-result success';

            clearBtn.click();

            expect(timestampInput.value).toBe('');
            expect(datetimeInput.value).toBe('');
            expect(timestampResult.textContent).toBe('');
            expect(timestampResult.className).toBe('timestamp-result');
        });
    });

    describe('Copy Functionality', () => {
        test('should copy result to clipboard when copy button is clicked', () => {
            const copyBtn = document.getElementById('timestampCopyBtn');
            
            // Mock clipboard API
            const mockClipboard = {
                writeText: jest.fn().mockResolvedValue(undefined)
            };
            Object.assign(navigator, { clipboard: mockClipboard });

            // Set a result first
            timestampInput.value = '1640995200';
            timestampInput.dispatchEvent(new Event('input'));

            copyBtn.click();

            expect(mockClipboard.writeText).toHaveBeenCalled();
        });

        test('should show success message when copying', () => {
            const copyBtn = document.getElementById('timestampCopyBtn');
            
            // Mock clipboard API
            const mockClipboard = {
                writeText: jest.fn().mockResolvedValue(undefined)
            };
            Object.assign(navigator, { clipboard: mockClipboard });

            // Set a result first
            timestampInput.value = '1640995200';
            timestampInput.dispatchEvent(new Event('input'));

            const originalText = timestampResult.textContent;
            copyBtn.click();

            expect(timestampResult.textContent).toBe('Result copied to clipboard!');
        });
    });

    describe('Navigation', () => {
        test('should scroll to converter section when clicking the card', () => {
            // Mock scrollIntoView
            const mockScrollIntoView = jest.fn();
            document.getElementById('timestampConverter').scrollIntoView = mockScrollIntoView;

            timestampCard.click();

            expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
        });
    });

    describe('Date Components Display', () => {
        test('should display all date components correctly', () => {
            const timestamp = '1640995200'; // 2022-01-01 12:00:00 UTC
            timestampInput.value = timestamp;
            timestampInput.dispatchEvent(new Event('input'));

            expect(timestampResult.textContent).toContain('Year: 2022');
            expect(timestampResult.textContent).toContain('Month: 1');
            expect(timestampResult.textContent).toContain('Day: 1');
            expect(timestampResult.textContent).toContain('Hour:');
            expect(timestampResult.textContent).toContain('Minute:');
            expect(timestampResult.textContent).toContain('Second:');
            expect(timestampResult.textContent).toContain('Timezone:');
        });
    });

    describe('Timezone Handling', () => {
        test('should display local timezone information', () => {
            const timestamp = '1640995200';
            timestampInput.value = timestamp;
            timestampInput.dispatchEvent(new Event('input'));

            expect(timestampResult.textContent).toContain('Timezone:');
            // The actual timezone will depend on the test environment
        });

        test('should display both UTC and local time', () => {
            const timestamp = '1640995200';
            timestampInput.value = timestamp;
            timestampInput.dispatchEvent(new Event('input'));

            expect(timestampResult.textContent).toContain('UTC:');
            expect(timestampResult.textContent).toContain('Local:');
        });
    });

    describe('Input Synchronization', () => {
        test('should update datetime input when timestamp is entered', () => {
            const timestamp = '1640995200';
            timestampInput.value = timestamp;
            timestampInput.dispatchEvent(new Event('input'));

            expect(datetimeInput.value).not.toBe('');
            expect(datetimeInput.value).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
        });

        test('should update timestamp input when datetime is entered', () => {
            const datetime = '2022-01-01T12:00:00';
            datetimeInput.value = datetime;
            datetimeInput.dispatchEvent(new Event('input'));

            expect(timestampInput.value).not.toBe('');
            expect(Number(timestampInput.value)).toBeGreaterThan(0);
        });
    });

    describe('Edge Cases', () => {
        test('should handle decimal timestamps', () => {
            const timestamp = '1640995200.5';
            timestampInput.value = timestamp;
            timestampInput.dispatchEvent(new Event('input'));

            expect(timestampResult.textContent).toContain('UNIX Timestamp (seconds): 1640995200');
            expect(timestampResult.className).toContain('success');
        });

        test('should handle scientific notation', () => {
            const timestamp = '1.6409952e12';
            timestampInput.value = timestamp;
            timestampInput.dispatchEvent(new Event('input'));

            expect(timestampResult.textContent).toContain('UNIX Timestamp (seconds): 1640995200');
            expect(timestampResult.className).toContain('success');
        });

        test('should handle whitespace in input', () => {
            const timestamp = '  1640995200  ';
            timestampInput.value = timestamp;
            timestampInput.dispatchEvent(new Event('input'));

            expect(timestampResult.textContent).toContain('UNIX Timestamp (seconds): 1640995200');
            expect(timestampResult.className).toContain('success');
        });
    });
}); 