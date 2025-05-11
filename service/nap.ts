import { getTime, getTimeHumaize } from "../utils/time";

type NapGachaInfo = {
  ann_id: number;
  title: string;
  image: string;
  images: string[];
  content: string;
  start_time?: string | null;
  end_time?: string | null;
  start_time_humaize?: string | null;
  end_time_humaize?: string | null;
};

type NapProgress = {
  start_time?: string | null;
  end_time?: string | null;
  start_time_humaize?: string | null;
  end_time_humaize?: string | null;
  percent?: number | null;
};

type NapResponse = {
  progress: NapProgress;
  gacha_info: NapGachaInfo[];
};

type AnnContentResponse = {
  retcode: number;
  message: string;
  data: {
    list: Array<{
      ann_id: number;
      title: string;
      subtitle: string;
      banner: string;
      content: string;
      lang: string;
      remind_text: string;
    }>;
    total: number;
    pic_list: Array<{
      ann_id: number;
      content_type: number;
      title: string;
      subtitle: string;
      banner: string;
      content: string;
      lang: string;
      img: string;
      href_type: number;
      href: string;
      pic_list: Array<{
        title: string;
        img: string;
        href_type: number;
        href: string;
      }>;
      remind_text: string;
    }>;
    pic_total: number;
  };
};

type AnnListResponse = {
  retcode: number;
  message: string;
  data: {
    list: Array<{
      list: Array<{
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
        logout_remind: number;
        logout_remind_ver: number;
        country: string;
        need_remind_text: number;
        remind_text: string;
        weak_remind: number;
        remind_consumption_type: number;
      }>;
      type_id: number;
      type_label: string;
    }>;
    total: number;
    type_list: Array<{
      id: number;
      name: string;
      mi18n_name: string;
    }>;
    alert: boolean;
    alert_id: number;
    timezone: number;
    t: string;
    pic_list: Array<{
      type_list: Array<{
        list: Array<{
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
          pic_type: number;
          content_type: number;
          img: string;
          href_type: number;
          href: string;
          pic_list: Array<unknown>;
          extra_remind: number;
          need_remind_text: number;
          remind_text: string;
          weak_remind: number;
          remind_consumption_type: number;
        }>;
        pic_type: number;
      }>;
      type_id: number;
      type_label: string;
    }>;
    pic_total: number;
    pic_type_list: Array<{
      id: number;
      name: string;
      mi18n_name: string;
    }>;
    pic_alert: boolean;
    pic_alert_id: number;
    static_sign: string;
    banner: string;
    calendar_type: {
      mi18n_name: string;
      enabled: boolean;
      remind: boolean;
    };
  };
};

async function getAnnList(): Promise<AnnListResponse> {
  const response = await fetch(
    "https://announcement-api.mihoyo.com/common/nap_cn/announcement/api/getAnnList?" +
      new URLSearchParams({
        game: "nap",
        game_biz: "nap_cn",
        lang: "zh-cn",
        bundle_id: "nap_cn",
        platform: "pc",
        region: "prod_gf_cn",
        level: "60",
        channel_id: "1",
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
        i.title.includes("已知问题及游戏优化说明") ||
        i.subtitle.includes("版本更新说明")
      ) {
        return i;
      }
    }
  }
}

async function getAnnContent(): Promise<AnnContentResponse> {
  const response = await fetch(
    "https://announcement-static.mihoyo.com/common/nap_cn/announcement/api/getAnnContent?" +
      new URLSearchParams({
        game: "nap",
        game_biz: "nap_cn",
        lang: "zh-cn",
        bundle_id: "nap_cn",
        platform: "pc",
        region: "prod_gf_cn",
        level: "60",
        channel_id: "1",
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
  return annContent.data.pic_list
    .filter((i) => i.subtitle.includes("调频") || i.subtitle.includes("频段"))
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
  const progress: NapProgress = {};

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
      /(?:([0-9]+\.[0-9]版本更新后)|(\d{4}\/\d{2}\/\d{2} +\d{2}:\d{2}(?::\d{2})?)).*?(\d{4}\/\d{2}\/\d{2} +\d{2}:\d{2}(?::\d{2})?)/gm.exec(
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
    const images = Array.from(
      i.content.matchAll(/<img[^>]+src="([^"]+)"[^>]*>/g)
    ).map((m) => m[1]);

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
