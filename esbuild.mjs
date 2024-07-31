import * as esbuild from 'esbuild'

await esbuild.build({
  entryPoints: ['src/game.ts'],
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['esnext'],
  outfile: 'out.js',
})
