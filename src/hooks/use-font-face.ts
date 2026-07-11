import { useEffect } from "react";

export function useFontFace(
  family: string,
  url: string,
  descriptors?: FontFaceDescriptors,
) {
  useEffect(() => {
    const alreadyLoaded = [...document.fonts].some(font => font.family === family);
    if (alreadyLoaded) {
      return;
    }

    const font = new FontFace(family, `url(${url})`, descriptors);
    void font.load().then(loadedFont => document.fonts.add(loadedFont));
  }, [descriptors, family, url]);
}
