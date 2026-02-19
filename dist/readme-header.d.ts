export interface ReadmeHeaderOptions {
    /** package.json-style object with `name`, `version`, and `wp.theme` or `wp.plugin` */
    pkg: Record<string, unknown>;
    /** Entity directory slug */
    slug: string;
    /** Whether this is a theme or plugin readme */
    type: 'theme' | 'plugin';
}
/**
 * Build a WordPress readme.txt header block.
 *
 * Generates the `=== Name ===` title line followed by key: value fields.
 * Field order follows WordPress.org conventions.
 */
export declare function buildReadmeHeader(options: ReadmeHeaderOptions): string;
/**
 * Replace the header block in an existing readme.txt file.
 *
 * Scans from the top for a `=== Title ===` line, then replaces everything
 * up to (but not including) the first non-blank, non-header-field line.
 *
 * Returns `null` if no title line is found.
 */
export declare function replaceReadmeHeader(content: string, newHeader: string): string | null;
