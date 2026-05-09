import {
  forwardRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
  type ReactNode,
} from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";

export type ButtonShape = "square" | "rounded" | "pill" | "circle";

/** `md` = default / medium. */
export type ButtonSize = "sm" | "md" | "lg" | "xl";

/** Includes native `<button>` handlers (`onClick`, `onKeyDown`, …) via spread. */
export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color"> & {
  /** Visual preset; overridden by `backgroundColor` / `textColor` where noted */
  variant?: ButtonVariant;
  /** Default corner style; use `borderRadius` to override precisely */
  shape?: ButtonShape;
  /** Corner radius: number = px, string = any CSS value (e.g. `"12px"`, `"1rem"`) */
  borderRadius?: number | string;
  /** Size scale — padding & typography (`md` is the default “medium”) */
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  /**
   * Compact icon-only layout. Also inferred when there is no label but an icon is set.
   * Use `aria-label` for accessibility when there is no visible text.
   */
  iconOnly?: boolean;
  /** Sets `backgroundColor` (overrides variant) */
  backgroundColor?: string;
  /** Sets text and icon color (overrides variant); outline border tracks this color */
  textColor?: string;
};

const VARIANT_BASE: Record<
  ButtonVariant,
  Pick<CSSProperties, "backgroundColor" | "color" | "border">
> = {
  primary: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "1px solid transparent",
  },
  secondary: {
    backgroundColor: "#6b7280",
    color: "#ffffff",
    border: "1px solid transparent",
  },
  outline: {
    backgroundColor: "transparent",
    color: "#2563eb",
    border: "2px solid #2563eb",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "#374151",
    border: "1px solid transparent",
  },
  danger: {
    backgroundColor: "#dc2626",
    color: "#ffffff",
    border: "1px solid transparent",
  },
};

const SHAPE_RADIUS: Record<ButtonShape, string> = {
  square: "4px",
  rounded: "8px",
  pill: "9999px",
  circle: "50%",
};

const SIZE_TOKENS: Record<
  ButtonSize,
  {
    padding: string;
    paddingCompact: string;
    paddingCompactWithLabel: string;
    fontSize: number;
    gap: number;
    iconCircle: number;
  }
> = {
  sm: {
    padding: "4px 10px",
    paddingCompact: "4px",
    paddingCompactWithLabel: "4px 8px",
    fontSize: 12,
    gap: 6,
    iconCircle: 32,
  },
  md: {
    padding: "8px 16px",
    paddingCompact: "8px",
    paddingCompactWithLabel: "6px 12px",
    fontSize: 14,
    gap: 8,
    iconCircle: 40,
  },
  lg: {
    padding: "10px 20px",
    paddingCompact: "10px",
    paddingCompactWithLabel: "8px 14px",
    fontSize: 16,
    gap: 10,
    iconCircle: 44,
  },
  xl: {
    padding: "12px 24px",
    paddingCompact: "12px",
    paddingCompactWithLabel: "10px 16px",
    fontSize: 18,
    gap: 12,
    iconCircle: 48,
  },
};

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const raw = hex.trim().replace("#", "");
  if (raw.length === 3) {
    return {
      r: parseInt(raw[0] + raw[0], 16),
      g: parseInt(raw[1] + raw[1], 16),
      b: parseInt(raw[2] + raw[2], 16),
    };
  }
  if (raw.length === 6) {
    return {
      r: parseInt(raw.slice(0, 2), 16),
      g: parseInt(raw.slice(2, 4), 16),
      b: parseInt(raw.slice(4, 6), 16),
    };
  }
  return null;
}

function outlineHoverBackground(fg: string): string {
  const rgb = hexToRgb(fg);
  if (!rgb) return "rgba(37, 99, 235, 0.1)";
  return `rgba(${rgb.r},${rgb.g},${rgb.b},0.1)`;
}

function hasRenderableLabel(children: ReactNode): boolean {
  if (children === null || children === undefined) return false;
  if (typeof children === "boolean") return false;
  if (typeof children === "string") return children.trim().length > 0;
  if (typeof children === "number") return true;
  return true;
}

function resolveBorderRadius(
  shape: ButtonShape,
  borderRadius: ButtonProps["borderRadius"],
): string {
  if (borderRadius !== undefined && borderRadius !== null) {
    return typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius;
  }
  return SHAPE_RADIUS[shape];
}

