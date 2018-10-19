import babel from 'rollup-plugin-babel';
import { uglify } from "rollup-plugin-uglify";
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json'

module.exports = [
  {
    input: 'main.js',
    output: {
      name: 'test',
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [
      resolve(),
      babel({
        exclude: 'node_modules/**'
      }),
      commonjs()
    ],
  },
	{
		input: 'main.js',
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		]
	}
]