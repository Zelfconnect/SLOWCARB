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
const SNAP_ALIGN_TOLERANCE = 28;
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

async function getRailState(page, label) {
  return page.evaluate(({ label, tolerance }) => {
    const rail = document.querySelector('[data-rules-rail="rules"]');
    if (!(rail instanceof HTMLElement)) {
      throw new Error('Missing rules rail');
    }

    const railRect = rail.getBoundingClientRect();
    const panels = Array.from(rail.querySelectorAll('[data-rule-panel]')).map((panel) => {
      const element = panel;
      return {
        number: element.getAttribute('data-rule-panel'),
        title: element.querySelector('h3')?.textContent?.trim() ?? '',
        top: Math.round(element.getBoundingClientRect().top - railRect.top),
      };
    });

    const aligned = panels.filter((panel) => Math.abs(panel.top) <= tolerance);

    return {
      label,
      guided: rail.getAttribute('data-guided-scroll'),
      pageScrollY: Math.round(window.scrollY),
      railScrollTop: Math.round(rail.scrollTop),
      railScrollHeight: Math.round(rail.scrollHeight),
      railClientHeight: Math.round(rail.clientHeight),
      panels,
      aligned,
    };
  }, { label, tolerance: SNAP_ALIGN_TOLERANCE });
}

function getAlignedRule(state) {
  return state.aligned[0]?.number ?? null;
}

function assertAlignedRule(state, expectedRule, message) {
  const alignedRule = getAlignedRule(state);
  if (alignedRule !== String(expectedRule)) {
    throw new Error(`${message}. Snapshot: ${JSON.stringify(state)}`);
  }
}

function assertNoPostSettleDrift(states, expectedRule, message) {
  const alignedRules = states.map((state) => getAlignedRule(state));
  const firstSettledIndex = alignedRules.findIndex((rule) => rule === String(expectedRule));

  if (firstSettledIndex === -1) {
    throw new Error(`${message}. Never aligned to rule ${expectedRule}. Timeline: ${JSON.stringify(states)}`);
  }

  for (let index = firstSettledIndex; index < alignedRules.length; index += 1) {
    if (alignedRules[index] !== String(expectedRule)) {
      throw new Error(`${message}. Drifted after settling. Timeline: ${JSON.stringify(states)}`);
    }
  }
}

async function waitForAlignedRule(page, expectedRule, timeoutMs = 6000) {
  try {
    await page.waitForFunction(
      ({ expectedRule, tolerance }) => {
        const rail = document.querySelector('[data-rules-rail="rules"]');
        if (!(rail instanceof HTMLElement)) {
          return false;
        }

        const railRect = rail.getBoundingClientRect();
        const alignedPanels = Array.from(rail.querySelectorAll('[data-rule-panel]'))
          .map((panel) => {
            const element = panel;
            return {
              number: element.getAttribute('data-rule-panel'),
              top: Math.round(element.getBoundingClientRect().top - railRect.top),
            };
          })
          .filter((panel) => Math.abs(panel.top) <= tolerance);

        return alignedPanels.length === 1 && alignedPanels[0].number === String(expectedRule);
      },
      { expectedRule, tolerance: SNAP_ALIGN_TOLERANCE },
      { timeout: timeoutMs },
    );
  } catch (error) {
    const state = await getRailState(page, `waitForAlignedRule:${expectedRule}`);
    throw new Error(`Failed waiting for rule ${expectedRule} alignment. Snapshot: ${JSON.stringify(state)}`, { cause: error });
  }
}

async function prepareRail(page) {
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    const rail = document.querySelector('[data-rules-rail="rules"]');
    if (!(rail instanceof HTMLElement)) {
      throw new Error('Missing rules rail');
    }

    rail.scrollIntoView({
      behavior: 'auto',
      block: 'start',
    });
  });
  await page.waitForTimeout(600);

  const state = await getRailState(page, 'after-prepare');
  if (state.guided !== 'true') {
    throw new Error(`Guided rail is disabled. Snapshot: ${JSON.stringify(state)}`);
  }
}

async function setRailToRule(page, ruleNumber) {
  await page.evaluate((ruleNumber) => {
    const rail = document.querySelector('[data-rules-rail="rules"]');
    if (!(rail instanceof HTMLElement)) {
      throw new Error('Missing rules rail');
    }

    const panel = rail.querySelector(`[data-rule-panel="${ruleNumber}"]`);
    if (!(panel instanceof HTMLElement)) {
      throw new Error(`Missing rule panel ${ruleNumber}`);
    }

    rail.scrollTo({
      top: panel.offsetTop,
      behavior: 'auto',
    });
  }, ruleNumber);
  await waitForAlignedRule(page, ruleNumber);
  await page.waitForTimeout(300);
}

async function getRailGestureBox(page) {
  const rail = page.locator('[data-rules-rail="rules"][data-guided-scroll="true"]');
  const box = await rail.boundingBox();

  if (!box) {
    throw new Error('Unable to resolve rules rail bounding box');
  }

  return {
    startX: box.x + box.width / 2,
    startYDown: box.y + box.height * 0.78,
    endYDown: box.y + box.height * 0.2,
    startYUp: box.y + box.height * 0.22,
    endYUp: box.y + box.height * 0.8,
  };
}

async function performTouchSwipe(client, coordinates) {
  const { startX, startY, endY } = coordinates;

  await client.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: startX, y: startY }],
  });

  const steps = 3;
  for (let step = 1; step <= steps; step += 1) {
    const progress = step / steps;
    const y = startY + (endY - startY) * progress;

    await client.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: startX, y }],
    });

    await sleep(8);
  }

  await client.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  });
}

