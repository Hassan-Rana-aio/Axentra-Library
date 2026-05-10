import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";

/** Matches `TextField` scale for consistent forms */
export type TextAreaSize = "sm" | "md" | "lg";

export type TextAreaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size"
> & {
  label?: ReactNode;
  hideLabel?: boolean;
  helperText?: ReactNode;
  error?: ReactNode;
  size?: TextAreaSize;
  fullWidth?: boolean;
  /** Character counter — requires `maxLength` on the textarea */
  showCount?: boolean;

  style?: CSSProperties;
  className?: string;
  labelStyle?: CSSProperties;
  labelClassName?: string;
  textareaWrapperStyle?: CSSProperties;
  textareaWrapperClassName?: string;
  textareaStyle?: CSSProperties;
  textareaClassName?: string;
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
  TextAreaSize,
  {
    py: number;
    px: number;
    fontSize: number;
    labelFontSize: number;
    helperFontSize: number;
  }
> = {
  sm: { py: 8, px: 10, fontSize: 13, labelFontSize: 12, helperFontSize: 11 },
  md: { py: 10, px: 12, fontSize: 14, labelFontSize: 13, helperFontSize: 12 },
  lg: { py: 12, px: 14, fontSize: 16, labelFontSize: 14, helperFontSize: 13 },
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea(
    {
      label,
      hideLabel = false,
      helperText,
      error,
      size = "md",
      fullWidth = false,
      showCount = false,
      style,
      className,
      labelStyle,
      labelClassName,
      textareaWrapperStyle,
      textareaWrapperClassName,
      textareaStyle,
      textareaClassName,
      helperStyle,
      helperClassName,
      backgroundColor = DEFAULT_BG,
      textColor = DEFAULT_TEXT,
      borderColor = DEFAULT_BORDER,
      focusBorderColor = DEFAULT_FOCUS_BORDER,
      errorBorderColor = DEFAULT_ERROR_BORDER,
      labelColor = DEFAULT_LABEL,
      disabled,
      id: idProp,
      rows = 4,
      maxLength,
      value,
      defaultValue,
      onFocus,
      onBlur,
      onChange,
      ...rest
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = idProp ?? generatedId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;

    const [focused, setFocused] = useState(false);
    const [uncontrolledLen, setUncontrolledLen] = useState(() =>
      typeof defaultValue === "string" ? defaultValue.length : 0,
    );

    const tokens = SIZE_TOKENS[size];
    const hasError = Boolean(error);

    const borderResolved = hasError
      ? errorBorderColor
      : focused
        ? focusBorderColor
        : borderColor;

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

    const wrapperStyle: CSSProperties = {
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
      ...textareaWrapperStyle,
    };

    const textareaBaseStyle: CSSProperties = {
      display: "block",
      width: "100%",
      minHeight: 0,
      padding: `${tokens.py}px ${tokens.px}px`,
      fontSize: tokens.fontSize,
      lineHeight: 1.45,
      color: textColor,
      backgroundColor: "transparent",
      border: "none",
      outline: "none",
      resize: "vertical",
      fontFamily: "inherit",
      ...textareaStyle,
    };

    const footer = error ?? helperText;
    const footerId = hasError ? errorId : helperText ? helperId : undefined;

    const footerStyle: CSSProperties = {
      fontSize: tokens.helperFontSize,
      color: hasError ? errorBorderColor : "#6b7280",
      margin: 0,
      ...helperStyle,
    };

    const length = typeof value === "string" ? value.length : uncontrolledLen;

    const showCounter = Boolean(showCount && maxLength !== undefined);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      if (value === undefined) setUncontrolledLen(e.target.value.length);
      onChange?.(e);
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

        <div className={textareaWrapperClassName} style={wrapperStyle}>
          <textarea
            ref={ref}
            id={inputId}
            rows={rows}
            disabled={disabled}
            maxLength={maxLength}
            value={value}
            defaultValue={defaultValue}
            className={textareaClassName}
            style={textareaBaseStyle}
            aria-invalid={hasError || undefined}
            aria-describedby={footerId}
            {...rest}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            onChange={handleChange}
          />
        </div>

        {(footer || showCounter) && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
            }}
          >
            {footer ? (
              <p
                id={footerId}
                className={helperClassName}
                style={{ ...footerStyle, flex: showCounter ? "1 1 auto" : undefined }}
                role={hasError ? "alert" : undefined}
              >
                {footer}
              </p>
            ) : showCounter ? (
              <span style={{ flex: 1 }} />
            ) : null}
            {showCounter && maxLength !== undefined ? (
              <span
                style={{
                  fontSize: tokens.helperFontSize,
                  color: "#6b7280",
                  flexShrink: 0,
                  fontVariantNumeric: "tabular-nums",
                  marginLeft: footer ? undefined : "auto",
                }}
                aria-live="polite"
              >
                {length}/{maxLength}
              </span>
            ) : null}
          </div>
        )}
      </div>
    );
  },
);

TextArea.displayName = "TextArea";
