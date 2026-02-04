import React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cx } from "../../utils/cx"
import { focusRing } from "../../utils/focusRing"

interface SwitchProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    "asChild"
  > {}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, ...props }, forwardedRef) => (
  <SwitchPrimitives.Root
    ref={forwardedRef}
    className={cx(
      // base
      "group relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-xs outline-none transition-all duration-100",
      // background color
      "bg-gray-200 dark:bg-gray-900",
      // checked
      "data-[state=checked]:bg-blue-500",
      // disabled
      "data-[disabled]:cursor-default",
      "data-[disabled]:bg-gray-100 data-[disabled]:dark:bg-gray-800",
      // focus
      focusRing,
      className
    )}
    {...props}
  >
    <SwitchPrimitives.Thumb
      className={cx(
        // base
        "pointer-events-none block size-4 rounded-full bg-white shadow-lg ring-0 transition-transform duration-100",
        // checked
        "data-[state=checked]:translate-x-4",
        "data-[state=unchecked]:translate-x-0",
        // disabled
        "group-data-[disabled]:bg-gray-50 group-data-[disabled]:dark:bg-gray-500"
      )}
    />
  </SwitchPrimitives.Root>
))

Switch.displayName = "Switch"

export { Switch }
export type { SwitchProps }
