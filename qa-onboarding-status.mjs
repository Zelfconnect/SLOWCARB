export function createStepResult(step, name, checks) {
  const failedChecks = checks.filter((check) => !check.passed).map((check) => check.name);
  const failedCriticalChecks = checks
    .filter((check) => check.critical && !check.passed)
    .map((check) => check.name);

  return {
    step,
    name,
    status: failedChecks.length === 0 ? 'Clean' : 'Issue',
    failedChecks,
    failedCriticalChecks,
  };
}

export function summarizeOnboardingRun(stepResults) {
  const issueSteps = stepResults.filter((step) => step.status !== 'Clean');
  const totalSteps = stepResults.length;
  const cleanCount = totalSteps - issueSteps.length;
  const criticalIssueSteps = stepResults.filter((step) => step.failedCriticalChecks.length > 0);
  const score = totalSteps === 0 ? 0 : Number(((cleanCount / totalSteps) * 10).toFixed(1));

  return {
    status: score >= 7 && criticalIssueSteps.length === 0 ? 'Clean' : 'Issue',
    score,
    cleanCount,
    issueCount: issueSteps.length,
    issueSteps: issueSteps.map((step) => step.step),
    criticalIssueCount: criticalIssueSteps.length,
    criticalIssueSteps: criticalIssueSteps.map((step) => step.step),
  };
}

export function getVisualQaRunMessage(summary) {
  if (summary.status === 'Clean') {
    return `Visual QA run is "Clean" (score ${summary.score}/10, no critical issues).`;
  }

  return `Visual QA run is "Issue" (score ${summary.score}/10, critical issues: ${summary.criticalIssueCount}) for onboarding steps: ${summary.issueSteps.join(', ')}.`;
}
