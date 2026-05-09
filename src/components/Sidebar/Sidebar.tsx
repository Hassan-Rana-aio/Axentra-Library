import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";

export type SidebarNavItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  items?: SidebarNavItem[];
};

export type SidebarLogoutConfig = {
  label?: string;
  icon?: ReactNode;
  onClick: () => void;
};

export type SidebarProps = Omit<
  HTMLAttributes<HTMLElement>,
  "children" | "onSelect"
> & {
  items: readonly SidebarNavItem[];
  activeId?: string;
  defaultActiveId?: string;
  onSelect?: (id: string, item: SidebarNavItem, path: SidebarNavItem[]) => void;
  parentSelectable?: boolean;

  /** Expanded (open) rail width — used when `collapsed` is false */
  width?: number | string;
  /** Narrow rail width when sidebar is collapsed (icon-only top level) */
  collapsedWidth?: number | string;
  subTabIndentPx?: number;

  /** When true, sidebar stretches vertically (at least full viewport). */
  fullHeight?: boolean;
  /**
   * `viewport` — `min-height: 100vh` (works standalone / Storybook canvas).
   * `fill` — also `height: 100%` + `align-self: stretch` for flex layouts (parent row should use `min-height: 100vh` + `align-items: stretch`).
   */
  fullHeightMode?: "viewport" | "fill";

  sidebarBackgroundColor?: string;
  tabBackgroundColor?: string;
  tabHoverBackgroundColor?: string;
  tabActiveBackgroundColor?: string;
  tabTextColor?: string;
  tabActiveTextColor?: string;
  accentColor?: string;

  /** Collapsed = narrow rail, labels hidden (root icons only). Uncollapsed = full width + labels + nested items. */
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Show rail toggle control */
  showCollapseToggle?: boolean;
  /**
   * `edge` — floating half-pill on the right border, vertically centered (default).
   * `rail` — full-width row at top or bottom (`collapseTogglePlacement`).
   */
  collapseToggleVariant?: "edge" | "rail";
  collapseTogglePlacement?: "top" | "bottom";
  /** Accessible label for the collapse toggle */
  collapseToggleLabel?: string;
  /** Background of the edge handle (half-pill). */
  collapseHandleBackgroundColor?: string;
  /** Chevron color on the edge handle. */
  collapseHandleIconColor?: string;
  /** Hover background for the edge handle. */
  collapseHandleHoverBackgroundColor?: string;

  /** Optional logout row — uses danger styling props below */
  logout?: SidebarLogoutConfig;
  logoutBackgroundColor?: string;
  logoutHoverBackgroundColor?: string;
  logoutTextColor?: string;

  defaultExpandedIds?: readonly string[];
};

const DEFAULT_SIDEBAR_BG = "#f1f5f9";
const DEFAULT_TAB_BG = "transparent";
const DEFAULT_TAB_HOVER = "#e2e8f0";
const DEFAULT_TAB_ACTIVE = "#dbeafe";
const DEFAULT_TAB_TEXT = "#334155";
const DEFAULT_TAB_ACTIVE_TEXT = "#1e40af";
const DEFAULT_ACCENT = "#64748b";

const DEFAULT_LOGOUT_TEXT = "#fca5a5";
const DEFAULT_LOGOUT_HOVER_BG = "rgba(239, 68, 68, 0.18)";
const DEFAULT_LOGOUT_BG = "transparent";

/** Compact edge tab fill */
const DEFAULT_COLLAPSE_HANDLE_BG = "rgb(183, 186, 195)";
const DEFAULT_COLLAPSE_HANDLE_ICON = "#334155";
const DEFAULT_COLLAPSE_HANDLE_HOVER_BG = "rgb(168, 171, 180)";

function findAncestorIds(
  nodes: readonly SidebarNavItem[],
  targetId: string,
  stack: string[] = [],
): string[] | null {
  for (const node of nodes) {
    if (node.id === targetId) return stack;
    if (node.items?.length) {
      const found = findAncestorIds(node.items, targetId, [...stack, node.id]);
      if (found !== null) return found;
    }
  }
  return null;
}

function MiniChevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      style={{
        flexShrink: 0,
        transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
        transition: "transform 0.15s ease",
      }}
    >
      <path
        d="M6 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RailCollapseToggleIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={collapsed ? "M9 6l6 6-6 6" : "M15 6l-6 6 6 6"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Open rail: « collapse; narrow rail: » expand */
function DoubleChevronEdgeIcon({ mode }: { mode: "collapseLeft" | "expandRight" }) {
  const d =
    mode === "collapseLeft"
      ? "M13 2l-6 6 6 6M19 2l-6 6 6 6"
      : "M11 2l6 6 -6 6M5 2l6 6 -6 6";
  return (
    <svg width="15" height="11" viewBox="0 0 24 16" fill="none" aria-hidden>
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Sidebar({
  items,
  activeId: activeIdProp,
  defaultActiveId = "",
  onSelect,
  parentSelectable = false,
  width = 260,
  collapsedWidth = 72,
  subTabIndentPx = 14,
  fullHeight = true,
  fullHeightMode = "viewport",
  sidebarBackgroundColor = DEFAULT_SIDEBAR_BG,
  tabBackgroundColor = DEFAULT_TAB_BG,
  tabHoverBackgroundColor = DEFAULT_TAB_HOVER,
  tabActiveBackgroundColor = DEFAULT_TAB_ACTIVE,
  tabTextColor = DEFAULT_TAB_TEXT,
  tabActiveTextColor = DEFAULT_TAB_ACTIVE_TEXT,
  accentColor = DEFAULT_ACCENT,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  showCollapseToggle = true,
  collapseToggleVariant = "edge",
  collapseTogglePlacement = "bottom",
  collapseToggleLabel = "Toggle sidebar",
  collapseHandleBackgroundColor = DEFAULT_COLLAPSE_HANDLE_BG,
  collapseHandleIconColor = DEFAULT_COLLAPSE_HANDLE_ICON,
  collapseHandleHoverBackgroundColor = DEFAULT_COLLAPSE_HANDLE_HOVER_BG,
  logout,
  logoutBackgroundColor = DEFAULT_LOGOUT_BG,
  logoutHoverBackgroundColor = DEFAULT_LOGOUT_HOVER_BG,
  logoutTextColor = DEFAULT_LOGOUT_TEXT,
  defaultExpandedIds,
  style,
  className,
  ...rest
}: SidebarProps) {
  const [internalActive, setInternalActive] = useState(defaultActiveId);
  const activeId = activeIdProp !== undefined ? activeIdProp : internalActive;

  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const collapsedControlled = collapsedProp !== undefined;
  const collapsed = collapsedControlled ? collapsedProp : internalCollapsed;

  const setCollapsed = useCallback(
    (next: boolean) => {
      if (!collapsedControlled) setInternalCollapsed(next);
      onCollapsedChange?.(next);
    },
    [collapsedControlled, onCollapsedChange],
  );

  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const s = new Set<string>(defaultExpandedIds ?? []);
    const seed = activeIdProp !== undefined ? activeIdProp : defaultActiveId;
    if (seed) findAncestorIds(items, seed)?.forEach((id) => s.add(id));
    return s;
  });

  useEffect(() => {
    if (!activeId) return;
    const anc = findAncestorIds(items, activeId);
    if (!anc?.length) return;
    setExpandedIds((prev) => {
      const n = new Set(prev);
      anc.forEach((id) => n.add(id));
      return n;
    });
  }, [activeId, items]);

  const toggleSection = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }, []);

  const emitSelect = useCallback(
    (item: SidebarNavItem, path: SidebarNavItem[]) => {
      if (activeIdProp === undefined) setInternalActive(item.id);
      onSelect?.(item.id, item, path);
    },
    [activeIdProp, onSelect],
  );

  const appliedWidth = collapsed ? collapsedWidth : width;

  const shell: CSSProperties = {
    width: appliedWidth,
    minWidth: 0,
    boxSizing: "border-box",
    backgroundColor: sidebarBackgroundColor,
    display: "flex",
    flexDirection: "column",
    padding: 10,
    gap: 8,
    fontFamily: "system-ui, sans-serif",
    transition: "width 0.2s ease, background-color 0.15s ease",
    ...style,
  };

  if (fullHeight) {
    shell.minHeight = "100vh";
    if (fullHeightMode === "fill") {
      shell.height = "100%";
      shell.alignSelf = "stretch";
      shell.flexShrink = 0;
    }
  }

  if (showCollapseToggle && collapseToggleVariant === "edge") {
    shell.position = "relative";
    shell.overflow = "visible";
  }

  const toggleRail = () => setCollapsed(!collapsed);

  const renderEdgeCollapseHandle = () =>
    showCollapseToggle && collapseToggleVariant === "edge" ? (
      <button
        type="button"
        aria-expanded={!collapsed}
        aria-label={collapseToggleLabel}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={toggleRail}
        style={{
          position: "absolute",
          left: "100%",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: 0,
          padding: "5px 8px 5px 6px",
          width: "auto",
          minHeight: 26,
          border: "none",
          borderRadius: "0 999px 999px 0",
          backgroundColor: collapseHandleBackgroundColor,
          color: collapseHandleIconColor,
          cursor: "pointer",
          boxShadow: "0 1px 2px rgba(15, 23, 42, 0.14)",
          outline: "none",
          WebkitTapHighlightColor: "transparent",
          transition: "background-color 0.15s ease, box-shadow 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = collapseHandleHoverBackgroundColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = collapseHandleBackgroundColor;
        }}
        onFocus={(e) => {
          const el = e.currentTarget;
          el.style.outline = "none";
          if (el.matches?.(":focus-visible")) {
            el.style.boxShadow = `0 0 0 2px ${accentColor}`;
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = "0 1px 2px rgba(15, 23, 42, 0.14)";
        }}
      >
        <DoubleChevronEdgeIcon mode={collapsed ? "expandRight" : "collapseLeft"} />
      </button>
    ) : null;

  const renderRailCollapseToggle = () =>
    showCollapseToggle && collapseToggleVariant === "rail" ? (
      <button
        type="button"
        aria-expanded={!collapsed}
        aria-label={collapseToggleLabel}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={toggleRail}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          gap: 10,
          width: "100%",
          padding: "10px 12px",
          borderRadius: 8,
          border: "none",
          color: tabTextColor,
          backgroundColor: tabBackgroundColor,
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 500,
          outline: "none",
          WebkitTapHighlightColor: "transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = tabHoverBackgroundColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = tabBackgroundColor;
        }}
        onFocus={(e) => {
          const el = e.currentTarget;
          el.style.outline = "none";
          if (el.matches?.(":focus-visible")) {
            el.style.boxShadow = `0 0 0 2px ${accentColor}`;
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <span style={{ color: accentColor, display: "inline-flex" }}>
          <RailCollapseToggleIcon collapsed={collapsed} />
        </span>
        {!collapsed ? (
          <span style={{ flex: 1, textAlign: "left" }}>Hide menu</span>
        ) : null}
      </button>
    ) : null;

  const logoutBtn = logout ? (
    <button
      type="button"
      onClick={logout.onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        gap: 10,
        width: "100%",
        padding: "10px 12px",
        borderRadius: 8,
        border: "none",
        cursor: "pointer",
        fontSize: 14,
        fontWeight: 600,
        color: logoutTextColor,
        backgroundColor: logoutBackgroundColor,
        transition: "background-color 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = logoutHoverBackgroundColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = logoutBackgroundColor;
      }}
    >
      {logout.icon ? (
        <span style={{ display: "inline-flex" }}>{logout.icon}</span>
      ) : null}
      {!collapsed ? (
        <span style={{ flex: 1, textAlign: "left" }}>{logout.label ?? "Log out"}</span>
      ) : null}
    </button>
  ) : null;

  const renderRows = (
    nodes: readonly SidebarNavItem[],
    depth: number,
    path: SidebarNavItem[],
  ): ReactNode => {
    return nodes.map((node) => {
      const hasKids = Boolean(node.items?.length);
      const expanded = expandedIds.has(node.id);
      const isActive = !hasKids && activeId === node.id;
      const padLeft =
        collapsed && depth === 0
          ? 0
          : 10 + depth * (collapsed ? Math.min(subTabIndentPx, 8) : subTabIndentPx);

      const rowBase: CSSProperties = {
        display: "flex",
        alignItems: "center",
        gap: collapsed ? 0 : 10,
        width: "100%",
        textAlign: "left",
        padding: collapsed ? "10px 8px" : "10px 12px",
        paddingLeft: collapsed && depth === 0 ? 8 : padLeft,
        justifyContent: collapsed && depth === 0 ? "center" : undefined,
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 14,
        fontWeight: isActive ? 600 : 500,
        color: isActive ? tabActiveTextColor : tabTextColor,
        backgroundColor: isActive ? tabActiveBackgroundColor : tabBackgroundColor,
        transition:
          "background-color 0.15s ease, color 0.15s ease, font-weight 0.15s ease",
        boxSizing: "border-box",
      };

      if (!hasKids) {
        return (
          <button
            key={node.id}
            type="button"
            style={rowBase}
            aria-current={isActive ? "page" : undefined}
            title={collapsed ? node.label : undefined}
            onMouseEnter={(e) => {
              if (!isActive)
                e.currentTarget.style.backgroundColor = tabHoverBackgroundColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isActive
                ? tabActiveBackgroundColor
                : tabBackgroundColor;
            }}
            onClick={() => emitSelect(node, path)}
          >
            {node.icon ? (
              <span style={{ display: "inline-flex", color: "inherit" }}>
                {node.icon}
              </span>
            ) : null}
            {!collapsed ? (
              <span style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
                {node.label}
              </span>
            ) : null}
          </button>
        );
      }

      if (collapsed) {
        return (
          <button
            key={node.id}
            type="button"
            style={{
              ...rowBase,
              fontWeight: 600,
              color: tabTextColor,
              backgroundColor: tabBackgroundColor,
            }}
            title={node.label}
            onClick={() => {
              setCollapsed(false);
              setExpandedIds((prev) => {
                const n = new Set(prev);
                n.add(node.id);
                return n;
              });
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = tabHoverBackgroundColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = tabBackgroundColor;
            }}
          >
            {node.icon ? (
              <span style={{ display: "inline-flex" }}>{node.icon}</span>
            ) : (
              <span style={{ fontSize: 12, fontWeight: 700 }}>•••</span>
            )}
          </button>
        );
      }

      const onParentClick = () => {
        if (parentSelectable) emitSelect(node, path);
        toggleSection(node.id);
      };

      return (
        <div key={node.id} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <button
            type="button"
            style={{
              ...rowBase,
              fontWeight: 600,
              color: tabTextColor,
              backgroundColor: tabBackgroundColor,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = tabHoverBackgroundColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = tabBackgroundColor;
            }}
            onClick={onParentClick}
          >
            <span style={{ color: accentColor, display: "inline-flex" }}>
              <MiniChevron expanded={expanded} />
            </span>
            {node.icon ? (
              <span style={{ display: "inline-flex", color: "inherit" }}>
                {node.icon}
              </span>
            ) : null}
            <span style={{ flex: 1, minWidth: 0 }}>{node.label}</span>
          </button>
          {expanded ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {renderRows(node.items!, depth + 1, [...path, node])}
            </div>
          ) : null}
        </div>
      );
    });
  };

  const scrollRegion: CSSProperties = {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  };

  const footerStack: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    flexShrink: 0,
    paddingTop: 8,
    borderTop: `1px solid ${accentColor}`,
    opacity: 0.92,
  };

  const showFooter =
    Boolean(logout) ||
    (showCollapseToggle &&
      collapseToggleVariant === "rail" &&
      collapseTogglePlacement === "bottom");

  return (
    <nav className={className} style={shell} aria-label="Sidebar" {...rest}>
      {renderEdgeCollapseHandle()}
      {showCollapseToggle &&
      collapseToggleVariant === "rail" &&
      collapseTogglePlacement === "top"
        ? renderRailCollapseToggle()
        : null}

      <div style={scrollRegion}>{renderRows(items, 0, [])}</div>

      {showFooter ? (
        <div style={footerStack}>
          {showCollapseToggle &&
          collapseToggleVariant === "rail" &&
          collapseTogglePlacement === "bottom"
            ? renderRailCollapseToggle()
            : null}
          {logoutBtn}
        </div>
      ) : null}
    </nav>
  );
}
