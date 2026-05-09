import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { ChevronIcon } from "../icons/ChevronIcon";

export type DropdownProps<T> = {
  /** Items to list — any shape; label via `getLabel` or `renderItem` */
  items: readonly T[];
  placeholder?: string;
  disabled?: boolean;

  /** Controlled selected index (`null` = none) */
  selectedIndex?: number | null;
  /** Uncontrolled initial selection */
  defaultSelectedIndex?: number | null;
  /** Fires when user picks a row */
  onSelectionChange?: (index: number, item: T) => void;

  /** Label for trigger & rows when `renderItem` is omitted */
  getLabel?: (item: T, index: number) => string;
  getKey?: (item: T, index: number) => string | number;

  renderItem?: (item: T, index: number, ctx: { selected: boolean }) => ReactNode;

  /**
   * Full trigger UI. Call `toggle()` to open/close (respects disabled / empty items).
   * Use `<ChevronIcon direction={open ? "up" : "down"} />` next to your label.
   */
  renderTrigger?: (ctx: {
    open: boolean;
    toggle: () => void;
    selectedItem: T | undefined;
    selectedIndex: number | null;
    placeholder: string;
    disabled: boolean;
    items: readonly T[];
    /** Wire to your trigger: `id={triggerId}` & `aria-controls={listId}` */
    triggerId: string;
    listId: string;
  }) => ReactNode;

  /** Controlled open */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  alignMenu?: "start" | "end";
  menuMaxHeight?: number | string;
  /** Menu width matches trigger width */
  matchTriggerWidth?: boolean;

  style?: CSSProperties;
  className?: string;
  triggerStyle?: CSSProperties;
  triggerClassName?: string;
  menuStyle?: CSSProperties;
  menuClassName?: string;

  /**
   * Colors — defaults match neutral / blue accent row selection.
   * (`renderTrigger` bypasses trigger colors; style your own trigger.)
   */
  triggerBackgroundColor?: string;
  /** Hover/focus surface on the default trigger button */
  triggerHoverBackgroundColor?: string;
  triggerTextColor?: string;
  triggerBorderColor?: string;

  menuBackgroundColor?: string;
  menuBorderColor?: string;

  itemTextColor?: string;
  /** Row hover (non-selected or over selected) */
  itemHoverBackgroundColor?: string;
  /** Selected row background */
  itemSelectedBackgroundColor?: string;

  /** Optional root ref for tests / positioning */
  rootRef?: RefObject<HTMLDivElement | null>;
};

const DEFAULT_TRIGGER_BG = "#ffffff";
const DEFAULT_TRIGGER_HOVER_BG = "#f9fafb";
const DEFAULT_TRIGGER_TEXT = "#111827";
const DEFAULT_TRIGGER_BORDER = "#d1d5db";
const DEFAULT_TRIGGER_DISABLED_BG = "#f3f4f6";

const DEFAULT_MENU_BG = "#ffffff";
const DEFAULT_MENU_BORDER = "#e5e7eb";

const DEFAULT_ITEM_TEXT = "#111827";
const DEFAULT_ITEM_HOVER_BG = "#f3f4f6";
const DEFAULT_ITEM_SELECTED_BG = "#eff6ff";

function defaultGetLabel<T>(item: T): string {
  if (
    item !== null &&
    typeof item === "object" &&
    "label" in (item as object) &&
    typeof (item as { label?: unknown }).label === "string"
  ) {
    return (item as unknown as { label: string }).label;
  }
  return String(item);
}

