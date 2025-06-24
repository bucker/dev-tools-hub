# Dev Tools Hub

A modern, responsive GitHub Pages site showcasing essential developer tools with a modular architecture for easy maintenance and extensibility.

## Features

- **Modular Structure**: Clean separation of concerns with dedicated CSS and JS files for each component
- **JSON Parser**: Format and analyze JSON with collapsible structure and syntax highlighting
- **Base64 Encoder/Decoder**: Encode text to Base64 and decode Base64 to text with auto-detection
- **Timestamp Converter**: Convert UNIX timestamps to human-readable datetime and back (both directions)
- **Markdown Previewer**: Real-time markdown editor and previewer
- **Responsive Design**: Mobile-friendly layout that works on all devices
- **Modern UI**: Clean and intuitive interface with smooth animations
- **Copy to Clipboard**: Easy result copying functionality
- **Comprehensive Testing**: Unit tests covering edge cases and error handling

## Tools

### JSON Parser
Format and validate JSON with a collapsible tree structure. Features include:
- Real-time formatting and validation
- Collapsible object and array sections
- Syntax highlighting for different data types
- Error handling for invalid JSON

### Base64 Encoder/Decoder
Convert text to Base64 and vice versa. Features include:
- Auto-detection of input type (text vs Base64)
- Copy to clipboard functionality
- Clear button for easy reset
- Support for large text inputs

### Timestamp Converter
Convert between UNIX timestamps and human-readable datetime formats. Features include:
- **Bidirectional conversion**: UNIX timestamp ↔ Human-readable datetime
- **Multiple formats**: Seconds and milliseconds support
- **Timezone handling**: Local timezone display with UTC conversion
- **Current time**: One-click current timestamp generation
- **Comprehensive output**: UTC, Local, ISO formats plus date components
- **Copy functionality**: Easy result copying
- **Input validation**: Robust error handling for invalid inputs

#### Timestamp Converter Usage

**UNIX Timestamp to DateTime:**
- Enter a UNIX timestamp (seconds or milliseconds) in the first input field
- The tool automatically converts it to human-readable format
- Results show both UTC and local time, plus individual date components

**DateTime to UNIX Timestamp:**
- Use the datetime picker or enter a date in ISO format
- The tool converts it to UNIX timestamp (both seconds and milliseconds)
- Results are displayed in the output section

**Examples:**
```
UNIX Timestamp (seconds): 1640995200
→ 2022-01-01 12:00:00 UTC

UNIX Timestamp (milliseconds): 1640995200000
→ 2022-01-01 12:00:00 UTC

Date: 2022-01-01T12:00:00
→ UNIX Timestamp: 1640995200
```

**Supported Input Formats:**
- UNIX timestamps: `1640995200` (seconds) or `1640995200000` (milliseconds)
- ISO datetime: `2022-01-01T12:00:00` or `2022-01-01T12:00:00.000Z`
- Local datetime: `2022-01-01 12:00:00`

### JWT Decoder
Decode JWT tokens into readable JSON. Features include:
- Decodes and formats JWT header and payload
- Robust error handling for invalid tokens
- Copy decoded JSON to clipboard
- Clear/reset functionality

#### Usage
1. Paste your JWT token into the input field.
2. Click "Decode JWT" to view the decoded header and payload as formatted JSON.
3. Click "Copy Decoded" to copy the result to your clipboard.
4. Use "Clear" to reset the input and output fields.

#### Example
**Input:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```
**Output:**
```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}
```

#### Limitations & Edge Cases
- Only decodes the header and payload (signature is not verified or decoded).
- Input must be a valid JWT (three parts, Base64Url encoded).
- Malformed or invalid tokens will show a clear error message.
- Large or deeply nested payloads are formatted as pretty JSON.

### Text Diff Check
Compare two strings and highlight their differences. Features include:
- Visual diff highlighting for added, removed, and unchanged text
- Word-level comparison for clear readability
- Robust input validation and error handling
- Clear/reset functionality

#### Usage
1. Enter the first string in the "String A" field.
2. Enter the second string in the "String B" field.
3. Click "Compare" to see the differences highlighted below.
4. Use "Clear" to reset both input fields and the result.

#### Example
**String A:**
```
The quick brown fox jumps over the lazy dog.
```
**String B:**
```
The quick brown fox leaps over the lazy cat.
```
**Output:**
<span class="diff-unchanged">The quick brown fox </span><span class="diff-removed">jumps</span><span class="diff-added">leaps</span><span class="diff-unchanged"> over the lazy </span><span class="diff-removed">dog</span><span class="diff-added">cat</span><span class="diff-unchanged">.</span>

#### Limitations & Edge Cases
- Only compares plain text (no file upload or rich formatting)
- Large inputs may be slow to render
- Requires internet connection to load the diff library (jsdiff)
- Diff is word-based for clarity; character-level or line-level diff is not currently supported

### Markdown Previewer
A real-time markdown editor and previewer. Features include:
- Live preview of markdown as you type
- Supports standard markdown syntax
- Simple two-column layout for easy comparison

#### Usage
1. Type your markdown text in the left-hand input area.
2. The right-hand panel will instantly render the HTML preview.

#### Example
**Input:**
```markdown
# Hello, world!

