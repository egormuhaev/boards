import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
	server: {
		host: true,
	},
	plugins: [
		react(),
		viteStaticCopy({
			targets: [
				{
					src: 'src/pdf-reader/web/*',
					dest: 'web',
				},
				{
					src: 'src/pdf-reader/build/*',
					dest: 'build',
				},
				{
					src: 'public/*',
					dest: 'public',
				},
			],
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
})
