import babel   from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
// import browserify from 'rollup-plugin-browserify-transform'

export default {
  entry: 'src/app.js',
  dest: 'dist/bundle.js',
  format: 'umd',
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    babel()
  ]
}
