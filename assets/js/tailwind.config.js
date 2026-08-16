/* Tailwind CDN configuration for Mended Consulting.
 *
 * Loaded synchronously after the Tailwind CDN script so the scale is available
 * before the body parses.
 *
 * DIVISION OF LABOUR:
 *   Tailwind utilities  -> layout only (grid, flex, gap, spacing, sizing, order)
 *   assets/css/site.css -> all brand colour, type, border and shadow styling
 *
 * Do not put hex values in markup. These tokens mirror :root in site.css and
 * exist so an occasional utility like bg-brand stays on-palette. Change both
 * files together when rebranding.
 */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        paper: '#efece4',   /* bone */
        ink: '#000000',
        brand: {
          DEFAULT: '#580b0e',   /* Mended maroon */
          hover: '#7a1418',
        },
        sand: '#e4ded2',
      },
      fontFamily: {
        display: ['Archivo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Archivo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        wrap: '1280px',
      },
    },
  },
};
