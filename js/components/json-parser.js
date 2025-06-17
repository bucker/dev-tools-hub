function initJsonParser() {
    const jsonInput = document.getElementById('jsonInput');
    const jsonOutput = document.getElementById('jsonOutput');
    const jsonParserCard = document.getElementById('jsonParserCard');
    if (!jsonInput || !jsonOutput || !jsonParserCard) return;

    // Show JSON parser section when clicking the card
    jsonParserCard.addEventListener('click', () => {
        document.getElementById('jsonParser').scrollIntoView({ behavior: 'smooth' });
    });

    // Function to create collapsible JSON tree
    function createJsonTree(data, level = 0) {
        const container = document.createElement('div');
        container.className = 'collapsible-content';
        
        if (typeof data === 'object' && data !== null) {
            const isArray = Array.isArray(data);
            const items = isArray ? data : Object.entries(data);
            
            items.forEach((item, index) => {
                const itemContainer = document.createElement('div');
                const key = isArray ? index : item[0];
                const value = isArray ? item : item[1];
                
                const collapsible = document.createElement('div');
                collapsible.className = 'collapsible';
                
                if (typeof value === 'object' && value !== null) {
                    collapsible.innerHTML = `<span class="json-key">${key}</span>: ${isArray ? '[' : '{'}`;
                    collapsible.addEventListener('click', () => {
                        collapsible.classList.toggle('collapsed');
                        const content = collapsible.nextElementSibling;
                        content.classList.toggle('collapsed');
                    });
                    
                    itemContainer.appendChild(collapsible);
                    itemContainer.appendChild(createJsonTree(value, level + 1));
                    
                    const closingBracket = document.createElement('div');
                    closingBracket.textContent = isArray ? ']' : '}';
                    itemContainer.appendChild(closingBracket);
                } else {
                    const valueSpan = document.createElement('span');
                    valueSpan.className = typeof value === 'string' ? 'json-string' :
                                        typeof value === 'number' ? 'json-number' :
                                        typeof value === 'boolean' ? 'json-boolean' : 'json-null';
                    
                    const formattedValue = typeof value === 'string' ? `"${value}"` : value;
                    collapsible.innerHTML = `<span class="json-key">${key}</span>: ${valueSpan.outerHTML.replace('</span>', formattedValue + '</span>')}`;
                    itemContainer.appendChild(collapsible);
                }
                
                container.appendChild(itemContainer);
            });
        }
        
        return container;
    }

    // Function to format JSON
    function formatJson() {
        try {
            const input = jsonInput.value.trim();
            if (!input) {
                jsonOutput.innerHTML = '';
                return;
            }

            const parsed = JSON.parse(input);
            jsonOutput.innerHTML = '';
            jsonOutput.appendChild(createJsonTree(parsed));
        } catch (error) {
            jsonOutput.innerHTML = `<div class="error">Invalid JSON: ${error.message}</div>`;
        }
    }

    // Add input event listener
    jsonInput.addEventListener('input', formatJson);
}

// Export for module systems
if (typeof module !== 'undefined') {
    module.exports = { initJsonParser };
} 