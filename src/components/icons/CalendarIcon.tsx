import type { ComponentProps } from "react";
import { HiCalendarDays } from "react-icons/hi2";

export type CalendarIconProps = ComponentProps<typeof HiCalendarDays>;

/** Calendar glyph for date fields — [Heroicons via react-icons](https://react-icons.github.io/react-icons/icons?name=hi2). */
export function CalendarIcon({ size = 18, ...rest }: CalendarIconProps) {
  return <HiCalendarDays aria-hidden size={size} {...rest} />;
}
