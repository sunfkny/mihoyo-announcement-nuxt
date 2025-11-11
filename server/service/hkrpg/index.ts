import type { BaseResponse } from "~~/shared/constants/url";
import { Window } from "happy-dom";
import { ofetch } from "ofetch";
import { checkResponse, getMihoYoBaseUrl } from "~~/shared/constants/url";
import { formatChineseISOLocaleString, parseLocalDate, parseTimeHumaize } from "~~/shared/datetime";
import { AnnContentSchema } from "./schema/getAnnContent";
import { AnnListSchema } from "./schema/getAnnList";

const query = {
  game: "hkrpg",
  game_biz: "hkrpg_cn",
  lang: "zh-cn",
  bundle_id: "hkrpg_cn",
  channel_id: "1",
  platform: "pc",
  region: "prod_gf_cn",
  level: "70",
  uid: "100000000",
};

const fetch = ofetch.create({
  query,
  baseURL: getMihoYoBaseUrl("hkrpg-ann-api"),
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

interface HkrpgGachaInfo {
  ann_id: number;
  title: string;
  image: string;
  content: string;
  start_time: string | null;
  end_time: string | null;
  start_time_humaize: string | null;
  end_time_humaize: string | null;
}

interface HkrpgProgress {
  start_time: string | null;
  end_time: string | null;
  end_time_humaize: string | null;
  percent: number | null;
}

interface HkrpgResponse {
  progress: HkrpgProgress;
  gacha_info: HkrpgGachaInfo[];
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
      if (i.title.includes("游戏优化及已知问题说明")) {
        return i;
      }
    }
    for (const i of lst.list) {
      if (i.tag_label === "修复/更新") {
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
    .filter(i => i.title.includes("跃迁"))
    .map((i) => {
      return {
        content: i.content,
        ann_id: i.ann_id,
        title: i.title,
        image: i.img,
      };
    });
}

export async function getHkrpgInfo(): Promise<HkrpgResponse> {
  const [annList, annContent] = await Promise.all([
    getAnnList(),
    getAnnContent(),
  ]);

  const versionInfo = getVersionInfoFromAnnList(annList);
  const progress: HkrpgProgress = {
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

    if (i.title.includes("联动跃迁") && i.content.includes("长期开放")) {
      const match
        = /(\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}(?::\d{2})?)/.exec(
          i.content,
        );
      if (match) {
        const start = parseTimeHumaize(match[1]);
        start_time = start.time;
        start_time_humaize = start.time_humaize;
        end_time_humaize = "长期开放";
        const result: HkrpgGachaInfo = {
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
      }
    }

    const window = new Window({ url: "https://webstatic.mihoyo.com/hkrpg/announcement/index.html" });
    const document = window.document;
    document.body.innerHTML = i.content;
    document.querySelectorAll("span").forEach((p) => {
      p.innerHTML = p.textContent.trim();
    });
    document.querySelectorAll("p").forEach((p) => {
      p.innerHTML = p.textContent.trim();
    });
    // multiple banner with different time
    const normalizedContents = new Set(Array.from(document.querySelectorAll("table td[rowspan]")).map(i => i.textContent));
    for (const normalizedContent of normalizedContents) {
      if (normalizedContent && normalizedContent.includes("-")) {
        const [start_part, end_part] = normalizedContent.split("-");
        const parsedStart = parseTimeHumaize(start_part);
        const parsedEnd = parseTimeHumaize(end_part);
        if (parsedEnd.time) {
          const dt = new Date(parsedEnd.time);
          const now = new Date();
          if (dt < now) {
            // skip if banner is expired
            continue;
          }
        }
        start_time = parsedStart.time;
        start_time_humaize = parsedStart.time_humaize;
        end_time = parsedEnd.time;
        end_time_humaize = parsedEnd.time_humaize;
      }
    }

    const result: HkrpgGachaInfo = {
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
