# Complete Example Configuration

This is a comprehensive example showing all features of the Navigation Card.

```yaml
type: custom:ha-navigation-card
title: Quick Navigation  # Optional card title
sections:
  # Configuration Section
  - title: Configuration
    items:
      - label: Settings
        icon: mdi:cog-outline
        url: /config/dashboard
      - label: Devices & Services
        icon: mdi:devices
        url: /config/devices/dashboard
      - label: Automations
        icon: mdi:robot
        url: /config/automation/dashboard
      - label: Helpers
        icon: mdi:tools
        url: /config/helpers
      
  # Add-ons Section with Settings
  - title: Add-ons
    items:
      - label: Studio Code
        image: /api/hassio/addons/a0d7b954_vscode/logo
        url: /a0d7b954_vscode/ingress
        settings:
          label: VS Code Settings
          url: /hassio/addon/a0d7b954_vscode/config
          icon: mdi:cog-outline
      - label: File Editor
        icon: mdi:file-document-edit
        url: /hassio/ingress/core_configurator
        settings:
          label: File Editor Settings
          url: /hassio/addon/core_configurator/config
          icon: mdi:cog-outline
      - label: Terminal
        icon: mdi:console
        url: /hassio/ingress/core_ssh
        settings:
          label: Terminal Settings
          url: /hassio/addon/core_ssh/config
          icon: mdi:cog-outline
  
  # Media Section
  - title: Media
    items:
      - label: Media Browser
        icon: mdi:folder-multiple-image
        url: /media-browser
      - label: Radio
        icon: mdi:radio
        url: /lovelace/radio
      - label: TV Control
        icon: mdi:television
        url: /lovelace/tv
  
  # External Links Section
  - title: External
    items:
      - label: Router
        icon: mdi:router-wireless
        url: http://192.168.1.1
      - label: NAS
        icon: mdi:nas
        url: http://192.168.1.100:5000
      - label: GitHub
        icon: mdi:github
        url: https://github.com

# Custom color scheme
colors:
  title_bg_color: 'rgba(7, 7, 50, 0.3)'
  item_bg_color: 'rgba(7, 7, 50, 0.28)'
  item_bg_color_hover: 'rgba(5, 5, 50, 0.5)'
  icon_bg_color: 'rgba(255, 255, 255, 0.03)'
  text_color: '#fff'
  settings_icon_color: 'var(--accent-color)'
  settings_icon_size: '24px'
```

## Key Features Demonstrated:

1. **Multiple Sections**: Four different sections organizing different types of links
2. **Mixed Icons**: Uses both MDI icons and custom addon images
3. **Settings Links**: Some items have gear icon overlays for quick settings access
4. **Internal Navigation**: Uses Home Assistant paths (start with `/`)
5. **External Links**: Full URLs for external resources
6. **Custom Colors**: Personalized color scheme
7. **Optional Title**: Card has an optional title at the top

## Customization Tips:

- Remove sections you don't need
- Change icons to match your preferences
- Adjust colors to match your theme
- Add or remove items as needed
- The settings overlay is optional for each item
