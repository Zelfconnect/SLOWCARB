/**
 * Returns current local date as 'yyyy-MM-dd' string.
 * Unlike `new Date().toISOString().split('T')[0]` which returns the **UTC** date,
 * this returns the date in the user's local timezone — critical for Dutch users
 * in CET/CEST where UTC midnight differs from local midnight.
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns yesterday's local date as 'yyyy-MM-dd' string.
 */
export function getYesterdayDateString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return getLocalDateString(yesterday);
}
