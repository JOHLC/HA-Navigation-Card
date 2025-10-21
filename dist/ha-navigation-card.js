// Navigation Card (ha-navigation-card)
// Lightweight customizable navigation / launcher card for Home Assistant Lovelace
// https://github.com/user/repo
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
    if (this._activeSection == null) this._activeSection = 0;
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
    const newConfig = { ...this._config };
    const newSections = [...newConfig.sections];
  const section = { ...newSections[this._activeSection || 0] };
    const newItems = [...(section.items || [])];
    newItems[index] = { ...newItems[index], [key]: ev.target.value };
    section.items = newItems;
  newSections[this._activeSection || 0] = section;
    newConfig.sections = newSections;
    this._dispatchConfigChanged(newConfig);
  }

  _toggleSettings(ev, index) {
    const enable = ev.target.checked;
    const newConfig = { ...this._config };
    const newSections = [...newConfig.sections];
  const section = { ...newSections[this._activeSection || 0] };
    const newItems = [...(section.items || [])];
    const item = { ...newItems[index] };
    if (enable) {
      item.settings = item.settings || {
        label: (item.label || 'Item') + ' Settings',
        url: item.url || '#',
        icon: 'mdi:cog-outline'
      };
    } else {
      delete item.settings;
    }
    newItems[index] = item;
    section.items = newItems;
  newSections[this._activeSection || 0] = section;
    newConfig.sections = newSections;
    this._dispatchConfigChanged(newConfig);
  }

  _settingsFieldChanged(ev, index, field) {
    const newConfig = { ...this._config };
    const newSections = [...newConfig.sections];
  const section = { ...newSections[this._activeSection || 0] };
    const newItems = [...(section.items || [])];
    const item = { ...newItems[index] };
    const settings = { ...(item.settings || {}) };
    settings[field] = ev.target.value;
    item.settings = settings;
    newItems[index] = item;
    section.items = newItems;
  newSections[this._activeSection || 0] = section;
    newConfig.sections = newSections;
    this._dispatchConfigChanged(newConfig);
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
  _selectSection(index) { this._activeSection = index; this.requestUpdate(); }
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
            @input="${(e)=>{const newConfig={...this._config}; const secs=[...newConfig.sections]; const sec={...secs[this._activeSection]}; sec.title=e.target.value; secs[this._activeSection]=sec; newConfig.sections=secs; this._dispatchConfigChanged(newConfig);}}"
          ></ha-textfield>

          <div class="colors-toggle" style="margin-top:10px;">
            <ha-formfield .label="${this._showColors? 'Hide advanced color options':'Show advanced color options'}">
              <ha-switch .checked="${this._showColors}" @change="${this._toggleColors}"></ha-switch>
            </ha-formfield>
          </div>
          ${this._showColors ? html`
            <div class="colors-grid">
              ${[
                {k:'title_bg_color', l:'Section Title Background'},
                {k:'item_bg_color', l:'Item Background'},
                {k:'item_bg_color_hover', l:'Item Hover Background'},
                {k:'icon_bg_color', l:'Icon Background'},
                {k:'text_color', l:'Text Color'},
                {k:'settings_icon_color', l:'Settings Icon Color'},
                {k:'settings_icon_size', l:'Settings Icon Size (px)'}
              ].map(({k,l})=> html`
                <ha-textfield
                  label="${l}"
                  .value="${(this._config.colors && this._config.colors[k]) || ''}"
                  placeholder="${k.includes('color') ? '#fff or rgba(0,0,0,0.2)' : ''}"
                  @input="${(e)=>this._colorChanged(e,k)}"
                ></ha-textfield>
              `)}
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
  .colors-grid { display:grid; grid-template-columns: repeat(auto-fill,minmax(180px,1fr)); gap:8px; margin:8px 0 12px; }
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
      colors: {
        title_bg_color: 'rgba(7, 7, 50, 0.3)',
        item_bg_color: 'rgba(7, 7, 50, 0.28)',
        item_bg_color_hover: 'rgba(5, 5, 50, 0.5)',
        icon_bg_color: 'rgba(255, 255, 255, 0.03)',
        text_color: '#fff',
  settings_icon_color: 'var(--accent-color)',
      }
    };
  }

  render() {
    const colors = {
        title_bg_color: 'rgba(7, 7, 50, 0.3)',
        item_bg_color: 'rgba(7, 7, 50, 0.28)',
        item_bg_color_hover: 'rgba(5, 5, 50, 0.5)',
        icon_bg_color: 'rgba(255, 255, 255, 0.03)',
        text_color: '#fff',
  settings_icon_color: 'var(--accent-color)',
        ...(this.config.colors || {}),
    };

    const style = html`
        <style>
            :host {
                --nav-title-bg-color: ${colors.title_bg_color};
                --nav-item-bg-color: ${colors.item_bg_color};
                --nav-item-bg-color-hover: ${colors.item_bg_color_hover};
                --nav-icon-bg-color: ${colors.icon_bg_color};
                --nav-text-color: ${colors.text_color};
                --nav-settings-icon-color: ${colors.settings_icon_color};
                /* size of the settings cog (can be overridden by theme or card-mod) */
                --nav-settings-icon-size: ${colors.settings_icon_size || '24px'};
            }
        </style>
    `;

    return html`
      ${style}
      <div class="dock-container" role="navigation" aria-label="Home shortcuts">
        ${this.config.sections.map(section => html`
          <div class="dock-section">
            ${section.title ? html`<h3>${section.title}</h3>` : ""}
            <div class="dock">
              ${section.items.map((item) => {
                const safe = this._sanitizeItem(item);
                const icon = safe.image
                  ? html`<img loading="lazy" src="${safe.image}" alt="${safe.label}" />`
                  : html`<ha-icon icon="${safe.icon || 'mdi:link'}"></ha-icon>`;

                const settings = safe.settings
                  ? html`
                      <span
                        class="dock-item-settings"
                        title="${safe.settings.label || 'Settings'}"
                        role="button"
                        tabindex="0"
                        @click="${(e) => this._handleSettingsClick(e, safe.settings.url)}"
                      >
                        <ha-icon icon="${safe.settings.icon || 'mdi:cog-outline'}"></ha-icon>
                      </span>
                    `
                  : '';

                return html`
                  <a
                    class="dock-item"
                    href="${safe.url}"
                    title="${safe.label}"
                    role="link"
                    aria-label="${safe.label}"
                    @click="${(e)=>this._onItemClick(e, safe.url)}"
                  >
                    ${icon}
                    <span class="label">${safe.label}</span>
                    ${settings}
                  </a>
                `;
              })}
            </div>
          </div>
        `)}
      </div>
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
    if (!url) return;
    try {
      // Prefer HA's navigation helper if present
      const nav = window?.history;
      if (url.startsWith(window.location.origin)) {
        url = url.replace(window.location.origin, '');
      }
      if (nav && url.startsWith('/')) {
        nav.pushState(null, '', url);
        window.dispatchEvent(new Event('location-changed'));
      } else {
        window.location.assign(url);
      }
    } catch (err) {
      console.error('[ha-navigation-card] navigation error', err);
      window.location.href = url;
    }
  }

  _sanitizeItem(item) {
    const out = { ...item };
    const blockProtocols = ['javascript:', 'data:'];
    if (typeof out.url === 'string') {
      const trimmed = out.url.trim();
      const lower = trimmed.toLowerCase();
      if (blockProtocols.some(p => lower.startsWith(p))) {
        console.warn('[ha-navigation-card] blocked unsafe url', out.url);
        out.url = '#';
      }
    } else {
      out.url = '#';
    }
    return out;
  }

  getCardSize() {
    // Rough estimate: number of sections * 2 (header + row) capped minimum 2
    if (!this.config?.sections) return 2;
    return Math.max(2, this.config.sections.length * 2);
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
  documentationURL: "https://github.com/user/repo", // TODO: Add your documentation link here
});
