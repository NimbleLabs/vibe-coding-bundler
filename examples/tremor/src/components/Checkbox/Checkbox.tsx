import React from "react"
import * as CheckboxPrimitives from "@radix-ui/react-checkbox"
import { cx } from "../../utils/cx"
import { focusRing } from "../../utils/focusRing"

interface CheckboxProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof CheckboxPrimitives.Root>,
    "asChild"
  > {}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitives.Root>,
  CheckboxProps
>(({ className, checked, ...props }, forwardedRef) => {
  return (
    <CheckboxPrimitives.Root
      ref={forwardedRef}
      {...props}
      checked={checked}
      className={cx(
        // base
        "relative inline-flex size-4 shrink-0 appearance-none items-center justify-center rounded border shadow-xs outline-none transition duration-100",
        // border color
        "border-gray-300 dark:border-gray-800",
        // background color
        "bg-white dark:bg-gray-950",
        // checked and indeterminate
        "data-[state=checked]:border-0 data-[state=indeterminate]:border-0",
        "data-[state=checked]:bg-blue-500 data-[state=indeterminate]:bg-blue-500",
        // disabled
        "data-[disabled]:border-gray-300 data-[disabled]:bg-gray-100 data-[disabled]:text-gray-400",
        "data-[disabled]:dark:border-gray-700 data-[disabled]:dark:bg-gray-800 data-[disabled]:dark:text-gray-500",
        // focus
        focusRing,
        className
      )}
    >
      <CheckboxPrimitives.Indicator
        className={cx("flex size-full items-center justify-center text-white")}
      >
        {checked === "indeterminate" ? (
          <svg
            width="9"
            height="9"
            viewBox="0 0 9 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 4.5H8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg
            width="9"
            height="9"
            viewBox="0 0 9 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 4.5L3.5 7L8 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </CheckboxPrimitives.Indicator>
    </CheckboxPrimitives.Root>
  )
})

Checkbox.displayName = "Checkbox"

export { Checkbox }
export type { CheckboxProps }
