export function formatWeekEstimate(weeks: number): string {
  return `${weeks} ${weeks === 1 ? 'week' : 'weken'}`;
}
