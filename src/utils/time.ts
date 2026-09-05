import { differenceInDays, differenceInMilliseconds } from 'date-fns';

export const START_DATE = new Date('2026-07-13T00:00:00');
export const TARGET_DATE = new Date('2066-07-13T00:00:00');

export function getTimeStats() {
  const now = new Date();
  
  const totalDays = differenceInDays(TARGET_DATE, START_DATE);
  const remainingDays = differenceInDays(TARGET_DATE, now);
  const elapsedDays = totalDays - remainingDays;

  // More precise percentage using milliseconds
  const totalMs = TARGET_DATE.getTime() - START_DATE.getTime();
  const elapsedMs = now.getTime() - START_DATE.getTime();
  
  let percentage = (elapsedMs / totalMs) * 100;
  
  // Clamp between 0 and 100
  if (percentage < 0) percentage = 0;
  if (percentage > 100) percentage = 100;

  return {
    remainingDays: Math.max(0, remainingDays),
    elapsedPercentage: percentage,
  };
}
