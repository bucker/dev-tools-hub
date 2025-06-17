# Modular Structure Documentation

This project has been refactored into a modular structure for better organization and maintainability.

## File Structure

```
dev-tools-hub/
├── css/
│   ├── base.css              # Reset styles, CSS variables, and base styles
│   ├── layout.css            # Header, navigation, hero, and footer styles
│   ├── components.css        # Tools section, cards, and contact form styles
│   ├── json-parser.css       # JSON parser specific styles
│   └── base64-tool.css       # Base64 tool specific styles
├── js/
│   ├── main.js               # Core functionality (smooth scrolling, form handling, animations)
│   └── components/
│       ├── json-parser.js    # JSON parser component functionality
│       └── base64-tool.js    # Base64 tool component functionality
├── index.html                # Main HTML file (updated to include modular files)
├── style.css                 # Original CSS file (can be removed)
└── script.js                 # Original JavaScript file (can be removed)
```

## CSS Modules

### `css/base.css`
- CSS reset and base styles
- CSS custom properties (variables)
- Responsive design breakpoints
- Global typography settings

### `css/layout.css`
- Header and navigation styles
- Hero section styles
- Footer styles
- Layout-specific responsive design

### `css/components.css`
- Tools section styles
- Tool card styles
- About section styles
- Contact form styles

### `css/json-parser.css`
- JSON parser container styles
- JSON tree visualization styles
- Collapsible content styles
- JSON syntax highlighting

### `css/base64-tool.css`
- Base64 tool container styles
- Input/output area styles
- Button styles
- Result display styles

## JavaScript Modules

### `js/main.js`
- Smooth scrolling functionality
- Contact form handling
- Scroll-based animations
- Component initialization

### `js/components/json-parser.js`
- JSON parsing and formatting
- Collapsible tree creation
- JSON validation
- Real-time formatting

### `js/components/base64-tool.js`
- Base64 encoding/decoding
- Input validation
- Copy to clipboard functionality
- Auto-detection of input type

## Benefits of Modular Structure

1. **Maintainability**: Each feature has its own dedicated files
2. **Reusability**: Components can be easily reused in other projects
3. **Scalability**: Easy to add new tools without affecting existing code
4. **Debugging**: Easier to locate and fix issues
5. **Team Collaboration**: Multiple developers can work on different features simultaneously
6. **Performance**: Only load the CSS/JS needed for specific features

## Adding New Tools

To add a new tool:

1. Create a new CSS file in `css/` for the tool's styles
2. Create a new JavaScript file in `js/components/` for the tool's functionality
3. Add the CSS and JS files to `index.html`
4. Add the tool's HTML structure to the appropriate section
5. Initialize the tool in `js/main.js` if needed

## Migration Notes

- The original `style.css` and `script.js` files can be removed after confirming the modular structure works correctly
- All functionality has been preserved in the modular structure
- The HTML file has been updated to include all modular files in the correct order 