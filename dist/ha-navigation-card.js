// Navigation Card (ha-navigation-card)
// Lightweight customizable navigation / launcher card for Home Assistant Lovelace
// https://github.com/JOHLC/HA-Navigation-Card
const CARD_VERSION = '0.1.0';

// Attempt to obtain Home Assistant's internal LitElement base (so we use the same instance)
// Fallback gracefully if HA elements not yet defined when this script is evaluated.
let HaBase = undefined;
try {
  HaBase = customElements.get('ha-panel-lovelace');
  if (!HaBase) HaBase = customElements.get('hui-view');
} catch (_) {
  // ignore
}
const LitElementBase = HaBase ? Object.getPrototypeOf(HaBase) : (window.LitElement || Object.getPrototypeOf(customElements.get('home-assistant') || HTMLElement));
if (!LitElementBase || !LitElementBase.prototype || !LitElementBase.prototype.html) {
  console.warn('%c[ha-navigation-card]%c Failed to resolve LitElement base – card may not render yet (will retry).', 'color:#6cf;font-weight:bold;', '');
}
const html = LitElementBase.prototype.html;
const css = LitElementBase.prototype.css;

// Default color configuration
const DEFAULT_COLORS = {
  title_bg_color: 'rgba(7, 7, 50, 0.3)',
  item_bg_color: 'rgba(7, 7, 50, 0.28)',
  item_bg_color_hover: 'rgba(5, 5, 50, 0.5)',
  icon_bg_color: 'rgba(255, 255, 255, 0.03)',
  text_color: '#fff',
  settings_icon_color: 'var(--accent-color)',
  settings_icon_size: '24px'
};

// Styled console banner (once)
if (!window.__HA_NAV_CARD_LOGGED) {
  window.__HA_NAV_CARD_LOGGED = true;
  console.info('%cHA Navigation Card%c v' + CARD_VERSION + ' loaded', 'background:#1e1e2f;color:#6cf;padding:4px 8px;border-radius:4px 0 0 4px;font-weight:600;', 'background:#3a3a55;color:#fff;padding:4px 8px;border-radius:0 4px 4px 0;');
}

class HaNavigationCardEditor extends LitElementBase {
  static get properties() {
    return {
      hass: {},
      _config: {},
      _activeSection: { type: Number },
      _showColors: { type: Boolean },
    };
  }

  setConfig(config) {
    this._config = {
      ...config,
      sections: config.sections && Array.isArray(config.sections) ? config.sections : [],
      colors: { ...(config.colors || {}) }
    };
    // Ensure sections have valid structure
    this._config.sections = this._config.sections.map(section => ({
      ...section,
      items: Array.isArray(section.items) ? section.items : []
    }));
    if (this._activeSection == null || this._activeSection >= this._config.sections.length) {
      this._activeSection = 0;
    }
  }

  // Helper method to update an item in the active section
  _updateSectionItem(index, updater) {
    const newConfig = { ...this._config };
    const newSections = [...newConfig.sections];
    const sectionIdx = this._activeSection || 0;
    const section = { ...newSections[sectionIdx] };
    const newItems = [...(section.items || [])];
    newItems[index] = updater(newItems[index]);
    section.items = newItems;
    newSections[sectionIdx] = section;
    newConfig.sections = newSections;
    this._dispatchConfigChanged(newConfig);
  }

  _valueChanged(ev) {
    if (!this._config || !this.hass) {
      return;
    }
    const { target } = ev;
    const newConfig = { ...this._config };
    if (target.configValue) {
      if (target.configValue === "title") {
        if (!newConfig.sections.length) {
          newConfig.sections = [{ title: target.value, items: [] }];
        } else {
          const newSections = [...newConfig.sections];
          newSections[0] = { ...newSections[0], title: target.value };
          newConfig.sections = newSections;
        }
      } else {
        newConfig[target.configValue] = target.value;
      }
    }
    this._dispatchConfigChanged(newConfig);
  }

  _itemChanged(ev, index, key) {
    this._updateSectionItem(index, item => ({ ...item, [key]: ev.target.value }));
  }

