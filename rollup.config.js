import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import path from 'path'
import copy from 'rollup-plugin-copy'
import del from 'rollup-plugin-delete'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import typescript from 'rollup-plugin-typescript2'
import packageJson from './package.json' with { type: 'json' }

const outputDirectory = path.parse(packageJson.main).dir

export default {
	input: './src/index.ts',
	output: {
		dir: outputDirectory,
		format: 'esm',
		sourcemap: true,
	},
	external: ['react'],
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
	],
}
