import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  entry: 'src/app.js',
  format: 'iife',
  plugins: [
    babel(),
    nodeResolve({ jsnext: true, main: true }),
    commonjs()
  ]
}
