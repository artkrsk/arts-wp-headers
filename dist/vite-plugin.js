import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildPluginHeader } from './plugin-header.js';
import { buildReadmeHeader, replaceReadmeHeader } from './readme-header.js';
import { buildThemeHeader } from './theme-header.js';
import { patchTgmVersion } from './patch-tgm.js';
import { replacePluginFileHeader } from './replace-header.js';
function processMapping(mapping) {
    const phpSrc = mapping.phpSrc ?? 'src/php';
    const pkgPath = resolve(mapping.entityDir, 'package.json');
    if (!existsSync(pkgPath)) {
        return;
    }
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    const wp = pkg['wp'] ?? {};
    if (mapping.type === 'theme') {
        if (!wp['theme']) {
            return;
        }
        writeFileSync(resolve(mapping.entityDir, phpSrc, 'style.css'), buildThemeHeader({ pkg, slug: mapping.slug }));
        // readme.txt sync (theme)
        const themeReadmePath = resolve(mapping.entityDir, phpSrc, 'readme.txt');
        if (existsSync(themeReadmePath)) {
            const readmeContent = readFileSync(themeReadmePath, 'utf-8');
            const newReadmeHeader = buildReadmeHeader({ pkg, slug: mapping.slug, type: 'theme' });
            const replacedReadme = replaceReadmeHeader(readmeContent, newReadmeHeader);
            if (replacedReadme !== null) {
                writeFileSync(themeReadmePath, replacedReadme);
            }
        }
    }
    else {
        if (!wp['plugin']) {
            return;
        }
        const plugin = wp['plugin'];
        const version = pkg['version'] ?? '1.0.0';
        const pluginPhpPath = resolve(mapping.entityDir, phpSrc, `${mapping.slug}.php`);
        if (existsSync(pluginPhpPath)) {
            const content = readFileSync(pluginPhpPath, 'utf-8');
            const replaced = replacePluginFileHeader(content, buildPluginHeader({ pkg, slug: mapping.slug }));
            if (replaced !== null) {
                writeFileSync(pluginPhpPath, replaced);
            }
        }
        // readme.txt sync (plugin)
        const pluginReadmePath = resolve(mapping.entityDir, phpSrc, 'readme.txt');
        if (existsSync(pluginReadmePath)) {
            const readmeContent = readFileSync(pluginReadmePath, 'utf-8');
            const newReadmeHeader = buildReadmeHeader({ pkg, slug: mapping.slug, type: 'plugin' });
            const replacedReadme = replaceReadmeHeader(readmeContent, newReadmeHeader);
            if (replacedReadme !== null) {
                writeFileSync(pluginReadmePath, replacedReadme);
            }
        }
        const loadPluginsFile = plugin['loadPluginsFile'];
        if (loadPluginsFile && mapping.tgmBasePath) {
            const tgmFilePath = resolve(mapping.tgmBasePath, loadPluginsFile);
            if (existsSync(tgmFilePath)) {
                const tgmContent = readFileSync(tgmFilePath, 'utf-8');
                const patched = patchTgmVersion(tgmContent, mapping.slug, version);
                if (patched !== tgmContent) {
                    writeFileSync(tgmFilePath, patched);
                }
            }
        }
    }
}
/**
 * Vite plugin that generates WordPress file headers (style.css, plugin PHP)
 * and patches TGM version entries on build and during dev server.
 */
export function wpHeaders(mappings) {
    return {
        name: 'vite-plugin-wp-headers',
        configResolved() {
            for (const mapping of mappings) {
                processMapping(mapping);
            }
        },
        configureServer(server) {
            for (const mapping of mappings) {
                const pkgPath = resolve(mapping.entityDir, 'package.json');
                server.watcher.add(pkgPath);
                server.watcher.on('change', (filePath) => {
                    if (filePath !== pkgPath) {
                        return;
                    }
                    try {
                        processMapping(mapping);
                    }
                    catch (err) {
                        server.config.logger.error(String(err));
                    }
                });
            }
        },
    };
}
