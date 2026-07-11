import { createFileRoute, notFound } from "@tanstack/react-router";
import { AnnouncementPage } from "#/components/announcement-page";
import { LoadingAnnouncement } from "#/components/loading-announcement";
import { announcementQueryOptions } from "#/utils/announcements.query";
import { getGame, isGame } from "#/utils/games";

const fontUrls = {
  bh3: "https://webstatic.mihoyo.com/bh3/upload/announcement/font/zh-cn.ttf",
  hk4e: "https://webstatic.mihoyo.com/common/clgm-static/ys/fonts/zh-cn.ttf",
  hkrpg: "https://webstatic.mihoyo.com/common/clgm-static/sr/fonts/zh-cn.ttf",
  nap: "https://sdk.mihoyo.com/nap/announcement/fonts/zh-cn-light.e490414b.ttf",
} as const;

export const Route = createFileRoute("/announcement/$game")({
  beforeLoad: ({ params }) => {
    if (!isGame(params.game)) {
      throw notFound();
    }
    return { game: params.game };
  },
  loader: ({ context, params }) => {
    if (!isGame(params.game)) {
      throw notFound();
    }
    return context.queryClient.ensureQueryData(announcementQueryOptions(params.game));
  },
  head: ({ params }) => {
    const game = getGame(params.game);
    if (!game) {
      return {};
    }
    return {
      meta: [{ title: `${game.name}卡池 - Mihoyo Announcement` }],
      links: [
        {
          rel: "preload",
          href: fontUrls[game.key],
          as: "font",
          type: "font/ttf",
          crossOrigin: "anonymous",
        },
      ],
    };
  },
  pendingMs: 0,
  pendingMinMs: 250,
  pendingComponent: LoadingAnnouncement,
  errorComponent: AnnouncementError,
  component: AnnouncementRoute,
});

function AnnouncementRoute() {
  const { game } = Route.useRouteContext();
  const data = Route.useLoaderData();
  return <AnnouncementPage game={game} data={data} />;
}

function AnnouncementError({ error }: { error: Error }) {
  return (
    <div className="my-4">
      <span>获取失败</span>
      <pre><code>{String(error)}</code></pre>
    </div>
  );
}
