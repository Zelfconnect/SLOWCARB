import { describe, expect, it } from 'vitest';
// @ts-expect-error mjs helper has no type declarations.
import {
  createStepResult,
  summarizeOnboardingRun,
  getVisualQaRunMessage,
} from '../../../qa-onboarding-status.mjs';

describe('onboarding QA status helpers', () => {
  it('marks a step as Clean when all checks pass', () => {
    const result = createStepResult(3, 'Promise', [
      { name: 'Heading visible', passed: true },
      { name: 'CTA visible', passed: true },
    ]);

    expect(result).toEqual({
      step: 3,
      name: 'Promise',
      status: 'Clean',
      failedChecks: [],
    });
  });

  it('marks a step as Issue and reports failed checks', () => {
    const result = createStepResult(5, 'Body timeline', [
      { name: 'Heading visible', passed: true },
      { name: 'Dag 1-2 marker', passed: false },
    ]);

    expect(result.status).toBe('Issue');
    expect(result.failedChecks).toEqual(['Dag 1-2 marker']);
  });

  it('summarizes a fully clean run with the expected message', () => {
    const summary = summarizeOnboardingRun([
      createStepResult(1, 'Welcome', [{ name: 'Heading', passed: true }]),
      createStepResult(2, 'Name', [{ name: 'Input', passed: true }]),
    ]);

    expect(summary).toEqual({
      status: 'Clean',
      cleanCount: 2,
      issueCount: 0,
      issueSteps: [],
    });
    expect(getVisualQaRunMessage(summary)).toBe('Visual QA run is clean.');
  });

  it('summarizes issue steps and reports their step numbers', () => {
    const summary = summarizeOnboardingRun([
      createStepResult(1, 'Welcome', [{ name: 'Heading', passed: true }]),
      createStepResult(2, 'Name', [{ name: 'Input', passed: false }]),
      createStepResult(3, 'Promise', [{ name: 'Heading', passed: false }]),
    ]);

    expect(summary.status).toBe('Issue');
    expect(summary.issueSteps).toEqual([2, 3]);
    expect(getVisualQaRunMessage(summary)).toBe(
      'Visual QA run is "Issue" for onboarding steps: 2, 3.',
    );
  });
});
