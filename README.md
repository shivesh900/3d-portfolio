# Shivesh Haran P · 3D Interactive Developer Portfolio

**Live:** https://shivesh900.github.io/3d-portfolio/

A neon, low-poly developer room you can explore in the browser:

- **Floating holographic project panels**: tap one to open the details, stack, code and live links.
- **NOVA, a holographic AI assistant**: ask it about projects, skills, education or contact info. It runs entirely in the browser using intent matching and entity detection over the portfolio data, with typed hologram-style replies. No API key, no server.
- **Room objects**: the monitors (about me + skills radar), the certification shelf, the education board and the tech-stack wall.
- **Recruiter quick view**: a fast 2D page with a summary, education, experience, projects, skills, coursework, GitHub stats and a resume download. It opens automatically when WebGL isn't available. Link straight to it with `#quick`.

## Tech
Three.js (procedural low-poly scene, canvas-generated textures, optional bloom on capable devices), vanilla JS, esbuild. No external assets or fonts. The whole 3D bundle is about 140 KB gzipped, and the quick view loads without it.

Performance: pixel ratio is capped, bloom is desktop-only, quality drops automatically if the frame rate is low, and rendering pauses when the tab is hidden or the quick view is open.

## Edit the content
Everything (projects, skills, links, education, and what the assistant knows) lives in **`docs/data.js`**. Edit it and push. No build needed for content changes.

## Develop
```bash
npm install
npm run build        # bundles src/ -> docs/js/
npm test             # node --test
python3 -m http.server -d docs 8000
```
GitHub Pages serves the `docs/` folder on `main`.
