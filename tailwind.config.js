/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,tsx,ts}', 'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'],
	theme: {
		screens: {
			xxs: '20rem', //320
			xs: '30rem', //480
			sm: '48rem', // 768
			md: '64rem', //1024
			lg: '90rem', // 1440
		},
		extend: {
			colors: {
				primary: '#032868',
				secondary: '#1342A4',
				customDarkBlue: '#1342A4',
				accent: '#D15331',
				navy: '#091B40',
				dark: '#150710',
				lite: '#F1F0E8',
			},
			animation: {
				fade: 'fadeIn 1s ease-in-out',
				fadeOut: 'fadeOut 5s ease-in',
				slideDown: 'slideDown 0.1s ease-in',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: 0 },
					'100%': { opacity: 1 },
				},
				fadeOut: {
					'0%': { opacity: 1 },
					'50%': { opacity: 0.5 },
					'100%': { opacity: 0 },
				},
				slideDown: {
					'0%': { height: 0 },
					'50%': { height: '5rem' },
					'100%': { height: '8rem' },
				},
			},
		},
	},
	plugins: [require('flowbite/plugin')],
};

