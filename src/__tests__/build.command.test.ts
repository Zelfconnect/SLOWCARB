import { execSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const currentFilePath = fileURLToPath(import.meta.url);
const projectRoot = resolve(dirname(currentFilePath), '..', '..');

describe('production build command', () => {
  it(
    'runs successfully',
    () => {
      const buildOutput = execSync('npm run build', {
        cwd: projectRoot,
        encoding: 'utf8',
        shell: true,
      });

      expect(buildOutput).toContain('vite v');
    },
    120_000
  );
});
