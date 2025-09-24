import type { BaseResponse } from "../constant";
import moment from "moment";
import { ofetch } from "ofetch";
import { checkResponse, getMihoYoBaseUrl } from "../constant";
import { getTime, getTimeHumaize } from "../time";
import { AnnContentSchema } from "./schema/getAnnContent";
import { AnnListSchema } from "./schema/getAnnList";

const query = {
  game: "bh3",
  game_biz: "bh3_cn",
  lang: "zh-cn",
  bundle_id: "bh3_cn",
  channel_id: "14",
  level: "88",
  platform: "pc",
  region: "bb01",
  uid: "100000000",
};

const fetch = ofetch.create({
  query,
  timeout: 1000,
  baseURL: getMihoYoBaseUrl("ann-api"),
  responseType: "json",
});

export async function getAnnList() {
  const resp = await fetch<BaseResponse>(
    `/common/${query.game_biz}/announcement/api/getAnnList`,
  );
  checkResponse(resp);
  return AnnListSchema.loose().parse(resp);
}

export async function getAnnContent() {
  const resp = await fetch<BaseResponse>(
    `/common/${query.game_biz}/announcement/api/getAnnContent`,
  );
  checkResponse(resp);
  return AnnContentSchema.loose().parse(resp);
}

interface Bh3GachaInfo {
  ann_id: number;
  title: string;
  image: string;
  content: string;
  start_time: string | null;
  end_time: string | null;
  start_time_humaize: string | null;
  end_time_humaize: string | null;
}

interface Bh3Progress {
  start_time: string | null;
  end_time: string | null;
  end_time_humaize: string | null;
  percent: number | null;
}

interface Bh3Response {
  progress: Bh3Progress;
  gacha_info: Bh3GachaInfo[];
}

function getVersionInfoFromAnnList(
  annList: Awaited<ReturnType<typeof getAnnList>>,
):
  | {
    start_time: string;
    end_time: string;
  }
  | null {
  for (const lst of annList.data.list) {
    for (const i of lst.list) {
      if (
        i.title.includes("游戏更新内容问题修复及优化说明")
        || i.subtitle.includes("游戏更新内容公告")
        || i.subtitle.includes("版本更新公告")
      ) {
        return i;
      }
    }
  }
  return null;
}

function getGachaInfoFromAnnContent(
  annContent: Awaited<ReturnType<typeof getAnnContent>>,
): {
  content: string;
  ann_id: number;
  title: string;
  image: string;
}[] {
  return annContent.data.list
    .filter(
      i =>
        i.subtitle.includes("补给")
        && ["补给信息", "补给规则"].some(j => i.content.includes(j)),
    )
    .map((i) => {
      return {
        content: i.content,
        ann_id: i.ann_id,
        title: i.title,
        image: i.banner,
      };
    });
}

export async function getBh3Info(): Promise<Bh3Response> {
  const [annList, annContent] = await Promise.all([
    getAnnList(),
    getAnnContent(),
  ]);

  const versionInfo = getVersionInfoFromAnnList(annList);
  const progress: Bh3Progress = {
    start_time: null,
    end_time: null,
    end_time_humaize: null,
    percent: null,
  };

  if (versionInfo) {
    const startTime = getTime(versionInfo.start_time);
    const endTime = getTime(versionInfo.end_time);
    progress.start_time = startTime.format("YYYY-MM-DD HH:mm:ss");
    progress.end_time = endTime.format("YYYY-MM-DD HH:mm:ss");
    const currentTime = getTime();
    if (currentTime.isBetween(startTime, endTime)) {
      progress.percent = currentTime.diff(startTime) / endTime.diff(startTime);
      progress.end_time_humaize = getTimeHumaize(endTime);
    }
  }

  const gacha_info: Bh3GachaInfo[] = getGachaInfoFromAnnContent(annContent).map(
    (i) => {
      let start_time = null;
      let end_time = null;
      let start_time_humaize = null;
      let end_time_humaize = null;

      const datetimePattern = /(?<start_str>\d+月\d+日\d+:\d+|\d+\.\d+版本更新后)~(?<end_str>\d+月\d+日\d+:\d+)/;
      const match = datetimePattern.exec(i.content);
      const groups = match?.groups as { start_str: string; end_str: string } | undefined;
      if (groups) {
        const { start_str, end_str } = groups;
        const parsedStart = start_str.includes("版本更新后") ? null : moment(start_str, "M月D日H:m");
        start_time = parsedStart ? parsedStart.format("YYYY-MM-DD HH:mm:ss") : null;
        start_time_humaize = parsedStart ? getTimeHumaize(parsedStart) : start_str;
        const endTime = moment(end_str, "M月D日H:m");
        end_time = endTime.format("YYYY-MM-DD HH:mm:ss");
        end_time_humaize = getTimeHumaize(endTime);
      }

      return {
        ann_id: i.ann_id,
        title: i.title,
        image: i.image,
        content: i.content,
        start_time,
        end_time,
        start_time_humaize,
        end_time_humaize,
      };
    },
  );

  return {
    progress,
    gacha_info,
  };
}
