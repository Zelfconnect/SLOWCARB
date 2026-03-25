import { spawn, spawnSync } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';

const HOST = '127.0.0.1';
const PORT = 4173;
const LOCAL_URL = `http://${HOST}:${PORT}`;
const BASE_URL = process.env.LANDING_URL ?? LOCAL_URL;
const OUTPUT_DIR = path.resolve('output/playwright/landing-rules-scroll');
const SNAP_TARGET_OFFSET = 16;
const SNAP_ALIGN_TOLERANCE = 24;
const RULE_TITLES = [
  'Vermijd "witte" koolhydraten',
  'Eet steeds dezelfde maaltijden',
  'Drink geen calorieën',
  'Eet geen fruit',
  'Eén cheatday per week',
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function isServerReady(url) {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForServer(url, timeoutMs = 30000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    if (await isServerReady(url)) {
      return;
    }

    await sleep(500);
  }

  throw new Error(`Timed out waiting for ${url}`);
}

function startLocalServer() {
  if (process.env.LANDING_URL) {
    return null;
  }

  if (process.platform === 'win32') {
    return spawn(
      'cmd.exe',
      ['/c', `npm run dev -- --host ${HOST} --port ${PORT} --strictPort`],
      {
        cwd: process.cwd(),
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
  }

  return spawn(
    'npm',
    ['run', 'dev', '--', '--host', HOST, '--port', String(PORT), '--strictPort'],
    {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
}

function stopLocalServer(server) {
  if (!server?.pid) {
    return;
  }

  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/pid', String(server.pid), '/t', '/f'], {
      stdio: 'ignore',
    });
    return;
  }

  server.kill('SIGTERM');
}

async function getAlignedRuleSnapshot(page) {
  return page.evaluate(({ offset, tolerance }) => {
    const anchors = Array.from(document.querySelectorAll('[data-rule-anchor]')).map((anchor) => {
      const element = anchor;
      return {
        number: element.getAttribute('data-rule-anchor'),
        title: element.querySelector('h3')?.textContent?.trim() ?? '',
        top: Math.round(element.getBoundingClientRect().top),
      };
    });

    const aligned = anchors.filter((anchor) => Math.abs(anchor.top - offset) <= tolerance);

    return {
      aligned,
      anchors,
      scrollY: Math.round(window.scrollY),
    };
  }, { offset: SNAP_TARGET_OFFSET, tolerance: SNAP_ALIGN_TOLERANCE });
}

async function waitForAlignedRule(page, expectedTitle) {
  try {
    await page.waitForFunction(
      ({ title, offset, tolerance }) => {
        const alignedAnchors = Array.from(document.querySelectorAll('[data-rule-anchor]'))
          .map((anchor) => {
            const element = anchor;
            return {
              title: element.querySelector('h3')?.textContent?.trim() ?? '',
              top: element.getBoundingClientRect().top,
            };
          })
          .filter((anchor) => Math.abs(anchor.top - offset) <= tolerance);

        return alignedAnchors.length === 1 && alignedAnchors[0].title === title;
      },
      {
        title: expectedTitle,
        offset: SNAP_TARGET_OFFSET,
        tolerance: SNAP_ALIGN_TOLERANCE,
      },
      { timeout: 6000 },
    );
  } catch (error) {
    const snapshot = await getAlignedRuleSnapshot(page);
    throw new Error(
      `Expected "${expectedTitle}" to align within tolerance. Snapshot: ${JSON.stringify(snapshot)}`,
      { cause: error },
    );
  }

  const snapshot = await getAlignedRuleSnapshot(page);
  if (snapshot.aligned.length !== 1 || snapshot.aligned[0].title !== expectedTitle) {
    throw new Error(`Expected "${expectedTitle}" to align, received ${JSON.stringify(snapshot)}`);
  }

  return snapshot;
}

async function scrollToRule(page, ruleNumber) {
  await page.evaluate(
    ({ number, offset }) => {
      const anchor = document.querySelector(`[data-rule-anchor="${number}"]`);
      if (!(anchor instanceof HTMLElement)) {
        throw new Error(`Missing rule anchor ${number}`);
      }

      window.scrollTo({
        top: anchor.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'auto',
      });
    },
    { number: ruleNumber, offset: SNAP_TARGET_OFFSET },
  );
}

async function applyBurst(page, direction) {
  await page.evaluate(({ delta }) => {
    window.scrollBy({
      top: delta,
      behavior: 'auto',
    });
  }, { delta: direction === 'down' ? 700 : -700 });
}

async function captureRule(page, filename) {
  await page.screenshot({
    path: path.join(OUTPUT_DIR, filename),
    fullPage: false,
  });
}

async function prepareAtRule(page, ruleNumber) {
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);
  await scrollToRule(page, 1);
  await waitForAlignedRule(page, RULE_TITLES[0]);
  await page.waitForTimeout(260);

  for (let currentRule = 2; currentRule <= ruleNumber; currentRule += 1) {
    await applyBurst(page, 'down');
    await waitForAlignedRule(page, RULE_TITLES[currentRule - 1]);
    await page.waitForTimeout(260);
  }
}

async function run() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const server = startLocalServer();
  const serverLogs = [];

  if (server) {
    server.stdout?.on('data', (chunk) => {
      serverLogs.push(chunk.toString());
    });
    server.stderr?.on('data', (chunk) => {
      serverLogs.push(chunk.toString());
    });
  }

  try {
    await waitForServer(BASE_URL);

    const browser = await chromium.launch({ headless: true });
    try {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
      });
      const page = await context.newPage();

      await prepareAtRule(page, 1);
      const initialSnapshot = await getAlignedRuleSnapshot(page);
      await captureRule(page, '01-rule-1.png');
      console.log('Aligned:', JSON.stringify(initialSnapshot));
      await page.waitForTimeout(260);

      for (let index = 1; index < RULE_TITLES.length; index += 1) {
        await applyBurst(page, 'down');
        const snapshot = await waitForAlignedRule(page, RULE_TITLES[index]);
        await captureRule(page, `0${index + 1}-down-rule-${index + 1}.png`);
        console.log('Aligned:', JSON.stringify(snapshot));
        await page.waitForTimeout(260);
      }

      for (let startRule = RULE_TITLES.length; startRule >= 2; startRule -= 1) {
        await scrollToRule(page, startRule);
        await waitForAlignedRule(page, RULE_TITLES[startRule - 1]);
        await page.waitForTimeout(260);
        await applyBurst(page, 'up');
        const snapshot = await waitForAlignedRule(page, RULE_TITLES[startRule - 2]);
        await captureRule(page, `up-rule-${startRule - 1}.png`);
        console.log('Aligned:', JSON.stringify(snapshot));
        await page.waitForTimeout(260);
      }

      await browser.close();
    } catch (error) {
      await browser.close();
      throw error;
    }
  } catch (error) {
    if (serverLogs.length > 0) {
      console.error(serverLogs.join(''));
    }
    throw error;
  } finally {
    stopLocalServer(server);
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
