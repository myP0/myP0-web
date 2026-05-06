/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts,md}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				bg: '#faf8f3',
				panel: '#ffffff',
				ink: '#1d1c19',
				dim: '#6b6962',
				faint: '#a8a59c',
				rule: '#dfdcd2',
				accent: 'oklch(0.58 0.15 40)',
				'accent-soft': 'oklch(0.94 0.04 40)'
			},
			fontFamily: {
				sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'system-ui', 'sans-serif'],
				serif: ['Fraunces', '"Instrument Serif"', 'Georgia', 'serif']
			}
		}
	},
	plugins: [require('@tailwindcss/typography')]
};
