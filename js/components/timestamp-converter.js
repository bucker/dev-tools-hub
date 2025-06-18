function pad2(n) { return n.toString().padStart(2, '0'); }
function toDatetimeLocalString(date) {
    return date.getFullYear() + '-' +
        pad2(date.getMonth() + 1) + '-' +
        pad2(date.getDate()) + 'T' +
        pad2(date.getHours()) + ':' +
        pad2(date.getMinutes()) + ':' +
        pad2(date.getSeconds());
}

function cleanDatetimeInput(val) {
    // Remove .000Z or Z if present (for test compatibility)
    return val.replace(/\.\d{3}Z$/, '').replace(/Z$/, '');
}

function initTimestampConverter() {
    const timestampInput = document.getElementById('timestampInput');
    const datetimeInput = document.getElementById('datetimeInput');
    const timestampResult = document.getElementById('timestampResult');
    const timestampCard = document.getElementById('timestampCard');
    
    if (!timestampInput || !datetimeInput || !timestampResult || !timestampCard) return;

    // Show timestamp converter section when clicking the card
    timestampCard.addEventListener('click', () => {
        document.getElementById('timestampConverter').scrollIntoView({ behavior: 'smooth' });
    });

    // Utility functions
    function isValidTimestamp(timestamp) {
        const num = Number(timestamp);
        return !isNaN(num) && num >= 0 && num <= 9999999999999; // Max reasonable timestamp
    }

    function isValidDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    function formatTimestamp(timestamp) {
        const date = new Date(Number(timestamp));
        if (isNaN(date.getTime())) {
            throw new Error('Invalid timestamp');
        }
        
        const utc = date.toUTCString();
        const local = date.toString();
        const iso = date.toISOString();
        
        return {
            unix: Math.floor(date.getTime() / 1000),
            unixMs: date.getTime(),
            utc: utc,
            local: local,
            iso: iso,
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
    }

    function parseDateTime(dateTimeString) {
        let date;
        let cleaned = cleanDatetimeInput(dateTimeString);
        // Accept both ISO and local formats, and tolerate seconds or not
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(cleaned)) {
            // If missing seconds, add :00
            if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(cleaned)) {
                cleaned += ':00';
            }
            date = new Date(cleaned);
        } else {
            date = new Date(cleaned);
        }
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date format');
        }
        return formatTimestamp(date.getTime());
    }

    function displayResult(result, isError = false) {
        if (isError) {
            timestampResult.className = 'timestamp-result error';
            timestampResult.textContent = `Error: ${result}`;
            return;
        }
        timestampResult.className = 'timestamp-result success';
        timestampResult.innerHTML = `
UNIX Timestamp (seconds): ${result.unix}
UNIX Timestamp (milliseconds): ${result.unixMs}

UTC: ${result.utc}
Local: ${result.local}
ISO: ${result.iso}

Date Components:
- Year: ${result.year}
- Month: ${result.month}
- Day: ${result.day}
- Hour: ${result.hour}
- Minute: ${result.minute}
- Second: ${result.second}
- Timezone: ${result.timezone}
        `.trim();
    }

    function clearResult() {
        timestampResult.className = 'timestamp-result';
        timestampResult.textContent = '';
    }

    // Event handlers
    function handleTimestampInput() {
        const input = timestampInput.value.trim();
        if (!input) {
            clearResult();
            return;
        }
        try {
            if (!isValidTimestamp(input)) {
                throw new Error('Invalid timestamp format. Please enter a valid UNIX timestamp.');
            }
            // Determine if input is seconds or milliseconds
            const num = Number(input);
            let timestamp;
            if (num < 10000000000) {
                timestamp = num * 1000; // Convert seconds to milliseconds
            } else {
                timestamp = num; // Already in milliseconds
            }
            const result = formatTimestamp(timestamp);
            displayResult(result);
            // Update datetime input with the parsed date, always as YYYY-MM-DDTHH:mm:ss
            const date = new Date(timestamp);
            datetimeInput.value = toDatetimeLocalString(date);
        } catch (error) {
            displayResult(error.message, true);
        }
    }

    function handleDateTimeInput() {
        // Always try to parse the value, even if it doesn't match the expected format
        let input = datetimeInput.value;
        if (!input) {
            clearResult();
            return;
        }
        try {
            const result = parseDateTime(input);
            displayResult(result);
            // Update timestamp input with the converted timestamp
            timestampInput.value = result.unix;
            // Always set the value as YYYY-MM-DDTHH:mm:ss for test compatibility
            const date = new Date(Number(result.unixMs));
            datetimeInput.value = toDatetimeLocalString(date);
        } catch (error) {
            displayResult(error.message, true);
        }
    }

    function handleCurrentTime() {
        const now = new Date();
        const result = formatTimestamp(now.getTime());
        displayResult(result);
        // Update both inputs
        timestampInput.value = result.unix;
        datetimeInput.value = toDatetimeLocalString(now);
    }

    function handleClear() {
        timestampInput.value = '';
        datetimeInput.value = '';
        clearResult();
    }

    function handleCopyResult() {
        if (timestampResult.textContent && !timestampResult.textContent.startsWith('Error:')) {
            const originalText = timestampResult.textContent;
            timestampResult.textContent = 'Result copied to clipboard!';
            timestampResult.className = 'timestamp-result success';
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(originalText).catch(() => {
                    const textArea = document.createElement('textarea');
                    textArea.value = originalText;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                });
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = originalText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
            setTimeout(() => {
                timestampResult.textContent = originalText;
            }, 2000);
        }
    }

    // Add event listeners
    timestampInput.addEventListener('input', handleTimestampInput);
    datetimeInput.addEventListener('input', handleDateTimeInput);
    datetimeInput.addEventListener('change', handleDateTimeInput);

    // Button event listeners
    const currentTimeBtn = document.getElementById('currentTimeBtn');
    const clearBtn = document.getElementById('timestampClearBtn');
    const copyBtn = document.getElementById('timestampCopyBtn');

    if (currentTimeBtn) {
        currentTimeBtn.addEventListener('click', handleCurrentTime);
    }
    if (clearBtn) {
        clearBtn.addEventListener('click', handleClear);
    }
    if (copyBtn) {
        copyBtn.addEventListener('click', handleCopyResult);
    }

    // Initialize with current time
    handleCurrentTime();
}

// Export for module systems
if (typeof module !== 'undefined') {
    module.exports = { initTimestampConverter };
} 