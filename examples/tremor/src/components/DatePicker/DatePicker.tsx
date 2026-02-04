import React from "react"
import * as PopoverPrimitives from "@radix-ui/react-popover"
import { cx } from "../../utils/cx"
import { focusInput, hasErrorInput } from "../../utils/focusRing"
import { Calendar } from "../Calendar/Calendar"

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  hasError?: boolean
  className?: string
  minDate?: Date
  maxDate?: Date
}

const formatDate = (date: Date | undefined): string => {
  if (!date) return ""
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = "Select date",
      disabled,
      hasError,
      className,
      minDate,
      maxDate,
    },
    forwardedRef
  ) => {
    const [open, setOpen] = React.useState(false)

    const handleSelect = (date: Date) => {
      onChange?.(date)
      setOpen(false)
    }

    return (
      <PopoverPrimitives.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitives.Trigger asChild>
          <button
            ref={forwardedRef}
            type="button"
            disabled={disabled}
            className={cx(
              // base
              "flex w-full items-center justify-between gap-x-2 rounded-md border px-3 py-2 shadow-xs outline-none transition sm:text-sm",
              // border color
              "border-gray-300 dark:border-gray-800",
              // text color
              value ? "text-gray-900 dark:text-gray-50" : "text-gray-400 dark:text-gray-500",
              // background color
              "bg-white dark:bg-gray-950",
              // hover
              "hover:bg-gray-50 dark:hover:bg-gray-950/50",
              // disabled
              "disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed",
              "disabled:dark:border-gray-800 disabled:dark:bg-gray-800 disabled:dark:text-gray-500",
              // focus
              focusInput,
              // error
              hasError ? hasErrorInput : "",
              className
            )}
          >
            <span className="truncate">
              {value ? formatDate(value) : placeholder}
            </span>
            <svg
              className="size-5 shrink-0 text-gray-400 dark:text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
              />
            </svg>
          </button>
        </PopoverPrimitives.Trigger>

        <PopoverPrimitives.Portal>
          <PopoverPrimitives.Content
            align="start"
            sideOffset={4}
            className={cx(
              "z-50 rounded-lg shadow-xl",
              "border border-gray-200 dark:border-gray-800",
              "bg-white dark:bg-gray-950",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
            )}
          >
            <Calendar
              value={value}
              onChange={handleSelect}
              minDate={minDate}
              maxDate={maxDate}
              className="border-0 shadow-none"
            />
          </PopoverPrimitives.Content>
        </PopoverPrimitives.Portal>
      </PopoverPrimitives.Root>
    )
  }
)

DatePicker.displayName = "DatePicker"

export { DatePicker }
export type { DatePickerProps }
