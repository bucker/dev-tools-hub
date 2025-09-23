# Project Analysis: dev-tools-hub

## Overview

`dev-tools-hub` is a modern, responsive GitHub Pages site showcasing essential developer tools. It's a single-page application built with vanilla HTML, CSS, and JavaScript. The project has no runtime dependencies and uses Jest for testing.

## Project Structure

```
/Users/susi/dojo/dev-tools-hub/
├───.gitignore
├───index.html
├───jest.setup.js
├───package-lock.json
├───package.json
├───prompt.md
├───README.md
├───__tests__/
│   ├───base64Tool.test.js
│   ├───htmlPreviewer.test.js
│   ├───jsonParser.test.js
│   ├───jwtDecoder.test.js
│   ├───textDiffTool.test.js
│   └───timestampConverter.test.js
├───.git/...
├───css/
│   ├───base.css
│   ├───base64-tool.css
│   ├───components.css
│   ├───html-previewer.css
│   ├───json-parser.css
│   ├───jwt-decoder.css
│   ├───layout.css
│   └───timestamp-converter.css
├───js/
│   ├───main.js
│   └───components/
│       ├───base64-tool.js
│       ├───html-previewer.js
│       ├───json-parser.js
│       ├───jwt-decoder.js
│       ├───text-diff-tool.js
│       └───timestamp-converter.js
└───node_modules/...
```

- **`index.html`**: The main entry point of the application. It defines the structure of the page, including the tool cards and the individual tool sections.
- **`css/`**: Contains the stylesheets for the application. The CSS is modular, with a base stylesheet, a layout stylesheet, and individual stylesheets for each tool.
- **`js/`**: Contains the JavaScript code for the application.
    - **`js/main.js`**: The main script that handles smooth scrolling, animations, and initializes the tool components.
    - **`js/components/`**: Each file in this directory corresponds to a specific tool on the page. Each tool script likely contains an `init` function that is called by `main.js`.
- **`__tests__/`**: Contains the Jest tests for the application. Each tool has its own test file.
- **`package.json`**: Defines the project metadata, scripts, and development dependencies. The only script is `test`, which runs Jest. The dependencies are all related to testing (`jest`, `@testing-library/jest-dom`, etc.).

## Tools

The application provides the following tools:

- **JSON Parser**: Formats and analyzes JSON with a collapsible structure.
- **Base64 Encoder/Decoder**: Encodes text to Base64 and decodes Base64 to text.
- **Timestamp Converter**: Converts UNIX timestamps to human-readable datetime and back.
- **JWT Decoder**: Decodes JWT tokens to readable JSON.
- **Text Diff Check**: Compares two strings and highlights their differences.
- **HTML Previewer**: Renders and previews HTML from a string input.

## Architecture

The application follows a simple, modular architecture:

- **Single-Page Application (SPA)**: All the tools are on a single HTML page.
- **Vanilla JS**: The application is built without any front-end frameworks like React, Vue, or Angular.
- **Component-based**: The JavaScript code is organized into components, with each tool being a separate component. The components are loosely coupled and are initialized in `main.js`.
- **Event-driven**: The application is event-driven, with event listeners attached to buttons and other UI elements to trigger the tool's functionality.

## Testing

The project uses Jest for testing. The tests are located in the `__tests__` directory. Each tool has its own test file, which suggests a good level of test coverage. The tests are run in a `jsdom` environment, which allows for testing the DOM manipulation code.

## How to run tests

To run the tests, use the following command:

```bash
npm test
```

This will execute all the test files in the `__tests__` directory.
