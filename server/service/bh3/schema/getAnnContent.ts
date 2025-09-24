import { z } from "zod";

export const AnnContentSchema = z.object({
  retcode: z.number(),
  message: z.string(),
  data: z.object({
    list: z.array(
      z.object({
        ann_id: z.number(),
        title: z.string(),
        subtitle: z.string(),
        banner: z.string(),
        content: z.string(),
        lang: z.string(),
        remind_text: z.string(),
      }),
    ),
    total: z.number(),
    pic_list: z.array(z.unknown()),
    pic_total: z.number(),
  }),
});
