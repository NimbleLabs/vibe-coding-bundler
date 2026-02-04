import React from "react"
import { cx } from "../../utils/cx"
import { focusRing } from "../../utils/focusRing"

interface TabNavigationProps extends React.HTMLAttributes<HTMLDivElement> {}

const TabNavigation = React.forwardRef<HTMLDivElement, TabNavigationProps>(
  ({ className, children, ...props }, forwardedRef) => {
    return (
      <div
        ref={forwardedRef}
        className={cx(
          // base
          "flex items-center justify-start border-b",
          // border color
          "border-gray-200 dark:border-gray-800",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

TabNavigation.displayName = "TabNavigation"

interface TabNavigationLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  active?: boolean
}

const TabNavigationLink = React.forwardRef<
  HTMLAnchorElement,
  TabNavigationLinkProps
>(({ className, active, children, ...props }, forwardedRef) => {
  return (
    <a
      ref={forwardedRef}
      className={cx(
        // base
        "-mb-px items-center justify-center whitespace-nowrap border-b-2 px-3 pb-2.5 text-sm font-medium transition-all",
        // text color
        "text-gray-500 dark:text-gray-500",
        // hover
        "hover:text-gray-700 dark:hover:text-gray-400",
        // border
        active
          ? "border-blue-500 text-blue-500"
          : "border-transparent",
        // focus
        focusRing,
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
})

TabNavigationLink.displayName = "TabNavigationLink"

export { TabNavigation, TabNavigationLink }
export type { TabNavigationProps, TabNavigationLinkProps }
