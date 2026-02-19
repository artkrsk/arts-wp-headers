import { describe, it, expect } from 'vitest'
import { buildReadmeHeader, replaceReadmeHeader } from '../src/readme-header'

describe('buildReadmeHeader', () => {
  it('produces theme header with all fields', () => {
    const result = buildReadmeHeader({
      pkg: {
        name: '@arts/velum-theme',
        version: '2.1.0',
        wp: {
          theme: {
            contributors: 'artemsemkin',
            author: 'Artem Semkin',
            requiresAtLeast: '6.5',
            testedUpTo: '6.9',
            requiresPHP: '8.0',
            license: 'GPLv2 or later',
            licenseUri: 'http://www.gnu.org/licenses/gpl-2.0.html',
          },
        },
      },
      slug: 'velum',
      type: 'theme',
    })

    expect(result).toContain('=== Velum ===')
    expect(result).toContain('Contributors: artemsemkin')
    expect(result).toContain('Requires at least: 6.5')
    expect(result).toContain('Tested up to: 6.9')
    expect(result).toContain('Requires PHP: 8.0')
    expect(result).toContain('Stable tag: 2.1.0')
    expect(result).toContain('License: GPLv2 or later')
    expect(result).toContain('License URI: http://www.gnu.org/licenses/gpl-2.0.html')
  })

  it('produces plugin header with all fields including donate link and tags', () => {
    const result = buildReadmeHeader({
      pkg: {
        name: '@arts/fluid-design-system',
        version: '1.5.0',
        wp: {
          plugin: {
            name: 'Fluid Design System for Elementor',
            contributors: 'artemsemkin',
            donateLink: 'https://example.com/donate',
            tags: 'elementor, design system, fluid',
            requiresAtLeast: '6.5',
            testedUpTo: '6.9',
            requiresPHP: '8.0',
            license: 'GPLv2 or later',
            licenseUri: 'http://www.gnu.org/licenses/gpl-2.0.html',
          },
        },
      },
      slug: 'fluid-design-system',
      type: 'plugin',
    })

    expect(result).toContain('=== Fluid Design System for Elementor ===')
    expect(result).toContain('Contributors: artemsemkin')
    expect(result).toContain('Donate link: https://example.com/donate')
    expect(result).toContain('Tags: elementor, design system, fluid')
    expect(result).toContain('Requires at least: 6.5')
    expect(result).toContain('Tested up to: 6.9')
    expect(result).toContain('Requires PHP: 8.0')
    expect(result).toContain('Stable tag: 1.5.0')
    expect(result).toContain('License: GPLv2 or later')
    expect(result).toContain('License URI: http://www.gnu.org/licenses/gpl-2.0.html')
  })

  it('produces minimal header with only name and version', () => {
    const result = buildReadmeHeader({
      pkg: { name: '@arts/velum-theme', version: '1.0.0', wp: { theme: {} } },
      slug: 'velum',
      type: 'theme',
    })

    expect(result).toContain('=== Velum ===')
    expect(result).toContain('Stable tag: 1.0.0')
    expect(result).not.toContain('Contributors:')
    expect(result).not.toContain('Requires at least:')
    expect(result).not.toContain('License:')
  })

  it('falls back to author when contributors is not set', () => {
    const result = buildReadmeHeader({
      pkg: {
        name: '@arts/velum-theme',
        version: '1.0.0',
        wp: { theme: { author: 'Artem Semkin' } },
      },
      slug: 'velum',
      type: 'theme',
    })

    expect(result).toContain('Contributors: Artem Semkin')
  })

  it('prefers contributors over author', () => {
    const result = buildReadmeHeader({
      pkg: {
        name: '@arts/velum-theme',
        version: '1.0.0',
        wp: { theme: { contributors: 'artemsemkin', author: 'Artem Semkin' } },
      },
      slug: 'velum',
      type: 'theme',
    })

    expect(result).toContain('Contributors: artemsemkin')
    expect(result).not.toContain('Artem Semkin')
  })

  it('omits donate link and tags for themes', () => {
    const result = buildReadmeHeader({
      pkg: {
        name: '@arts/velum-theme',
        version: '1.0.0',
        wp: {
          theme: {
            tags: 'blog, portfolio',
          },
        },
      },
      slug: 'velum',
      type: 'theme',
    })

    expect(result).not.toContain('Tags:')
    expect(result).not.toContain('Donate link:')
  })

  it('derives name from pkg.name stripping scope and -theme suffix', () => {
    const result = buildReadmeHeader({
      pkg: { name: '@arts/my-cool-theme', version: '1.0.0', wp: { theme: {} } },
      slug: 'my-cool-theme',
      type: 'theme',
    })

    expect(result).toContain('=== My Cool ===')
  })

  it('derives name from pkg.name stripping -plugin suffix', () => {
    const result = buildReadmeHeader({
      pkg: { name: '@arts/my-cool-plugin', version: '1.0.0', wp: { plugin: {} } },
      slug: 'my-cool-plugin',
      type: 'plugin',
    })

    expect(result).toContain('=== My Cool ===')
  })

  it('uses plugin.name field when set for plugins', () => {
    const result = buildReadmeHeader({
      pkg: {
        name: '@arts/fluid-design-system',
        version: '1.0.0',
        wp: { plugin: { name: 'Fluid Design System for Elementor' } },
      },
      slug: 'fluid-design-system',
      type: 'plugin',
    })

    expect(result).toContain('=== Fluid Design System for Elementor ===')
  })

  it('falls back to slug when pkg.name is missing', () => {
    const result = buildReadmeHeader({
      pkg: { version: '1.0.0', wp: { theme: {} } },
      slug: 'my-cool-theme',
      type: 'theme',
    })

    expect(result).toContain('=== My Cool Theme ===')
  })

  it('respects field order for themes', () => {
    const result = buildReadmeHeader({
      pkg: {
        name: '@arts/velum-theme',
        version: '1.0.0',
        wp: {
          theme: {
            contributors: 'user',
            requiresAtLeast: '6.5',
            testedUpTo: '6.9',
            requiresPHP: '8.0',
            license: 'GPL',
            licenseUri: 'https://gpl.org',
          },
        },
      },
      slug: 'velum',
      type: 'theme',
    })

    const lines = result.split('\n').filter((l) => l.includes(':'))
    const fieldOrder = lines.map((l) => l.split(':')[0].trim())

    expect(fieldOrder).toEqual([
      'Contributors',
      'Requires at least',
      'Tested up to',
      'Requires PHP',
      'Stable tag',
      'License',
      'License URI',
    ])
  })

  it('respects field order for plugins', () => {
    const result = buildReadmeHeader({
      pkg: {
        name: '@arts/test-plugin',
        version: '1.0.0',
        wp: {
          plugin: {
            contributors: 'user',
            donateLink: 'https://donate.com',
            tags: 'tag1, tag2',
            requiresAtLeast: '6.5',
            testedUpTo: '6.9',
            requiresPHP: '8.0',
            license: 'GPL',
            licenseUri: 'https://gpl.org',
          },
        },
      },
      slug: 'test',
      type: 'plugin',
    })

    const lines = result.split('\n').filter((l) => l.includes(':'))
    const fieldOrder = lines.map((l) => l.split(':')[0].trim())

    expect(fieldOrder).toEqual([
      'Contributors',
      'Donate link',
      'Tags',
      'Requires at least',
      'Tested up to',
      'Requires PHP',
      'Stable tag',
      'License',
      'License URI',
    ])
  })

  it('defaults version to 1.0.0 when missing', () => {
    const result = buildReadmeHeader({
      pkg: { name: '@arts/velum-theme', wp: { theme: {} } },
      slug: 'velum',
      type: 'theme',
    })

    expect(result).toContain('Stable tag: 1.0.0')
  })
})

