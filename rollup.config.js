import external from 'rollup-plugin-auto-external';
import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';
import cjs from 'rollup-plugin-commonjs';
import del from 'rollup-plugin-delete';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import visualizer from 'rollup-plugin-visualizer';

const env = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';

const config = {
  input: 'src/index.js',
  output: [
    {
      exports: 'named',
      file: `./dist/cjs/spooner.${env}.js`,
      format: 'cjs',
      name: 'spooner',
      sourcemap: env !== 'production',
    },
    {
      file: `./dist/es/spooner.${env}.js`,
      format: 'es',
      sourcemap: env !== 'production',
    },
  ],
  plugins: [
    external(),
    ...(isProduction
      ? [
          del({
            targets: ['./dist/'],
          }),
        ]
      : []),
    babel({
      exclude: '**/node_modules/**',
      runtimeHelpers: true,
    }),
    resolve(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    cjs(),
    ...(isProduction
      ? [
          sizeSnapshot(),
          minify({
            comments: false,
          }),
        ]
      : []),
    visualizer({ filename: './statistics.html' }),
  ],
};

export default config;
