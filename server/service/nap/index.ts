import type { BaseResponse, MihoyoSubdomain } from "#shared/constants/url";
import { checkResponse, getMihoYoBaseUrl } from "#shared/constants/url";
import { formatChineseISOLocaleString, parseLocalDate, parseTimeHumaize } from "#shared/datetime";
import { Window } from "happy-dom";
import { ofetch } from "ofetch";
import * as v from "valibot";
import { AnnContentSchema } from "./schema/getAnnContent";
import { AnnListSchema } from "./schema/getAnnList";

export const subdomain: MihoyoSubdomain = "announcement-api";
export const query = {
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
  baseURL: getMihoYoBaseUrl(subdomain),
  responseType: "json",
});

export async function getAnnList() {
  const resp = await fetch<BaseResponse>(
    `/common/${query.game_biz}/announcement/api/getAnnList`,
  );
  checkResponse(resp);
  return v.parse(AnnListSchema, resp);
}

export async function getAnnContent() {
  const resp = await fetch<BaseResponse>(
    `/common/${query.game_biz}/announcement/api/getAnnContent`,
  );
  checkResponse(resp);
  return v.parse(AnnContentSchema, resp);
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
    .filter(i => !i.subtitle.includes("调频回馈") && (i.subtitle.includes("调频") || i.subtitle.includes("频段")))
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
    const startTime = parseLocalDate(versionInfo.start_time);
    const parsedEndTime = parseTimeHumaize(versionInfo.end_time);
    const endTime = parseLocalDate(versionInfo.end_time);
    progress.start_time = formatChineseISOLocaleString(startTime);
    progress.end_time = parsedEndTime.time;
    progress.end_time_humaize = parsedEndTime.time_humaize;

    const currentTime = new Date();
    if (startTime < currentTime && currentTime < endTime) {
      progress.percent = (currentTime.getTime() - startTime.getTime()) / (endTime.getTime() - startTime.getTime());
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
    const images = Array.from(window.document.querySelectorAll("img")).map(i => i.src);
    document.querySelectorAll("span").forEach((p) => {
      p.innerHTML = p.textContent.trim();
    });
    document.querySelectorAll("p").forEach((p) => {
      p.innerHTML = p.textContent.trim();
    });
    const firstTimeRange = Array.from(document.querySelectorAll("table td[rowspan]"))
      .map(i => i.textContent?.trim() ?? "")
      .filter(text => text.includes("~"))
      .map((text) => {
        const [start_part, end_part] = text.split("~");
        return {
          parsedStart: parseTimeHumaize(start_part),
          parsedEnd: parseTimeHumaize(end_part),
        };
      })
      .find(({ parsedEnd }) => {
        if (!parsedEnd.time) {
          return true;
        }
        return new Date(parsedEnd.time) >= new Date();
      });

    if (firstTimeRange) {
      start_time = firstTimeRange.parsedStart.time;
      start_time_humaize = firstTimeRange.parsedStart.time_humaize;
      end_time = firstTimeRange.parsedEnd.time;
      end_time_humaize = firstTimeRange.parsedEnd.time_humaize;
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
