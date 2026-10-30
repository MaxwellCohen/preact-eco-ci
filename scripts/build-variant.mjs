// Usage: node scripts/build-variant.mjs <variant>
// Read-only: shallow-clones the pinned repos over https, packs them, builds the demo.
// Nothing is ever pushed to or opened against the cloned repos.
import { execFileSync } from 'node:child_process';
import { existsSync, cpSync, mkdirSync, readFileSync, rmSync, writeFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const name = process.argv[2];
const versions = JSON.parse(readFileSync('versions.json', 'utf8'));
const v = versions[name];
if (!v) throw new Error(`unknown variant "${name}". Known: ${Object.keys(versions).join(', ')}`);

const root = resolve('.');
const out = join(root, '.build', name);
const src = join(root, '.cache', name);
const env = { ...process.env, PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: '1' };
const run = (cmd, args, cwd, extra = {}) => execFileSync(cmd, args, { cwd, stdio: 'inherit', env: { ...env, ...extra } });

rmSync(out, { recursive: true, force: true });
rmSync(src, { recursive: true, force: true });
mkdirSync(src, { recursive: true });
mkdirSync(out, { recursive: true });

const tarballs = {};
for (const [key, { repo, ref }] of Object.entries(v)) {
  const dir = join(src, key);
  run('git', ['clone', '--depth', '1', '--branch', ref, `https://github.com/${repo}.git`, dir]);
  const sha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: dir }).toString().trim();
  const pnpm = existsSync(join(dir, 'pnpm-lock.yaml'));
  run(pnpm ? 'pnpm' : 'npm', pnpm ? ['install', '--frozen-lockfile', '--ignore-scripts'] : ['install', '--ignore-scripts', '--no-audit', '--no-fund'], dir);
  run(pnpm ? 'pnpm' : 'npm', ['run', 'build'], dir);
  // some forks run `prepare` (husky/playwright) on pack even with --ignore-scripts; we already built above
  const cp = join(dir, 'package.json');
  const cpkg = JSON.parse(readFileSync(cp, 'utf8'));
  for (const h of ['prepare', 'prepack', 'prepublishOnly']) delete cpkg.scripts?.[h];
  writeFileSync(cp, JSON.stringify(cpkg, null, 2));
  run('npm', ['pack', '--ignore-scripts', '--pack-destination', src], dir, { npm_config_ignore_scripts: 'true' });
  const tgz = readdirSync(src).find(f => f.endsWith('.tgz') && !Object.values(tarballs).some(t => t.file === f));
  tarballs[key] = { file: tgz, repo, ref, sha };
}

cpSync(join(root, 'demos/streaming'), out, { recursive: true });
const pkgPath = join(out, 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
pkg.dependencies.preact = `file:${join(src, tarballs.preact.file)}`;
pkg.dependencies['preact-render-to-string'] = `file:${join(src, tarballs.rts.file)}`;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
writeFileSync(join(out, 'src/version.json'), JSON.stringify({ variant: name, ...tarballs }, null, 2));

const wr = join(out, 'wrangler.jsonc');
writeFileSync(wr, readFileSync(wr, 'utf8').replace('__NAME__', `preact-eco-${name}`));

run('npm', ['install', '--no-audit', '--no-fund'], out);
run('npm', ['run', 'build'], out);
console.log(`\nbuilt ${name} -> ${out}`);
