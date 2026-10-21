import {readdirSync, readFileSync} from 'node:fs';
import {join, relative, resolve} from 'node:path';

const root = resolve(process.cwd());
const allowed = new Set([
  '.github/workflows/public-smoke.yml',
  'README.md',
  'fixtures/sample.json',
  'src/validator.mjs',
  'test/validator.test.mjs',
  'scripts/check-public-safe.mjs'
]);
function walk(dir) {
  const output = [];
  for (const entry of readdirSync(dir, {withFileTypes: true})) {
    if (entry.name === '.git') continue;
    const filename = join(dir, entry.name);
    if (entry.isSymbolicLink()) throw new Error('Symlinks are not allowed');
    if (entry.isDirectory()) output.push(...walk(filename));
    else output.push(relative(root, filename).replaceAll('\\', '/'));
  }
  return output;
}

const found = walk(root);
if (found.length !== allowed.size || found.some(file => !allowed.has(file))) {
  throw new Error('Unexpected files. Never copy private files or Git history to public repository.');
}
const forbidden = [
  /gh[pousr]_[A-Za-z0-9]{20,}/,
  /github_pat_[A-Za-z0-9_]{20,}/,
  /-----BEGIN [A-Z ]+ PRIVATE KEY-----/,
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/,
  /\b[A-Za-z]:\\Users\\/i
];
for (const file of found) {
  const content = readFileSync(join(root, file), 'utf8');
  if (forbidden.some(pattern => pattern.test(content))) {
    throw new Error('Possible sensitive content in public fixture: ' + file);
  }
}
console.log('PASS: public-only allowlist and basic secret-pattern scan');
