import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

/*
 * Arma dist/404.html a partir del index ya construido. Vercel lo sirve con
 * estado 404 en cualquier ruta que no exista (vercel.json ya no reescribe todo
 * a index.html). Antes cualquier URL inventada respondía 200 con el home, y
 * para Google eran páginas duplicadas.
 *
 * Es la misma app (React Router pinta la página de Error), pero con noindex,
 * sin canonical y con un texto de 404 en lugar del resumen del home para
 * quien no ejecuta JavaScript.
 */
const pagina404 = () => ({
  name: 'airhive-404',
  apply: 'build',
  closeBundle() {
    const dist = path.resolve('dist')
    let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
    const inicio = html.indexOf('<div id="root">')
    const fin = html.indexOf('<!-- /root')
    if (inicio < 0 || fin < 0) throw new Error('404.html: no encontré <div id="root"> o el marcador /root en index.html')
    html =
      html.slice(0, inicio) +
      '<div id="root">\n      <main>\n        <h1>Página no encontrada</h1>\n        <p>La página que buscas no existe. <a href="/">Volver a Air Hive</a>.</p>\n      </main>\n    </div>\n    ' +
      html.slice(fin)
    html = html
      .replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="noindex, follow" />')
      .replace(/<link rel="canonical"[^>]*>\s*/, '')
      .replace(/<title>[^<]*<\/title>/, '<title>Página no encontrada | Air Hive</title>')
    fs.writeFileSync(path.join(dist, '404.html'), html)
  },
})

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    pagina404(),
  ],
  build: {
    outDir: 'dist',
  },
})
