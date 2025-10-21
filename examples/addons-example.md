# Add-ons Example Configuration

This example shows how to configure the card for Home Assistant add-ons with settings links.

```yaml
type: custom:ha-navigation-card
sections:
  - title: Development
    items:
      - label: Studio Code Server
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
  - title: Monitoring
    items:
      - label: Glances
        icon: mdi:chart-line
        url: /hassio/ingress/glances
        settings:
          label: Glances Settings
          url: /hassio/addon/glances/config
          icon: mdi:cog-outline
      - label: InfluxDB
        icon: mdi:database
        url: /hassio/ingress/influxdb
        settings:
          label: InfluxDB Settings
          url: /hassio/addon/influxdb/config
          icon: mdi:cog-outline
```

**Note:** Replace the add-on IDs (e.g., `a0d7b954_vscode`) with your actual add-on IDs. You can find these in the URL when viewing an add-on in Settings → Add-ons.
