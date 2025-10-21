# Copilot Instructions for HA-Navigation-Card

## Project Overview

This repository contains **HA Navigation Card**, a lightweight and customizable navigation/launcher card for Home Assistant Lovelace dashboards. It's a custom component that extends Home Assistant's UI capabilities.

## Technology Stack

- **Language**: JavaScript (ES6+)
- **Framework**: LitElement (from Home Assistant's internal implementation)
- **Target Environment**: Home Assistant Lovelace UI
- **Distribution**: Single-file custom card (`dist/ha-navigation-card.js`)

## Project Structure

```
├── dist/
│   └── ha-navigation-card.js    # Main card implementation
├── LICENSE                       # MIT License
└── README.md                     # Project documentation
```

## Key Components

### Main Card Class
- `HaNavigationCardEditor`: Visual editor for card configuration
- `HaNavigationCard`: Main card component that renders the navigation UI
- Uses Home Assistant's LitElement base for consistency with HA's architecture

### Important Patterns
- Dynamic LitElement resolution to use Home Assistant's internal instance
- Configuration-based rendering with sections and colors
- Event-driven communication with Home Assistant (fire events, navigation)
- Custom element registration for both card and editor

## Development Guidelines

### Code Style
- Use ES6+ features (const/let, arrow functions, template literals)
- Follow Home Assistant's custom card patterns
- Maintain single-file distribution for easy installation
- Include version tracking and console logging for debugging
- Use styled console output for better developer experience

### Configuration Schema
Cards should support standard Home Assistant card configuration:
- `type`: Card type identifier
- `sections`: Array of navigation sections with items
- `colors`: Customization options for theming
- Editor should provide visual configuration interface

### Home Assistant Integration
- Cards must implement `setConfig(config)` method
- Cards must implement `getCardSize()` for layout optimization
- Use `this.hass` for Home Assistant state and services
- Fire Home Assistant events using `fire(this, 'event-name', data)`
- Use `navigate(this, '/path')` for navigation

### Event Handling
- Handle `config-changed` events in editor
- Use proper event bubbling for configuration updates
- Validate configuration before applying changes

### Styling
- Use CSS-in-JS with LitElement's `css` tagged template
- Support Home Assistant themes via CSS variables
- Provide fallback colors for better compatibility
- Use responsive design principles

## Testing Approach

Since this is a Home Assistant custom card:
- Test in a live Home Assistant instance
- Verify card editor functionality
- Test with different configurations
- Ensure compatibility with Home Assistant's latest version
- Check responsive behavior on different screen sizes

## Deployment

- All code is in `dist/ha-navigation-card.js`
- Users install by copying the file to their Home Assistant custom cards directory
- Card registers itself automatically when loaded
- Version tracking via `CARD_VERSION` constant

## Common Tasks

### Making Changes
1. Edit `dist/ha-navigation-card.js` directly
2. Test in Home Assistant development environment
3. Update `CARD_VERSION` for releases
4. Ensure console logging works for debugging

### Adding Features
- Maintain backward compatibility with existing configurations
- Add configuration options to both card and editor
- Update editor UI for new options
- Document changes in comments

### Bug Fixes
- Test thoroughly in Home Assistant environment
- Consider edge cases in configuration
- Maintain existing functionality
- Check console for errors

## Important Considerations

### Home Assistant Compatibility
- Must work with Home Assistant's card framework
- Should gracefully handle missing dependencies
- Use Home Assistant's styling conventions
- Respect Home Assistant's navigation patterns

### User Experience
- Configuration should be intuitive
- Editor should provide visual feedback
- Navigation should feel native to Home Assistant
- Errors should be user-friendly

### Performance
- Keep bundle size minimal (single file)
- Avoid unnecessary re-renders
- Use efficient selectors and queries
- Cache computed values when appropriate

## Resources

- Home Assistant Developer Docs: https://developers.home-assistant.io/
- LitElement Documentation: https://lit.dev/
- Custom Cards Guide: https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card

## Notes for AI Assistants

- This is a front-end only project with no build process
- All code is in a single distributable JavaScript file
- Changes should maintain compatibility with Home Assistant's framework
- Always consider the end-user installation experience
- Test suggestions should reference Home Assistant's testing patterns
