import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			screens: {
				mobile: '375px',
			},
			colors: {
				announcement: '#6a8469',
				announcementText: '#fffffe',
				body: '#f5f5f5',
				bodyAlpha05: 'rgba(254, 254, 254, 0.05)',
				bodyDim: '#f1f1f1',
				bodyLightDim: '#f9f9f9',
				bodyMediumDim: '#f4f4f4',
				border: '#1c1b19',
				btnPrimary: '#d62a2f',
				btnPrimaryLight: '#de5559',
				btnPrimaryDim: '#c1252a',
				btnPrimaryText: '#fffffe',
				cartDot: '#d62a2f',
				drawers: '#2f2c2f',
				drawersDim: '#222022',
				drawerBorder: '#fafafa',
				drawerText: '#fefefe',
				drawerTextDark: '#d8d8d8',
				drawerButton: '#d62a2f',
				drawerButtonText: '#fffffe',
				footer: '#2f2c2f',
				footerText: '#fefefe',
				footerTextAlpha01: '#fefefe',
				gridOverlay: '#000000',
				gridOverlayOpacity: 'rgba(0, 0, 0, 0.1)',
				headerTextAlpha01: 'rgba(254, 254, 254, 0.1)',
				heroText: '#fffffe',
				smallImageBg: '#ffffff',
				largeImageBg: '#1c1b19',
				imageOverlay: '#1c1b19',
				imageOverlayOpacity: 'rgba(0, 0, 0, 0.1)',
				imageOverlayTextShadow: '0.2',
				link: '#1c1b19',
				modalBg: '#c2c2c2',
				nav: '#2f2c2f',
				navText: '#fefefe',
				price: '#1c1b19',
				saleTag: '#1c1b19',
				saleTagText: '#fffffe',
				textBody: '#1c1b19',
				textBodyAlpha015: 'rgba(28, 27, 25, 0.15)',
				textBodyAlpha005: 'rgba(28, 27, 25, 0.05)',
				textBodyAlpha008: 'rgba(28, 27, 25, 0.08)',
				textSavings: '#d62a2f',
			},
			spacing: {
				gridGutter: '17px',
				drawerGutter: '20px',
				sizeChartMargin: '25px 0',
				sizeChartIconMargin: '5px',
				newsletterReminderPadding: '40px',
				// Add more spacing values based on your custom properties
			},
			fontSize: {
				typeHeader: '36px',
				typeBase: '17px',
				typeCollectionTitle: '20px',
				// Add more font size values based on your custom properties
			},
			fontWeight: {
				typeHeader: '900',
				typeBase: '600',
				// Add more font weight values based on your custom properties
			},
			lineHeight: {
				typeHeader: '1',
				typeBase: '1.5',
				baselineHeightMinus01: '1.4',
				// Add more line height values based on your custom properties
			},
			letterSpacing: {
				typeBase: '0.025em',
				// Add more letter spacing values based on your custom properties
			},
			borderRadius: {
				button: '0',
				// Add more border radius values based on your custom properties
			},
			keyframes: {
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
			},
			animation: {
				'slide-right':
					'slide-right 1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
			},
		},
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: ['corporate', 'black'],
	},
}
export default config