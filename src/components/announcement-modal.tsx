import type { MouseEvent, ReactNode } from "react";
import type { AnnouncementItem } from "#/types/announcement";
import type { Game } from "#/utils/games";
import { X } from "lucide-react";
import { useState } from "react";
import { useFontFace } from "#/hooks/use-font-face";
import { cn } from "#/lib/utils";
import { resolveTimeAndResetFontSize } from "#/utils/announcement-html";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const fonts = {
  bh3: {
    family: "bh3WebFont",
    url: "https://webstatic.mihoyo.com/bh3/upload/announcement/font/zh-cn.ttf",
  },
  hk4e: {
    family: "ysCloudFont",
    url: "https://webstatic.mihoyo.com/common/clgm-static/ys/fonts/zh-cn.ttf",
  },
  hkrpg: {
    family: "rpgWebFont",
    url: "https://webstatic.mihoyo.com/common/clgm-static/sr/fonts/zh-cn.ttf",
  },
  nap: {
    family: "nap-zh-cn-light",
    url: "https://sdk.mihoyo.com/nap/announcement/fonts/zh-cn-light.e490414b.ttf",
  },
} as const;

const modalClasses: Record<Game, { content: string; header: string; title: string; body: string }> = {
  bh3: {
    content: "border-transparent bg-[#003366] text-white sm:max-w-3xl",
    header: "border-neutral-800",
    title: "text-white",
    body: "bh3-content use-bh3-font scroll-bh3 pr-4 overflow-y-scroll",
  },
  hk4e: {
    content: "border-transparent bg-[#F9F6F2] text-gray-800 sm:max-w-3xl",
    header: "border-neutral-200",
    title: "text-gray-800",
    body: "hk4e-content use-hk4e-font scroll-hk4e pr-4 overflow-y-auto",
  },
  hkrpg: {
    content: "border-transparent bg-[#D9DEEA] text-gray-800 sm:max-w-5xl",
    header: "border-neutral-300",
    title: "text-gray-800",
    body: "hkrpg-content use-hkrpg-font scroll-hkrpg mask pr-2 overflow-y-auto",
  },
  nap: {
    content: "border-2 border-[#929292] bg-[#050505] text-white sm:max-w-5xl",
    header: "border-neutral-800",
    title: "text-white",
    body: "nap-content use-nap-font scroll-nap pr-2 overflow-y-auto",
  },
};

export function AnnouncementModal({
  game,
  item,
  children,
}: {
  game: Game;
  item: AnnouncementItem;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const font = fonts[game];
  useFontFace(font.family, font.url, game === "nap" ? { display: "swap", weight: "400" } : { display: "swap" });
  const classes = modalClasses[game];

  function handleTriggerClick(event: MouseEvent) {
    const selection = document.getSelection();
    if (!selection || !selection.isCollapsed) {
      event.preventDefault();
    }
  }

  const html = game === "bh3" ? item.content : resolveTimeAndResetFontSize(item.content);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger onClick={handleTriggerClick}>
        {children}
      </DialogTrigger>
      <DialogContent className={classes.content} aria-describedby={undefined}>
        <DialogHeader className={classes.header}>
          <DialogTitle className={classes.title}>{item.title}</DialogTitle>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="关闭"
              className={game === "bh3" || game === "nap" ? "text-white" : "text-gray-800"}
            >
              <X className="size-5" />
            </Button>
          </DialogClose>
        </DialogHeader>
        <DialogBody>
          <div className={cn("max-h-[calc(100vh-14rem)] min-h-4", classes.body)}>
            {(game === "bh3" || game === "hk4e") && (
              <img src={item.image} alt="" className="mb-4 w-full" />
            )}
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
