import { spawn, spawnSync } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { chromium, devices } from 'playwright';

const HOST = '127.0.0.1';
const PORT = 4173;
const LOCAL_URL = `http://${HOST}:${PORT}`;
const BASE_URL = process.env.LANDING_URL ?? LOCAL_URL;
const OUTPUT_DIR = path.resolve('output/playwright/landing-rules-scroll');
const SNAP_ALIGN_TOLERANCE = 32;
const TIMELINE_CHECKPOINTS_MS = [150, 400, 800, 1800];
const VIEWPORTS = [
  {
    label: '390x844',
    contextOptions: {
      ...devices['iPhone 13'],
      viewport: { width: 390, height: 844 },
    },
  },
  {
    label: '390x664',
    contextOptions: {
      ...devices['iPhone 13'],
    },
  },
];
const DESKTOP_VIEWPORT = {
  label: '1024x900',
  contextOptions: {
    viewport: { width: 1024, height: 900 },
    isMobile: false,
    hasTouch: false,
  },
};

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

function describeMarker(marker) {
  return marker.kind === 'rule' ? `rule:${marker.rule}` : marker.kind;
}

async function getSnapState(page, label) {
  return page.evaluate(({ label, tolerance }) => {
    const markers = Array.from(document.querySelectorAll('[data-method-snap]')).map((element) => {
      const htmlElement = element;
      const rect = htmlElement.getBoundingClientRect();

      return {
        kind: htmlElement.getAttribute('data-method-snap'),
        rule: htmlElement.getAttribute('data-rule-panel'),
        top: Math.round(rect.top),
        height: Math.round(rect.height),
      };
    });

    const aligned = markers.filter((marker) => Math.abs(marker.top) <= tolerance);
    const founderTop = document.getElementById('founder')?.getBoundingClientRect().top ?? null;

    return {
      label,
      htmlSnap: document.documentElement.getAttribute('data-landing-method-snap'),
      bodySnap: document.body.getAttribute('data-landing-method-snap'),
      pageScrollY: Math.round(window.scrollY),
      founderTop: founderTop === null ? null : Math.round(founderTop),
      markers,
      aligned,
    };
  }, { label, tolerance: SNAP_ALIGN_TOLERANCE });
}

function getAlignedTarget(state) {
  const marker = state.aligned[0];
  return marker ? describeMarker(marker) : null;
}

function assertAlignedTarget(state, expectedTarget, message) {
  const alignedTarget = getAlignedTarget(state);
  if (alignedTarget !== expectedTarget) {
    throw new Error(`${message}. Snapshot: ${JSON.stringify(state)}`);
  }
}

function assertNoPostSettleDrift(states, expectedTarget, message) {
  const alignedTargets = states.map((state) => getAlignedTarget(state));
  const firstSettledIndex = alignedTargets.findIndex((target) => target === expectedTarget);

  if (firstSettledIndex === -1) {
    throw new Error(`${message}. Never aligned to ${expectedTarget}. Timeline: ${JSON.stringify(states)}`);
  }

  for (let index = firstSettledIndex; index < alignedTargets.length; index += 1) {
    if (alignedTargets[index] !== expectedTarget) {
      throw new Error(`${message}. Drifted after settling. Timeline: ${JSON.stringify(states)}`);
    }
  }
}

function selectorForTarget(target) {
  if (target === 'intro') {
    return '[data-method-snap="intro"]';
  }

  if (target === 'release') {
    return '[data-method-snap="release"]';
  }

  if (target.startsWith('rule:')) {
    return `[data-rule-panel="${target.split(':')[1]}"]`;
  }

  throw new Error(`Unsupported target ${target}`);
}

async function waitForAlignedTarget(page, expectedTarget, timeoutMs = 6000) {
  try {
    await page.waitForFunction(
      ({ expectedTarget, tolerance }) => {
        const markers = Array.from(document.querySelectorAll('[data-method-snap]'))
          .map((element) => {
            const htmlElement = element;
            const rect = htmlElement.getBoundingClientRect();
            return {
              kind: htmlElement.getAttribute('data-method-snap'),
              rule: htmlElement.getAttribute('data-rule-panel'),
              top: Math.round(rect.top),
            };
          })
          .filter((marker) => Math.abs(marker.top) <= tolerance);

        if (markers.length !== 1) {
          return false;
        }

        const marker = markers[0];
        const target = marker.kind === 'rule' ? `rule:${marker.rule}` : marker.kind;
        return target === expectedTarget;
      },
      { expectedTarget, tolerance: SNAP_ALIGN_TOLERANCE },
      { timeout: timeoutMs },
    );
  } catch (error) {
    const state = await getSnapState(page, `waitForAlignedTarget:${expectedTarget}`);
    throw new Error(`Failed waiting for ${expectedTarget}. Snapshot: ${JSON.stringify(state)}`, { cause: error });
  }
}

async function preparePage(page) {
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);

  const state = await getSnapState(page, 'after-load');
  if (state.htmlSnap !== 'true' || state.bodySnap !== 'true') {
    throw new Error(`Landing method snap is disabled. Snapshot: ${JSON.stringify(state)}`);
  }
}

async function setToTarget(page, target) {
  const selector = selectorForTarget(target);
  await page.evaluate((selector) => {
    const element = document.querySelector(selector);
    if (!(element instanceof HTMLElement)) {
      throw new Error(`Missing snap target ${selector}`);
    }

    element.scrollIntoView({
      behavior: 'auto',
      block: 'start',
    });
  }, selector);

  await waitForAlignedTarget(page, target);
  await page.waitForTimeout(300);
}

async function getScrollStep(page) {
  const viewport = page.viewportSize();
  if (!viewport) {
    throw new Error('Missing viewport size');
  }

  return viewport.height;
}

