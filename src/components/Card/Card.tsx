import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export type CardPadding = "sm" | "md" | "lg";

export type CardVariant = "surface" | "bordered" | "elevated";

/**
 * `split` — left column vs right column (default).
 * `leftFull` — one full-width row using **left** (+ optional **leftIcon**); ignores **right** / **rightIcon**.
 * `rightFull` — one full-width row using **right** (+ optional **rightIcon**), content aligned to the end; ignores **left** / **leftIcon**.
 */
export type CardColumnLayout = "split" | "leftFull" | "rightFull";

export type CardProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  /** Left column body (title, description, etc.) */
  left?: ReactNode;
  /** Right column body (actions, meta, value) */
  right?: ReactNode;
  /** Icon at the start of the left column */
  leftIcon?: ReactNode;
  /** Icon after `right` content (trailing on the right side) */
  rightIcon?: ReactNode;
  padding?: CardPadding;
  variant?: CardVariant;
  columnLayout?: CardColumnLayout;
  /** Vertical alignment of left/right rows */
  align?: "start" | "center" | "stretch";
  /** Override surface color */
  backgroundColor?: string;
  /** Override border (when bordered / elevated draw a stroke) */
  borderColor?: string;
};

const PADDING: Record<CardPadding, string> = {
  sm: "12px 14px",
  md: "16px 18px",
  lg: "20px 22px",
};

const VARIANT_STYLES: Record<
  CardVariant,
  Pick<CSSProperties, "backgroundColor" | "border" | "boxShadow">
> = {
  surface: {
    backgroundColor: "#ffffff",
    border: "1px solid transparent",
    boxShadow: "none",
  },
  bordered: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    boxShadow: "none",
  },
  elevated: {
    backgroundColor: "#ffffff",
    border: "1px solid #f3f4f6",
    boxShadow: "0 4px 14px rgba(15, 23, 42, 0.08)",
  },
};

const iconWrap: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  color: "inherit",
};

export function Card({
  left,
  right,
  leftIcon,
  rightIcon,
  padding = "md",
  variant = "bordered",
  columnLayout = "split",
  align = "center",
  backgroundColor,
  borderColor,
  style,
  className,
  children,
  ...rest
}: CardProps) {
  const preset = VARIANT_STYLES[variant];
  const bg = backgroundColor ?? preset.backgroundColor;
  const border = borderColor !== undefined ? `1px solid ${borderColor}` : preset.border;

  const shell: CSSProperties = {
    ...preset,
    backgroundColor: bg,
    border,
    borderRadius: 12,
    padding: PADDING[padding],
    boxSizing: "border-box",
    fontFamily: "system-ui, sans-serif",
    color: "#111827",
    transition: "box-shadow 0.15s ease, border-color 0.15s ease",
    ...style,
  };

  const hasLeft = left !== undefined || leftIcon !== undefined;
  const hasRight = right !== undefined || rightIcon !== undefined;

  const split =
    columnLayout === "leftFull"
      ? hasLeft
      : columnLayout === "rightFull"
        ? hasRight
        : hasLeft || hasRight;

  const alignItems =
    align === "start" ? "flex-start" : align === "stretch" ? "stretch" : "center";

  const row: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems,
    justifyContent:
      hasLeft && hasRight ? "space-between" : hasRight ? "flex-end" : "flex-start",
    gap: 16,
    width: "100%",
    minWidth: 0,
  };

  const leftCluster: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems,
    gap: 12,
    flex: 1,
    minWidth: 0,
  };

  const rightCluster: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems,
    gap: 10,
    flexShrink: 0,
    justifyContent: "flex-end",
    textAlign: "right",
    minWidth: 0,
  };

  const leftFullRow: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems,
    gap: 12,
    width: "100%",
    minWidth: 0,
    justifyContent: "flex-start",
  };

  let body: ReactNode = null;

  if (split) {
    if (columnLayout === "leftFull") {
      body = (
        <div style={leftFullRow}>
          {leftIcon ? <span style={iconWrap}>{leftIcon}</span> : null}
          <div style={{ flex: 1, minWidth: 0 }}>{left ?? null}</div>
        </div>
      );
    } else if (columnLayout === "rightFull") {
      body = (
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "flex-end",
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems,
              gap: 10,
              maxWidth: "100%",
              justifyContent: "flex-end",
              textAlign: "right",
            }}
          >
            <div style={{ minWidth: 0 }}>{right ?? null}</div>
            {rightIcon ? <span style={iconWrap}>{rightIcon}</span> : null}
          </div>
        </div>
      );
    } else {
      body = (
        <div style={row}>
          {hasLeft ? (
            <div style={leftCluster}>
              {leftIcon ? <span style={iconWrap}>{leftIcon}</span> : null}
              <div style={{ flex: 1, minWidth: 0 }}>{left ?? null}</div>
            </div>
          ) : null}
          {hasRight ? (
            <div style={rightCluster}>
              <div style={{ minWidth: 0 }}>{right ?? null}</div>
              {rightIcon ? <span style={iconWrap}>{rightIcon}</span> : null}
            </div>
          ) : null}
        </div>
      );
    }
  }

  return (
    <div className={className} style={shell} {...rest}>
      {split ? body : children}
    </div>
  );
}
