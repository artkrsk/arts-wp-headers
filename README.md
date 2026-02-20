# @artemsemkin/wp-headers

Generate and patch WordPress file headers from `package.json` data.

## Install

```bash
npm install @artemsemkin/wp-headers
```

## What it does

Reads `wp.theme` or `wp.plugin` fields from a `package.json` and writes properly formatted WordPress header comments to the corresponding files (`style.css`, plugin PHP, `readme.txt`). Also patches version strings in TGM-style plugin arrays.

## Examples

### Theme: `package.json` → `style.css`

Given this in your theme's `package.json`:

```json
{
  "name": "@starter/flavor-theme",
  "version": "1.0.0",
  "description": "A starter theme for WordPress",
  "wp": {
    "theme": {
      "uri": "https://example.com/flavor",
      "author": "Dev Studio",
      "authorUri": "https://example.com",
      "requires": "6.0",
      "testedUpTo": "6.7",
      "requiresPHP": "7.4",
      "license": "GPL-2.0-or-later",
      "licenseUri": "https://www.gnu.org/licenses/gpl-2.0.html",
      "textDomain": "flavor",
      "tags": ["blog", "one-column"]
    }
  }
}
```

Running `processMapping({ type: 'theme', slug: 'flavor', entityDir: '/path/to/theme' })` generates this `style.css`:

```css
/*
 * Theme Name: Flavor
 * Theme URI: https://example.com/flavor
 * Author: Dev Studio
 * Author URI: https://example.com
 * Description: A starter theme for WordPress
 * Version: 1.0.0
 * Requires at least: 6.0
 * Tested up to: 6.7
 * Requires PHP: 7.4
 * License: GPL-2.0-or-later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: flavor
 * Tags: blog, one-column
 */
```

### Plugin: `package.json` → PHP header

Given this in your plugin's `package.json`:

```json
{
  "name": "@starter/flavor-core",
  "version": "1.0.0",
  "description": "Core functionality for Flavor theme",
  "wp": {
    "plugin": {
      "name": "Flavor Core",
      "uri": "https://example.com/flavor-core",
      "author": "Dev Studio",
      "authorUri": "https://example.com",
      "requires": "6.0",
      "testedUpTo": "6.7",
      "requiresPHP": "7.4",
      "license": "GPL-2.0-or-later",
      "textDomain": "flavor-core"
    }
  }
}
```

Running `processMapping({ type: 'plugin', slug: 'flavor-core', entityDir: '/path/to/plugin' })` generates this at the top of `flavor-core.php`:

```php
/**
 * Plugin Name: Flavor Core
 * Plugin URI: https://example.com/flavor-core
 * Description: Core functionality for Flavor theme
 * Version: 1.0.0
 * Requires at least: 6.0
 * Tested up to: 6.7
 * Requires PHP: 7.4
 * Author: Dev Studio
 * Author URI: https://example.com
 * License: GPL-2.0-or-later
 * Text Domain: flavor-core
 */
```

## Usage

```ts
import { processMapping } from '@artemsemkin/wp-headers'

processMapping({
  type: 'plugin',
  slug: 'my-plugin',
  entityDir: '/path/to/plugin',
  tgmBasePath: '/path/to/theme/src/php', // optional: patches TGM version arrays
})
```

## Vite integration

Use [`@artemsemkin/vite-plugin-wp-headers`](https://github.com/artkrsk/vite-plugin-wp-headers) to run header generation during Vite's build lifecycle and watch for changes during dev.
