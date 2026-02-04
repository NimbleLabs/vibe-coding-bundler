import React from "react"
import { cx } from "../../utils/cx"
import { focusInput, hasErrorInput } from "../../utils/focusRing"

interface SelectNativeProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean
}

const SelectNative = React.forwardRef<HTMLSelectElement, SelectNativeProps>(
  ({ className, hasError, children, ...props }, forwardedRef) => {
    return (
      <select
        ref={forwardedRef}
        className={cx(
          // base
          "relative block w-full cursor-pointer appearance-none rounded-md border bg-transparent px-3 py-2 pr-8 shadow-xs outline-none transition sm:text-sm",
          // background color
          "bg-white dark:bg-gray-950",
          // border color
          "border-gray-300 dark:border-gray-800",
          // text color
          "text-gray-900 dark:text-gray-50",
          // hover
          "hover:bg-gray-50 dark:hover:bg-gray-950/50",
          // disabled
          "disabled:pointer-events-none disabled:bg-gray-100 disabled:text-gray-400",
          "disabled:dark:border-gray-700 disabled:dark:bg-gray-800 disabled:dark:text-gray-500",
          // focus
          focusInput,
          // error
          hasError ? hasErrorInput : "",
          className
        )}
        {...props}
      >
        {children}
      </select>
    )
  }
)

SelectNative.displayName = "SelectNative"

export { SelectNative }
export type { SelectNativeProps }