function hoverInteractionStyles(args: {
  variant: ButtonVariant;
  hovered: boolean;
  pressed: boolean;
  disabled: boolean | undefined;
  fg: string;
  hasCustomBg: boolean;
}): CSSProperties {
  const { variant, hovered, pressed, disabled, fg, hasCustomBg } = args;
  if (disabled) return {};

  const lift =
    hovered && !pressed ? "translateY(-1px)" : pressed ? "translateY(0)" : undefined;

  if (!hovered && !pressed) {
    return {};
  }

  if (variant === "outline") {
    return {
      transform: lift,
      backgroundColor: hovered || pressed ? outlineHoverBackground(fg) : undefined,
      boxShadow: hovered && !pressed ? "0 2px 8px rgba(15, 23, 42, 0.08)" : undefined,
    };
  }

  if (variant === "ghost") {
    return {
      transform: lift,
      backgroundColor: hovered || pressed ? "rgba(55, 65, 81, 0.1)" : undefined,
      boxShadow: hovered && !pressed ? "0 1px 4px rgba(15, 23, 42, 0.06)" : undefined,
    };
  }

  /* Filled variants (+ custom bg): brighten / shadow */
  return {
    transform: lift,
    filter:
      hovered || pressed
        ? hasCustomBg
          ? pressed
            ? "brightness(0.96)"
            : "brightness(1.06)"
          : pressed
            ? "brightness(0.95)"
            : "brightness(1.08)"
        : undefined,
    boxShadow:
      hovered && !pressed
        ? "0 4px 12px rgba(15, 23, 42, 0.18)"
        : pressed
          ? "0 1px 4px rgba(15, 23, 42, 0.12)"
          : undefined,
  };
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    shape = "rounded",
    size = "md",
    borderRadius,
    leftIcon,
    rightIcon,
    iconOnly = false,
    backgroundColor,
    textColor,
    style,
    className,
    children,
    disabled,
    type = "button",
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
    onBlur,
    ...rest
  },
  ref,
) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const base = VARIANT_BASE[variant];
  const radius = resolveBorderRadius(shape, borderRadius);
  const label = hasRenderableLabel(children);
  const tokens = SIZE_TOKENS[size];

  const compact = iconOnly || (!label && Boolean(leftIcon ?? rightIcon));

  const fg = String(textColor ?? base.color ?? "#111827");
  const bg = backgroundColor ?? base.backgroundColor;
  const hasCustomBg = Boolean(backgroundColor);

  const border =
    variant === "outline"
      ? `2px solid ${fg}`
      : ((base.border as string | undefined) ?? "1px solid transparent");

  const paddingStyle: CSSProperties = compact
    ? shape === "circle"
      ? {
          width: tokens.iconCircle,
          height: tokens.iconCircle,
          padding: 0,
        }
      : label
        ? { padding: tokens.paddingCompactWithLabel }
        : { padding: tokens.paddingCompact }
    : { padding: tokens.padding };

  const slotCount =
    Number(Boolean(leftIcon)) + Number(Boolean(rightIcon)) + Number(Boolean(label));

  const interaction = hoverInteractionStyles({
    variant,
    hovered,
    pressed,
    disabled,
    fg,
    hasCustomBg,
  });

  const buttonStyle: CSSProperties = {
    backgroundColor: bg,
    color: fg,
    border,
    borderRadius: radius,
    transition:
      "background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, filter 0.15s ease, box-shadow 0.15s ease, transform 0.12s ease",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: slotCount >= 2 ? tokens.gap : 0,
    fontFamily: "system-ui, sans-serif",
    fontSize: tokens.fontSize,
    fontWeight: 500,
    lineHeight: 1.25,
    boxSizing: "border-box",
    ...paddingStyle,
    ...interaction,
    ...style,
  };

  const iconWrap = (node: ReactNode) => (
    <span
      style={{
        display: "inline-flex",
        flexShrink: 0,
        alignItems: "center",
        color: fg,
      }}
      aria-hidden={label ? true : undefined}
    >
      {node}
    </span>
  );

  const handleEnter = (e: MouseEvent<HTMLButtonElement>) => {
    setHovered(true);
    onMouseEnter?.(e);
  };

  const handleLeave = (e: MouseEvent<HTMLButtonElement>) => {
    setHovered(false);
    setPressed(false);
    onMouseLeave?.(e);
  };

  const handleDown = (e: MouseEvent<HTMLButtonElement>) => {
    if (!disabled) setPressed(true);
    onMouseDown?.(e);
  };

  const handleUp = (e: MouseEvent<HTMLButtonElement>) => {
    setPressed(false);
    onMouseUp?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLButtonElement>) => {
    setHovered(false);
    setPressed(false);
    onBlur?.(e);
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={className}
      style={buttonStyle}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseDown={handleDown}
      onMouseUp={handleUp}
      onBlur={handleBlur}
      {...rest}
    >
      {leftIcon ? iconWrap(leftIcon) : null}
      {label ? <span style={{ color: fg }}>{children}</span> : null}
      {rightIcon ? iconWrap(rightIcon) : null}
    </button>
  );
});

Button.displayName = "Button";
