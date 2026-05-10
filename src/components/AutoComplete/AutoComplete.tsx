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

export type AutoCompleteProps<T> = {
  /**
   * Static items used when `onSearch` is not provided.
   * If `onSearch` is provided, these are treated as initial items.
   */
  items?: readonly T[];

  /** Async search handler; when set, the component will fetch results as you type. */
  onSearch?: (query: string) => Promise<readonly T[]>;

  /** Controlled query */
  query?: string;
  /** Uncontrolled initial query */
  defaultQuery?: string;
  /** Fires on query change (controlled or uncontrolled) */
  onQueryChange?: (query: string) => void;

  /** Fires when user picks an item */
  onSelect?: (item: T, ctx: { query: string; index: number }) => void;

  placeholder?: string;
  disabled?: boolean;
  /** Minimum characters before opening / searching */
  minChars?: number;
  /** Debounce for `onSearch` in ms */
  debounceMs?: number;
  /** Close menu after selection */
  closeOnSelect?: boolean;
  /** Replace input with selected label on selection */
  fillInputOnSelect?: boolean;

  /** Label used for filtering and as default row rendering */
  getLabel?: (item: T, index: number) => string;
  getKey?: (item: T, index: number) => string | number;
  /** Custom row rendering */
  renderItem?: (item: T, index: number, ctx: { active: boolean }) => ReactNode;
  /** Custom filter logic for static `items` */
  filterItem?: (item: T, index: number, query: string) => boolean;

  /** Shows below the input */
  helperText?: ReactNode;
  /** Text shown when there are no results (and query meets `minChars`) */
  noResultsText?: ReactNode;
  /** Optional external loading override (useful if you manage async outside) */
  loading?: boolean;

  style?: CSSProperties;
  className?: string;
  inputStyle?: CSSProperties;
  inputClassName?: string;
  menuStyle?: CSSProperties;
  menuClassName?: string;

  inputBackgroundColor?: string;
  inputTextColor?: string;
  inputBorderColor?: string;
  inputFocusBorderColor?: string;

  menuBackgroundColor?: string;
  menuBorderColor?: string;

  itemTextColor?: string;
  itemHoverBackgroundColor?: string;
  itemActiveBackgroundColor?: string;

  rootRef?: RefObject<HTMLDivElement | null>;
};

const DEFAULT_INPUT_BG = "#ffffff";
const DEFAULT_INPUT_TEXT = "#111827";
const DEFAULT_INPUT_BORDER = "#d1d5db";
const DEFAULT_INPUT_FOCUS_BORDER = "#2563eb";

const DEFAULT_MENU_BG = "#ffffff";
const DEFAULT_MENU_BORDER = "#e5e7eb";

const DEFAULT_ITEM_TEXT = "#111827";
const DEFAULT_ITEM_HOVER_BG = "#f3f4f6";
const DEFAULT_ITEM_ACTIVE_BG = "#eff6ff";

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

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(t);
  }, [delayMs, value]);
  return debounced;
}

