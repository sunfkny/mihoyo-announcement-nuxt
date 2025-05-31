import { getTime, getTimeHumaize } from "../utils/time";

interface Bh3GachaInfo {
  ann_id: number;
  title: string;
  image: string;
  content: string;
  info?: string | null;
}

interface Bh3Progress {
  start_time?: string | null;
  end_time?: string | null;
  start_time_humaize?: string | null;
  end_time_humaize?: string | null;
  percent?: number | null;
}

interface Bh3Response {
  progress: Bh3Progress;
  gacha_info: Bh3GachaInfo[];
}

interface AnnContentResponse {
  retcode: number;
  message: string;
  data: {
    list: {
      ann_id: number;
      title: string;
      subtitle: string;
      banner: string;
      content: string;
      lang: string;
    }[];
    pic_list: unknown[];
    total: number;
    pic_total: number;
  };
}

interface AnnListResponse {
  retcode: number;
  message: string;
  data: {
    list: {
      list: {
        ann_id: number;
        title: string;
        subtitle: string;
        banner: string;
        content: string;
        type_label: string;
        tag_label: string;
        tag_icon: string;
        login_alert: number;
        lang: string;
        start_time: string;
        end_time: string;
        type: number;
        remind: number;
        alert: number;
        tag_start_time: string;
        tag_end_time: string;
        remind_ver: number;
        has_content: boolean;
        extra_remind: number;
        tag_icon_hover: string;
      }[];
      type_id: number;
      type_label: string;
    }[];
    total: number;
    type_list: {
      id: number;
      name: string;
      mi18n_name: string;
    }[];
    alert: boolean;
    alert_id: number;
    timezone: number;
    t: string;
    pic_list: unknown[];
    pic_total: number;
    pic_type_list: unknown[];
    pic_alert: boolean;
    pic_alert_id: number;
    static_sign: string;
  };
}

async function getAnnList(): Promise<AnnListResponse> {
  const response = await fetch(
    "https://ann-api.mihoyo.com/common/bh3_cn/announcement/api/getAnnList?" +
      new URLSearchParams({
        game: "bh3",
        game_biz: "bh3_cn",
        lang: "zh-cn",
        bundle_id: "bh3_cn",
        channel_id: "14",
        level: "88",
        platform: "pc",
        region: "bb01",
        uid: "100000000",
      }).toString()
  );
  if (response.status !== 200) {
    throw new Error(`Fail to get ann list ${response.status}`);
  }
  if (
    response.headers.get("Content-Type")?.includes("application/json") === false
  ) {
    throw new Error(
      `Fail to get ann list ${response.headers.get("Content-Type")}`
    );
  }
  return await response.json();
}

function getVersionInfoFromAnnList(
  annList: Awaited<ReturnType<typeof getAnnList>>
):
  | {
      start_time: string;
      end_time: string;
    }
  | undefined {
  for (const lst of annList.data.list) {
    for (const i of lst.list) {
      if (
        i.title.includes("游戏更新内容问题修复及优化说明") ||
        i.subtitle.includes("游戏更新内容公告") ||
        i.subtitle.includes("版本更新公告")
      ) {
        return i;
      }
    }
  }
}

async function getAnnContent(): Promise<AnnContentResponse> {
  const response = await fetch(
    "https://ann-api.mihoyo.com/common/bh3_cn/announcement/api/getAnnContent?" +
      new URLSearchParams({
        game: "bh3",
        game_biz: "bh3_cn",
        lang: "zh-cn",
        bundle_id: "bh3_cn",
        channel_id: "14",
        level: "88",
        platform: "pc",
        region: "bb01",
        uid: "100000000",
      }).toString()
  );
  if (response.status !== 200) {
    throw new Error(`Fail to get ann content ${response.status}`);
  }
  if (
    response.headers.get("Content-Type")?.includes("application/json") === false
  ) {
    throw new Error(
      `Fail to get ann list ${response.headers.get("Content-Type")}`
    );
  }
  return await response.json();
}

function getGachaInfoFromAnnContent(
  annContent: Awaited<ReturnType<typeof getAnnContent>>
): {
  content: string;
  ann_id: number;
  title: string;
  image: string;
}[] {
  return annContent.data.list
    .filter(
      (i) =>
        i.subtitle.includes("补给") &&
        ["补给信息", "补给规则"].some((j) => i.content.includes(j))
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
  const progress: Bh3Progress = {};

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
      const info =
        /<h2[^>]+>补给信息<\/h2>(.*?)<h2[^>]+>补给规则<\/h2>/s.exec(
          i.content
        )?.[1] ??
        /<h2[^>]+>开放时间<\/h2>(.*?)<h2[^>]+>具体内容<\/h2>/s.exec(
          i.content
        )?.[1] ??
        "";

      return {
        ann_id: i.ann_id,
        title: i.title,
        image: i.image,
        content: i.content,
        info,
      };
    }
  );

  return {
    progress,
    gacha_info,
  };
}
