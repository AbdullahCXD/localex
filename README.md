<div align="center">
  <h1>
    <span style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 3em; font-weight: 800;">LocaleX</span>
  </h1>
  
  <p style="font-size: 1.2em; color: #666; margin: 20px 0; max-width: 600px;">
    The internationalization system that doesn't get in your way. Built for developers who want powerful translation features without the complexity.
  </p>
  
  <div style="margin: 30px 0;">
    <img src="https://img.shields.io/npm/v/localex?style=flat-square&color=667eea" alt="npm version">
    <img src="https://img.shields.io/npm/dm/localex?style=flat-square&color=764ba2" alt="downloads">
    <img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&color=3178c6" alt="TypeScript">
    <img src="https://img.shields.io/github/license/username/localex?style=flat-square&color=green" alt="license">
  </div>
</div>

---

## Why LocaleX?

<table style="width: 100%; border: none;">
<tr style="border: none;">
<td style="border: none; width: 50%; padding-right: 20px;">

**Traditional i18n libraries** make you jump through hoops. Complex configurations, rigid file structures, and verbose APIs that slow you down.

**LocaleX is different.** It's designed around how you actually work. YAML files that make sense, an API that feels natural, and features that solve real problems.

</td>
<td style="border: none; width: 50%; padding-left: 20px;">

```typescript
// This is all you need to get started
const i18n = createLocaleX({
  localeDirectory: './locales',
  ext: 'yml'
});

i18n.loadLocales();

// And this is how simple translations are
const msg = i18n.translate('en', 'user.welcome', {
  params: { name: 'Sarah' }
});
```

</td>
</tr>
</table>

---

## Features That Actually Matter

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 30px 0;">

<div style="padding: 20px; border: 1px solid #e1e5e9; border-radius: 8px; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);">
<h3 style="color: #2c3e50; margin-top: 0;">YAML-First Design</h3>
<p style="color: #555;">Your translators can actually read and edit these files. No more JSON nightmares or proprietary formats.</p>
</div>

<div style="padding: 20px; border: 1px solid #e1e5e9; border-radius: 8px; background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);">
<h3 style="color: #2c3e50; margin-top: 0;">Smart Pluralization</h3>
<p style="color: #555;">Handle zero, one, and many cases naturally. No need to learn complex plural rule syntax.</p>
</div>

<div style="padding: 20px; border: 1px solid #e1e5e9; border-radius: 8px; background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);">
<h3 style="color: #2c3e50; margin-top: 0;">Nested Everything</h3>
<p style="color: #555;">Organize translations the way your app is structured. Deep nesting with dot notation that just works.</p>
</div>

<div style="padding: 20px; border: 1px solid #e1e5e9; border-radius: 8px; background: linear-gradient(135deg, #d299c2 0%, #fef9d7 100%);">
<h3 style="color: #2c3e50; margin-top: 0;">Type-Safe by Default</h3>
<p style="color: #555;">Full TypeScript support means fewer runtime surprises and better developer experience.</p>
</div>

<div style="padding: 20px; border: 1px solid #e1e5e9; border-radius: 8px; background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%);">
<h3 style="color: #2c3e50; margin-top: 0;">Security Built-In</h3>
<p style="color: #555;">Parameter escaping is automatic. No more worrying about XSS through user-generated content.</p>
</div>

<div style="padding: 20px; border: 1px solid #e1e5e9; border-radius: 8px; background: linear-gradient(135deg, #fdbb2d 0%, #22c1c3 100%);">
<h3 style="color: #2c3e50; margin-top: 0;">Translation Analytics</h3>
<p style="color: #555;">Know exactly which locales are complete and which need work. Perfect for managing translation teams.</p>
</div>

</div>

---

## Installation

<div style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 6px; padding: 20px; margin: 20px 0;">

```bash
npm install localex
```

<details style="margin-top: 15px;">
<summary style="cursor: pointer; color: #666;">Other package managers</summary>

```bash
yarn add localex
pnpm add localex
bun add localex
```

</details>
</div>

---

## Getting Started

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; margin: 30px 0;">

### The 30-Second Setup

