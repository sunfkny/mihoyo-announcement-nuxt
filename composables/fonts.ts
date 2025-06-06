function guessFontMimeType(url: string): string {
  const cleanUrl = url.split("?")[0];
  const ext = cleanUrl.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "ttf":
      return "font/ttf";
    case "otf":
      return "font/otf";
    case "woff":
      return "font/woff";
    case "woff2":
      return "font/woff2";
    default:
      return "font/woff2";
  }
}

export function useFontFace(
  family: string,
  url: `https://${string}` | `http://${string}`,
  descriptors?: FontFaceDescriptors,
  options: {
    preload?: boolean;
    type?: string;
    crossorigin?: "" | "anonymous" | "use-credentials";
  } = {}
) {
  const {
    preload = true,
    type = guessFontMimeType(url),
    crossorigin = "anonymous",
  } = options;

  if (preload && import.meta.server) {
    useHead({
      link: [
        {
          key: family,
          rel: "preload",
          href: url,
          as: "font",
          type,
          crossorigin,
        },
      ],
    });
  }

  if (import.meta.client) {
    const alreadyLoaded = [...document.fonts].some(
      (font) => font.family === family
    );

    if (!alreadyLoaded) {
      const font = new FontFace(family, `url(${url})`, descriptors);
      font.load().then((loadedFont) => {
        document.fonts.add(loadedFont);
      });
    }
  }
}