async function swipeToNextRule(page, client) {
  const box = await getRailGestureBox(page);
  await performTouchSwipe(client, {
    startX: box.startX,
    startY: box.startYDown,
    endY: box.endYDown,
  });
}

async function swipeToPreviousRule(page, client) {
  const box = await getRailGestureBox(page);
  await performTouchSwipe(client, {
    startX: box.startX,
    startY: box.startYUp,
    endY: box.endYUp,
  });
}

async function captureTimeline(page, prefix) {
  const states = [];
  let elapsed = 0;

  for (const checkpoint of TIMELINE_CHECKPOINTS_MS) {
    await page.waitForTimeout(checkpoint - elapsed);
    elapsed = checkpoint;
    states.push(await getRailState(page, `${prefix}-${checkpoint}ms`));
  }

  return states;
}

async function assertSwipeSequence(page, client, {
  startRule,
  expectedRule,
  direction,
  viewportLabel,
}) {
  await setRailToRule(page, startRule);
  const beforeState = await getRailState(page, `${viewportLabel}-${direction}-before-${startRule}`);
  assertAlignedRule(beforeState, startRule, `${viewportLabel} failed to start on rule ${startRule}`);

  if (direction === 'next') {
    await swipeToNextRule(page, client);
  } else {
    await swipeToPreviousRule(page, client);
  }

  const timeline = await captureTimeline(page, `${viewportLabel}-${direction}-${startRule}-to-${expectedRule}`);
  const finalState = timeline[timeline.length - 1];

  assertAlignedRule(finalState, expectedRule, `${viewportLabel} ${direction} swipe landed on the wrong rule`);
  assertNoPostSettleDrift(timeline, expectedRule, `${viewportLabel} ${direction} swipe drifted after settling`);

  return timeline;
}

async function assertBoundaryRelease(page, client, {
  startRule,
  direction,
  viewportLabel,
}) {
  await setRailToRule(page, startRule);
  const beforeState = await getRailState(page, `${viewportLabel}-${direction}-boundary-before`);
  const beforePageScrollY = beforeState.pageScrollY;
  const beforeRailScrollTop = beforeState.railScrollTop;

  if (direction === 'next') {
    await swipeToNextRule(page, client);
  } else {
    await swipeToPreviousRule(page, client);
  }

  const timeline = await captureTimeline(page, `${viewportLabel}-${direction}-boundary`);
  const finalState = timeline[timeline.length - 1];

  assertAlignedRule(finalState, startRule, `${viewportLabel} boundary swipe should keep the boundary rule aligned`);

  if (direction === 'next') {
    if (finalState.pageScrollY <= beforePageScrollY) {
      throw new Error(`${viewportLabel} last-rule release did not continue the page scroll. Timeline: ${JSON.stringify(timeline)}`);
    }
    if (finalState.railScrollTop < beforeRailScrollTop) {
      throw new Error(`${viewportLabel} last-rule release moved the rail backward. Timeline: ${JSON.stringify(timeline)}`);
    }
    return;
  }

  if (finalState.pageScrollY >= beforePageScrollY) {
    throw new Error(`${viewportLabel} first-rule release did not move back into the page intro. Timeline: ${JSON.stringify(timeline)}`);
  }
  if (finalState.railScrollTop > beforeRailScrollTop) {
    throw new Error(`${viewportLabel} first-rule release moved the rail away from the first rule. Timeline: ${JSON.stringify(timeline)}`);
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
    await prepareRail(page);
    return await callback({ page, client });
  } finally {
    await context.close();
  }
}

async function runViewportScenario(browser, viewportConfig) {
  await withPreparedViewport(browser, viewportConfig, async ({ page }) => {
    await captureViewportArtifacts(page, viewportConfig.label, 'prepared');
  });

  const downToRule2 = await withPreparedViewport(browser, viewportConfig, async ({ page, client }) =>
    assertSwipeSequence(page, client, {
      startRule: 1,
      expectedRule: 2,
      direction: 'next',
      viewportLabel: viewportConfig.label,
    }),
  );
  console.log('Timeline:', JSON.stringify(downToRule2));

  const downToRule3 = await withPreparedViewport(browser, viewportConfig, async ({ page, client }) =>
    assertSwipeSequence(page, client, {
      startRule: 2,
      expectedRule: 3,
      direction: 'next',
      viewportLabel: viewportConfig.label,
    }),
  );
  console.log('Timeline:', JSON.stringify(downToRule3));

  const upToRule2 = await withPreparedViewport(browser, viewportConfig, async ({ page, client }) =>
    assertSwipeSequence(page, client, {
      startRule: 3,
      expectedRule: 2,
      direction: 'previous',
      viewportLabel: viewportConfig.label,
    }),
  );
  console.log('Timeline:', JSON.stringify(upToRule2));

  const upToRule1 = await withPreparedViewport(browser, viewportConfig, async ({ page, client }) =>
    assertSwipeSequence(page, client, {
      startRule: 2,
      expectedRule: 1,
      direction: 'previous',
      viewportLabel: viewportConfig.label,
    }),
  );
  console.log('Timeline:', JSON.stringify(upToRule1));

  await withPreparedViewport(browser, viewportConfig, async ({ page, client }) => {
    await assertBoundaryRelease(page, client, {
      startRule: 1,
      direction: 'previous',
      viewportLabel: viewportConfig.label,
    });
  });

  await withPreparedViewport(browser, viewportConfig, async ({ page, client }) => {
    await assertBoundaryRelease(page, client, {
      startRule: 5,
      direction: 'next',
      viewportLabel: viewportConfig.label,
    });
    await captureViewportArtifacts(page, viewportConfig.label, 'complete');
  });
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
        console.log(`Running rules rail QA for ${viewportConfig.label}`);
        await runViewportScenario(browser, viewportConfig);
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