describe('replaceReadmeHeader', () => {
  it('replaces header and preserves short description and sections', () => {
    const content = `=== Old Name ===
Contributors: olduser
Requires at least: 6.0
Stable tag: 1.0.0

A short description of the plugin.

== Description ==

Long description here.

== Changelog ==

= 1.0.0 =
* Initial release
`
    const newHeader = `=== New Name ===

Contributors: newuser
Requires at least: 6.5
Stable tag: 2.0.0

`
    const result = replaceReadmeHeader(content, newHeader)

    expect(result).toContain('=== New Name ===')
    expect(result).toContain('Contributors: newuser')
    expect(result).toContain('Stable tag: 2.0.0')
    expect(result).toContain('A short description of the plugin.')
    expect(result).toContain('== Description ==')
    expect(result).toContain('== Changelog ==')
    expect(result).not.toContain('Old Name')
    expect(result).not.toContain('olduser')
  })

  it('handles no short description (section immediately after header)', () => {
    const content = `=== My Plugin ===
Stable tag: 1.0.0

== Description ==

Content here.
`
    const newHeader = `=== My Plugin ===

Stable tag: 2.0.0

`
    const result = replaceReadmeHeader(content, newHeader)

    expect(result).toContain('Stable tag: 2.0.0')
    expect(result).toContain('== Description ==')
  })

  it('handles header-only file with no sections below', () => {
    const content = `=== My Theme ===
Contributors: user
Stable tag: 1.0.0
`
    const newHeader = `=== My Theme ===

Contributors: newuser
Stable tag: 2.0.0

`
    const result = replaceReadmeHeader(content, newHeader)

    expect(result).toContain('Contributors: newuser')
    expect(result).toContain('Stable tag: 2.0.0')
  })

  it('returns null when no title line found', () => {
    const content = `This is just some random text
without any readme title.
`
    const result = replaceReadmeHeader(content, '=== Test ===\n\n')

    expect(result).toBeNull()
  })

  it('handles extra blank lines between header and content', () => {
    const content = `=== My Plugin ===
Stable tag: 1.0.0



A short description.

== Description ==

Content.
`
    const newHeader = `=== My Plugin ===

Stable tag: 2.0.0

`
    const result = replaceReadmeHeader(content, newHeader)

    expect(result).toContain('Stable tag: 2.0.0')
    expect(result).toContain('A short description.')
  })

  it('preserves trailing newline', () => {
    const content = `=== Test ===
Stable tag: 1.0.0

Some text.
`
    const newHeader = `=== Test ===

Stable tag: 2.0.0

`
    const result = replaceReadmeHeader(content, newHeader)

    expect(result).toMatch(/\n$/)
  })

  it('handles real-world plugin readme with many sections', () => {
    const content = `=== Fluid Design System for Elementor ===
Contributors: artemsemkin
Donate link: https://example.com
Tags: elementor, design
Requires at least: 6.5
Tested up to: 6.9
Requires PHP: 8.0
Stable tag: 1.5.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Fluid responsive design system for Elementor page builder.

== Description ==

This plugin provides a comprehensive fluid design system.

= Features =

* Feature one
* Feature two

== Installation ==

1. Upload the plugin
2. Activate it

== Frequently Asked Questions ==

= How do I use this? =

Just install and activate.

== Screenshots ==

1. Screenshot description

== Changelog ==

= 1.5.0 =
* New feature

= 1.0.0 =
* Initial release

== Upgrade Notice ==

= 1.5.0 =
Upgrade for new features.
`
    const newHeader = `=== Fluid Design System for Elementor ===

Contributors: artemsemkin
Donate link: https://example.com
Tags: elementor, design, fluid
Requires at least: 6.7
Tested up to: 6.9
Requires PHP: 8.2
Stable tag: 2.0.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

`
    const result = replaceReadmeHeader(content, newHeader)

    expect(result).toContain('Stable tag: 2.0.0')
    expect(result).toContain('Requires PHP: 8.2')
    expect(result).toContain('Tags: elementor, design, fluid')
    expect(result).toContain('Fluid responsive design system')
    expect(result).toContain('== Description ==')
    expect(result).toContain('== Installation ==')
    expect(result).toContain('== Frequently Asked Questions ==')
    expect(result).toContain('== Changelog ==')
    expect(result).toContain('== Upgrade Notice ==')
    expect(result).not.toContain('Requires at least: 6.5')
    expect(result).not.toContain('Requires PHP: 8.0')
    expect(result).not.toContain('Stable tag: 1.5.0')
  })
})
