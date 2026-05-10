import type { ComponentProps } from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi2";

export type ChevronIconProps = ComponentProps<typeof HiChevronDown> & {
  /** `down` = closed trigger style; `up` = open / expanded */
  direction?: "up" | "down";
};

/** Directional chevron — Heroicons (`react-icons/hi2`). */
export function ChevronIcon({
  direction = "down",
  size = 16,
  style,
  ...rest
}: ChevronIconProps) {
  const Icon = direction === "up" ? HiChevronUp : HiChevronDown;
  return (
    <Icon
      aria-hidden
      size={size}
      style={{
        flexShrink: 0,
        ...style,
      }}
      {...rest}
    />
  );
}
