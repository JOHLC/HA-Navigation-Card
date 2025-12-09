#!/usr/bin/env node
/**
 * Test to verify that the card can be loaded multiple times without errors
 * This simulates what happens when the card is reloaded in Home Assistant
 */

const fs = require('fs');
const path = require('path');

const CARD_FILE = path.join(__dirname, '..', 'dist', 'ha-navigation-card.js');

console.log('🧪 Testing Multiple Card Loads\n');
console.log('='.repeat(60));

// Create a mock DOM environment
class MockCustomElementRegistry {
  constructor() {
    this.elements = new Map();
  }
  
  define(name, constructor) {
    if (this.elements.has(name)) {
      throw new Error(`Failed to execute 'define' on 'CustomElementRegistry': the name "${name}" has already been used with this registry`);
    }
    this.elements.set(name, constructor);
  }
  
  get(name) {
    return this.elements.get(name);
  }
}

class MockLitElement {
  static get html() { return (strings, ...values) => ''; }
  static get css() { return (strings, ...values) => ''; }
}
MockLitElement.prototype.html = MockLitElement.html;
MockLitElement.prototype.css = MockLitElement.css;

// Set up global environment
global.window = {
  LitElement: MockLitElement,
  customCards: [],
  __HA_NAV_CARD_LOGGED: false,
  location: { origin: 'http://localhost' },
  history: { pushState: () => {} },
  dispatchEvent: () => {},
  open: () => {}
};

global.customElements = new MockCustomElementRegistry();
global.HTMLElement = class HTMLElement {};
global.Event = class Event {};
global.console = console;

console.log('\n✓ Test 1: First Load');
try {
  const cardCode = fs.readFileSync(CARD_FILE, 'utf8');
  eval(cardCode);
  console.log('  ✅ Card loaded successfully on first load');
  
  // Check if elements are registered
  const editorElement = global.customElements.get('ha-navigation-card-editor');
  const cardElement = global.customElements.get('ha-navigation-card');
  
  if (editorElement) {
    console.log('  ✅ Editor element registered');
  } else {
    console.log('  ❌ Editor element NOT registered');
    process.exit(1);
  }
  
  if (cardElement) {
    console.log('  ✅ Card element registered');
  } else {
    console.log('  ❌ Card element NOT registered');
    process.exit(1);
  }
} catch (err) {
  console.error('  ❌ FAIL: First load failed:', err.message);
  console.error('     Stack:', err.stack);
  process.exit(1);
}

console.log('\n✓ Test 2: Second Load (Simulating Reload)');
try {
  const cardCode = fs.readFileSync(CARD_FILE, 'utf8');
  eval(cardCode);
  console.log('  ✅ Card loaded successfully on second load (no errors)');
  
  // Check if elements are still registered
  const editorElement = global.customElements.get('ha-navigation-card-editor');
  const cardElement = global.customElements.get('ha-navigation-card');
  
  if (editorElement) {
    console.log('  ✅ Editor element still registered');
  } else {
    console.log('  ❌ Editor element NOT registered after reload');
    process.exit(1);
  }
  
  if (cardElement) {
    console.log('  ✅ Card element still registered');
  } else {
    console.log('  ❌ Card element NOT registered after reload');
    process.exit(1);
  }
} catch (err) {
  console.error('  ❌ FAIL: Second load failed:', err.message);
  console.error('     This is the error that users were experiencing!');
  process.exit(1);
}

console.log('\n✓ Test 3: Third Load (Extra Verification)');
try {
  const cardCode = fs.readFileSync(CARD_FILE, 'utf8');
  eval(cardCode);
  console.log('  ✅ Card loaded successfully on third load (no errors)');
} catch (err) {
  console.error('  ❌ FAIL: Third load failed:', err.message);
  process.exit(1);
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('✅ All multiple load tests passed!');
console.log('='.repeat(60));
console.log('\n📋 Summary:');
console.log('  - Card can be loaded multiple times without errors');
console.log('  - Custom elements are properly guarded against re-registration');
console.log('  - No "already been used with this registry" errors');
console.log('\n✨ Card is safe for Home Assistant reloads!\n');
