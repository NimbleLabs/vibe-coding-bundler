import React from "react"
import { cx } from "../../utils/cx"
import { focusInput, hasErrorInput } from "../../utils/focusRing"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
  enableStepper?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      hasError,
      enableStepper = false,
      type = "text",
      ...props
    },
    forwardedRef
  ) => {
    return (
      <input
        ref={forwardedRef}
        type={type}
        className={cx(
          // base
          "relative block w-full appearance-none rounded-md border px-2.5 py-1.5 shadow-xs outline-none transition sm:text-sm",
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
          // file
          type === "file" && [
            "text-sm file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0",
            "file:text-sm file:font-medium",
            "file:bg-gray-100 file:text-gray-700 file:dark:bg-gray-800 file:dark:text-gray-300",
            "file:cursor-pointer",
          ],
          // focus
          focusInput,
          // number input
          !enableStepper && "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          // error
          hasError ? hasErrorInput : "",
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }
export type { InputProps }
