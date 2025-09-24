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
    pic_list: z.array(
      z.union([
        z.object({
          ann_id: z.number(),
          content_type: z.number(),
          title: z.string(),
          subtitle: z.string(),
          banner: z.string(),
          content: z.string(),
          lang: z.string(),
          img: z.string(),
          href_type: z.number(),
          href: z.string(),
          pic_list: z.array(z.unknown()),
          remind_text: z.string(),
        }),
        z.object({
          ann_id: z.number(),
          content_type: z.number(),
          title: z.string(),
          subtitle: z.string(),
          banner: z.string(),
          content: z.string(),
          lang: z.string(),
          img: z.string(),
          href_type: z.number(),
          href: z.string(),
          pic_list: z.array(
            z.object({
              title: z.string(),
              img: z.string(),
              href_type: z.number(),
              href: z.string(),
            }),
          ),
          remind_text: z.string(),
        }),
      ]),
    ),
    pic_total: z.number(),
  }),
});
