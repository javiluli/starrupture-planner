const fs = require('fs')
const path = require('path')

const root = process.cwd()
const srcSans = path.join(root, 'node_modules', 'geist', 'dist', 'fonts', 'geist-sans', 'Geist-Variable.woff2')
const srcMono = path.join(root, 'node_modules', 'geist', 'dist', 'fonts', 'geist-mono', 'GeistMono-Variable.woff2')
const destDir = path.join(root, 'public', 'fonts', 'geist')

if (!fs.existsSync(srcSans) || !fs.existsSync(srcMono)) {
  console.error('Geist font files not found. Did you install the geist package?')
  process.exit(1)
}

fs.mkdirSync(destDir, { recursive: true })
fs.copyFileSync(srcSans, path.join(destDir, 'Geist-Variable.woff2'))
fs.copyFileSync(srcMono, path.join(destDir, 'GeistMono-Variable.woff2'))

console.log('Geist fonts copied to public/fonts/geist')
