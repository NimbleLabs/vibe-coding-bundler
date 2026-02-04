import React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cx } from "../../utils/cx"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, forwardedRef) => (
  <ToastPrimitives.Viewport
    ref={forwardedRef}
    className={cx(
      "fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 sm:flex-col sm:max-w-[420px]",
      className
    )}
    {...props}
  />
))

ToastViewport.displayName = "ToastViewport"

type ToastVariant = "default" | "success" | "warning" | "error"

const variantStyles: Record<ToastVariant, string> = {
  default: "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950",
  success: "border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/50",
  warning: "border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950/50",
  error: "border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/50",
}

interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> {
  variant?: ToastVariant
}

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  ToastProps
>(({ className, variant = "default", ...props }, forwardedRef) => (
  <ToastPrimitives.Root
    ref={forwardedRef}
    className={cx(
      // base
      "group pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-lg border p-4 shadow-lg transition-all",
      // variant
      variantStyles[variant],
      // animation
      "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full",
      className
    )}
    {...props}
  />
))

Toast.displayName = "Toast"

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, forwardedRef) => (
  <ToastPrimitives.Action
    ref={forwardedRef}
    className={cx(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors",
      "border-gray-200 dark:border-gray-700",
      "hover:bg-gray-100 dark:hover:bg-gray-800",
      "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
))

ToastAction.displayName = "ToastAction"

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, forwardedRef) => (
  <ToastPrimitives.Close
    ref={forwardedRef}
    className={cx(
      "absolute right-2 top-2 rounded-md p-1 text-gray-400 opacity-0 transition-opacity",
      "hover:text-gray-900 dark:hover:text-gray-50",
      "focus:opacity-100 focus:outline-none focus:ring-2",
      "group-hover:opacity-100",
      className
    )}
    toast-close=""
    {...props}
  >
    <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  </ToastPrimitives.Close>
))

ToastClose.displayName = "ToastClose"

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, forwardedRef) => (
  <ToastPrimitives.Title
    ref={forwardedRef}
    className={cx("text-sm font-semibold text-gray-900 dark:text-gray-50", className)}
    {...props}
  />
))

ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, forwardedRef) => (
  <ToastPrimitives.Description
    ref={forwardedRef}
    className={cx("text-sm text-gray-600 dark:text-gray-400", className)}
    {...props}
  />
))

ToastDescription.displayName = "ToastDescription"

// Toast hook for imperative usage
type ToastMessage = {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
  action?: React.ReactNode
}

const ToastContext = React.createContext<{
  toasts: ToastMessage[]
  addToast: (toast: Omit<ToastMessage, "id">) => void
  removeToast: (id: string) => void
} | null>(null)

const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastContext,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  useToast,
}
export type { ToastProps, ToastMessage, ToastVariant }
