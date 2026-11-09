// Refreshes star counts at build time. If GitHub can't be reached, the last
// known counts in src/data/stars.json are kept and the build carries on.
import { readFileSync, writeFileSync } from 'node:fs';
const file = 'src/data/stars.json';
const stars = JSON.parse(readFileSync(file, 'utf8'));
for (const repo of Object.keys(stars)) {
  try {
    const res = await fetch(`https://api.github.com/repos/Forrest404/${repo}`, {
      headers: { 'User-Agent': 'shadi-forrest-site-build' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    stars[repo] = (await res.json()).stargazers_count;
  } catch (err) {
    console.warn(`stars: keeping ${repo}=${stars[repo]} (${err.message})`);
  }
}
writeFileSync(file, JSON.stringify(stars, null, 2) + '\n');
