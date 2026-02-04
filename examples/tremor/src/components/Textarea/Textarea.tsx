import React from "react"
import { cx } from "../../utils/cx"
import { focusInput, hasErrorInput } from "../../utils/focusRing"

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError, ...props }, forwardedRef) => {
    return (
      <textarea
        ref={forwardedRef}
        className={cx(
          // base
          "flex min-h-[4rem] w-full rounded-md border px-3 py-1.5 shadow-xs outline-none transition sm:text-sm",
          // border color
          "border-gray-300 dark:border-gray-800",
          // text color
          "text-gray-900 dark:text-gray-50",
          // placeholder color
          "placeholder-gray-400 dark:placeholder-gray-500",
          // background color
          "bg-white dark:bg-gray-950",
          // disabled
          "disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400",
          "disabled:dark:border-gray-700 disabled:dark:bg-gray-800 disabled:dark:text-gray-500",
          // focus
          focusInput,
          // error
          hasError ? hasErrorInput : "",
          className
        )}
        {...props}
      />
    )
  }
)

Textarea.displayName = "Textarea"

export { Textarea }
export type { TextareaProps }