This is a **markdown** previewer.
```
**Output:**
<h1>Hello, world!</h1>
<p>This is a <strong>markdown</strong> previewer.</p>

#### Limitations & Edge Cases
- Requires an internet connection to load the `marked.js` library.
- Very large documents may experience a slight delay in rendering.

## Modular Structure

The project follows a modular architecture for better maintainability:

```
dev-tools-hub/
├── css/
│   ├── base.css              # Reset styles and CSS variables
│   ├── layout.css            # Header, navigation, and layout styles
│   ├── components.css        # Common component styles
│   ├── json-parser.css       # JSON parser specific styles
│   ├── base64-tool.css       # Base64 tool specific styles
│   └── timestamp-converter.css # Timestamp converter specific styles
│   └── markdown-previewer.css # Markdown previewer specific styles
├── js/
│   ├── main.js               # Core functionality and component initialization
│   └── components/
│       ├── json-parser.js    # JSON parser component
│       ├── base64-tool.js    # Base64 tool component
│       └── timestamp-converter.js # Timestamp converter component
│       └── markdown-previewer.js # Markdown previewer component
├── __tests__/
│   ├── jsonParser.test.js    # JSON parser unit tests
│   └── timestampConverter.test.js # Timestamp converter unit tests
│   └── markdownPreviewer.test.js # Markdown previewer unit tests
└── index.html                # Main HTML file
```

### Benefits of Modular Structure
- **Maintainability**: Each feature has dedicated files
- **Reusability**: Components can be easily reused
- **Scalability**: Easy to add new tools
- **Testing**: Isolated unit tests for each component
- **Performance**: Only load necessary CSS/JS

## Setup

1. Clone this repository:
```bash
git clone https://github.com/yourusername/dev-tools-hub.git
cd dev-tools-hub
```

2. Install dependencies (for testing):
```bash
npm install
```

3. Run tests:
```bash
npm test
```

4. Start local development server:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have http-server installed)
npx http-server
```

Then open your browser and navigate to `http://localhost:8000`

## Testing

The project includes comprehensive unit tests for all components:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Coverage
- **JSON Parser**: Formatting, validation, collapsible functionality, error handling
- **Timestamp Converter**: Bidirectional conversion, timezone handling, edge cases, input validation
- **Edge Cases**: Invalid inputs, empty values, boundary conditions
- **User Interactions**: Button clicks, form submissions, navigation

## Adding New Tools

To add a new tool to the modular structure:

1. **Create CSS file**: `css/your-tool.css` for tool-specific styles
2. **Create JS component**: `js/components/your-tool.js` with initialization function
3. **Add HTML section**: Include tool section in `index.html`
4. **Update main.js**: Add initialization call in `DOMContentLoaded` event
5. **Add tests**: Create `__tests__/yourTool.test.js` for comprehensive testing
6. **Update documentation**: Add usage instructions to README.md

## Deployment to GitHub Pages

1. Push your changes to GitHub:
```bash
git add .
git commit -m "Add new feature"
git push origin main
```

2. Go to your repository's Settings on GitHub
3. Scroll down to the "GitHub Pages" section
4. Under "Source", select the branch you want to deploy (usually `main`)
5. Click "Save"

Your site will be available at `https://yourusername.github.io/dev-tools-hub/`

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Follow the modular structure pattern
2. Add comprehensive unit tests for new features
3. Update documentation for any new tools
4. Ensure responsive design compatibility
5. Test across different browsers and devices

## License

This project is licensed under the MIT License - see the LICENSE file for details.
