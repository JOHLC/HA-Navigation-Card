# Navigation Card for Home Assistant

[![GitHub Release](https://img.shields.io/github/release/JOHLC/HA-Navigation-Card.svg)](https://github.com/JOHLC/HA-Navigation-Card/releases)
![GitHub Release Date](https://img.shields.io/github/release-date/JOHLC/HA-Navigation-Card)
![GitHub Downloads (all assets, all releases)](https://img.shields.io/github/downloads/JOHLC/HA-Navigation-Card/total)

A customizable navigation card for Home Assistant that creates a launcher/dock interface on your Lovelace dashboard. Perfect for quick access to frequently used pages, add-ons, and settings.

<img width="auto" alt="image" src="https://github.com/user-attachments/assets/80ca1c44-f2be-4e53-9284-3cf674e17051" />


## ✨ Features

- 🎨 **Multiple Sections** - Organize navigation items into logical groups
- 🎯 **Custom Icons & Images** - Use Material Design Icons or custom images
- ⚙️ **Settings Shortcuts** - Optional gear icon overlay for quick settings access
- 🖱️ **Visual Editor** - Easy-to-use UI configuration through Lovelace
- 🎨 **Customizable** - Adjust colors, backgrounds, and styles
- 📱 **Responsive Design** - Looks great on mobile and desktop
- ✨ **Smooth Animations** - Hover effects and smooth transitions

## 📦 Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant instance
2. Go to "Frontend"
3. Click the three dots in the top right and select "Custom repositories"
4. Add this repository URL: `https://github.com/JOHLC/HA-Navigation-Card`
5. Select category "Lovelace"
6. Click "Add"
7. Find "Navigation Card" in the list and click "Install"

### Manual Installation

1. Download `ha-navigation-card.js` from the [latest release](https://github.com/JOHLC/HA-Navigation-Card/releases)
2. Copy it to your `config/www` folder
3. Add the resource to your Lovelace dashboard:
   - Go to Settings → Dashboards → Resources
   - Click "+ ADD RESOURCE"
   - URL: `/local/ha-navigation-card.js`
   - Resource type: JavaScript Module
4. Restart Home Assistant

## 🚀 Quick Start

### Basic Configuration

Add the card through the UI or use YAML:

```yaml
type: custom:ha-navigation-card
sections:
  - title: Configuration
    items:
      - label: Settings
        icon: mdi:cog-outline
        url: /config/dashboard
      - label: Devices
        icon: mdi:devices
        url: /config/devices/dashboard
      - label: Automations
        icon: mdi:robot
        url: /config/automation/dashboard
```

### Left-Aligned Configuration

To align titles and icons to the left instead of center:

```yaml
type: custom:ha-navigation-card
sections:
  - title: Developer Tools
    items:
      - label: YAML
        icon: mdi:code-tags
        url: /developer-tools/yaml
      - label: Services
        icon: mdi:room-service
        url: /developer-tools/service
styles:
  alignment: left
```


## 🎨 Configuration Options

### Card Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `sections` | array | **Required** | Array of navigation sections |
| `title` | string | _optional_ | Optional card title |
| `styles` | object | _optional_ | Custom style overrides |
| `colors` | object | _optional_ | Custom color overrides |

### Section Options

| Name | Type | Description |
|------|------|-------------|
| `title` | string | Section heading text |
| `items` | array | Array of navigation items |

### Item Options

| Name | Type | Description |
|------|------|-------------|
| `label` | string | Display text for the item |
| `url` | string | Navigation URL (internal or external) |
| `icon` | string | MDI icon name (e.g., `mdi:home`) |
| `image` | string | Image URL (overrides icon if provided) |
| `settings` | object | Optional settings link overlay |

### Settings Options

| Name | Type | Description |
|------|------|-------------|
| `label` | string | Tooltip text for settings icon |
| `url` | string | Settings page URL |
| `icon` | string | Icon for the settings button |

### Style Options

| Name | Type | Description |
|------|------|-------------|
| `alignment` | string | Alignment of titles and items: `left`, `center` (default), or `right` |

### Color Options

| Name | Type | Description |
|------|------|-------------|
| `title_bg_color` | string | Background color for section titles |
| `item_bg_color` | string | Background color for items |
| `item_bg_color_hover` | string | Background color on hover |
| `icon_bg_color` | string | Background color for icon area |
| `text_color` | string | Text color |
| `settings_icon_color` | string | Color of settings icon |
| `settings_icon_size` | string | Size of settings icon (e.g., `24px`) |

## 🎯 Usage Tips

### Finding Add-on URLs

For Home Assistant add-ons, URLs typically follow these patterns:

- **Ingress URL**: `/hassio/ingress/<addon_slug>`
- **Settings URL**: `/hassio/addon/<addon_slug>/config`
- **Logo**: `/api/hassio/addons/<addon_id>/logo`

To find your add-on IDs:
1. Go to Settings → Add-ons
2. Click on an add-on
3. Check the URL in your browser

### Using Custom Images

Store custom images in your `config/www` folder and reference them as:
```yaml
image: /local/my-icon.png
```