  _toggleSettings(ev, index) {
    const enable = ev.target.checked;
    this._updateSectionItem(index, item => {
      const newItem = { ...item };
      if (enable) {
        newItem.settings = newItem.settings || {
          label: (item.label || 'Item') + ' Settings',
          url: item.url || '#',
          icon: 'mdi:cog-outline'
        };
      } else {
        delete newItem.settings;
      }
      return newItem;
    });
  }

  _settingsFieldChanged(ev, index, field) {
    this._updateSectionItem(index, item => ({
      ...item,
      settings: { ...(item.settings || {}), [field]: ev.target.value }
    }));
  }

  _addItem() {
    const newConfig = { ...this._config };
    if (!newConfig.sections.length) newConfig.sections = [{ title: 'New Section', items: [] }];
    const newSections = [...newConfig.sections];
    const idx = this._activeSection || 0;
    const section = { ...newSections[idx] };
    const newItems = [...(section.items || []), { label: "New Item", url: "#", icon: "mdi:new-box" }];
    section.items = newItems;
    newSections[idx] = section;
    newConfig.sections = newSections;
    this._dispatchConfigChanged(newConfig);
  }

  _removeItem(index) {
    const newConfig = { ...this._config };
    const newSections = [...newConfig.sections];
    const section = { ...newSections[this._activeSection || 0] };
    const newItems = [...(section.items || [])];
    newItems.splice(index, 1);
    section.items = newItems;
    newSections[this._activeSection || 0] = section;
    newConfig.sections = newSections;
    this._dispatchConfigChanged(newConfig);
  }

  // Section management
  _selectSection(index) { 
    this._activeSection = index; 
    this.requestUpdate(); 
  }

  _updateSectionTitle(ev) {
    const newConfig = { ...this._config };
    const newSections = [...newConfig.sections];
    const section = { ...newSections[this._activeSection || 0] };
    section.title = ev.target.value;
    newSections[this._activeSection || 0] = section;
    newConfig.sections = newSections;
    this._dispatchConfigChanged(newConfig);
  }

  _addSection() {
    const newConfig = { ...this._config };
    const sections = [...(newConfig.sections || [])];
    sections.push({ title: 'New Section', items: [] });
    newConfig.sections = sections;
    this._activeSection = sections.length - 1;
    this._dispatchConfigChanged(newConfig);
  }

  _removeSection(index) {
    const newConfig = { ...this._config };
    const sections = [...(newConfig.sections || [])];
    if (sections.length <= 1) return; // keep at least one
    sections.splice(index,1);
    newConfig.sections = sections;
    if (this._activeSection >= sections.length) this._activeSection = sections.length - 1;
    this._dispatchConfigChanged(newConfig);
  }

  _moveSection(index, dir) {
    const newIndex = index + dir;
    const newConfig = { ...this._config };
    const sections = [...(newConfig.sections || [])];
    if (newIndex < 0 || newIndex >= sections.length) return;
    const [s] = sections.splice(index,1);
    sections.splice(newIndex,0,s);
    newConfig.sections = sections;
    this._activeSection = newIndex;
    this._dispatchConfigChanged(newConfig);
  }

  _colorChanged(ev,key){
    const newConfig = { ...this._config, colors: { ...(this._config.colors||{}) } };
    newConfig.colors[key] = ev.target.value;
    this._dispatchConfigChanged(newConfig);
  }

  _toggleColors(){ this._showColors = !this._showColors; }

  _dispatchConfigChanged(config) {
    const event = new Event("config-changed", {
      bubbles: true,
      composed: true,
    });
    event.detail = { config };
    this.dispatchEvent(event);
  }

