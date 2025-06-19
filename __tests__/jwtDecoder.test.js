/**
 * @jest-environment jsdom
 */

const { decodeJwt, base64UrlDecode, initJwtDecoder } = require('../js/components/jwt-decoder.js');

describe('JWT Decoder', () => {
    describe('Core Decoding Functions', () => {
        test('base64UrlDecode decodes valid Base64Url', () => {
            expect(base64UrlDecode('eyJmb28iOiJiYXIifQ')).toBe('{"foo":"bar"}');
        });
        test('base64UrlDecode throws on invalid input', () => {
            expect(() => base64UrlDecode('!@#')).toThrow('Invalid Base64Url encoding');
        });
        test('decodeJwt decodes valid JWT', () => {
            const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.signature';
            const { header, payload } = decodeJwt(jwt);
            expect(header.alg).toBe('HS256');
            expect(payload.name).toBe('John Doe');
        });
        test('decodeJwt throws on missing token', () => {
            expect(() => decodeJwt('')).toThrow('No token provided');
        });
        test('decodeJwt throws on wrong part count', () => {
            expect(() => decodeJwt('abc.def')).toThrow('JWT must have 3 parts');
        });
        test('decodeJwt throws on invalid header', () => {
            const jwt = '!!..signature';
            expect(() => decodeJwt(jwt)).toThrow('Invalid JWT header');
        });
        test('decodeJwt throws on invalid payload', () => {
            // Use a valid header, invalid payload, and any signature
            const validHeader = 'eyJhbGciOiJIUzI1NiJ9'; // {"alg":"HS256"}
            const invalidPayload = '!!'; // not valid base64url
            const jwt = `${validHeader}.${invalidPayload}.signature`;
            expect(() => decodeJwt(jwt)).toThrow('Invalid JWT payload');
        });
    });

    describe('UI Interactions', () => {
        let jwtInput, jwtOutput, decodeBtn, clearBtn, copyBtn, jwtCard;
        beforeEach(() => {
            document.body.innerHTML = `
                <div id="jwtDecoderCard"></div>
                <div id="jwtDecoder">
                    <div class="jwt-decoder-container">
                        <div class="jwt-input">
                            <textarea id="jwtInput"></textarea>
                            <div class="jwt-buttons">
                                <button id="jwtDecodeBtn">Decode JWT</button>
                                <button id="jwtClearBtn">Clear</button>
                            </div>
                        </div>
                        <div class="jwt-output">
                            <div id="jwtOutput" class="jwt-result"></div>
                            <button id="jwtCopyBtn">Copy Decoded</button>
                        </div>
                    </div>
                </div>
            `;
            jwtInput = document.getElementById('jwtInput');
            jwtOutput = document.getElementById('jwtOutput');
            decodeBtn = document.getElementById('jwtDecodeBtn');
            clearBtn = document.getElementById('jwtClearBtn');
            copyBtn = document.getElementById('jwtCopyBtn');
            jwtCard = document.getElementById('jwtDecoderCard');
            // Mock clipboard
            Object.defineProperty(navigator, 'clipboard', {
                value: { writeText: jest.fn().mockResolvedValue(undefined) },
                writable: true
            });
            document.execCommand = jest.fn().mockReturnValue(true);
            initJwtDecoder();
        });
        test('should decode valid JWT and display result', () => {
            jwtInput.value = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.signature';
            decodeBtn.click();
            expect(jwtOutput.textContent).toContain('Header:');
            expect(jwtOutput.textContent).toContain('Payload:');
            expect(jwtOutput.className).toContain('success');
        });
        test('should show error for empty input', () => {
            jwtInput.value = '';
            decodeBtn.click();
            expect(jwtOutput.textContent).toContain('Please enter a JWT token.');
            expect(jwtOutput.className).toContain('error');
        });
        test('should show error for malformed JWT', () => {
            jwtInput.value = 'abc.def';
            decodeBtn.click();
            expect(jwtOutput.textContent).toContain('JWT must have 3 parts');
            expect(jwtOutput.className).toContain('error');
        });
        test('should clear input and output', () => {
            jwtInput.value = 'something';
            jwtOutput.textContent = 'result';
            clearBtn.click();
            expect(jwtInput.value).toBe('');
            expect(jwtOutput.textContent).toBe('');
            expect(jwtOutput.className).toBe('jwt-result');
        });
        test('should copy result to clipboard', async () => {
            jwtOutput.textContent = 'Header:\n{}\n\nPayload:\n{}';
            jwtOutput.className = 'jwt-result success';
            await copyBtn.click();
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Header:\n{}\n\nPayload:\n{}');
        });
        test('should not copy if result is error', async () => {
            jwtOutput.textContent = 'Error: something';
            jwtOutput.className = 'jwt-result error';
            window.alert = jest.fn();
            await copyBtn.click();
            expect(window.alert).toHaveBeenCalledWith('No valid result to copy');
        });
        test('should scroll to section when card is clicked', () => {
            const mockScrollIntoView = jest.fn();
            document.getElementById('jwtDecoder').scrollIntoView = mockScrollIntoView;
            jwtCard.click();
            expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
        });
    });
}); 