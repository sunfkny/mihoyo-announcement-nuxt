export function resolveTime(value: string) {
  return value.replaceAll(
    /&lt;t class="t_.*?&gt;(.*?)&lt;\/t&gt;/gi,
    (_match, content: string) => `<span>${content}</span>`,
  );
}

export function resetFontSize(value: string) {
  return value.replaceAll(/font-size:\s+0.\d+rem/g, "font-size:1rem");
}

export function resolveTimeAndResetFontSize(value: string) {
  return resetFontSize(resolveTime(value));
}
