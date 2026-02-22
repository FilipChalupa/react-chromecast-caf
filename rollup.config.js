import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import fs from 'fs' // Added fs import
import path from 'path'
import copy from 'rollup-plugin-copy'
import del from 'rollup-plugin-delete'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import typescript from 'rollup-plugin-typescript2'
import packageJson from './package.json' with { type: 'json' }

const outputDirectory = path.parse(packageJson.main).dir

// Custom plugin to add reference to cast-shim.d.ts
const addCastShimReference = () => ({
	name: 'add-cast-shim-reference',
	writeBundle: async () => {
		const dtsPath = path.resolve(outputDirectory, 'index.d.ts')
		const shimReference = '/// <reference path="./types/cast-shim.d.ts" />\n'

		if (fs.existsSync(dtsPath)) {
			const content = fs.readFileSync(dtsPath, 'utf8')
			if (!content.startsWith(shimReference)) {
				fs.writeFileSync(dtsPath, shimReference + content, 'utf8')
			}
		}
	},
})

export default {
	input: './src/index.ts',
	output: {
		dir: outputDirectory,
		format: 'esm',
		sourcemap: true,
	},
	external: [
		'react',
		'chromecast-caf-receiver-module',
		'chromecast-caf-sender-module',
	],
	plugins: [
		del({ targets: outputDirectory + '/*' }),
		peerDepsExternal(),
		resolve({
			extensions: ['.js', '.jsx', '.ts', '.tsx'],
		}),
		commonjs(),
		typescript({ sourceMap: true }),
		copy({
			targets: [{ src: 'src/types/cast-shim.d.ts', dest: 'dist/types' }],
		}),
		addCastShimReference(), // Added custom plugin
	],
}
