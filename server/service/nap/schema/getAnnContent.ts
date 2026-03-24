import * as v from "valibot";

export const AnnContentSchema = v.object({
  retcode: v.number(),
  message: v.string(),
  data: v.object({
    list: v.array(
      v.object({
        ann_id: v.number(),
        title: v.string(),
        subtitle: v.string(),
        banner: v.string(),
        content: v.string(),
        lang: v.string(),
        remind_text: v.string(),
      }),
    ),
    total: v.number(),
    pic_list: v.array(
      v.object({
        ann_id: v.number(),
        content_type: v.number(),
        title: v.string(),
        subtitle: v.string(),
        banner: v.string(),
        content: v.string(),
        lang: v.string(),
        img: v.string(),
        href_type: v.number(),
        href: v.string(),
        pic_list: v.array(
          v.object({
            title: v.string(),
            img: v.string(),
            href_type: v.number(),
            href: v.string(),
          }),
        ),
        remind_text: v.string(),
      }),
    ),
    pic_total: v.number(),
  }),
});
