import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({

	plugins: [
		react({
			babel: {
				plugins: [
					'babel-plugin-macros',
					[
						'@emotion/babel-plugin-jsx-pragmatic',
						{
							export: 'jsx',
							import: '__cssprop',
							module: '@emotion/react',
						},
					],
					['@babel/plugin-transform-react-jsx', { pragma: '__cssprop' }, 'twin.macro'],
				],
			},
		}),

		svgr({
			// svgr options: https://react-svgr.com/docs/options/
			svgrOptions: {
				// ...
			},

			// esbuild options, to transform jsx to js
			esbuildOptions: {
				// ...
			},

			// A minimatch pattern, or array of patterns, which specifies the files in the build the plugin should include.
			include: '**/*.svg?react',

			//  A minimatch pattern, or array of patterns, which specifies the files in the build the plugin should ignore. By default no files are ignored.
			exclude: '',
		}),
	],

	css: {
		preprocessorOptions: {
			css: {
				postcssOptions: {
					config: 'postcss.config.js',
				},
			},
		},
	},
	server: {
		host: true,
		strictPort: true,
		port: 3000,
	},
	assetsInclude: /\.(svg)$/,
});
