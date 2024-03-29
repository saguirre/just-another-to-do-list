/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
    './common/components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false,
  theme: {
    extend: {
      borderWidth: {
        DEFAULT: '1px',
        '0.5': '0.5px',
        0: '0px',
        2: '2px',
        4: '4px',
        8: '8px',
      },
      colors: {
        'th-background': 'var(--background)',
        'th-background-secondary': 'var(--background-secondary)',
        'th-background-third': 'var(--background-third)',
        'th-foreground': 'var(--foreground)',
        'th-primary-dark': 'var(--primary-dark)',
        'th-primary-medium': 'var(--primary-medium)',
        'th-primary-light': 'var(--primary-light)',
        'th-primary-extra-light': 'var(--primary-extra-light)',
        'th-accent-dark': 'var(--accent-dark)',
        'th-accent-medium': 'var(--accent-medium)',
        'th-accent-light': 'var(--accent-light)',
        'th-accent-extra-light': 'var(--accent-extra-light)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@headlessui/tailwindcss')],
}
