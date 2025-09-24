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
