import {
  forwardRef,
  useId,
  useState,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

/** Visual scale — maps to padding and font size (native `<input size=` is omitted). */
export type TextFieldSize = "sm" | "md" | "lg";

export type TextFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "children"
> & {
  /** Accessible label; rendered above the input */
  label?: ReactNode;
  /** Hide label visually but keep it for screen readers */
  hideLabel?: boolean;
  /** Hint below the input when there is no `error` */
  helperText?: ReactNode;
  /** Validation message — shows below field and styles border as error */
  error?: ReactNode;
  /** Padding / typography scale */
  size?: TextFieldSize;
  fullWidth?: boolean;
  /** When `type="password"`, adds a show/hide toggle */
  showPasswordToggle?: boolean;
  labels?: {
    showPassword?: string;
    hidePassword?: string;
  };

  /** Icon or prefix inside the field on the left (e.g. calendar for DOB). Decorative icons should set `aria-hidden` on the SVG. */
  startAdornment?: ReactNode;

  style?: CSSProperties;
  className?: string;
  labelStyle?: CSSProperties;
  labelClassName?: string;
  inputWrapperStyle?: CSSProperties;
  inputWrapperClassName?: string;
  inputStyle?: CSSProperties;
  inputClassName?: string;
  helperStyle?: CSSProperties;
  helperClassName?: string;

  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  focusBorderColor?: string;
  errorBorderColor?: string;
  labelColor?: string;
};

const DEFAULT_BG = "#ffffff";
const DEFAULT_TEXT = "#111827";
const DEFAULT_BORDER = "#d1d5db";
const DEFAULT_FOCUS_BORDER = "#2563eb";
const DEFAULT_ERROR_BORDER = "#dc2626";
const DEFAULT_LABEL = "#374151";

const SIZE_TOKENS: Record<
  TextFieldSize,
  {
    py: number;
    pxStart: number;
    pxEnd: number;
    startSlotPaddingLeft: number;
    startSlotGap: number;
    fontSize: number;
    labelFontSize: number;
    helperFontSize: number;
  }
> = {
  sm: {
    py: 6,
    pxStart: 10,
    pxEnd: 10,
    startSlotPaddingLeft: 8,
    startSlotGap: 6,
    fontSize: 13,
    labelFontSize: 12,
    helperFontSize: 11,
  },
  md: {
    py: 10,
    pxStart: 12,
    pxEnd: 12,
    startSlotPaddingLeft: 10,
    startSlotGap: 8,
    fontSize: 14,
    labelFontSize: 13,
    helperFontSize: 12,
  },
  lg: {
    py: 12,
    pxStart: 14,
    pxEnd: 14,
    startSlotPaddingLeft: 12,
    startSlotGap: 8,
    fontSize: 16,
    labelFontSize: 14,
    helperFontSize: 13,
  },
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      label,
      hideLabel = false,
      helperText,
      error,
      size = "md",
      fullWidth = false,
      showPasswordToggle = false,
      labels: labelStrings,
      startAdornment,
      style,
      className,
      labelStyle,
      labelClassName,
      inputWrapperStyle,
      inputWrapperClassName,
      inputStyle,
      inputClassName,
      helperStyle,
      helperClassName,
      backgroundColor = DEFAULT_BG,
      textColor = DEFAULT_TEXT,
      borderColor = DEFAULT_BORDER,
      focusBorderColor = DEFAULT_FOCUS_BORDER,
      errorBorderColor = DEFAULT_ERROR_BORDER,
      labelColor = DEFAULT_LABEL,
      type = "text",
      disabled,
      id: idProp,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = idProp ?? generatedId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    const [focused, setFocused] = useState(false);
    const [visiblePassword, setVisiblePassword] = useState(false);
    const isPassword = type === "password";
    const resolvedType =
      isPassword && showPasswordToggle ? (visiblePassword ? "text" : "password") : type;

    const tokens = SIZE_TOKENS[size];
    const hasError = Boolean(error);
    const hasStart = Boolean(startAdornment);

    const rootStyle: CSSProperties = {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      width: fullWidth ? "100%" : undefined,
      minWidth: fullWidth ? undefined : 280,
      fontFamily: "system-ui, sans-serif",
      ...(hideLabel ? { position: "relative" as const } : null),
      ...style,
    };

    const labelResolvedStyle: CSSProperties = {
      fontSize: tokens.labelFontSize,
      fontWeight: 500,
      color: labelColor,
      ...(hideLabel
        ? {
            position: "absolute",
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: "hidden",
            clip: "rect(0, 0, 0, 0)",
            whiteSpace: "nowrap",
            border: 0,
          }
        : {}),
      ...labelStyle,
    };

    const borderResolved = hasError
      ? errorBorderColor
      : focused
        ? focusBorderColor
        : borderColor;

    const wrapperStyle: CSSProperties = {
      display: "flex",
      alignItems: "stretch",
      gap: 0,
      borderRadius: 8,
      border: `1px solid ${borderResolved}`,
      backgroundColor,
      boxSizing: "border-box",
      overflow: "hidden",
      transition: "border-color 0.15s ease, box-shadow 0.15s ease",
      boxShadow:
        focused && !disabled
          ? hasError
            ? "0 0 0 3px rgba(220, 38, 38, 0.15)"
            : "0 0 0 3px rgba(37, 99, 235, 0.15)"
          : "none",
      ...inputWrapperStyle,
    };

    const inputPadding = `${tokens.py}px ${tokens.pxEnd}px ${tokens.py}px ${
      hasStart ? 0 : tokens.pxStart
    }px`;

    const inputBaseStyle: CSSProperties = {
      flex: 1,
      minWidth: 0,
      padding: inputPadding,
      fontSize: tokens.fontSize,
      lineHeight: 1.25,
      color: textColor,
      backgroundColor: "transparent",
      border: "none",
      outline: "none",
      borderRadius: 0,
      fontFamily: "inherit",
      ...inputStyle,
    };

    const startSlotStyle: CSSProperties = {
      display: "flex",
      alignItems: "center",
      flexShrink: 0,
      paddingLeft: tokens.startSlotPaddingLeft,
      paddingRight: hasStart ? tokens.startSlotGap : 0,
      color: "#6b7280",
    };

    const toggleLabels = {
      show: labelStrings?.showPassword ?? "Show password",
      hide: labelStrings?.hidePassword ?? "Hide password",
    };

    const footer = error ?? helperText;
    const footerId = hasError ? errorId : helperText ? helperId : undefined;
    const footerStyle: CSSProperties = {
      fontSize: tokens.helperFontSize,
      color: hasError ? errorBorderColor : "#6b7280",
      margin: 0,
      ...helperStyle,
    };

    return (
      <div className={className} style={rootStyle}>
        {label !== undefined && label !== null && label !== "" ? (
          <label
            htmlFor={inputId}
            className={labelClassName}
            style={labelResolvedStyle}
          >
            {label}
          </label>
        ) : null}

        <div
          className={inputWrapperClassName}
          style={wrapperStyle}
          onFocusCapture={() => {
            if (!disabled) setFocused(true);
          }}
          onBlurCapture={(e) => {
            const next = e.relatedTarget as Node | null;
            if (!next || !e.currentTarget.contains(next)) setFocused(false);
          }}
        >
          {hasStart ? <span style={startSlotStyle}>{startAdornment}</span> : null}
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            disabled={disabled}
            className={inputClassName}
            style={inputBaseStyle}
            aria-invalid={hasError || undefined}
            aria-describedby={footerId}
            {...rest}
            onFocus={onFocus}
            onBlur={onBlur}
          />
          {isPassword && showPasswordToggle ? (
            <button
              type="button"
              tabIndex={-1}
              disabled={disabled}
              aria-label={visiblePassword ? toggleLabels.hide : toggleLabels.show}
              onClick={() => setVisiblePassword((v) => !v)}
              style={{
                alignSelf: "stretch",
                padding: "0 12px",
                border: "none",
                borderLeft: `1px solid ${borderColor}`,
                background: disabled ? "#f3f4f6" : "transparent",
                color: textColor,
                fontSize: tokens.helperFontSize,
                fontFamily: "inherit",
                cursor: disabled ? "not-allowed" : "pointer",
                borderRadius: "0 7px 7px 0",
                flexShrink: 0,
              }}
            >
              {visiblePassword ? "Hide" : "Show"}
            </button>
          ) : null}
        </div>

        {footer ? (
          <p
            id={footerId}
            className={helperClassName}
            style={footerStyle}
            role={hasError ? "alert" : undefined}
          >
            {footer}
          </p>
        ) : null}
      </div>
    );
  },
);

TextField.displayName = "TextField";
