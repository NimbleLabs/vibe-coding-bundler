import React from "react"
import * as TogglePrimitives from "@radix-ui/react-toggle"
import { cx } from "../../utils/cx"
import { focusRing } from "../../utils/focusRing"

interface ToggleProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof TogglePrimitives.Root>,
    "asChild"
  > {}

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitives.Root>,
  ToggleProps
>(({ className, children, ...props }, forwardedRef) => (
  <TogglePrimitives.Root
    ref={forwardedRef}
    className={cx(
      // base
      "inline-flex items-center justify-center gap-x-2 rounded-md border px-2.5 py-1.5 text-sm font-medium shadow-xs outline-none transition",
      // border
      "border-gray-300 dark:border-gray-800",
      // text color
      "text-gray-700 dark:text-gray-300",
      // background color
      "bg-white dark:bg-gray-950",
      // hover
      "hover:bg-gray-50 dark:hover:bg-gray-900",
      // pressed
      "data-[state=on]:bg-gray-100 data-[state=on]:dark:bg-gray-800",
      "data-[state=on]:border-gray-400 data-[state=on]:dark:border-gray-700",
      // disabled
      "disabled:pointer-events-none",
      "disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400",
      "disabled:dark:border-gray-800 disabled:dark:bg-gray-900 disabled:dark:text-gray-600",
      // focus
      focusRing,
      className
    )}
    {...props}
  >
    {children}
  </TogglePrimitives.Root>
))

Toggle.displayName = "Toggle"

export { Toggle }
export type { ToggleProps }
