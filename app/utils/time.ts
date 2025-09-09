import process from "node:process";
import moment from "moment";

const TZ = "Asia/Shanghai";
process.env.TZ = TZ;

export function getTime(time?: string): moment.Moment {
  if (!time) {
    return moment();
  }
  return moment(time, "YYYY/MM/DD HH:mm");
}

export function getTimeHumaize(time: moment.Moment) {
  const now = moment();
  const duration = {
    sign: now.isAfter(time) ? -1 : 1,
    days: Math.abs(now.diff(time, "days")),
    hours: Math.abs(now.diff(time, "hours") % 24),
    minutes: Math.abs(now.diff(time, "minutes") % 60),
  };
  const durationSuffix = duration.sign === 1 ? "后" : "前";
  const durationString = `${duration.days}天${duration.hours}小时${duration.minutes}分钟${durationSuffix}`;
  return durationString;
}

export function parseTimeHumaize(time_string: string): {
  time: string | null;
  time_humaize: string | null;
} {
  time_string = time_string.trim();
  const time_pattern = /(?<dt>\d{4}\/\d{2}\/\d{2}\s\d{2}:\d{2}(?<sec>:\d{2})?)/;
  const match = time_pattern.exec(time_string);
  const groups = match?.groups as { dt: string; sec: string | undefined } | undefined;
  if (groups) {
    const timeMoment = groups.sec ? moment(groups.dt, "YYYY/MM/DD HH:mm:ss") : moment(groups.dt, "YYYY/MM/DD HH:mm");
    return {
      time: timeMoment.format("YYYY-MM-DD HH:mm:ss"),
      time_humaize: getTimeHumaize(timeMoment),
    };
  }
  return {
    time: null,
    time_humaize: time_string,
  };
}
