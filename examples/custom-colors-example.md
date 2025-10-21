# Custom Colors Example

This example demonstrates how to customize the card's appearance with custom colors.

```yaml
type: custom:ha-navigation-card
sections:
  - title: Dashboard
    items:
      - label: Home
        icon: mdi:home
        url: /lovelace/0
      - label: Lights
        icon: mdi:lightbulb
        url: /lovelace/lights
      - label: Climate
        icon: mdi:thermostat
        url: /lovelace/climate
      - label: Security
        icon: mdi:shield-home
        url: /lovelace/security
colors:
  # Dark blue theme
  title_bg_color: 'rgba(25, 118, 210, 0.3)'
  item_bg_color: 'rgba(25, 118, 210, 0.15)'
  item_bg_color_hover: 'rgba(25, 118, 210, 0.35)'
  icon_bg_color: 'rgba(255, 255, 255, 0.05)'
  text_color: '#e3f2fd'
  settings_icon_color: '#82b1ff'
  settings_icon_size: '22px'
```

## Alternative: Purple Theme

```yaml
type: custom:ha-navigation-card
sections:
  - title: Media
    items:
      - label: Spotify
        icon: mdi:spotify
        url: /lovelace/spotify
      - label: TV
        icon: mdi:television
        url: /lovelace/tv
colors:
  title_bg_color: 'rgba(103, 58, 183, 0.3)'
  item_bg_color: 'rgba(103, 58, 183, 0.15)'
  item_bg_color_hover: 'rgba(103, 58, 183, 0.35)'
  icon_bg_color: 'rgba(255, 255, 255, 0.08)'
  text_color: '#e1bee7'
  settings_icon_color: '#ce93d8'
```

## Alternative: Green Theme

```yaml
type: custom:ha-navigation-card
sections:
  - title: Garden
    items:
      - label: Irrigation
        icon: mdi:water
        url: /lovelace/irrigation
      - label: Weather
        icon: mdi:weather-partly-cloudy
        url: /lovelace/weather
colors:
  title_bg_color: 'rgba(46, 125, 50, 0.3)'
  item_bg_color: 'rgba(46, 125, 50, 0.15)'
  item_bg_color_hover: 'rgba(46, 125, 50, 0.35)'
  icon_bg_color: 'rgba(255, 255, 255, 0.05)'
  text_color: '#c8e6c9'
  settings_icon_color: '#81c784'
```

You can use any CSS color format: hex colors (`#ffffff`), RGB (`rgb(255, 255, 255)`), or RGBA with transparency (`rgba(255, 255, 255, 0.5)`).
