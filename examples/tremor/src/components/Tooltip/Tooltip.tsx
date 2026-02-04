import React from "react"
import * as TooltipPrimitives from "@radix-ui/react-tooltip"
import { cx } from "../../utils/cx"

const TooltipProvider = TooltipPrimitives.Provider

TooltipProvider.displayName = "TooltipProvider"

const Tooltip = TooltipPrimitives.Root

Tooltip.displayName = "Tooltip"

const TooltipTrigger = TooltipPrimitives.Trigger

TooltipTrigger.displayName = "TooltipTrigger"

interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitives.Content> {}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitives.Content>,
  TooltipContentProps
>(
  (
    { className, sideOffset = 4, children, ...props },
    forwardedRef
  ) => (
    <TooltipPrimitives.Portal>
      <TooltipPrimitives.Content
        ref={forwardedRef}
        sideOffset={sideOffset}
        className={cx(
          // base
          "z-50 max-w-xs rounded px-2.5 py-1 text-sm shadow-md",
          // background color
          "bg-gray-900 dark:bg-gray-50",
          // text color
          "text-white dark:text-gray-900",
          // animation
          "animate-in fade-in-0 zoom-in-95",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitives.Arrow className="fill-gray-900 dark:fill-gray-50" />
      </TooltipPrimitives.Content>
    </TooltipPrimitives.Portal>
  )
)

TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
export type { TooltipContentProps }