async function swipeDown(page) {
  const step = await getScrollStep(page);
  await page.mouse.wheel(0, step);
}

async function swipeUp(page) {
  const step = await getScrollStep(page);
  await page.mouse.wheel(0, -step);
}

async function captureTimeline(page, prefix) {
  const states = [];
  let elapsed = 0;

  for (const checkpoint of TIMELINE_CHECKPOINTS_MS) {
    await page.waitForTimeout(checkpoint - elapsed);
    elapsed = checkpoint;
    states.push(await getSnapState(page, `${prefix}-${checkpoint}ms`));
  }

  return states;
}

async function assertSwipeSequence(page, {
  startTarget,
  expectedTarget,
  direction,
  viewportLabel,
}) {
  await setToTarget(page, startTarget);
  const beforeState = await getSnapState(page, `${viewportLabel}-${direction}-before-${startTarget}`);
  assertAlignedTarget(beforeState, startTarget, `${viewportLabel} failed to start on ${startTarget}`);

  if (direction === 'down') {
    await swipeDown(page);
  } else {
    await swipeUp(page);
  }

  const timeline = await captureTimeline(page, `${viewportLabel}-${direction}-${startTarget}-to-${expectedTarget}`);
  const finalState = timeline[timeline.length - 1];

  assertAlignedTarget(finalState, expectedTarget, `${viewportLabel} ${direction} swipe landed on the wrong target`);
  assertNoPostSettleDrift(timeline, expectedTarget, `${viewportLabel} ${direction} swipe drifted after settling`);

  return timeline;
}

async function assertReleaseToFounder(page, viewportLabel) {
  await setToTarget(page, 'rule:5');
  await swipeDown(page);

  const timeline = await captureTimeline(page, `${viewportLabel}-release`);
  const finalState = timeline[timeline.length - 1];

  assertAlignedTarget(finalState, 'release', `${viewportLabel} final swipe should align the release target`);

  if (finalState.founderTop === null || finalState.founderTop > 80) {
    throw new Error(`${viewportLabel} final swipe did not reveal the next section cleanly. Timeline: ${JSON.stringify(timeline)}`);
  }
}

async function captureViewportArtifacts(page, viewportLabel, suffix) {
  await page.screenshot({
    path: path.join(OUTPUT_DIR, `${viewportLabel}-${suffix}.png`),
    fullPage: false,
  });
}

async function withPreparedViewport(browser, viewportConfig, callback) {
  const context = await browser.newContext(viewportConfig.contextOptions);
  const page = await context.newPage();
  const client = await context.newCDPSession(page);

  try {
    await preparePage(page);
    return await callback({ page, client });
  } finally {
    await context.close();
  }
}

async function runViewportScenario(browser, viewportConfig) {
  await withPreparedViewport(browser, viewportConfig, async ({ page }) => {
    await setToTarget(page, 'intro');
    await captureViewportArtifacts(page, viewportConfig.label, 'intro');
  });

  const introToRule1 = await withPreparedViewport(browser, viewportConfig, async ({ page }) =>
    assertSwipeSequence(page, {
      startTarget: 'intro',
      expectedTarget: 'rule:1',
      direction: 'down',
      viewportLabel: viewportConfig.label,
    }),
  );
  console.log('Timeline:', JSON.stringify(introToRule1));

  const rule1ToRule2 = await withPreparedViewport(browser, viewportConfig, async ({ page }) =>
    assertSwipeSequence(page, {
      startTarget: 'rule:1',
      expectedTarget: 'rule:2',
      direction: 'down',
      viewportLabel: viewportConfig.label,
    }),
  );
  console.log('Timeline:', JSON.stringify(rule1ToRule2));

  const rule2ToRule3 = await withPreparedViewport(browser, viewportConfig, async ({ page }) =>
    assertSwipeSequence(page, {
      startTarget: 'rule:2',
      expectedTarget: 'rule:3',
      direction: 'down',
      viewportLabel: viewportConfig.label,
    }),
  );
  console.log('Timeline:', JSON.stringify(rule2ToRule3));

  const rule3ToRule2 = await withPreparedViewport(browser, viewportConfig, async ({ page }) =>
    assertSwipeSequence(page, {
      startTarget: 'rule:3',
      expectedTarget: 'rule:2',
      direction: 'up',
      viewportLabel: viewportConfig.label,
    }),
  );
  console.log('Timeline:', JSON.stringify(rule3ToRule2));

  const rule1ToIntro = await withPreparedViewport(browser, viewportConfig, async ({ page }) =>
    assertSwipeSequence(page, {
      startTarget: 'rule:1',
      expectedTarget: 'intro',
      direction: 'up',
      viewportLabel: viewportConfig.label,
    }),
  );
  console.log('Timeline:', JSON.stringify(rule1ToIntro));

  await withPreparedViewport(browser, viewportConfig, async ({ page }) => {
    await assertReleaseToFounder(page, viewportConfig.label);
    await captureViewportArtifacts(page, viewportConfig.label, 'release');
  });
}

async function runDesktopSmoke(browser) {
  const context = await browser.newContext(DESKTOP_VIEWPORT.contextOptions);
  const page = await context.newPage();

  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(1500);

    const state = await getSnapState(page, 'desktop-smoke');
    if (state.htmlSnap !== null || state.bodySnap !== null) {
      throw new Error(`Desktop should not enable landing method snap. Snapshot: ${JSON.stringify(state)}`);
    }
  } finally {
    await context.close();
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
      for (const viewportConfig of VIEWPORTS) {
        console.log(`Running method snap QA for ${viewportConfig.label}`);
        await runViewportScenario(browser, viewportConfig);
      }

      console.log(`Running method snap desktop smoke for ${DESKTOP_VIEWPORT.label}`);
      await runDesktopSmoke(browser);
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
