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
        initJsonParser = require('../js/components/json-parser.js').initJsonParser;
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

    test('should handle JSON with escaped characters', () => {
        const jsonWithEscapedChars = `{\n  \"title\": \"新しい環境に馴染むこと\",\n  \"article\": \"新しい仕事を手掛けるとき、最初は戸惑うこともあります。しかし、少しずつ新しい環境に馴染めるようになります。例えば、最初のうちは言葉や文化の違いに戸惑いますが、時間が経つにつれて、周りの人々と溶け込んでいくことができるのです。大切なのは、勇気を出してコミュニケーションをとることです。友達を作ることで、もっとその場所に親しむことができます。最初は大変でも、努力すれば必ず新しい環境にうまく馴染むことができるでしょう。\",\n  \"furigana\": [\n    {\n      \"word\": \"手掛ける\",\n      \"reading\": \"てがける\"\n    },\n    {\n      \"word\": \"馴染め\",\n      \"reading\": \"なじめ\"\n    },\n    {\n      \"word\": \"溶け込ん\",\n      \"reading\": \"とけこん\"\n    },\n    {\n      \"word\": \"環境\",\n      \"reading\": \"かんきょう\"\n    },\n    {\n      \"word\": \"戸惑う\",\n      \"reading\": \"とまどう\"\n    },\n    {\n      \"word\": \"文化\",\n      \"reading\": \"ぶんか\"\n    },\n    {\n      \"word\": \"友達\",\n      \"reading\": \"ともだち\"\n    },\n    {\n      \"word\": \"努力\",\n      \"reading\": \"どりょく\"\n    },\n    {\n      \"word\": \"それに\",\n      \"reading\": \"それに\"\n    },\n    {\n      \"word\": \"大切\",\n      \"reading\": \"たいせつ\"\n    }\n  ],\n  \"analysis\": [\n    {\n      \"pattern\": \"〜ことができる\",\n      \"explanation\": \"表示能力或可能性的句型，常用來表達某種行為或狀態可以實現。\",\n      \"example\": \"新しい環境にうまく馴染むことができる\"\n    }\n  ],\n  \"words\": [\n    {\n      \"word\": \"環境\",\n      \"explanation\": \"指周圍的自然或社會情況，可以影響人的行為和生活。\",\n      \"example\": \"新しい環境にしっかり馴染むことが大切です。\"\n    },\n    {\n      \"word\": \"戸惑う\",\n      \"explanation\": \"感到迷惑或不知所措的狀態，常用於初次接觸某件事時的情況。\",\n      \"example\": \"彼は新しい仕事に戸惑っている。\"\n    },\n    {\n      \"word\": \"文化\",\n      \"explanation\": \"特定社會或群體的生活方式、信仰、藝術等的表現，可以幫助人們理解彼此。\",\n      \"example\": \"多様な文化に触れることは大変興味深い。\"\n    },\n    {\n      \"word\": \"努力\",\n      \"explanation\": \"為了達成目標所做的努力，通常是持續的過程。\",\n      \"example\": \"彼女は目標のために努力している。\"\n    },\n    {\n      \"word\": \"大切\",\n      \"explanation\": \"有重要性或不可或缺的意思，常用於形容事物的價值。\",\n      \"example\": \"友達を作ることが大切です。\"\n    }\n  ]\n}`;
        jsonInput.value = jsonWithEscapedChars;
        jsonInput.dispatchEvent(new Event('input'));

        expect(jsonOutput.innerHTML).toContain('<span class="json-key">title</span>');
        expect(jsonOutput.innerHTML).toContain('<span class="json-string">"新しい環境に馴染むこと"</span>');
        expect(jsonOutput.innerHTML).toContain('<span class="json-key">article</span>');
        expect(jsonOutput.innerHTML).toContain('<span class="json-key">furigana</span>');
        expect(jsonOutput.innerHTML).toContain('<span class="json-key">analysis</span>');
        expect(jsonOutput.innerHTML).toContain('<span class="json-key">words</span>');
    });
}); 