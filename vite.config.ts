import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import ts from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), svgr(), ts()],
	define: {
		'import.meta.env.PACKAGE_VERSION': JSON.stringify(
			process.env.npm_package_version
		),
	},
});
