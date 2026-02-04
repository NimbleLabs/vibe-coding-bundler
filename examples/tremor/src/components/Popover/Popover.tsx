import React from "react"
import * as PopoverPrimitives from "@radix-ui/react-popover"
import { cx } from "../../utils/cx"

const Popover = PopoverPrimitives.Root

Popover.displayName = "Popover"

const PopoverTrigger = PopoverPrimitives.Trigger

PopoverTrigger.displayName = "PopoverTrigger"

const PopoverAnchor = PopoverPrimitives.Anchor

PopoverAnchor.displayName = "PopoverAnchor"

const PopoverClose = PopoverPrimitives.Close

PopoverClose.displayName = "PopoverClose"

interface PopoverContentProps
  extends React.ComponentPropsWithoutRef<typeof PopoverPrimitives.Content> {}

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitives.Content>,
  PopoverContentProps
>(
  (
    { className, align = "center", sideOffset = 8, children, ...props },
    forwardedRef
  ) => (
    <PopoverPrimitives.Portal>
      <PopoverPrimitives.Content
        ref={forwardedRef}
        align={align}
        sideOffset={sideOffset}
        className={cx(
          // base
          "z-50 w-72 rounded-md border p-4 shadow-lg outline-none",
          // border color
          "border-gray-200 dark:border-gray-800",
          // background color
          "bg-white dark:bg-gray-950",
          // text color
          "text-gray-900 dark:text-gray-50",
          // animation
          "data-[state=open]:animate-popoverShow",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      >
        {children}
      </PopoverPrimitives.Content>
    </PopoverPrimitives.Portal>
  )
)

PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverAnchor, PopoverClose, PopoverContent, PopoverTrigger }
export type { PopoverContentProps }
