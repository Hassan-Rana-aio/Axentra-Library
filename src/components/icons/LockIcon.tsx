import type { ComponentProps } from "react";
import { HiLockClosed } from "react-icons/hi2";

export type LockIconProps = ComponentProps<typeof HiLockClosed>;

/** Lock glyph for password fields — Heroicons (`react-icons/hi2`). */
export function LockIcon({ size = 18, ...rest }: LockIconProps) {
  return <HiLockClosed aria-hidden size={size} {...rest} />;
}
