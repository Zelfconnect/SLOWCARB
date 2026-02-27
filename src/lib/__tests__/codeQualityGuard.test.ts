import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

const SRC_DIR = join(process.cwd(), 'src');
const CODE_EXTENSIONS = new Set(['.ts', '.tsx']);

function collectCodeFiles(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...collectCodeFiles(fullPath));
      continue;
    }

    if (CODE_EXTENSIONS.has(extname(entry))) {
      files.push(fullPath);
    }
  }

  return files;
}

describe('code quality guardrails', () => {
  it('contains no TODO comments in src TypeScript files', () => {
    const offenders = collectCodeFiles(SRC_DIR).filter(file =>
      /\/\/\s*TODO\b/.test(readFileSync(file, 'utf8'))
    );

    expect(offenders).toEqual([]);
  });

  it('contains no explicit any types in src TypeScript files', () => {
    const anyTypePattern = /:\s*any\b|<\s*any\s*>|\bas\s+any\b/;

    const offenders = collectCodeFiles(SRC_DIR).filter(file =>
      anyTypePattern.test(readFileSync(file, 'utf8'))
    );

    expect(offenders).toEqual([]);
  });

  it('contains no console statements in src TypeScript files', () => {
    const consolePattern = /\bconsole\.(log|info|warn|error|debug)\s*\(/;

    const offenders = collectCodeFiles(SRC_DIR).filter(file =>
      consolePattern.test(readFileSync(file, 'utf8'))
    );

    expect(offenders).toEqual([]);
  });
});