export function Dropdown<T>(props: DropdownProps<T>) {
  const {
    items,
    placeholder = "Select…",
    disabled = false,
    selectedIndex: selectedIndexProp,
    defaultSelectedIndex = null,
    onSelectionChange,
    getLabel = (item) => defaultGetLabel(item),
    getKey = (_, index) => index,
    renderItem,
    renderTrigger,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    alignMenu = "start",
    menuMaxHeight = 280,
    matchTriggerWidth = true,
    style,
    className,
    triggerStyle,
    triggerClassName,
    menuStyle,
    menuClassName,
    triggerBackgroundColor = DEFAULT_TRIGGER_BG,
    triggerHoverBackgroundColor = DEFAULT_TRIGGER_HOVER_BG,
    triggerTextColor = DEFAULT_TRIGGER_TEXT,
    triggerBorderColor = DEFAULT_TRIGGER_BORDER,
    menuBackgroundColor = DEFAULT_MENU_BG,
    menuBorderColor = DEFAULT_MENU_BORDER,
    itemTextColor = DEFAULT_ITEM_TEXT,
    itemHoverBackgroundColor = DEFAULT_ITEM_HOVER_BG,
    itemSelectedBackgroundColor = DEFAULT_ITEM_SELECTED_BG,
    rootRef: rootRefProp,
  } = props;

  const internalRootRef = useRef<HTMLDivElement>(null);
  const rootRef = rootRefProp ?? internalRootRef;

  const [openUncontrolled, setOpenUncontrolled] = useState(defaultOpen);
  const isOpenControlled = openProp !== undefined;
  const open = isOpenControlled ? openProp : openUncontrolled;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isOpenControlled) setOpenUncontrolled(next);
      onOpenChange?.(next);
    },
    [isOpenControlled, onOpenChange],
  );

  const [selectedUncontrolled, setSelectedUncontrolled] = useState<number | null>(
    defaultSelectedIndex,
  );
  const isSelectedControlled = selectedIndexProp !== undefined;
  const selectedIndex = isSelectedControlled
    ? (selectedIndexProp ?? null)
    : selectedUncontrolled;

  const listId = useId();
  const buttonId = useId();

  const [triggerHovered, setTriggerHovered] = useState(false);
  const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(null);

  const selectedItem =
    selectedIndex !== null && selectedIndex >= 0 && selectedIndex < items.length
      ? items[selectedIndex]
      : undefined;

  const triggerLabel = useMemo(() => {
    if (selectedItem === undefined) return placeholder;
    return getLabel(selectedItem, selectedIndex!);
  }, [getLabel, placeholder, selectedIndex, selectedItem]);

  const toggle = () => {
    if (disabled || items.length === 0) return;
    setOpen(!open);
  };

  const selectIndex = (index: number) => {
    const item = items[index];
    if (item === undefined) return;
    if (!isSelectedControlled) setSelectedUncontrolled(index);
    onSelectionChange?.(index, item);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;

    const onDocMouseDown = (e: MouseEvent) => {
      const el = rootRef.current;
      if (!el || el.contains(e.target as Node)) return;
      setOpen(false);
    };

    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, rootRef, setOpen]);

  useEffect(() => {
    if (!open) setHoveredItemIndex(null);
  }, [open]);

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!open && items.length > 0) setOpen(true);
    }
  };

  const menuPosition: CSSProperties = {
    position: "absolute",
    top: "100%",
    marginTop: 4,
    zIndex: 1000,
    minWidth: matchTriggerWidth ? "100%" : undefined,
    ...(alignMenu === "end" ? { right: 0 } : { left: 0 }),
    maxHeight: menuMaxHeight,
    overflowY: "auto",
    backgroundColor: menuBackgroundColor,
    border: `1px solid ${menuBorderColor}`,
    borderRadius: 8,
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.12)",
    padding: 4,
    boxSizing: "border-box",
    transition: "background-color 0.15s ease, border-color 0.15s ease",
    ...menuStyle,
  };

  const triggerBgResolved = disabled
    ? DEFAULT_TRIGGER_DISABLED_BG
    : triggerHovered && !disabled
      ? triggerHoverBackgroundColor
      : triggerBackgroundColor;

  const triggerBaseStyle: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    padding: "8px 12px",
    minWidth: 160,
    fontSize: 14,
    fontFamily: "system-ui, sans-serif",
    lineHeight: 1.25,
    color: triggerTextColor,
    backgroundColor: triggerBgResolved,
    border: `1px solid ${triggerBorderColor}`,
    borderRadius: 8,
    cursor:
      disabled || items.length === 0 ? "not-allowed" : open ? "pointer" : "pointer",
    opacity: disabled ? 0.65 : 1,
    boxSizing: "border-box",
    width: matchTriggerWidth ? "100%" : "auto",
    transition:
      "background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease",
    ...triggerStyle,
  };

  return (
    <div ref={rootRef} className={className} style={{ position: "relative", ...style }}>
      {renderTrigger ? (
        renderTrigger({
          open,
          toggle,
          selectedItem,
          selectedIndex,
          placeholder,
          disabled,
          items,
          triggerId: buttonId,
          listId,
        })
      ) : (
        <button
          id={buttonId}
          type="button"
          disabled={disabled || items.length === 0}
          className={triggerClassName}
          style={triggerBaseStyle}
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listId}
          onClick={toggle}
          onKeyDown={onTriggerKeyDown}
          onMouseEnter={() => setTriggerHovered(true)}
          onMouseLeave={() => setTriggerHovered(false)}
        >
          <span
            style={{
              flex: 1,
              textAlign: "left",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: triggerTextColor,
            }}
          >
            {selectedItem === undefined ? placeholder : triggerLabel}
          </span>
          <span style={{ color: triggerTextColor, display: "inline-flex" }}>
            <ChevronIcon direction={open ? "up" : "down"} />
          </span>
        </button>
      )}

      {open && items.length > 0 ? (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={renderTrigger ? undefined : buttonId}
          aria-label={renderTrigger ? "Options" : undefined}
          className={menuClassName}
          style={menuPosition}
        >
          {items.map((item, index) => {
            const key = getKey(item, index);
            const selected = selectedIndex === index;
            const hovered = hoveredItemIndex === index;
            const label = getLabel(item, index);

            const rowBg = hovered
              ? itemHoverBackgroundColor
              : selected
                ? itemSelectedBackgroundColor
                : "transparent";

            return (
              <li
                key={key}
                role="option"
                aria-selected={selected}
                style={{ listStyle: "none", margin: 0, padding: 0 }}
              >
                <button
                  type="button"
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 10px",
                    border: "none",
                    borderRadius: 6,
                    background: rowBg,
                    color: itemTextColor,
                    fontSize: 14,
                    fontFamily: "system-ui, sans-serif",
                    cursor: "pointer",
                    transition: "background-color 0.12s ease, color 0.12s ease",
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setHoveredItemIndex(index)}
                  onMouseLeave={() => setHoveredItemIndex(null)}
                  onClick={() => selectIndex(index)}
                >
                  {renderItem ? (
                    renderItem(item, index, { selected })
                  ) : (
                    <span>{label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
