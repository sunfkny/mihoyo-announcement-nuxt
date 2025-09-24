import type { BaseResponse } from "../constant";
import { Window } from "happy-dom";
import { ofetch } from "ofetch";
import { checkResponse, getMihoYoBaseUrl } from "../constant";
import { getTime, getTimeHumaize, parseTimeHumaize } from "../time";
import { AnnContentSchema } from "./schema/getAnnContent";
import { AnnListSchema } from "./schema/getAnnList";

const query = {
  game: "nap",
  game_biz: "nap_cn",
  lang: "zh-cn",
  bundle_id: "nap_cn",
  platform: "pc",
  region: "prod_gf_cn",
  level: "60",
  channel_id: "1",
};

const fetch = ofetch.create({
  query,
  baseURL: getMihoYoBaseUrl("announcement-api"),
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

type NapGachaInfo = {
  ann_id: number;
  title: string;
  image: string;
  images: string[];
  content: string;
  start_time: string | null;
  end_time: string | null;
  start_time_humaize: string | null;
  end_time_humaize: string | null;
};

type NapProgress = {
  start_time: string | null;
  end_time: string | null;
  end_time_humaize: string | null;
  percent: number | null;
};

type NapResponse = {
  progress: NapProgress;
  gacha_info: NapGachaInfo[];
};

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
        i.title.includes("已知问题及游戏优化说明")
        || i.subtitle.includes("版本更新说明")
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
  return annContent.data.pic_list
    .filter(i => i.subtitle.includes("调频") || i.subtitle.includes("频段"))
    .map((i) => {
      return {
        content: i.content,
        ann_id: i.ann_id,
        title: i.subtitle,
        image: i.img,
      };
    });
}

export async function getNapInfo(): Promise<NapResponse> {
  const [annList, annContent] = await Promise.all([
    getAnnList(),
    getAnnContent(),
  ]);

  const versionInfo = getVersionInfoFromAnnList(annList);
  const progress: NapProgress = {
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

    const window = new Window({ url: "https://sdk.mihoyo.com/nap/announcement/index.html" });
    const document = window.document;
    document.body.innerHTML = i.content;
    const images = [...window.document.querySelectorAll("img")].map(i => i.src);
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

    const result: NapGachaInfo = {
      ann_id: i.ann_id,
      title: i.title,
      image: i.image,
      images,
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