1. **Create your locale files** in a `locales` folder
2. **Import LocaleX** and point it at your folder  
3. **Start translating** with a clean, intuitive API

That's it. No webpack plugins, no build step configuration, no ceremony.

</div>

### Your First Locale File

Create `locales/en.yml`:

```yaml
id: en
title: English
translations:
  welcome: "Welcome to our app!"
  user:
    greeting: "Hey there, {{name}}!"
    profile:
      title: "Your Profile"
      lastSeen: "Last seen {{time}} ago"
  items:
    none: "No items yet"
    count: "{{count}} item|{{count}} items"
```

### Initialize LocaleX

```typescript
import { createLocaleX } from 'localex';

const i18n = createLocaleX({
  localeDirectory: './locales',
  ext: 'yml'
});

i18n.loadLocales();
```

### Use Your Translations

```typescript
// Simple translation
const title = i18n.translate('en', 'user.profile.title');
// → "Your Profile"

// With parameters
const greeting = i18n.translate('en', 'user.greeting', {
  params: { name: 'Alex' }
});
// → "Hey there, Alex!"

// Smart pluralization
const itemCount = i18n.translate('en', 'items.count', {
  params: { count: 5 },
  count: 5
});
// → "5 items"
```

---

## Real-World Examples

<div style="margin: 30px 0;">

### E-commerce Site

```typescript
// Product page
const productTitle = i18n.translate('en', 'product.title', {
  params: { 
    name: product.name,
    brand: product.brand 
  }
});

// Shopping cart
const cartSummary = i18n.translate('en', 'cart.summary', {
  params: { 
    items: cart.length,
    total: formatPrice(cart.total)
  },
  count: cart.length
});

// Reviews section
const reviewCount = i18n.translate('en', 'reviews.count', {
  params: { count: reviews.length },
  count: reviews.length
});
```

### Admin Dashboard

```typescript
// Check translation coverage before launching
const coverage = i18n.getLocaleCompleteness('es', 'en');
if (coverage < 95) {
  console.warn(`Spanish translations only ${coverage}% complete`);
}

// Update translations without restarting
i18n.updateLocaleTranslations('en', {
  newFeature: {
    title: 'Analytics Dashboard',
    description: 'View your {{metric}} performance'
  }
});

// Validate all required keys exist
const requiredKeys = ['nav.home', 'nav.settings', 'nav.logout'];
const missing = requiredKeys.filter(key => 
  !i18n.hasTranslation('fr', key)
);
```

</div>

---

## Advanced Configuration

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0;">

<div>

### Selective Loading

Only load the locales you need:

```typescript
const i18n = createLocaleX({
  localeDirectory: './locales',
  ext: 'yml',
  loadSpecifiedLocales: true,
  locales: ['en', 'es', 'fr']
});
```

### Custom Logging

Integrate with your existing logging system:

```typescript
const i18n = createLocaleX({
  localeDirectory: './locales',
  ext: 'yml',
  logging: {
    debug: process.env.NODE_ENV === 'development',
    format: (level, message, color) => 
      `[${new Date().toISOString()}] ${color(level)}: ${message}`
  }
});
```

</div>

<div>

### Rich Metadata

Add context to your locales:

```yaml
id: en-US
title: English (United States)
meta:
  direction: ltr
  language: en
  region: US
  author: Translation Team
  version: 2.1.0
  lastUpdated: 2024-01-15
  completeness: 100
translations:
  # your translations...
```

### Hot Reloading

Perfect for development:

```typescript
// During development
if (process.env.NODE_ENV === 'development') {
  // Watch for file changes and reload
  fs.watchFile('./locales', () => {
    i18n.reloadLocales();
  });
}
```

</div>

</div>

---

## Best Practices from the Trenches

<div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">

### Translation Key Structure

Think of your keys like file paths. They should tell a story about where they're used:

```yaml
translations:
  pages:
    dashboard:
      title: "Dashboard"
      widgets:
        sales: "Sales Overview"
        users: "User Activity"
    profile:
      title: "My Profile"
      sections:
        personal: "Personal Information"
        security: "Security Settings"
  components:
    buttons:
      save: "Save Changes"
      cancel: "Cancel"
      delete: "Delete"
    forms:
      validation:
        required: "This field is required"
        email: "Please enter a valid email"
```

