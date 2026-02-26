export function createStepResult(step, name, checks) {
  const failedChecks = checks.filter((check) => !check.passed).map((check) => check.name);
  return {
    step,
    name,
    status: failedChecks.length === 0 ? 'Clean' : 'Issue',
    failedChecks,
  };
}

export function summarizeOnboardingRun(stepResults) {
  const issueSteps = stepResults.filter((step) => step.status !== 'Clean');
  return {
    status: issueSteps.length === 0 ? 'Clean' : 'Issue',
    cleanCount: stepResults.length - issueSteps.length,
    issueCount: issueSteps.length,
    issueSteps: issueSteps.map((step) => step.step),
  };
}

export function getVisualQaRunMessage(summary) {
  if (summary.status === 'Clean') {
    return 'Visual QA run is clean.';
  }

  return `Visual QA run is "Issue" for onboarding steps: ${summary.issueSteps.join(', ')}.`;
}
