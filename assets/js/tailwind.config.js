/* Tailwind CDN configuration for Mended Consulting.
 *
 * Loaded synchronously immediately after the Tailwind CDN script so the brand
 * scale is available before the body is parsed.
 *
 * DIVISION OF LABOUR:
 *   Tailwind utilities  -> layout only (grid, flex, gap, spacing, sizing, order)
 *   assets/css/site.css -> all brand surface, type, colour and component styling
 *
 * Do not hardcode hex values in markup. Use the classes below or site.css so the
 * palette stays swappable from one place when Mended's brand kit lands.
 */
tailwind.config = {
  darkMode: 'class', // theme is locked dark at the page level, no toggle
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0b0f0d',
          2: '#111614',
          3: '#171e1b',
          4: '#1e2724',
        },
        bone: {
          DEFAULT: '#eceae4',
          dim: '#a8ada8',
          faint: '#7c847f',
        },
        accent: {
          DEFAULT: '#4fa37f',
          bright: '#74c9a2',
          deep: '#2f6b57',
        },
      },
      fontFamily: {
        display: ['Bricolage Grotesque', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        shell: '1280px',
      },
      borderRadius: {
        card: '16px',
        input: '12px',
      },
      transitionTimingFunction: {
        ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
};