  render() {
    if (!this.hass || !this._config) {
      return html``;
    }

    const section = (this._config.sections && this._config.sections[this._activeSection]) ? this._config.sections[this._activeSection] : { title: '', items: [] };

    return html`
      <div class="card-config">
        <h2 style="margin-top:0;">Navigation Card Setup</h2>
        <div style="color:var(--secondary-text-color,#888);font-size:0.98em;margin-bottom:12px;">
          Configure navigation sections and items for your Home Assistant dashboard. Each section can have a name and multiple navigation items. Use the advanced options to customize colors.
        </div>
        <div class="section-bar">
          <div class="sections-list" role="tablist" aria-label="Sections">
            ${(this._config.sections || []).map((s,i)=> html`
              <mwc-button
                class="section-tab ${i===this._activeSection? 'active':''}"
                @click="${()=>this._selectSection(i)}"
                role="tab"
                aria-selected="${i===this._activeSection}"
                title="Edit section: ${s.title || 'Section '+(i+1)}"
              >${s.title || 'Section '+(i+1)}</mwc-button>
              <mwc-icon-button
                class="move-btn"
                title="Move section left"
                ?disabled="${i===0}"
                @click="${()=>this._moveSection(i,-1)}"
              ><ha-icon icon="mdi:chevron-left"></ha-icon></mwc-icon-button>
              <mwc-icon-button
                class="move-btn"
                title="Move section right"
                ?disabled="${i===(this._config.sections.length-1)}"
                @click="${()=>this._moveSection(i,1)}"
              ><ha-icon icon="mdi:chevron-right"></ha-icon></mwc-icon-button>
              <mwc-icon-button
                class="remove-section"
                title="Remove this section"
                ?disabled="${this._config.sections.length<=1}"
                @click="${()=>this._removeSection(i)}"
              ><ha-icon icon="mdi:close"></ha-icon></mwc-icon-button>
            `)}
            <mwc-button outlined @click="${this._addSection}" class="add-section" title="Add a new section">Add Section</mwc-button>
          </div>
        </div>
        <div class="section-outline">
          <ha-textfield
            label="Card Title (optional)"
            .value="${this._config.title || ''}"
            .configValue="${'title'}"
            placeholder="e.g. Quick Links"
            @input="${this._valueChanged}"
          ></ha-textfield>
          <ha-textfield
            label="Section Name"
            .value="${section.title || ''}"
            placeholder="e.g. Main, Add-ons, Media"
            @input="${this._updateSectionTitle}"
          ></ha-textfield>

          <div class="colors-toggle" style="margin-top:10px;">
            <ha-formfield .label="${this._showColors? 'Hide advanced color options':'Show advanced color options'}">
              <ha-switch .checked="${this._showColors}" @change="${this._toggleColors}"></ha-switch>
            </ha-formfield>
          </div>
          ${this._showColors ? html`
            <div class="colors-section">
              <h4>Color Customization</h4>
              <div class="colors-grid">
                ${[
                  {k:'title_bg_color', l:'Section Title Background', p:'rgba(7, 7, 50, 0.3)'},
                  {k:'item_bg_color', l:'Item Background', p:'rgba(7, 7, 50, 0.28)'},
                  {k:'item_bg_color_hover', l:'Item Hover Background', p:'rgba(5, 5, 50, 0.5)'},
                  {k:'icon_bg_color', l:'Icon Background', p:'rgba(255, 255, 255, 0.03)'},
                  {k:'text_color', l:'Text Color', p:'#fff'},
                  {k:'settings_icon_color', l:'Settings Icon Color', p:'var(--accent-color)'},
                  {k:'settings_icon_size', l:'Settings Icon Size', p:'24px'}
                ].map(({k,l,p})=> html`
                  <ha-textfield
                    label="${l}"
                    .value="${(this._config.colors && this._config.colors[k]) || ''}"
                    placeholder="${p}"
                    @input="${(e)=>this._colorChanged(e,k)}"
                  ></ha-textfield>
                `)}
              </div>
            </div>
          `: ''}
          <div class="items-header" style="margin-top:18px;">
              <h3 style="margin-bottom:0;">Navigation Items</h3>
              <span style="color:var(--secondary-text-color,#888);font-size:0.95em;">Each item is a shortcut in this section.</span>
          </div>
          ${(section.items || []).length === 0 ? html`
            <div style="color:var(--secondary-text-color,#888);margin:8px 0 12px 0;">No items yet. Click <b>Add Item</b> to create your first shortcut.</div>
          ` : ''}
          ${(section.items || []).map(
            (item, index) => html`
              <div class="item-editor">
                  <div class="item-header">
                      <h4>Item ${index + 1}</h4>
                      <mwc-icon-button class="remove-item" title="Remove this item" @click="${() => this._removeItem(index)}">
                          <ha-icon icon="mdi:close"></ha-icon>
                      </mwc-icon-button>
                  </div>
                <ha-textfield
                  label="Label"
                  .value="${item.label || ''}"
                  placeholder="e.g. Settings, Lights, Cameras"
                  @input="${(e) => this._itemChanged(e, index, 'label')}"
                ></ha-textfield>
                <ha-textfield
                  label="URL (path or full link)"
                  .value="${item.url || ''}"
                  placeholder="e.g. /config/dashboard or https://..."
                  @input="${(e) => this._itemChanged(e, index, 'url')}"
                ></ha-textfield>
                <ha-icon-picker
                  label="Icon (mdi or custom)"
                  .value="${item.icon || ''}"
                  @value-changed="${(e) => this._itemChanged(e, index, 'icon')}"
                ></ha-icon-picker>
                <ha-textfield
                  label="Image URL (overrides icon)"
                  .value="${item.image || ''}"
                  placeholder="e.g. /local/myicon.png"
                  @input="${(e) => this._itemChanged(e, index, 'image')}"
                ></ha-textfield>
                <div class="settings-toggle">
                  <ha-formfield .label="${item.settings ? 'Settings link enabled' : 'Add settings link'}">
                    <ha-switch .checked="${!!item.settings}" @change="${(e)=>this._toggleSettings(e,index)}"></ha-switch>
                  </ha-formfield>
                </div>
                ${item.settings ? html`
                  <div class="settings-fields">
                    <ha-textfield
                      label="Settings Label"
                      .value="${item.settings.label || ''}"
                      placeholder="e.g. Studio Code Settings"
                      @input="${(e)=>this._settingsFieldChanged(e,index,'label')}"
                    ></ha-textfield>
                    <ha-textfield
                      label="Settings URL"
                      .value="${item.settings.url || ''}"
                      placeholder="e.g. /hassio/addon/.../config"
                      @input="${(e)=>this._settingsFieldChanged(e,index,'url')}"
                    ></ha-textfield>
                    <ha-icon-picker
                      label="Settings Icon"
                      .value="${item.settings.icon || 'mdi:cog-outline'}"
                      @value-changed="${(e)=>this._settingsFieldChanged(e,index,'icon')}"
                    ></ha-icon-picker>
                  </div>
                `: ''}
              </div>
            `
          )}
          <mwc-button @click="${this._addItem}" outlined style="margin-top:16px;width:100%;font-weight:bold;--mdc-theme-primary:var(--primary-color);">+ Add Item</mwc-button>
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
        .card-config {
            padding: 16px;
        }
        .items-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .item-editor {
            border: 1px solid var(--divider-color);
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 12px;
        }
        .section-bar {
            margin-bottom: 12px;
        }
        .section-outline {
            border: 2px solid var(--primary-color, #3f51b5);
            border-radius: 10px;
            margin-bottom: 24px;
            padding: 12px 10px 10px 10px;
            background: var(--card-background-color, #fff1);
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .item-header h4 {
            margin: 0;
        }
        ha-textfield, ha-icon-picker {
            display: block;
            margin-bottom: 8px;
        }
        .settings-fields {
          border-top: 1px solid var(--divider-color);
          margin-top: 8px;
          padding-top: 8px;
        }
        .settings-toggle {
          display: flex;
          align-items: center;
          margin-top: 4px;
          margin-bottom: 4px;
        }
  .sections-list { display: flex; flex-wrap: wrap; gap:4px; align-items: center; }
  .section-tab.active { --mdc-theme-primary: var(--primary-color); font-weight:600; }
  .colors-section { 
    border: 1px solid var(--divider-color); 
    border-radius: 8px; 
    padding: 12px; 
    margin: 12px 0; 
    background: var(--card-background-color, transparent);
  }
  .colors-section h4 { margin-top: 0; margin-bottom: 12px; color: var(--primary-text-color); }
  .colors-grid { display:grid; grid-template-columns: repeat(auto-fill,minmax(200px,1fr)); gap:10px; }
  .add-section { margin-left:4px; }
  .move-btn { --mdc-icon-size:20px; }
  .remove-section { --mdc-icon-size:20px; }
  .colors-toggle { margin-top:8px; margin-bottom:4px; }
    `;
  }
}
customElements.define("ha-navigation-card-editor", HaNavigationCardEditor);

