import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

export type HoverTooltipPlacement = "top" | "bottom" | "left" | "right";

export type HoverTooltipProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children" | "content"
> & {
  content: ReactNode;
  children: ReactNode;

  placement?: HoverTooltipPlacement;
  offset?: number;
  openDelayMs?: number;
  closeDelayMs?: number;

  disabled?: boolean;

  /** Tooltip panel background (default dark slate `#1e293b`) */
  backgroundColor?: string;
  /** Tooltip panel text / icon color (default near-white `#f8fafc`) */
  color?: string;
  radius?: number;
  maxWidth?: number | string;
  fontSize?: number | string;
  zIndex?: number;

  panelStyle?: CSSProperties;
  panelClassName?: string;
};

const DEFAULT_BG = "#1e293b";
const DEFAULT_FG = "#f8fafc";

function chainFocusHandler(
  prev: ((e: FocusEvent<HTMLElement>) => void) | undefined,
  next: (e: FocusEvent<HTMLElement>) => void,
): (e: FocusEvent<HTMLElement>) => void {
  return (e) => {
    prev?.(e);
    next(e);
  };
}

function cloneWithFocusA11y(
  child: ReactElement,
  extras: {
    describedBy?: string;
    onFocus: (e: FocusEvent<HTMLElement>) => void;
    onBlur: (e: FocusEvent<HTMLElement>) => void;
  },
): ReactElement {
  const p = child.props as Record<string, unknown>;
  const prevDesc = p["aria-describedby"] as string | undefined;
  const mergedDesc =
    extras.describedBy && prevDesc
      ? `${prevDesc} ${extras.describedBy}`
      : (extras.describedBy ?? prevDesc);

  return cloneElement(child, {
    "aria-describedby": mergedDesc,
    onFocus: chainFocusHandler(p.onFocus as never, extras.onFocus),
    onBlur: chainFocusHandler(p.onBlur as never, extras.onBlur),
  } as never);
}

function getSingleChildElement(children: ReactNode): ReactElement | null {
  try {
    const c = Children.only(children);
    return isValidElement(c) ? c : null;
  } catch {
    return null;
  }
}

function oppositePlacement(p: HoverTooltipPlacement): HoverTooltipPlacement {
  switch (p) {
    case "top":
      return "bottom";
    case "bottom":
      return "top";
    case "left":
      return "right";
    case "right":
      return "left";
    default:
      return "top";
  }
}

function rawPlacementCoords(
  place: HoverTooltipPlacement,
  t: DOMRect,
  panel: DOMRect,
  gap: number,
): { top: number; left: number } {
  switch (place) {
    case "top":
      return {
        top: t.top - panel.height - gap,
        left: t.left + (t.width - panel.width) / 2,
      };
    case "bottom":
      return {
        top: t.bottom + gap,
        left: t.left + (t.width - panel.width) / 2,
      };
    case "left":
      return {
        top: t.top + (t.height - panel.height) / 2,
        left: t.left - panel.width - gap,
      };
    case "right":
      return {
        top: t.top + (t.height - panel.height) / 2,
        left: t.right + gap,
      };
    default:
      return { top: t.top - panel.height - gap, left: t.left };
  }
}

function rectFitsViewport(
  top: number,
  left: number,
  panel: DOMRect,
  pad: number,
): boolean {
  return (
    top >= pad &&
    left >= pad &&
    top + panel.height <= window.innerHeight - pad &&
    left + panel.width <= window.innerWidth - pad
  );
}

function clampToViewport(
  top: number,
  left: number,
  panel: DOMRect,
  pad: number,
): { top: number; left: number } {
  const maxLeft = Math.max(pad, window.innerWidth - panel.width - pad);
  const maxTop = Math.max(pad, window.innerHeight - panel.height - pad);
  return {
    top: Math.min(Math.max(top, pad), maxTop),
    left: Math.min(Math.max(left, pad), maxLeft),
  };
}

