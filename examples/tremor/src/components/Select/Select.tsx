import React from "react"
import * as SelectPrimitives from "@radix-ui/react-select"
import { cx } from "../../utils/cx"
import { focusInput, hasErrorInput } from "../../utils/focusRing"

const Select = SelectPrimitives.Root

Select.displayName = "Select"

const SelectGroup = SelectPrimitives.Group

SelectGroup.displayName = "SelectGroup"

const SelectValue = SelectPrimitives.Value

SelectValue.displayName = "SelectValue"

interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitives.Trigger> {
  hasError?: boolean
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitives.Trigger>,
  SelectTriggerProps
>(({ className, hasError, children, ...props }, forwardedRef) => (
  <SelectPrimitives.Trigger
    ref={forwardedRef}
    className={cx(
      // base
      "flex w-full items-center justify-between gap-x-2 truncate rounded-md border px-3 py-2 shadow-xs outline-none transition sm:text-sm",
      // border color
      "border-gray-300 dark:border-gray-800",
      // text color
      "text-gray-900 dark:text-gray-50",
      // placeholder
      "data-[placeholder]:text-gray-400 data-[placeholder]:dark:text-gray-500",
      // background color
      "bg-white dark:bg-gray-950",
      // hover
      "hover:bg-gray-50 dark:hover:bg-gray-950/50",
      // disabled
      "data-[disabled]:bg-gray-100 data-[disabled]:text-gray-400",
      "data-[disabled]:dark:border-gray-800 data-[disabled]:dark:bg-gray-800 data-[disabled]:dark:text-gray-500",
      // focus
      focusInput,
      // error
      hasError ? hasErrorInput : "",
      className
    )}
    {...props}
  >
    <span className="truncate">{children}</span>
    <SelectPrimitives.Icon asChild>
      <svg
        className="size-4 shrink-0 text-gray-400 dark:text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m19 9-7 7-7-7"
        />
      </svg>
    </SelectPrimitives.Icon>
  </SelectPrimitives.Trigger>
))

SelectTrigger.displayName = "SelectTrigger"

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitives.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitives.Content>
>(
  (
    { className, children, position = "popper", ...props },
    forwardedRef
  ) => (
    <SelectPrimitives.Portal>
      <SelectPrimitives.Content
        ref={forwardedRef}
        className={cx(
          // base
          "relative z-50 overflow-hidden rounded-md border shadow-xl",
          // widths
          "min-w-[8rem]",
          position === "popper" && "max-h-[var(--radix-select-content-available-height)]",
          // border color
          "border-gray-200 dark:border-gray-800",
          // background color
          "bg-white dark:bg-gray-950",
          // text color
          "text-gray-900 dark:text-gray-50",
          // animation
          "data-[state=open]:animate-selectContentShow",
          className
        )}
        position={position}
        {...props}
      >
        <SelectPrimitives.Viewport
          className={cx(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          )}
        >
          {children}
        </SelectPrimitives.Viewport>
      </SelectPrimitives.Content>
    </SelectPrimitives.Portal>
  )
)

SelectContent.displayName = "SelectContent"

const SelectGroupLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitives.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitives.Label>
>(({ className, ...props }, forwardedRef) => (
  <SelectPrimitives.Label
    ref={forwardedRef}
    className={cx(
      // base
      "px-3 py-2 text-xs font-medium tracking-wide",
      // text color
      "text-gray-500 dark:text-gray-500",
      className
    )}
    {...props}
  />
))

SelectGroupLabel.displayName = "SelectGroupLabel"

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitives.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitives.Item>
>(({ className, children, ...props }, forwardedRef) => (
  <SelectPrimitives.Item
    ref={forwardedRef}
    className={cx(
      // base
      "relative flex w-full cursor-pointer select-none items-center gap-x-2 rounded py-1.5 pl-8 pr-3 outline-none transition sm:text-sm",
      // text color
      "text-gray-900 dark:text-gray-50",
      // disabled
      "data-[disabled]:pointer-events-none data-[disabled]:text-gray-400 data-[disabled]:hover:bg-none dark:data-[disabled]:text-gray-600",
      // focus
      "focus:bg-gray-100 dark:focus:bg-gray-900",
      // highlighted
      "data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-900",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex size-4 items-center justify-center">
      <SelectPrimitives.ItemIndicator>
        <svg
          className="size-4 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 12.75 6 6 9-13.5"
          />
        </svg>
      </SelectPrimitives.ItemIndicator>
    </span>
    <SelectPrimitives.ItemText>{children}</SelectPrimitives.ItemText>
  </SelectPrimitives.Item>
))

SelectItem.displayName = "SelectItem"

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitives.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitives.Separator>
>(({ className, ...props }, forwardedRef) => (
  <SelectPrimitives.Separator
    ref={forwardedRef}
    className={cx(
      // base
      "-mx-1 my-1 h-px",
      // background color
      "bg-gray-200 dark:bg-gray-800",
      className
    )}
    {...props}
  />
))

SelectSeparator.displayName = "SelectSeparator"

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
export type { SelectTriggerProps }