class HaNavigationCard extends LitElementBase {
  static get properties() {
    return {
      hass: {},
      config: {},
    };
  }

  setConfig(config) {
    if (!config.sections || !Array.isArray(config.sections)) {
      throw new Error("You need to define an array of sections");
    }
    // Validate sections have valid structure
    config.sections.forEach((section, idx) => {
      if (!section.items || !Array.isArray(section.items)) {
        console.warn(`[ha-navigation-card] Section ${idx} missing items array, using empty array`);
        section.items = [];
      }
    });
    this.config = config;
  }

  static getConfigElement() {
    return document.createElement("ha-navigation-card-editor");
  }

  static getStubConfig() {
    return {
      sections: [
        {
          title: "Config",
          items: [
            { label: "YAML / Restart", icon: "mdi:code-tags", url: "/developer-tools/yaml" },
            { label: "Settings", icon: "mdi:cog-outline", url: "/config/dashboard" },
          ]
        },
        {
          title: "Add-ons",
          items: [
            {
              label: "Studio Code",
              image: "/api/hassio/addons/a0d7b954_vscode/logo",
              url: "/a0d7b954_vscode/ingress",
              settings: {
                label: "Studio Code Settings",
                url: "/hassio/addon/a0d7b954_vscode/config",
                icon: "mdi:cog-outline"
              }
            },
          ]
        }
      ],
      colors: { ...DEFAULT_COLORS }
    };
  }

