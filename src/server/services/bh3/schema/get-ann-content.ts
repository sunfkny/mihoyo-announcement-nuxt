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
    pic_list: v.array(v.unknown()),
    pic_total: v.number(),
  }),
});
