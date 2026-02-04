import React from "react"
import * as RadioGroupPrimitives from "@radix-ui/react-radio-group"
import { cx } from "../../utils/cx"
import { focusRing } from "../../utils/focusRing"

const RadioCardGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitives.Root>
>(({ className, ...props }, forwardedRef) => (
  <RadioGroupPrimitives.Root
    ref={forwardedRef}
    className={cx("grid gap-2", className)}
    {...props}
  />
))

RadioCardGroup.displayName = "RadioCardGroup"

interface RadioCardItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitives.Item> {}

const RadioCardItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitives.Item>,
  RadioCardItemProps
>(({ className, children, ...props }, forwardedRef) => (
  <RadioGroupPrimitives.Item
    ref={forwardedRef}
    className={cx(
      // base
      "group relative flex cursor-pointer flex-col items-start gap-y-3 rounded-md border p-4 text-left shadow-xs outline-none transition",
      // border
      "border-gray-200 dark:border-gray-800",
      // background
      "bg-white dark:bg-gray-950",
      // hover
      "hover:bg-gray-50 dark:hover:bg-gray-900",
      // selected
      "data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-50 dark:data-[state=checked]:border-blue-500 dark:data-[state=checked]:bg-blue-950/20",
      // disabled
      "data-[disabled]:pointer-events-none data-[disabled]:border-gray-200 data-[disabled]:bg-gray-100 dark:data-[disabled]:border-gray-800 dark:data-[disabled]:bg-gray-800",
      // focus
      focusRing,
      className
    )}
    {...props}
  >
    {children}
    <div
      className={cx(
        // base
        "absolute right-4 top-4 flex size-4 items-center justify-center rounded-full border shadow-xs",
        // border
        "border-gray-300 dark:border-gray-700",
        // background
        "bg-white dark:bg-gray-950",
        // checked
        "group-data-[state=checked]:border-0 group-data-[state=checked]:bg-blue-500",
        // disabled
        "group-data-[disabled]:border-gray-300 group-data-[disabled]:bg-gray-100 dark:group-data-[disabled]:bg-gray-800"
      )}
    >
      <RadioGroupPrimitives.Indicator className="flex items-center justify-center">
        <div className="size-1.5 rounded-full bg-white" />
      </RadioGroupPrimitives.Indicator>
    </div>
  </RadioGroupPrimitives.Item>
))

RadioCardItem.displayName = "RadioCardItem"

export { RadioCardGroup, RadioCardItem }
export type { RadioCardItemProps }
