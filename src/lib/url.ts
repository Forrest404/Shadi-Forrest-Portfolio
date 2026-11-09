// Prefixes root-relative paths with the site's base, so the site works both at
// the root of a domain and under a GitHub Pages project path.
export const u = (path: string) => import.meta.env.BASE_URL.replace(/\/$/, '') + path;
