import type { BaseResponse } from "../constant";
import { Window } from "happy-dom";
import { ofetch } from "ofetch";
import { checkResponse, getMihoYoBaseUrl } from "../constant";
import { getTime, getTimeHumaize, parseTimeHumaize } from "../time";
import { AnnContentSchema } from "./schema/getAnnContent";
import { AnnListSchema } from "./schema/getAnnList";

const query = {
  game: "hk4e",
  game_biz: "hk4e_cn",
  lang: "zh-cn",
  from_cloud_web: "1",
  bundle_id: "hk4e_cn",
  channel_id: "1",
  level: "60",
  platform: "pc",
  region: "cn_gf01",
  uid: "100000000",
};

const fetch = ofetch.create({
  query,
  timeout: 1000,
  baseURL: getMihoYoBaseUrl("hk4e-ann-api"),
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

interface Hk4eGachaInfo {
  ann_id: number;
  title: string;
  image: string;
  content: string;
  start_time: string | null;
  end_time: string | null;
  start_time_humaize: string | null;
  end_time_humaize: string | null;
}

interface Hk4eProgress {
  start_time: string | null;
  end_time: string | null;
  end_time_humaize: string | null;
  percent: number | null;
}

interface Hk4eResponse {
  progress: Hk4eProgress;
  gacha_info: Hk4eGachaInfo[];
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
      if (i.subtitle.endsWith("版本更新说明")) {
        return i;
      }
    }
  }
  for (const lst of annList.data.list) {
    for (const i of lst.list) {
      if (i.title.includes("游戏更新修复与优化说明")) {
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
    .filter(i => i.subtitle.endsWith("祈愿"))
    .map((i) => {
      return {
        content: i.content,
        ann_id: i.ann_id,
        title: i.title,
        image: i.banner,
      };
    });
}

export async function getHk4eInfo(): Promise<Hk4eResponse> {
  const [annList, annContent] = await Promise.all([
    getAnnList(),
    getAnnContent(),
  ]);

  const versionInfo = getVersionInfoFromAnnList(annList);
  const progress: Hk4eProgress = {
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

  const gacha_info = getGachaInfoFromAnnContent(annContent).map((i) => {
    let start_time = null;
    let end_time = null;
    let start_time_humaize = null;
    let end_time_humaize = null;

    const window = new Window({ url: "https://webstatic.mihoyo.com/hk4e/announcement/index.html" });
    const document = window.document;
    document.body.innerHTML = i.content;
    document.querySelectorAll("span").forEach((p) => {
      p.innerHTML = p.textContent.trim();
    });
    document.querySelectorAll("p").forEach((p) => {
      p.innerHTML = p.textContent.trim();
    });
    const normalizedContent = document.querySelector("table td[rowspan]")?.textContent;
    if (normalizedContent && normalizedContent.includes("~")) {
      const [start_part, end_part] = normalizedContent.split("~");
      const parsedStart = parseTimeHumaize(start_part);
      start_time = parsedStart.time;
      start_time_humaize = parsedStart.time_humaize;
      const parsedEnd = parseTimeHumaize(end_part);
      end_time = parsedEnd.time;
      end_time_humaize = parsedEnd.time_humaize;
    }

    const result: Hk4eGachaInfo = {
      ann_id: i.ann_id,
      title: i.title,
      image: i.image,
      content: i.content,
      start_time,
      end_time,
      start_time_humaize,
      end_time_humaize,
    };
    return result;
  });

  return {
    progress,
    gacha_info,
  };
}
