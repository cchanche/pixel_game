import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/main.ts',
  output: {
    file: 'dist/index.cjs',
    format: 'cjs',
  },
  plugins: [typescript()],
  external: ['jimp', 'os', 'argparse', 'path', 'child_process', 'fs'],
};
