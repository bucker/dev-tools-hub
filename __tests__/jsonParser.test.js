/**
 * @jest-environment jsdom
 */

describe('JSON Parser', () => {
    let jsonInput;
    let jsonOutput;
    let jsonParserCard;
    let initJsonParser;

    beforeEach(() => {
        // Set up our document body
        document.body.innerHTML = `
            <div id="jsonParserCard"></div>
            <div id="jsonParser">
                <div class="json-parser-container">
                    <div class="json-input">
                        <textarea id="jsonInput"></textarea>
                    </div>
                    <div class="json-output">
                        <div id="jsonOutput" class="json-tree"></div>
                    </div>
                </div>
            </div>
        `;

        // Get our elements
        jsonInput = document.getElementById('jsonInput');
        jsonOutput = document.getElementById('jsonOutput');
        jsonParserCard = document.getElementById('jsonParserCard');

        // Load the script and call initJsonParser
        initJsonParser = require('../script.js').initJsonParser;
        initJsonParser();
    });

    test('should format valid JSON input', () => {
        const validJson = '{"name": "John", "age": 30, "isActive": true}';
        jsonInput.value = validJson;
        jsonInput.dispatchEvent(new Event('input'));

        expect(jsonOutput.innerHTML).toContain('<span class="json-key">name</span>');
        expect(jsonOutput.innerHTML).toContain('<span class="json-string">"John"</span>');
        expect(jsonOutput.innerHTML).toContain('<span class="json-key">age</span>');
        expect(jsonOutput.innerHTML).toContain('<span class="json-number">30</span>');
        expect(jsonOutput.innerHTML).toContain('<span class="json-key">isActive</span>');
        expect(jsonOutput.innerHTML).toContain('<span class="json-boolean">true</span>');
    });

    test('should handle invalid JSON input', () => {
        const invalidJson = '{"name": "John", "age": 30, "isActive": true';
        jsonInput.value = invalidJson;
        jsonInput.dispatchEvent(new Event('input'));

        expect(jsonOutput.innerHTML).toContain('Invalid JSON');
    });

    test('should handle empty input', () => {
        jsonInput.value = '';
        jsonInput.dispatchEvent(new Event('input'));

        expect(jsonOutput.innerHTML).toBe('');
    });

    test('should handle nested objects', () => {
        const nestedJson = '{"user": {"name": "John", "address": {"city": "New York"}}}';
        jsonInput.value = nestedJson;
        jsonInput.dispatchEvent(new Event('input'));

        expect(jsonOutput.innerHTML).toContain('<span class="json-key">user</span>');
        expect(jsonOutput.innerHTML).toContain('<span class="json-key">name</span>');
        expect(jsonOutput.innerHTML).toContain('<span class="json-string">"John"</span>');
        expect(jsonOutput.innerHTML).toContain('<span class="json-key">address</span>');
        expect(jsonOutput.innerHTML).toContain('<span class="json-key">city</span>');
        expect(jsonOutput.innerHTML).toContain('<span class="json-string">"New York"</span>');
    });

    test('should handle arrays', () => {
        const arrayJson = '{"items": [1, 2, 3, "four", true]}';
        jsonInput.value = arrayJson;
        jsonInput.dispatchEvent(new Event('input'));

        expect(jsonOutput.innerHTML).toContain('<span class="json-key">items</span>');
        expect(jsonOutput.innerHTML).toContain('<span class="json-number">1</span>');
        expect(jsonOutput.innerHTML).toContain('<span class="json-number">2</span>');
        expect(jsonOutput.innerHTML).toContain('<span class="json-number">3</span>');
        expect(jsonOutput.innerHTML).toContain('<span class="json-string">"four"</span>');
        expect(jsonOutput.innerHTML).toContain('<span class="json-boolean">true</span>');
    });

    test('should handle different value types', () => {
        const mixedJson = '{"string": "text", "number": 42, "boolean": true, "null": null}';
        jsonInput.value = mixedJson;
        jsonInput.dispatchEvent(new Event('input'));

        expect(jsonOutput.innerHTML).toContain('<span class="json-key">string</span>');
        expect(jsonOutput.innerHTML).toContain('<span class="json-string">"text"</span>');
        expect(jsonOutput.innerHTML).toContain('<span class="json-key">number</span>');
        expect(jsonOutput.innerHTML).toContain('<span class="json-number">42</span>');
        expect(jsonOutput.innerHTML).toContain('<span class="json-key">boolean</span>');
        expect(jsonOutput.innerHTML).toContain('<span class="json-boolean">true</span>');
        expect(jsonOutput.innerHTML).toContain('<span class="json-key">null</span>');
        expect(jsonOutput.innerHTML).toContain('<span class="json-null">null</span>');
    });

    test('should scroll to parser section when clicking the card', () => {
        // Mock scrollIntoView
        const mockScrollIntoView = jest.fn();
        document.getElementById('jsonParser').scrollIntoView = mockScrollIntoView;

        jsonParserCard.click();

        expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    test('should create collapsible sections for objects and arrays', () => {
        const complexJson = '{"object": {"key": "value"}, "array": [1, 2, 3]}';
        jsonInput.value = complexJson;
        jsonInput.dispatchEvent(new Event('input'));

        const collapsibleElements = jsonOutput.getElementsByClassName('collapsible');
        expect(collapsibleElements.length).toBeGreaterThan(0);
        
        // Test collapsible functionality
        const firstCollapsible = collapsibleElements[0];
        const initialContent = firstCollapsible.nextElementSibling;
        
        firstCollapsible.click();
        expect(firstCollapsible.classList.contains('collapsed')).toBe(true);
        expect(initialContent.classList.contains('collapsed')).toBe(true);
        
        firstCollapsible.click();
        expect(firstCollapsible.classList.contains('collapsed')).toBe(false);
        expect(initialContent.classList.contains('collapsed')).toBe(false);
    });
}); 