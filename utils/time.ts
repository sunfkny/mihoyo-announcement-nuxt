import moment from "moment";

const TZ = "Asia/Shanghai";
process.env.TZ = TZ;

export function getTime(time?: string): moment.Moment {
  if (!time) {
    return moment();
  }
  return moment(time, "YYYY/MM/DD hh:mm");
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
