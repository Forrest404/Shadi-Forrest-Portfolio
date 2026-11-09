# Shadi Forrest Portfolio

My portfolio: films on the Media page, devices, software and web products on the Tech page.

Live: https://forrest404.github.io/Shadi-Forrest-Portfolio/

Built with Astro, plain CSS and a little TypeScript. Fonts are self-hosted.

```bash
npm install
npm run dev      # http://localhost:4321/Shadi-Forrest-Portfolio/
npm run build    # static site in dist/
```

The site is served under `/Shadi-Forrest-Portfolio/` (see `astro.config.mjs`). Root-relative paths go through `u()` in `src/lib/url.ts` so they pick up that prefix.

Content lives in `src/data/` (projects, films, links). Scripts in `scripts/` cut the film loops, build the Tech images and take screenshots.
