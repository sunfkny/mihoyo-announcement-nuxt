export function resolveTime(s: string) {
  return s.replaceAll(
    /&lt;t class="t_.*?&gt;(.*?)&lt;\/t&gt;/gi,
    (match, p1) => {
      return `<span>${p1}</span>`;
    },
  );
}

export function resetFontSize(s: string) {
  return s.replaceAll(/font-size:\s+0.\d+rem/g, "font-size:1rem");
}

export function resolveTimeAndResetFontSize(s: string) {
  return resetFontSize(resolveTime(s));
}
