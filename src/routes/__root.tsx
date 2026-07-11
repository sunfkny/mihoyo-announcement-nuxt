import type { QueryClient } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import { games } from "#/utils/games";
import appCss from "../styles.css?url";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Mihoyo Announcement" },
      {
        name: "description",
        content: games.map(game => `${game.name}卡池`).join(","),
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://webstatic.mihoyo.com" },
      { rel: "preconnect", href: "https://sdk.mihoyo.com" },
      { rel: "preconnect", href: "https://sdk-webstatic.mihoyo.com" },
      { rel: "preconnect", href: "https://fastcdn.mihoyo.com" },
      { rel: "dns-prefetch", href: "https://webstatic.mihoyo.com" },
      { rel: "dns-prefetch", href: "https://sdk.mihoyo.com" },
      { rel: "dns-prefetch", href: "https://sdk-webstatic.mihoyo.com" },
      { rel: "dns-prefetch", href: "https://fastcdn.mihoyo.com" },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
