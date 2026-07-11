import type { AnnouncementResponse } from "#/types/announcement";
import type { Game } from "#/utils/games";
import { Fragment } from "react";
import { appendAnnotation } from "#/utils/format-annotation";
import { ossProcessWebp } from "#/utils/image-processing";
import { AnnouncementModal } from "./announcement-modal";
import { Progress } from "./ui/progress";

const imageAspectClasses: Record<Game, string> = {
  bh3: "aspect-[774/160]",
  hk4e: "aspect-[1080/533]",
  hkrpg: "aspect-[1120/340]",
  nap: "aspect-[1590/222]",
};

export function AnnouncementPage({
  game,
  data,
}: {
  game: Game;
  data: AnnouncementResponse;
}) {
  const progress = data.progress.percent ? data.progress.percent * 100 : 0;

  return (
    <div>
      {Boolean(data.progress.percent) && (
        <div className="my-4">
          <Progress value={progress} aria-label="当前版本进度" />
          <span>
            {data.progress.start_time}
            {" ~ "}
            {appendAnnotation(data.progress.end_time, data.progress.end_time_humanize)}
          </span>
        </div>
      )}

      {data.gacha_info.map((item, itemIndex) => (
        <Fragment key={item.ann_id}>
          <AnnouncementModal game={game} item={item}>
            {game === "nap"
              ? item.images?.map((image, imageIndex) => (
                  <div key={`${item.ann_id}-${image}`} className={imageAspectClasses.nap}>
                    <img
                      src={ossProcessWebp(image)}
                      alt={image}
                      fetchPriority={itemIndex === 0 && imageIndex === 0 ? "high" : "auto"}
                    />
                  </div>
                ))
              : (
                  <div className={imageAspectClasses[game]}>
                    <img
                      className={game === "bh3" ? "rounded" : undefined}
                      src={ossProcessWebp(item.image)}
                      alt={item.title}
                      fetchPriority={itemIndex === 0 ? "high" : "auto"}
                    />
                  </div>
                )}
          </AnnouncementModal>
          <p>{item.title}</p>
          <p>
            开始时间:
            {" "}
            {appendAnnotation(item.start_time, item.start_time_humanize)}
          </p>
          <p>
            结束时间:
            {" "}
            {appendAnnotation(item.end_time, item.end_time_humanize)}
          </p>
        </Fragment>
      ))}
    </div>
  );
}
