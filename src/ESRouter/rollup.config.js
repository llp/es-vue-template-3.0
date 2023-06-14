import resolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';

const cjs = require('rollup-plugin-commonjs');
const node = require('rollup-plugin-node-resolve');
const buble = require('rollup-plugin-buble');
const replace = require('rollup-plugin-replace');
const flow = require('rollup-plugin-flow-no-whitespace');


const path = require('path');

function resolveVue(p) {
  return path.resolve(__dirname, '../../node_modules/vue/src/', p);
}

function resolvePackage(src, extra = 'src') {
  return path.resolve(__dirname, '../packages/', src, extra);
}


export default {
  input: 'src/index.js',
  output: {
    file: './dist/index.js',
    format: 'es',
  },
  plugins: [
    resolve(),
    flow(),
    // buble({
    //   objectAssign: 'Object.assign',
    //   transforms: {
    //     arrow: true,
    //     modules: false,
    //     dangerousForOf: true,
    //   },
    // }),
    alias({
      entries: [
        {find: '@vue', replacement: '../../node_modules/@huantv/vue/src'},
        {find: 'shared', replacement: resolveVue('shared')},
      ]
    }),
    node({
      preferBuiltins: true,
    }),
    cjs(),
  ],
  external: ['@extscreen/es-log', '@extscreen/es-core']
};
