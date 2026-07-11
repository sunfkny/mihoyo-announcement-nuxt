import type { ComponentProps } from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "#/lib/utils";

interface ProgressProps extends ComponentProps<typeof ProgressPrimitive.Root> {
  "aria-label": string;
  "indicatorClassName"?: string;
}

export function Progress({
  className,
  indicatorClassName,
  value,
  ...props
}: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-blue-100 dark:bg-blue-950", className)}
      value={value}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn("h-full w-full bg-blue-500 transition-transform", indicatorClassName)}
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}
