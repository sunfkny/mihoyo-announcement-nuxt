import { getTime, getTimeHumaize } from "../utils/time";

interface Hk4eGachaInfo {
  ann_id: number;
  title: string;
  image: string;
  content: string;
  start_time?: string | null;
  end_time?: string | null;
  start_time_humaize?: string | null;
  end_time_humaize?: string | null;
}

interface Hk4eProgress {
  start_time?: string | null;
  end_time?: string | null;
  start_time_humaize?: string | null;
  end_time_humaize?: string | null;
  percent?: number | null;
}

interface Hk4eResponse {
  progress: Hk4eProgress;
  gacha_info: Hk4eGachaInfo[];
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
    "https://hk4e-ann-api.mihoyo.com/common/hk4e_cn/announcement/api/getAnnList?" +
      new URLSearchParams({
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
}

async function getAnnContent(): Promise<AnnContentResponse> {
  const response = await fetch(
    "https://hk4e-ann-static.mihoyo.com/common/hk4e_cn/announcement/api/getAnnContent?" +
      new URLSearchParams({
        game: "hk4e",
        game_biz: "hk4e_cn",
        lang: "zh-cn",
        bundle_id: "hk4e_cn",
        channel_id: "1",
        level: "60",
        platform: "pc",
        region: "cn_gf01",
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
    .filter((i) => i.subtitle.endsWith("祈愿"))
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
  const progress: Hk4eProgress = {};

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
    const t =
      /(?:([0-9]+\.[0-9]版本更新后)|(\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}(?::\d{2})?)).*?(\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}(?::\d{2})?)/.exec(
        i.content
      );
    const groups = Array.from(t || []).slice(1) || [];
    if (groups[0] && groups[2]) {
      start_time_humaize = groups[0];
      const endTime = getTime(groups[2]);
      end_time = endTime.format("YYYY-MM-DD HH:mm:ss");
      end_time_humaize = getTimeHumaize(endTime);
    }

    if (groups[1] && groups[2]) {
      const startTime = getTime(groups[1]);
      const endTime = getTime(groups[2]);
      start_time = startTime.format("YYYY-MM-DD HH:mm:ss");
      end_time = endTime.format("YYYY-MM-DD HH:mm:ss");
      start_time_humaize = getTimeHumaize(startTime);
      end_time_humaize = getTimeHumaize(endTime);
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
