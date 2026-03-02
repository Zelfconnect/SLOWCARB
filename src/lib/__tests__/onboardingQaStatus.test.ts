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
      failedCriticalChecks: [],
    });
  });

  it('marks a step as Issue and reports failed checks', () => {
    const result = createStepResult(5, 'Body timeline', [
      { name: 'Heading visible', passed: true },
      { name: 'Dag 1-2 marker', passed: false },
    ]);

    expect(result.status).toBe('Issue');
    expect(result.failedChecks).toEqual(['Dag 1-2 marker']);
    expect(result.failedCriticalChecks).toEqual([]);
  });

  it('tracks failed critical checks on a step', () => {
    const result = createStepResult(5, 'Body timeline', [
      { name: 'Timeline heading', critical: true, passed: false },
      { name: 'Dag 1-2 marker', passed: false },
    ]);

    expect(result.failedChecks).toEqual(['Timeline heading', 'Dag 1-2 marker']);
    expect(result.failedCriticalChecks).toEqual(['Timeline heading']);
  });

  it('summarizes a fully clean run with the expected message', () => {
    const summary = summarizeOnboardingRun([
      createStepResult(1, 'Welcome', [{ name: 'Heading', passed: true }]),
      createStepResult(2, 'Name', [{ name: 'Input', passed: true }]),
    ]);

    expect(summary).toEqual({
      status: 'Clean',
      score: 10,
      cleanCount: 2,
      issueCount: 0,
      issueSteps: [],
      criticalIssueCount: 0,
      criticalIssueSteps: [],
    });
    expect(getVisualQaRunMessage(summary)).toBe(
      'Visual QA run is "Clean" (score 10/10, no critical issues).',
    );
  });

  it('fails when score is below 7, even without critical issues', () => {
    const summary = summarizeOnboardingRun([
      createStepResult(1, 'Welcome', [{ name: 'Heading', passed: true }]),
      createStepResult(2, 'Name', [{ name: 'Input', passed: false }]),
      createStepResult(3, 'Promise', [{ name: 'Heading', passed: false }]),
    ]);

    expect(summary.status).toBe('Issue');
    expect(summary.score).toBe(3.3);
    expect(summary.issueSteps).toEqual([2, 3]);
    expect(getVisualQaRunMessage(summary)).toBe(
      'Visual QA run is "Issue" (score 3.3/10, critical issues: 0) for onboarding steps: 2, 3.',
    );
  });

  it('fails when any critical issue exists, even with score >= 7', () => {
    const summary = summarizeOnboardingRun([
      createStepResult(1, 'Welcome', [{ name: 'Heading', passed: true }]),
      createStepResult(2, 'Name', [{ name: 'Input', passed: true }]),
      createStepResult(3, 'Promise', [{ name: 'Heading', passed: true }]),
      createStepResult(4, 'Rules', [{ name: 'Heading', passed: true }]),
      createStepResult(5, 'Timeline', [{ name: 'Heading', critical: true, passed: false }]),
      createStepResult(6, 'Science', [{ name: 'Heading', passed: true }]),
      createStepResult(7, 'Reference', [{ name: 'Heading', passed: true }]),
      createStepResult(8, 'Weight', [{ name: 'Input', passed: true }]),
      createStepResult(9, 'Cheat Day', [{ name: 'Heading', passed: true }]),
      createStepResult(10, 'Summary', [{ name: 'CTA', passed: true }]),
    ]);

    expect(summary.status).toBe('Issue');
    expect(summary.score).toBe(9);
    expect(summary.criticalIssueCount).toBe(1);
    expect(summary.criticalIssueSteps).toEqual([5]);
  });
});
