import { execSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const currentFilePath = fileURLToPath(import.meta.url);
const projectRoot = resolve(dirname(currentFilePath), '..', '..');

describe('typecheck command', () => {
  it(
    'runs successfully',
    () => {
      const output = execSync('npx tsc --noEmit', {
        cwd: projectRoot,
        encoding: 'utf8',
        shell: true,
      });

      expect(output).toBe('');
    },
    120_000
  );
});
