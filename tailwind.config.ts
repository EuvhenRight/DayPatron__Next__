import type { Config } from 'tailwindcss'

const config = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	prefix: '',
	theme: {
		container: {
			center: true,
			padding: '1rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'slide-right': {
					'0%': {
						transform:
							'translateX(-100%) scale(0.5) perspective(1000px) rotateY(-90deg);',
						opacity: '0',
					},
					'33%': {
						opacity: '0',
					},
					'66%': {
						opacity: '1',
					},
					'100%': {
						transform: 'translateX(0) scale(1) perspective(1000px) rotateY(0)',
						opacity: '1',
					},
				},
				marquee: {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(-100%)' },
				},
			},
			animation: {
				marquee: 'marquee 15s linear infinite',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'slide-right':
					'slide-right 1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
