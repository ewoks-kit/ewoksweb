import { format } from 'd3-format';

const HOUR_IN_MS = 3600 * 1000;
const MIN_IN_MS = 60 * 1000;

const formatDurationMembers: (n: number) => string = format('02.0f');

export function formatDuration(duration: Date): string {
  const durationAsMs = duration.valueOf();
  if (durationAsMs < 1000) {
    return 'Less than one second';
  }

  const hours = Math.floor(durationAsMs / HOUR_IN_MS);
  const durationMinusHours = durationAsMs - hours * HOUR_IN_MS;
  const minutes = Math.floor(durationMinusHours / MIN_IN_MS);
  const durationMinusHoursAndMinutes = durationMinusHours - minutes * MIN_IN_MS;
  const seconds = Math.floor(durationMinusHoursAndMinutes / 1000);

  return `${formatDurationMembers(hours)}:${formatDurationMembers(
    minutes,
  )}:${formatDurationMembers(seconds)}`;
}
