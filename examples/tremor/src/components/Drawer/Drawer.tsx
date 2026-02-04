import React from "react"
import * as DialogPrimitives from "@radix-ui/react-dialog"
import { cx } from "../../utils/cx"
import { focusRing } from "../../utils/focusRing"

const Drawer = (
  props: React.ComponentPropsWithoutRef<typeof DialogPrimitives.Root>
) => {
  return <DialogPrimitives.Root {...props} />
}

Drawer.displayName = "Drawer"

const DrawerTrigger = DialogPrimitives.Trigger

DrawerTrigger.displayName = "DrawerTrigger"

const DrawerClose = DialogPrimitives.Close

DrawerClose.displayName = "DrawerClose"

const DrawerPortal = DialogPrimitives.Portal

DrawerPortal.displayName = "DrawerPortal"

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitives.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitives.Overlay>
>(({ className, ...props }, forwardedRef) => (
  <DialogPrimitives.Overlay
    ref={forwardedRef}
    className={cx(
      // base
      "fixed inset-0 z-50",
      // background color
      "bg-black/50",
      // animation
      "data-[state=open]:animate-overlayShow data-[state=closed]:animate-overlayHide",
      className
    )}
    {...props}
  />
))

DrawerOverlay.displayName = "DrawerOverlay"

interface DrawerContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitives.Content> {}

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitives.Content>,
  DrawerContentProps
>(({ className, children, ...props }, forwardedRef) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DialogPrimitives.Content
      ref={forwardedRef}
      className={cx(
        // base
        "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col overflow-y-auto border-l p-6 shadow-xl",
        // border color
        "border-gray-200 dark:border-gray-800",
        // background color
        "bg-white dark:bg-gray-950",
        // animation
        "data-[state=open]:animate-slideIn data-[state=closed]:animate-slideOut",
        // focus
        focusRing,
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitives.Content>
  </DrawerPortal>
))

DrawerContent.displayName = "DrawerContent"

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cx("flex flex-col gap-y-1", className)} {...props} />
}

DrawerHeader.displayName = "DrawerHeader"

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitives.Title>
>(({ className, ...props }, forwardedRef) => (
  <DialogPrimitives.Title
    ref={forwardedRef}
    className={cx(
      // base
      "text-lg font-semibold",
      // text color
      "text-gray-900 dark:text-gray-50",
      className
    )}
    {...props}
  />
))

DrawerTitle.displayName = "DrawerTitle"

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitives.Description>
>(({ className, ...props }, forwardedRef) => (
  <DialogPrimitives.Description
    ref={forwardedRef}
    className={cx(
      // base
      "text-sm",
      // text color
      "text-gray-500 dark:text-gray-500",
      className
    )}
    {...props}
  />
))

DrawerDescription.displayName = "DrawerDescription"

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cx("mt-auto flex flex-col gap-2 pt-4", className)}
      {...props}
    />
  )
}

DrawerFooter.displayName = "DrawerFooter"

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
}
