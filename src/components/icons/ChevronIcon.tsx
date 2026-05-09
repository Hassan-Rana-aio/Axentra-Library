import type { SVGAttributes } from "react";

export type ChevronIconProps = Omit<
  SVGAttributes<SVGSVGElement>,
  "children" | "viewBox"
> & {
  /** `down` = closed trigger style; `up` = open / expanded */
  direction?: "up" | "down";
};

export function ChevronIcon({ direction = "down", style, ...rest }: ChevronIconProps) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      style={{
        flexShrink: 0,
        transform: direction === "up" ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.15s ease",
        ...style,
      }}
      {...rest}
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