  render() {
    const colors = {
      ...DEFAULT_COLORS,
      ...(this.config.colors || {}),
    };

    // Apply CSS variables via inline style for dynamic color support
    const styleVars = `
      --nav-title-bg-color: ${colors.title_bg_color};
      --nav-item-bg-color: ${colors.item_bg_color};
      --nav-item-bg-color-hover: ${colors.item_bg_color_hover};
      --nav-icon-bg-color: ${colors.icon_bg_color};
      --nav-text-color: ${colors.text_color};
      --nav-settings-icon-color: ${colors.settings_icon_color};
      --nav-settings-icon-size: ${colors.settings_icon_size};
    `;

    return html`
      <div class="dock-container" role="navigation" aria-label="Home shortcuts" style="${styleVars}">
        ${this.config.sections.map(section => this._renderSection(section))}
      </div>
    `;
  }

  _renderSection(section) {
    return html`
      <div class="dock-section">
        ${section.title ? html`<h3>${section.title}</h3>` : ""}
        <div class="dock">
          ${section.items.map(item => this._renderItem(item))}
        </div>
      </div>
    `;
  }

  _renderItem(item) {
    const safe = this._sanitizeItem(item);
    const icon = safe.image
      ? html`<img loading="lazy" src="${safe.image}" alt="${safe.label}" />`
      : html`<ha-icon icon="${safe.icon || 'mdi:link'}"></ha-icon>`;

    const settings = safe.settings ? html`
      <span
        class="dock-item-settings"
        title="${safe.settings.label || 'Settings'}"
        role="button"
        tabindex="0"
        @click="${(e) => this._handleSettingsClick(e, safe.settings.url)}"
        @keydown="${(e) => e.key === 'Enter' && this._handleSettingsClick(e, safe.settings.url)}"
      >
        <ha-icon icon="${safe.settings.icon || 'mdi:cog-outline'}"></ha-icon>
      </span>
    ` : '';

    return html`
      <a
        class="dock-item"
        href="${safe.url}"
        title="${safe.label}"
        aria-label="${safe.label}"
        @click="${(e) => this._onItemClick(e, safe.url)}"
      >
        ${icon}
        <span class="label">${safe.label}</span>
        ${settings}
      </a>
    `;
  }

  _handleSettingsClick(e, url) {
    e.stopPropagation();
    e.preventDefault();
    this._navigate(url);
  }

  _onItemClick(e, url) {
    // Internal navigation (paths beginning with /) uses HA router without full reload.
    if (url && url.startsWith('/')) {
      e.preventDefault();
      this._navigate(url);
    }
  }

