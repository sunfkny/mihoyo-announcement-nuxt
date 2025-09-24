export function parseLocalDate(str: string, tz: number = 8) {
  if (!str || typeof str !== "string") {
    throw new Error(`Invalid date string: ${str}`);
  };

  const clean = str.trim()
    .replace(/\s+/g, " ")
    .replace(/[/\-]/g, "-");

  const groups = parseIsoLocalDate(clean) ?? parseChineseLocalDate(clean);
  if (!groups) {
    throw new Error(`Invalid date string: ${str}`);
  };

  const second = Number.parseInt(groups.second || "0");
  const minute = Number.parseInt(groups.minute || "0");
  const hour = Number.parseInt(groups.hour || "0");
  const day = Number.parseInt(groups.day);
  const month = Number.parseInt(groups.month);

  const year = (() => {
    if (groups.year !== undefined) {
      return Number.parseInt(groups.year || "0");
    }
    const m = new Date().getMonth() + 1;
    const y = new Date().getFullYear();
    if (month < m) {
      return y + 1;
    }
    return y;
  })();

  const utcTimestamp = Date.UTC(year, month - 1, day, hour, minute, second) - tz * 60 * 60 * 1000;
  const date = new Date(utcTimestamp);
  if (Number.isNaN(date.getTime())) {
    throw new TypeError(`Invalid date: ${str}`);
  }
  return date;
}

function parseIsoLocalDate(str: string) {
  const regex = /(?<year>\d{4})-(?<month>\d{1,2})-(?<day>\d{1,2})(?:\s+(?<hour>\d{1,2}):(?<minute>\d{1,2})(?::(?<second>\d{1,2}))?)?/;
  const match = str.match(regex);
  type MatchGroups = {
    year: string;
    month: string;
    day: string;
    hour?: string;
    minute?: string;
    second?: string;
  };
  const groups = match?.groups as MatchGroups | undefined;
  return groups ?? null;
}

function parseChineseLocalDate(str: string) {
  const regex = /((?<year>\d{4})年)?(?<month>\d{1,2})月(?<day>\d{1,2})日\s?(?:(?<hour>\d{1,2})(?::(?<minute>\d{1,2}))?(?::(?<second>\d{1,2}))?)?/;
  const match = str.match(regex);
  type MatchGroups = {
    year?: string;
    month: string;
    day: string;
    hour?: string;
    minute?: string;
    second?: string;
  };
  const groups = match?.groups as MatchGroups | undefined;
  return groups ?? null;
}

export function formatChineseISOLocaleString(dt: Date): string {
  // https://stackoverflow.com/a/58633686
  return dt.toLocaleString("sv-SE", { timeZone: "Asia/Shanghai" });
}

function diffDate(date1: Date, date2: Date) {
  const diff = Math.abs(date1.getTime() - date2.getTime());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
  };
}

export function getTimeHumaize(time: Date | string | null) {
  if (!time)
    return null;
  if (typeof time === "string") {
    time = getTime(time);
  }

  const now = new Date();
  const duration = {
    sign: time > now ? 1 : -1,
    ...diffDate(time, now),
  };
  const durationSuffix = duration.sign === 1 ? "后" : "前";
  const durationString = `${duration.days}天${duration.hours}小时${duration.minutes}分钟${durationSuffix}`;
  return durationString;
}

export function parseTimeHumaize(time_string: string | null): {
  time: string | null;
  time_humaize: string | null;
} {
  if (!time_string) {
    return { time: null, time_humaize: null };
  }
  try {
    const parsedTime = parseLocalDate(time_string);
    return { time: formatChineseISOLocaleString(parsedTime), time_humaize: getTimeHumaize(parsedTime) };
  }
  catch {
    return { time: null, time_humaize: time_string };
  }
}

export function getTime(time?: string): Date {
  if (!time) {
    return new Date();
  }
  return parseLocalDate(time);
}
