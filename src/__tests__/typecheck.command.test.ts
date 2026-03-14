import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const currentFilePath = fileURLToPath(import.meta.url);
const projectRoot = resolve(dirname(currentFilePath), '..', '..');

describe('typecheck command', () => {
  it(
    'runs successfully',
    () => {
      const output = execFileSync('npx', ['tsc', '--noEmit'], {
        cwd: projectRoot,
        encoding: 'utf8',
        stdio: 'pipe',
      });

      expect(output).toBe('');
    },
    120_000
  );
});