  _navigate(url) {
    if (!url || url === '#') return;
    
    try {
      // Normalize URL - remove origin if present to get path
      let targetUrl = url;
      if (targetUrl.startsWith(window.location.origin)) {
        targetUrl = targetUrl.substring(window.location.origin.length);
      }
      
      // Internal navigation for paths starting with /
      if (targetUrl.startsWith('/')) {
        window.history.pushState(null, '', targetUrl);
        window.dispatchEvent(new Event('location-changed', {
          bubbles: false,
          cancelable: false,
          composed: true
        }));
      } else {
        // External navigation
        window.location.assign(url);
      }
    } catch (err) {
      console.error('[ha-navigation-card] navigation error', err);
      // Fallback to direct assignment
      window.location.href = url;
    }
  }

  _sanitizeItem(item) {
    if (typeof item.url !== 'string') {
      return { ...item, url: '#' };
    }
    const trimmedUrl = item.url.trim().toLowerCase();
    if (trimmedUrl.startsWith('javascript:') || trimmedUrl.startsWith('data:')) {
      console.warn('[ha-navigation-card] blocked unsafe url', item.url);
      return { ...item, url: '#' };
    }
    return item;
  }

  getCardSize() {
    if (!this.config?.sections || !Array.isArray(this.config.sections)) return 2;
    
    // Calculate size based on sections and items
    // Each section with title takes ~2 units, items add to height based on wrapping
    let size = 0;
    this.config.sections.forEach(section => {
      // Section header
      size += section.title ? 1.5 : 0.5;
      // Items (estimate 3 items per row, each row ~1.5 units)
      const itemCount = section.items?.length || 0;
      size += Math.ceil(itemCount / 3) * 1.5;
    });
    
    return Math.max(2, Math.ceil(size));
  }

  static get styles() {
    return css`
      .dock-container {
        padding: 4px;
      }
      .dock-section {
        margin-bottom: 16px;
      }
      .dock-section h3 {
        margin: 16px 0 8px 0;
        padding: 4px 12px;
        background: var(--nav-title-bg-color);
        border-radius: 15px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        font-weight: bold;
        min-width: 150px;
        width: fit-content;
        text-align: center;
        display: block;
        margin-left: auto;
        margin-right: auto;
        color: var(--nav-text-color);
      }
      .dock {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
        padding: 4px 6px;
      }
      .dock-item {
        position: relative;
        margin: 6px;
        padding: 8px 10px;
        background: var(--nav-item-bg-color);
        border-radius: 12px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.18);
        text-align: center;
        transition: transform 0.14s ease, box-shadow 0.14s ease, background 0.14s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 120px;
        color: var(--nav-text-color);
        text-decoration: none;
        font-weight: 600;
        cursor: pointer;
      }
      .dock-item:hover {
        transform: translateY(-4px);
        background: var(--nav-item-bg-color-hover);
      }
      .dock-item img {
        width: 48px;
        height: 48px;
        object-fit: contain;
        background: var(--nav-icon-bg-color);
        border-radius: 8px;
        display: block;
        margin-bottom: 6px;
      }
      .dock-item ha-icon {
        --mdc-icon-size: 48px;
        background: var(--nav-icon-bg-color);
        border-radius: 8px;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 6px;
      }
      .dock-item .label {
        font-size: 0.92rem;
        margin-top: 4px;
        line-height: 1.05;
      }
      .dock-item-settings {
        position: absolute;
        top: 2px;
        right: 2px;
        z-index: 2;
        background: transparent;
        border-radius: 50%;
        padding: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.15s;
        color: var(--nav-settings-icon-color);
        text-decoration: none;
      }
      .dock-item-settings:hover {
        background: rgba(0,0,0,0.2);
      }
      .dock-item-settings ha-icon {
  --mdc-icon-size: var(--nav-settings-icon-size, 24px);
  width: var(--nav-settings-icon-size, 24px);
  height: var(--nav-settings-icon-size, 24px);
        display: block;
        background: none;
        border-radius: 0;
        margin-bottom: 0;
      }
      @media (max-width: 480px) {
        .dock-item {
          min-width: 88px;
          padding: 6px;
        }
      }
    `;
  }
}

customElements.define("ha-navigation-card", HaNavigationCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "ha-navigation-card",
  name: "Navigation Card",
  preview: true,
  description: "A customizable card for creating navigation docks or menus.",
  documentationURL: "https://github.com/JOHLC/HA-Navigation-Card",
});
