import { getEnv } from "./env";

/** "HH:mm" string overlap check on half-open interval [start, end). */
export function timeRangesOverlap(
  a: { start: string; end: string },
  b: { start: string; end: string },
): boolean {
  return a.start < b.end && b.start < a.end;
}

/** today as "YYYY-MM-DD" in app timezone. */
export function todayInAppTz(now: Date = new Date()): string {
  const tz = getEnv().APP_TIMEZONE;
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(now); // en-CA → YYYY-MM-DD
}

export function isWithinDateRange(
  date: string,
  start: string,
  end: string,
): boolean {
  return date >= start && date <= end;
}

/** Return the next Date (in app TZ) whose dayOfWeek equals targetDow, ≥ now. */
export function nextSessionDateTime(
  targetDow: number,
  timeStart: string,
  now: Date = new Date(),
): Date {
  const tz = getEnv().APP_TIMEZONE;
  // Compute current date parts in app TZ.
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const todayStr = `${get("year")}-${get("month")}-${get("day")}`;
  const wkMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  const todayDow = wkMap[get("weekday")] ?? 0;
  const nowHm = `${get("hour")}:${get("minute")}`;

  let daysAhead = (targetDow - todayDow + 7) % 7;
  if (daysAhead === 0 && nowHm >= timeStart) {
    daysAhead = 7;
  }

  const [y, m, d] = todayStr.split("-").map(Number);
  // Build a Date for the target session at app TZ wall-clock (timeStart).
  // Approach: use UTC-anchored construction then offset via timezone formatting trick.
  // Simpler approximation: assume server timezone offset matches APP_TIMEZONE if APP_TIMEZONE
  // is the system tz. Otherwise we resolve via Date.UTC and a tz offset lookup.
  const offsetMinutes = timezoneOffsetMinutes(tz, now);
  const [hh, mm] = timeStart.split(":").map(Number);
  const targetUtcMs = Date.UTC(y, (m - 1), d + daysAhead, hh, mm) - offsetMinutes * 60 * 1000;
  return new Date(targetUtcMs);
}

/** Return offset in minutes east of UTC for the given IANA timezone at the given instant. */
function timezoneOffsetMinutes(tz: string, at: Date): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = dtf.formatToParts(at);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return Math.round((asUtc - at.getTime()) / 60000);
}

export function hoursUntil(target: Date, from: Date = new Date()): number {
  return (target.getTime() - from.getTime()) / 3_600_000;
}
