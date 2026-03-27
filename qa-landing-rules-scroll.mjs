import { spawn, spawnSync } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { chromium, devices } from 'playwright';

const HOST = '127.0.0.1';
const PORT = 4173;
const LOCAL_URL = `http://${HOST}:${PORT}`;
const BASE_URL = process.env.LANDING_URL ?? LOCAL_URL;
const METHOD_URL = `${BASE_URL}#method`;
const OUTPUT_DIR = path.resolve('output/playwright/landing-rules-scroll');
const STEPPER_SELECTOR = '[data-rules-stepper]';
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
      viewport: { width: 390, height: 664 },
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

async function getStepperState(page, label) {
  return page.evaluate((label) => {
    const stepper = document.querySelector('[data-rules-stepper]');
    const method = document.getElementById('method');
    const founder = document.getElementById('founder');

    const stepperRect = stepper?.getBoundingClientRect() ?? null;
    const methodRect = method?.getBoundingClientRect() ?? null;
    const founderRect = founder?.getBoundingClientRect() ?? null;

    return {
      label,
      hasStepper: Boolean(stepper),
      stepperStage: stepper?.getAttribute('data-stepper-stage') ?? null,
      activeRule: stepper?.getAttribute('data-active-rule') ?? null,
      isAnimating: stepper?.getAttribute('data-stepper-animating') ?? null,
      pageScrollY: Math.round(window.scrollY),
      stepperTop: stepperRect ? Math.round(stepperRect.top) : null,
      stepperBottom: stepperRect ? Math.round(stepperRect.bottom) : null,
      methodTop: methodRect ? Math.round(methodRect.top) : null,
      founderTop: founderRect ? Math.round(founderRect.top) : null,
    };
  }, label);
}

function assertStage(state, expectedStage, message) {
  if (state.stepperStage !== expectedStage) {
    throw new Error(`${message}. Snapshot: ${JSON.stringify(state)}`);
  }
}

function assertNoPostSettleDrift(states, expectedStage, message) {
  const stageTimeline = states.map((state) => state.stepperStage);
  const firstSettledIndex = stageTimeline.findIndex((stage) => stage === expectedStage);

  if (firstSettledIndex === -1) {
    throw new Error(`${message}. Never reached ${expectedStage}. Timeline: ${JSON.stringify(states)}`);
  }

  for (let index = firstSettledIndex; index < stageTimeline.length; index += 1) {
    if (stageTimeline[index] !== expectedStage) {
      throw new Error(`${message}. Drifted after settling. Timeline: ${JSON.stringify(states)}`);
    }
  }
}

async function waitForStage(page, expectedStage, timeoutMs = 4000) {
  try {
    await page.waitForFunction(
      ({ expectedStage }) => {
        const stepper = document.querySelector('[data-rules-stepper]');
        return stepper?.getAttribute('data-stepper-stage') === expectedStage;
      },
      { expectedStage },
      { timeout: timeoutMs },
    );
  } catch (error) {
    const state = await getStepperState(page, `wait-for-${expectedStage}`);
    throw new Error(`Failed waiting for stage ${expectedStage}. Snapshot: ${JSON.stringify(state)}`, { cause: error });
  }
}

async function prepareMobilePage(page) {
  await page.goto(METHOD_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    document.getElementById('method')?.scrollIntoView({ block: 'start' });
  });
  await page.waitForTimeout(400);

  const state = await getStepperState(page, 'after-load');
  if (!state.hasStepper) {
    throw new Error(`Mobile rules stepper is not rendered. Snapshot: ${JSON.stringify(state)}`);
  }

  assertStage(state, 'intro', 'Expected mobile method stepper to start on the intro stage');
}

async function prepareDesktopPage(page) {
  await page.goto(METHOD_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1200);
}

