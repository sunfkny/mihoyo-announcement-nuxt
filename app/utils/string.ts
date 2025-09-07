type AnnotationOptions = {
  prefix?: string;
  suffix?: string;
  separator?: string;
};

export function appendAnnotation<T>(
  main: string | null | undefined,
  extra: T,
  options: AnnotationOptions = {}
): string | T {
  const { prefix = "(", suffix = ")", separator = " " } = options;

  if (main) {
    return `${main}${separator}${prefix}${extra}${suffix}`;
  }
  return extra;
}