</div>

<div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 20px; border-radius: 8px; margin: 20px 0;">

### Parameter Naming

Use descriptive parameter names that make sense to translators:

```yaml
# ❌ Hard to understand
message: "User {{u}} has {{n}} {{t}}"

# ✅ Clear and descriptive  
message: "User {{userName}} has {{itemCount}} {{itemType}}"
```

</div>

<div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0;">

### Pluralization Guidelines

Keep plural forms simple and natural:

```yaml
# ✅ Simple and clear
notifications: "{{count}} notification|{{count}} notifications"

# ✅ Include zero case when it matters
items: "No items|{{count}} item|{{count}} items"

# ❌ Overcomplicated
items: "zero items|one item|two items|{{count}} items"
```

</div>

---

## API Reference

<details>
<summary style="font-size: 1.2em; font-weight: bold; cursor: pointer; padding: 10px 0;">Core Methods</summary>

<div style="padding: 20px; background: #f8f9fa; margin: 10px 0; border-radius: 6px;">

### `translate(localeId, key, options?)`
The main translation method.

```typescript
interface TranslationOptions {
  params?: Record<string, string | number | boolean>;
  fallback?: string;
  escapeParams?: boolean;
  count?: number;
}
```

### `hasTranslation(localeId, key)`
Check if a translation exists.

### `getTranslationKeys(localeId)`
Get all available keys for debugging.

### `getLocaleCompleteness(localeId, referenceLocaleId)`
Compare translation coverage between locales.

</div>
</details>

<details>
<summary style="font-size: 1.2em; font-weight: bold; cursor: pointer; padding: 10px 0;">Utility Methods</summary>

<div style="padding: 20px; background: #f8f9fa; margin: 10px 0; border-radius: 6px;">

### `getAllLocales()`
Returns all loaded locale objects.

### `getAvailableLocaleIds()`  
Returns array of locale IDs.

### `getLocaleMetadata(localeId)`
Access locale metadata like direction, author, etc.

### `reloadLocales()`
Hot-reload all locales from disk.

### `updateLocaleTranslations(localeId, newTranslations)`
Update translations programmatically.

</div>
</details>

---

## Contributing

We built LocaleX because we got tired of fighting with i18n libraries that didn't understand how developers actually work. If you feel the same way, we'd love your help making it better.

<div style="display: flex; gap: 20px; margin: 20px 0;">
  <div style="flex: 1; padding: 20px; background: #f8f9fa; border-radius: 8px;">
    <h4>Found a Bug?</h4>
    <p>Open an issue with a minimal reproduction. We'll get back to you quickly.</p>
  </div>
  <div style="flex: 1; padding: 20px; background: #f8f9fa; border-radius: 8px;">
    <h4>Have an Idea?</h4>
    <p>Start a discussion! We love hearing how people want to use LocaleX.</p>
  </div>
  <div style="flex: 1; padding: 20px; background: #f8f9fa; border-radius: 8px;">
    <h4>Want to Code?</h4>
    <p>Check out our <code>good first issue</code> label for beginner-friendly tasks.</p>
  </div>
</div>

---

<div align="center" style="margin: 50px 0; padding: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white;">

<h2 style="color: white; margin-bottom: 20px;">Ready to Stop Fighting Your I18n Library?</h2>

<p style="font-size: 1.1em; margin-bottom: 30px; opacity: 0.9;">
LocaleX gets out of your way so you can focus on building great software.<br>
Your translators will thank you, and so will your future self.
</p>

<div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
  <a href="#installation" style="background: white; color: #667eea; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Get Started</a>
  <a href="https://github.com/username/localex" style="background: rgba(255,255,255,0.2); color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; border: 1px solid rgba(255,255,255,0.3);">View on GitHub</a>
</div>

</div>

---

<div align="center" style="color: #666; font-size: 0.9em;">

MIT Licensed | Made with care by developers who actually use this stuff

</div>