import type { ComponentProps } from "react";
import { HiEnvelope } from "react-icons/hi2";

export type MailIconProps = ComponentProps<typeof HiEnvelope>;

/** Envelope glyph for email fields — Heroicons (`react-icons/hi2`). */
export function MailIcon({ size = 18, ...rest }: MailIconProps) {
  return <HiEnvelope aria-hidden size={size} {...rest} />;
}
