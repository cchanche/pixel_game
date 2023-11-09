import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

/** @type {import('rollup').RollupOptions} */
export default {
  input: 'src/main.ts',
  output: {
    file: 'dist/index.cjs',
    format: 'cjs',
  },
  onwarn: (warning, defaultHandler) => {
    if (warning.code !== 'EVAL' && warning.code !== 'CIRCULAR_DEPENDENCY') {
      defaultHandler(warning);
    }
  },
  plugins: [
    typescript(),
    commonjs(),
    nodeResolve({ preferBuiltins: true }),
    json(),
  ],
};
