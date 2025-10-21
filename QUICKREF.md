# Quick Reference Guide

Fast reference for common tasks with Navigation Card.

## Basic YAML Structure

```yaml
type: custom:ha-navigation-card
sections:
  - title: Section Name
    items:
      - label: Item Name
        icon: mdi:icon-name
        url: /path
```

## Common URLs

### Configuration Pages
```yaml
- label: Settings
  icon: mdi:cog
  url: /config/dashboard

- label: Devices
  icon: mdi:devices  
  url: /config/devices/dashboard

- label: Integrations
  icon: mdi:puzzle
  url: /config/integrations

- label: Automations
  icon: mdi:robot
  url: /config/automation/dashboard

- label: Scripts
  icon: mdi:script-text
  url: /config/script/dashboard

- label: Helpers
  icon: mdi:tools
  url: /config/helpers
```

### Developer Tools
```yaml
- label: YAML
  icon: mdi:code-tags
  url: /developer-tools/yaml

- label: States
  icon: mdi:list-status
  url: /developer-tools/state

- label: Services
  icon: mdi:room-service
  url: /developer-tools/service

- label: Logs
  icon: mdi:math-log
  url: /config/logs
```

### Add-on URLs
```yaml
# Ingress URL pattern
url: /hassio/ingress/<addon_slug>

# Settings URL pattern
settings:
  url: /hassio/addon/<addon_slug>/config

# Logo URL pattern
image: /api/hassio/addons/<addon_id>/logo
```

## Common MDI Icons

```yaml
# Configuration
mdi:cog                 # Settings
mdi:cog-outline         # Settings (outlined)
mdi:tools               # Tools
mdi:hammer-wrench       # Developer tools

# Navigation
mdi:home                # Home
mdi:view-dashboard      # Dashboard
mdi:apps                # Apps grid
mdi:menu                # Menu

# Devices
mdi:devices             # Devices
mdi:lightbulb           # Lights
mdi:thermostat          # Climate
mdi:camera              # Camera
mdi:speaker             # Media player

# Add-ons
mdi:code-tags           # Code editor
mdi:file-document-edit  # File editor
mdi:console             # Terminal
mdi:database            # Database

# Media
mdi:spotify             # Spotify
mdi:music               # Music
mdi:television          # TV
mdi:radio               # Radio
mdi:folder-multiple-image # Media browser

# System
mdi:robot               # Automations
mdi:script-text         # Scripts
mdi:puzzle              # Integrations
mdi:shield-home         # Security
```

Find more icons at: https://pictogrammers.com/library/mdi/

## Color Examples

### Dark Blue Theme
```yaml
colors:
  title_bg_color: 'rgba(25, 118, 210, 0.3)'
  item_bg_color: 'rgba(25, 118, 210, 0.15)'
  item_bg_color_hover: 'rgba(25, 118, 210, 0.35)'
  icon_bg_color: 'rgba(255, 255, 255, 0.05)'
  text_color: '#e3f2fd'
```

### Purple Theme
```yaml
colors:
  title_bg_color: 'rgba(103, 58, 183, 0.3)'
  item_bg_color: 'rgba(103, 58, 183, 0.15)'
  item_bg_color_hover: 'rgba(103, 58, 183, 0.35)'
  icon_bg_color: 'rgba(255, 255, 255, 0.08)'
  text_color: '#e1bee7'
```

### Green Theme
```yaml
colors:
  title_bg_color: 'rgba(46, 125, 50, 0.3)'
  item_bg_color: 'rgba(46, 125, 50, 0.15)'
  item_bg_color_hover: 'rgba(46, 125, 50, 0.35)'
  icon_bg_color: 'rgba(255, 255, 255, 0.05)'
  text_color: '#c8e6c9'
```

## Settings Link Template

```yaml
- label: My Add-on
  icon: mdi:puzzle
  url: /hassio/ingress/my_addon
  settings:
    label: My Add-on Settings
    url: /hassio/addon/my_addon/config
    icon: mdi:cog-outline
```

## Custom Image

```yaml
- label: Custom App
  image: /local/my-icon.png
  url: /custom-path
```

## External Link

```yaml
- label: Router
  icon: mdi:router-wireless
  url: http://192.168.1.1
```

## Troubleshooting

**Card not showing:**
- Clear browser cache (Ctrl+F5)
- Check Resources in Settings → Dashboards
- Restart Home Assistant

**Icons not displaying:**
- Verify format: `mdi:icon-name`
- Check icon exists at pictogrammers.com

**Navigation not working:**
- Internal links must start with `/`
- Check permissions for target page

## Getting Help

- 📖 [Full Documentation](README.md)
- 💡 [Example Configurations](examples/)
- 🐛 [Report Issues](https://github.com/JOHLC/HA-Navigation-Card/issues)
