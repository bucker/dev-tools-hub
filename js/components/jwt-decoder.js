// JWT Decoder Tool
function base64UrlDecode(str) {
    // Replace URL-safe chars and pad with =
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    try {
        return decodeURIComponent(escape(atob(str)));
    } catch (e) {
        throw new Error('Invalid Base64Url encoding');
    }
}

function decodeJwt(token) {
    if (!token || typeof token !== 'string') throw new Error('No token provided');
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('JWT must have 3 parts');
    let header, payload;
    try {
        header = JSON.parse(base64UrlDecode(parts[0]));
    } catch (e) {
        throw new Error('Invalid JWT header');
    }
    try {
        payload = JSON.parse(base64UrlDecode(parts[1]));
    } catch (e) {
        throw new Error('Invalid JWT payload');
    }
    return { header, payload };
}

function initJwtDecoder() {
    const jwtInput = document.getElementById('jwtInput');
    const jwtOutput = document.getElementById('jwtOutput');
    const decodeBtn = document.getElementById('jwtDecodeBtn');
    const clearBtn = document.getElementById('jwtClearBtn');
    const copyBtn = document.getElementById('jwtCopyBtn');
    const jwtCard = document.getElementById('jwtDecoderCard');
    if (!jwtInput || !jwtOutput || !decodeBtn || !clearBtn || !copyBtn || !jwtCard) return;

    jwtCard.addEventListener('click', () => {
        document.getElementById('jwtDecoder').scrollIntoView({ behavior: 'smooth' });
    });

    function updateOutput(content, isError = false) {
        jwtOutput.textContent = content;
        jwtOutput.className = 'jwt-result' + (isError ? ' error' : ' success');
    }

    decodeBtn.addEventListener('click', () => {
        const input = jwtInput.value.trim();
        if (!input) {
            updateOutput('Please enter a JWT token.', true);
            return;
        }
        try {
            const { header, payload } = decodeJwt(input);
            const formatted = `Header:\n${JSON.stringify(header, null, 2)}\n\nPayload:\n${JSON.stringify(payload, null, 2)}`;
            updateOutput(formatted);
        } catch (e) {
            updateOutput('Error: ' + e.message, true);
        }
    });

    clearBtn.addEventListener('click', () => {
        jwtInput.value = '';
        jwtOutput.textContent = '';
        jwtOutput.className = 'jwt-result';
    });

    copyBtn.addEventListener('click', () => {
        const result = jwtOutput.textContent;
        if (!result || jwtOutput.classList.contains('error')) {
            alert('No valid result to copy');
            return;
        }
        navigator.clipboard.writeText(result).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
        }).catch(() => {
            const textArea = document.createElement('textarea');
            textArea.value = result;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
        });
    });
}

if (typeof module !== 'undefined') {
    module.exports = { initJwtDecoder, decodeJwt, base64UrlDecode };
} 