export function HoverTooltip({
  content,
  children,
  placement = "top",
  offset = 8,
  openDelayMs = 400,
  closeDelayMs = 100,
  disabled = false,
  backgroundColor = DEFAULT_BG,
  color = DEFAULT_FG,
  radius = 6,
  maxWidth = 280,
  fontSize = 12,
  zIndex = 10_000,
  panelStyle,
  panelClassName,
  style,
  className,
  ...rest
}: HoverTooltipProps) {
  const tooltipId = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleOpen = useCallback(() => {
    if (disabled) return;
    clearTimers();
    openTimerRef.current = setTimeout(() => setOpen(true), openDelayMs);
  }, [clearTimers, disabled, openDelayMs]);

  const scheduleClose = useCallback(() => {
    clearTimers();
    closeTimerRef.current = setTimeout(() => setOpen(false), closeDelayMs);
  }, [clearTimers, closeDelayMs]);

  const openNow = useCallback(() => {
    if (disabled) return;
    clearTimers();
    setOpen(true);
  }, [clearTimers, disabled]);

  const closeNow = useCallback(() => {
    clearTimers();
    setOpen(false);
  }, [clearTimers]);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    const panel = panelRef.current;
    if (!trigger || !panel) return;

    const t = trigger.getBoundingClientRect();
    const p = panel.getBoundingClientRect();
    const gap = offset;
    const pad = 8;

    let { top, left } = rawPlacementCoords(placement, t, p, gap);

    if (!rectFitsViewport(top, left, p, pad)) {
      const alt = oppositePlacement(placement);
      const altCoords = rawPlacementCoords(alt, t, p, gap);
      if (rectFitsViewport(altCoords.top, altCoords.left, p, pad)) {
        top = altCoords.top;
        left = altCoords.left;
      }
    }

    const clamped = clampToViewport(top, left, p, pad);
    setCoords({ top: clamped.top, left: clamped.left });
  }, [offset, placement]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, content, placement, updatePosition]);

  useEffect(() => {
    if (!open) return;

    const onScrollOrResize = () => updatePosition();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeNow();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, closeNow]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const panelStyleMerged: CSSProperties = useMemo(
    () => ({
      position: "fixed",
      top: coords.top,
      left: coords.left,
      zIndex,
      maxWidth,
      padding: "6px 10px",
      borderRadius: radius,
      backgroundColor,
      color,
      fontSize,
      fontFamily: "system-ui, sans-serif",
      lineHeight: 1.35,
      boxShadow: "0 4px 14px rgba(15, 23, 42, 0.22)",
      pointerEvents: "none",
      ...panelStyle,
    }),
    [
      backgroundColor,
      color,
      coords.left,
      coords.top,
      fontSize,
      maxWidth,
      panelStyle,
      radius,
      zIndex,
    ],
  );

  const describedByToken = open ? tooltipId : undefined;
  const singleEl = getSingleChildElement(children);

  const triggerInner = singleEl ? (
    cloneWithFocusA11y(singleEl, {
      describedBy: describedByToken,
      onFocus: openNow,
      onBlur: scheduleClose,
    })
  ) : (
    <span aria-describedby={describedByToken}>{children}</span>
  );

  const tooltipPanel =
    open && content ? (
      <div
        ref={panelRef}
        id={tooltipId}
        role="tooltip"
        className={panelClassName}
        style={panelStyleMerged}
      >
        {content}
      </div>
    ) : null;

  const portalEl =
    tooltipPanel && typeof document !== "undefined" && document.body
      ? createPortal(tooltipPanel, document.body)
      : null;

  return (
    <>
      <span
        ref={triggerRef}
        style={{
          display: "inline-flex",
          verticalAlign: "middle",
          ...style,
        }}
        className={className}
        onMouseEnter={(e) => {
          rest.onMouseEnter?.(e);
          scheduleOpen();
        }}
        onMouseLeave={(e) => {
          rest.onMouseLeave?.(e);
          scheduleClose();
        }}
        {...rest}
      >
        {triggerInner}
      </span>
      {portalEl}
    </>
  );
}
