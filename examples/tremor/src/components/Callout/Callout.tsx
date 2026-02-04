import React from "react"
import { cx } from "../../utils/cx"

type CalloutVariant = "default" | "success" | "warning" | "error" | "neutral"

interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  variant?: CalloutVariant
  icon?: React.ReactNode
}

const variantStyles: Record<CalloutVariant, { container: string; icon: string; title: string }> = {
  default: {
    container: "bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900",
    icon: "text-blue-500",
    title: "text-blue-900 dark:text-blue-50",
  },
  success: {
    container: "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900",
    icon: "text-emerald-500",
    title: "text-emerald-900 dark:text-emerald-50",
  },
  warning: {
    container: "bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-900",
    icon: "text-yellow-500",
    title: "text-yellow-900 dark:text-yellow-50",
  },
  error: {
    container: "bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-900",
    icon: "text-red-500",
    title: "text-red-900 dark:text-red-50",
  },
  neutral: {
    container: "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800",
    icon: "text-gray-500",
    title: "text-gray-900 dark:text-gray-50",
  },
}

const defaultIcons: Record<CalloutVariant, React.ReactNode> = {
  default: (
    <svg className="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
  ),
  success: (
    <svg className="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  warning: (
    <svg className="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
  ),
  error: (
    <svg className="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  neutral: (
    <svg className="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
  ),
}

const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
  ({ className, title, variant = "default", icon, children, ...props }, forwardedRef) => {
    const styles = variantStyles[variant]
    const iconElement = icon ?? defaultIcons[variant]

    return (
      <div
        ref={forwardedRef}
        className={cx(
          // base
          "flex flex-col gap-y-1 rounded-md border p-4",
          styles.container,
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-x-2">
          {iconElement && (
            <span className={cx("shrink-0", styles.icon)}>{iconElement}</span>
          )}
          <span className={cx("text-sm font-semibold", styles.title)}>
            {title}
          </span>
        </div>
        {children && (
          <div className={cx("text-sm text-gray-700 dark:text-gray-300 pl-7")}>
            {children}
          </div>
        )}
      </div>
    )
  }
)

Callout.displayName = "Callout"

export { Callout }
export type { CalloutProps, CalloutVariant }
