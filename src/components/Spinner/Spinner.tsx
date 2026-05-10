import type { CSSProperties } from "react";

export type SpinnerProps = {
  /** Width and height in pixels */
  size?: number;
  /** Arc stroke color */
  color?: string;
  /** Faint track ring; set `transparent` to hide */
  trackColor?: string;
  /** Stroke width in the same units as the 24×24 viewBox */
  strokeWidth?: number;
  /** One full rotation duration */
  duration?: string;
  /**
   * Accessible name — sets `role="status"` and `aria-live="polite"`.
   * Omit for decorative use (`aria-hidden`).
   */
  label?: string;
  style?: CSSProperties;
  className?: string;
};

const VIEWBOX = 24;
const CX = 12;
const CY = 12;
/** Radius fits stroke inside viewBox */
const R = 10;
const CIRC = 2 * Math.PI * R;

/** ~85° arc */
const ARC_LEN = CIRC * (85 / 360);
const DASH_GAP = CIRC - ARC_LEN;

const DEFAULT_COLOR = "#2563eb";
const DEFAULT_TRACK = "currentColor";

export function Spinner({
  size = 24,
  color = DEFAULT_COLOR,
  trackColor = DEFAULT_TRACK,
  strokeWidth = 2.5,
  duration = "0.75s",
  label,
  style,
  className,
}: SpinnerProps) {
  const decorative = !label;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      className={className}
      style={{ flexShrink: 0, color, ...style }}
      role={decorative ? undefined : "status"}
      aria-live={decorative ? undefined : "polite"}
      aria-busy={decorative ? undefined : true}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? true : undefined}
    >
      <circle
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
        opacity={trackColor === "transparent" ? 0 : 0.18}
      />
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`0 ${CX} ${CY}`}
          to={`360 ${CX} ${CY}`}
          dur={duration}
          repeatCount="indefinite"
        />
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${ARC_LEN} ${DASH_GAP}`}
        />
      </g>
    </svg>
  );
}
