# Navigation Card for Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/release/JOHLC/HA-Navigation-Card.svg)](https://github.com/JOHLC/HA-Navigation-Card/releases)
[![License](https://img.shields.io/github/license/JOHLC/HA-Navigation-Card.svg)](LICENSE)

A beautiful, customizable navigation card for Home Assistant that creates an elegant launcher/dock interface for your Lovelace dashboard. Perfect for quick access to frequently used pages, add-ons, and settings.

![Navigation Card Example](https://via.placeholder.com/800x400?text=Navigation+Card+Screenshot)

## ✨ Features

- 🎨 **Multiple Sections** - Organize navigation items into logical groups
- 🎯 **Custom Icons & Images** - Use Material Design Icons or custom images
- ⚙️ **Settings Shortcuts** - Optional gear icon overlay for quick settings access
- 🖱️ **Visual Editor** - Easy-to-use UI configuration through Lovelace
- 🎨 **Highly Customizable** - Adjust colors, backgrounds, and styles
- 📱 **Responsive Design** - Looks great on mobile and desktop
- ✨ **Smooth Animations** - Hover effects and smooth transitions
- 🔒 **Security** - Built-in XSS protection

## 📦 Installation

### HACS (Recommended)

1. Open HACS in your Home Assistant instance
2. Go to "Frontend"
3. Click the three dots in the top right and select "Custom repositories"
4. Add this repository URL: `https://github.com/JOHLC/HA-Navigation-Card`
5. Select category "Lovelace"
6. Click "Add"
7. Find "Navigation Card" in the list and click "Install"
8. Restart Home Assistant

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

### Advanced Configuration with Settings Links

```yaml
type: custom:ha-navigation-card
sections:
  - title: Add-ons
    items:
      - label: Studio Code
        image: /api/hassio/addons/a0d7b954_vscode/logo
        url: /a0d7b954_vscode/ingress
        settings:
          label: Studio Code Settings
          url: /hassio/addon/a0d7b954_vscode/config
          icon: mdi:cog-outline
      - label: File Editor
        icon: mdi:file-document-edit
        url: /hassio/ingress/file-editor
        settings:
          label: File Editor Settings
          url: /hassio/addon/file-editor/config
          icon: mdi:cog-outline
  - title: Media
    items:
      - label: Media Browser
        icon: mdi:folder-multiple-image
        url: /media-browser
      - label: Spotify
        icon: mdi:spotify
        url: /lovelace/spotify
```

### Custom Colors

```yaml
type: custom:ha-navigation-card
sections:
  - title: Quick Links
    items:
      - label: Dashboard
        icon: mdi:view-dashboard
        url: /lovelace/0
colors:
  title_bg_color: 'rgba(0, 100, 200, 0.3)'
  item_bg_color: 'rgba(0, 100, 200, 0.2)'
  item_bg_color_hover: 'rgba(0, 100, 200, 0.4)'
  icon_bg_color: 'rgba(255, 255, 255, 0.05)'
  text_color: '#ffffff'
  settings_icon_color: '#ffa500'
  settings_icon_size: '20px'
```

## 🎨 Configuration Options

### Card Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `sections` | array | **Required** | Array of navigation sections |
| `title` | string | _optional_ | Optional card title |
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

### Internal vs External Links

- **Internal navigation** (starts with `/`): Uses Home Assistant's router, no page reload
- **External links** (starts with `http`): Opens in new context

## 🎨 Styling with Card-Mod

You can further customize the card using [card-mod](https://github.com/thomasloven/lovelace-card-mod):

```yaml
type: custom:ha-navigation-card
sections:
  - title: Links
    items:
      - label: Home
        icon: mdi:home
        url: /lovelace/0
card_mod:
  style: |
    ha-card {
      border-radius: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
```

## 🔧 Troubleshooting

### Card not showing up

1. Clear your browser cache (Ctrl+F5)
2. Verify the resource is loaded (Settings → Dashboards → Resources)
3. Check browser console for errors (F12)
4. Ensure you restarted Home Assistant after installation

### Icons not displaying

- Verify icon names are in format `mdi:icon-name`
- Check the [MDI icon search](https://pictogrammers.com/library/mdi/) for valid icons
- For custom icons, ensure the image path is correct

### Navigation not working

- Internal links must start with `/`
- Check that the URL paths are correct
- Verify you have permission to access the target page

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## ⭐ Credits

Created by [Joel](https://github.com/JOHLC)

If you like this card, please star the repository!