export function AutoComplete<T>(props: AutoCompleteProps<T>) {
  const {
    items = [],
    onSearch,
    query: queryProp,
    defaultQuery = "",
    onQueryChange,
    onSelect,
    placeholder = "Search…",
    disabled = false,
    minChars = 0,
    debounceMs = 200,
    closeOnSelect = true,
    fillInputOnSelect = true,
    getLabel = (item) => defaultGetLabel(item),
    getKey = (_item, index) => index,
    renderItem,
    filterItem,
    helperText,
    noResultsText = "No results",
    loading: loadingProp,
    style,
    className,
    inputStyle,
    inputClassName,
    menuStyle,
    menuClassName,
    inputBackgroundColor = DEFAULT_INPUT_BG,
    inputTextColor = DEFAULT_INPUT_TEXT,
    inputBorderColor = DEFAULT_INPUT_BORDER,
    inputFocusBorderColor = DEFAULT_INPUT_FOCUS_BORDER,
    menuBackgroundColor = DEFAULT_MENU_BG,
    menuBorderColor = DEFAULT_MENU_BORDER,
    itemTextColor = DEFAULT_ITEM_TEXT,
    itemHoverBackgroundColor = DEFAULT_ITEM_HOVER_BG,
    itemActiveBackgroundColor = DEFAULT_ITEM_ACTIVE_BG,
    rootRef: rootRefProp,
  } = props;

  const internalRootRef = useRef<HTMLDivElement>(null);
  const rootRef = rootRefProp ?? internalRootRef;
  const inputRef = useRef<HTMLInputElement>(null);

  const isQueryControlled = queryProp !== undefined;
  const [queryUncontrolled, setQueryUncontrolled] = useState(defaultQuery);
  const query = isQueryControlled ? (queryProp ?? "") : queryUncontrolled;

  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);

  const inputId = useId();
  const listId = useId();

  const debouncedQuery = useDebouncedValue(query, debounceMs);

  const [asyncItems, setAsyncItems] = useState<readonly T[]>(items);
  const [asyncLoading, setAsyncLoading] = useState(false);

  const setQuery = useCallback(
    (next: string) => {
      if (!isQueryControlled) setQueryUncontrolled(next);
      onQueryChange?.(next);
    },
    [isQueryControlled, onQueryChange],
  );

  const canOpen = !disabled && query.trim().length >= minChars;

  useEffect(() => {
    if (!onSearch) return;
    setAsyncItems(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSearch]);

  useEffect(() => {
    if (!onSearch) return;
    const q = debouncedQuery.trim();
    if (q.length < minChars) {
      setAsyncItems(items);
      setAsyncLoading(false);
      return;
    }

    let cancelled = false;
    setAsyncLoading(true);
    onSearch(q)
      .then((res) => {
        if (cancelled) return;
        setAsyncItems(res);
      })
      .catch(() => {
        if (cancelled) return;
        setAsyncItems([]);
      })
      .finally(() => {
        if (cancelled) return;
        setAsyncLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, items, minChars, onSearch]);

  const staticFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < minChars) return [] as readonly T[];
    if (filterItem) return items.filter((it, i) => filterItem(it, i, query));
    if (q.length === 0) return items;
    return items.filter((it, i) => getLabel(it, i).toLowerCase().includes(q));
  }, [filterItem, getLabel, items, minChars, query]);

  const shownItems = onSearch ? asyncItems : staticFiltered;
  const loading = loadingProp ?? (onSearch ? asyncLoading : false);

  const visible = open && canOpen;
  const hasResults = shownItems.length > 0;
  const showEmpty =
    visible && !loading && !hasResults && query.trim().length >= minChars;

  useEffect(() => {
    if (!visible) setActiveIndex(-1);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    setActiveIndex((prev) => {
      const max = shownItems.length - 1;
      if (max < 0) return -1;
      if (prev < 0) return 0;
      return Math.min(prev, max);
    });
  }, [shownItems.length, visible]);

  useEffect(() => {
    if (!visible) return;

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
  }, [rootRef, visible]);

  const commitSelect = (index: number) => {
    const item = shownItems[index];
    if (item === undefined) return;
    onSelect?.(item, { query, index });
    if (fillInputOnSelect) setQuery(getLabel(item, index));
    if (closeOnSelect) setOpen(false);
  };

  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!visible) setOpen(true);
      setActiveIndex((i) => {
        const max = shownItems.length - 1;
        if (max < 0) return -1;
        return Math.min(i < 0 ? 0 : i + 1, max);
      });
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max((i < 0 ? shownItems.length : i) - 1, 0));
      return;
    }

    if (e.key === "Enter") {
      if (!visible) return;
      e.preventDefault();
      if (activeIndex >= 0) commitSelect(activeIndex);
      return;
    }

    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
  };

  const rootBase: CSSProperties = {
    position: "relative",
    fontFamily: "system-ui, sans-serif",
    ...style,
  };

  const inputBase: CSSProperties = {
    width: 320,
    padding: "10px 12px",
    fontSize: 14,
    lineHeight: 1.25,
    color: inputTextColor,
    backgroundColor: inputBackgroundColor,
    border: `1px solid ${focused ? inputFocusBorderColor : inputBorderColor}`,
    borderRadius: 8,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    ...(focused ? { boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.15)" } : null),
    ...inputStyle,
  };

  const menuBase: CSSProperties = {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: 6,
    zIndex: 1000,
    maxHeight: 280,
    overflowY: "auto",
    backgroundColor: menuBackgroundColor,
    border: `1px solid ${menuBorderColor}`,
    borderRadius: 8,
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.12)",
    padding: 4,
    boxSizing: "border-box",
    ...menuStyle,
  };

  return (
    <div ref={rootRef} className={className} style={rootBase}>
      <input
        id={inputId}
        ref={inputRef}
        className={inputClassName}
        style={inputBase}
        type="text"
        value={query}
        disabled={disabled}
        placeholder={placeholder}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={visible}
        aria-controls={listId}
        onChange={(e) => {
          const next = e.target.value;
          setQuery(next);
          if (!disabled) setOpen(true);
        }}
        onKeyDown={onInputKeyDown}
        onFocus={() => {
          setFocused(true);
          if (canOpen) setOpen(true);
        }}
        onBlur={() => setFocused(false)}
      />

      {helperText ? (
        <div style={{ marginTop: 6, fontSize: 12, color: "#6b7280" }}>{helperText}</div>
      ) : null}

      {visible ? (
        <div role="presentation" style={menuBase} className={menuClassName}>
          {loading ? (
            <div style={{ padding: "10px 10px", fontSize: 13, color: "#6b7280" }}>
              Loading…
            </div>
          ) : null}

          {showEmpty ? (
            <div style={{ padding: "10px 10px", fontSize: 13, color: "#6b7280" }}>
              {noResultsText}
            </div>
          ) : null}

          {!loading && hasResults ? (
            <ul
              id={listId}
              role="listbox"
              aria-labelledby={inputId}
              style={{ listStyle: "none", margin: 0, padding: 0 }}
            >
              {shownItems.map((item, index) => {
                const key = getKey(item, index);
                const active = index === activeIndex || index === hoveredIndex;
                const label = getLabel(item, index);
                return (
                  <li key={key} role="option" aria-selected={index === activeIndex}>
                    <button
                      type="button"
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "9px 10px",
                        border: "none",
                        borderRadius: 6,
                        background: active
                          ? itemActiveBackgroundColor
                          : itemHoverBackgroundColor && hoveredIndex === index
                            ? itemHoverBackgroundColor
                            : "transparent",
                        color: itemTextColor,
                        fontSize: 14,
                        fontFamily: "system-ui, sans-serif",
                        cursor: "pointer",
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(-1)}
                      onFocus={() => setActiveIndex(index)}
                      onClick={() => commitSelect(index)}
                    >
                      {renderItem ? renderItem(item, index, { active }) : label}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