async function flingOnStepper(page, direction) {
  await page.evaluate((direction) => {
    const stepper = document.querySelector('[data-rules-stepper]');
    if (!(stepper instanceof HTMLElement)) {
      throw new Error('Missing stepper element');
    }

    const rect = stepper.getBoundingClientRect();
    const x = Math.round(rect.left + rect.width / 2);
    const startY = direction === 'forward'
      ? Math.round(rect.top + rect.height * 0.82)
      : Math.round(rect.top + rect.height * 0.22);
    const endY = direction === 'forward'
      ? Math.round(rect.top + rect.height * 0.14)
      : Math.round(rect.top + rect.height * 0.86);
    const steps = 5;

    const createTouch = (touchY) => new Touch({
      identifier: 1,
      target: stepper,
      clientX: x,
      clientY: touchY,
      pageX: x,
      pageY: touchY,
      screenX: x,
      screenY: touchY,
      radiusX: 2,
      radiusY: 2,
      rotationAngle: 0,
      force: 1,
    });

    const dispatchTouch = (type, touchY) => {
      const touch = createTouch(touchY);
      const touches = type === 'touchend' ? [] : [touch];
      const event = new TouchEvent(type, {
        bubbles: true,
        cancelable: true,
        touches,
        targetTouches: touches,
        changedTouches: [touch],
      });
      stepper.dispatchEvent(event);
    };

    dispatchTouch('touchstart', startY);
    for (let index = 1; index < steps; index += 1) {
      const progress = index / (steps - 1);
      const touchY = Math.round(startY + (endY - startY) * progress);
      dispatchTouch('touchmove', touchY);
    }
    dispatchTouch('touchend', endY);
  }, direction);
}

async function captureTimeline(page, prefix) {
  const states = [];
  let elapsed = 0;

  for (const checkpoint of TIMELINE_CHECKPOINTS_MS) {
    await page.waitForTimeout(checkpoint - elapsed);
    elapsed = checkpoint;
    states.push(await getStepperState(page, `${prefix}-${checkpoint}ms`));
  }

  return states;
}

async function goToStage(page, targetStage) {
  const initialState = await getStepperState(page, `goto-${targetStage}-initial`);
  if (initialState.stepperStage === targetStage) {
    return;
  }

  if (targetStage === 'intro') {
    throw new Error('goToStage only supports intro as the initial state');
  }

  const [, ruleString] = targetStage.split('-');
  const stepsNeeded = Number(ruleString);

  for (let step = 0; step < stepsNeeded; step += 1) {
    await flingOnStepper(page, 'forward');
    await waitForStage(page, `rule-${step + 1}`);
    await page.waitForTimeout(460);
  }
}

async function assertStepperTransition(page, {
  startStage,
  expectedStage,
  direction,
  viewportLabel,
}) {
  await goToStage(page, startStage);
  const beforeState = await getStepperState(page, `${viewportLabel}-${startStage}-before`);
  assertStage(beforeState, startStage, `${viewportLabel} failed to start on ${startStage}`);

  await flingOnStepper(page, direction);
  await waitForStage(page, expectedStage);

  const timeline = await captureTimeline(page, `${viewportLabel}-${startStage}-to-${expectedStage}`);
  const finalState = timeline[timeline.length - 1];

  assertStage(finalState, expectedStage, `${viewportLabel} ${direction} fling landed on the wrong stage`);
  assertNoPostSettleDrift(timeline, expectedStage, `${viewportLabel} ${direction} fling drifted after settling`);

  return timeline;
}

async function assertReleaseToFounder(page, viewportLabel) {
  await goToStage(page, 'rule-5');
  const beforeState = await getStepperState(page, `${viewportLabel}-release-before`);
  assertStage(beforeState, 'rule-5', `${viewportLabel} failed to reach rule-5 before the release fling`);

  await page.mouse.wheel(0, 900);
  const timeline = await captureTimeline(page, `${viewportLabel}-release`);
  const finalState = timeline[timeline.length - 1];
  const viewport = page.viewportSize();

  if (!viewport) {
    throw new Error(`Missing viewport for ${viewportLabel}`);
  }

  if (finalState.founderTop === null || finalState.founderTop > Math.round(viewport.height * 0.8)) {
    throw new Error(`${viewportLabel} final fling did not release into the next section. Timeline: ${JSON.stringify(timeline)}`);
  }

  if (finalState.pageScrollY <= beforeState.pageScrollY) {
    throw new Error(`${viewportLabel} final fling did not move document scroll into the founder section. Timeline: ${JSON.stringify(timeline)}`);
  }
}

async function captureViewportArtifacts(page, viewportLabel, suffix) {
  await page.screenshot({
    path: path.join(OUTPUT_DIR, `${viewportLabel}-${suffix}.png`),
    fullPage: false,
  });
}

async function withPreparedMobileViewport(browser, viewportConfig, callback) {
  const context = await browser.newContext(viewportConfig.contextOptions);
  const page = await context.newPage();

  try {
    await prepareMobilePage(page);
    return await callback({ page });
  } finally {
    await context.close();
  }
}

async function runViewportScenario(browser, viewportConfig) {
  await withPreparedMobileViewport(browser, viewportConfig, async ({ page }) => {
    await captureViewportArtifacts(page, viewportConfig.label, 'intro');
  });

  const introToRule1 = await withPreparedMobileViewport(browser, viewportConfig, async ({ page }) =>
    assertStepperTransition(page, {
      startStage: 'intro',
      expectedStage: 'rule-1',
      direction: 'forward',
      viewportLabel: viewportConfig.label,
    }),
  );
  console.log('Timeline:', JSON.stringify(introToRule1));

  const rule1ToRule2 = await withPreparedMobileViewport(browser, viewportConfig, async ({ page }) =>
    assertStepperTransition(page, {
      startStage: 'rule-1',
      expectedStage: 'rule-2',
      direction: 'forward',
      viewportLabel: viewportConfig.label,
    }),
  );
  console.log('Timeline:', JSON.stringify(rule1ToRule2));

  const rule2ToRule3 = await withPreparedMobileViewport(browser, viewportConfig, async ({ page }) =>
    assertStepperTransition(page, {
      startStage: 'rule-2',
      expectedStage: 'rule-3',
      direction: 'forward',
      viewportLabel: viewportConfig.label,
    }),
  );
  console.log('Timeline:', JSON.stringify(rule2ToRule3));

  const rule3ToRule2 = await withPreparedMobileViewport(browser, viewportConfig, async ({ page }) =>
    assertStepperTransition(page, {
      startStage: 'rule-3',
      expectedStage: 'rule-2',
      direction: 'backward',
      viewportLabel: viewportConfig.label,
    }),
  );
  console.log('Timeline:', JSON.stringify(rule3ToRule2));

  const rule1ToIntro = await withPreparedMobileViewport(browser, viewportConfig, async ({ page }) =>
    assertStepperTransition(page, {
      startStage: 'rule-1',
      expectedStage: 'intro',
      direction: 'backward',
      viewportLabel: viewportConfig.label,
    }),
  );
  console.log('Timeline:', JSON.stringify(rule1ToIntro));

  await withPreparedMobileViewport(browser, viewportConfig, async ({ page }) => {
    await assertReleaseToFounder(page, viewportConfig.label);
    await captureViewportArtifacts(page, viewportConfig.label, 'release');
  });
}

async function runDesktopSmoke(browser) {
  const context = await browser.newContext(DESKTOP_VIEWPORT.contextOptions);
  const page = await context.newPage();

  try {
    await prepareDesktopPage(page);
    const state = await getStepperState(page, 'desktop-smoke');
    const rootSnapState = await page.evaluate(() => ({
      htmlSnap: document.documentElement.getAttribute('data-landing-method-snap'),
      bodySnap: document.body.getAttribute('data-landing-method-snap'),
    }));

    if (state.hasStepper) {
      throw new Error(`Desktop should not render the mobile rules stepper. Snapshot: ${JSON.stringify(state)}`);
    }

    if (rootSnapState.htmlSnap !== null || rootSnapState.bodySnap !== null) {
      throw new Error(`Desktop should not set root snap attributes. Snapshot: ${JSON.stringify(rootSnapState)}`);
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
        console.log(`Running rules stepper QA for ${viewportConfig.label}`);
        await runViewportScenario(browser, viewportConfig);
      }

      console.log(`Running desktop smoke for ${DESKTOP_VIEWPORT.label}`);
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
