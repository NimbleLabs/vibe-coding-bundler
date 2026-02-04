import React from "react"
import * as TabsPrimitives from "@radix-ui/react-tabs"
import { cx } from "../../utils/cx"
import { focusRing } from "../../utils/focusRing"

const Tabs = (
  props: Omit<
    React.ComponentPropsWithoutRef<typeof TabsPrimitives.Root>,
    "orientation"
  >
) => {
  return <TabsPrimitives.Root {...props} />
}

Tabs.displayName = "Tabs"

type TabsListVariant = "line" | "solid"

const variantStyles: Record<TabsListVariant, string> = {
  line: cx(
    // base
    "flex items-center justify-start border-b",
    // border color
    "border-gray-200 dark:border-gray-800"
  ),
  solid: cx(
    // base
    "inline-flex items-center justify-center rounded-md p-1",
    // background color
    "bg-gray-100 dark:bg-gray-800"
  ),
}

interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitives.List> {
  variant?: TabsListVariant
}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitives.List>,
  TabsListProps
>(({ className, variant = "line", children, ...props }, forwardedRef) => (
  <TabsPrimitives.List
    ref={forwardedRef}
    className={cx(variantStyles[variant], className)}
    {...props}
  >
    {children}
  </TabsPrimitives.List>
))

TabsList.displayName = "TabsList"

const tabTriggerStyles = {
  line: cx(
    // base
    "-mb-px items-center justify-center whitespace-nowrap border-b-2 border-transparent px-3 pb-2.5 text-sm font-medium transition-all",
    // text color
    "text-gray-500 dark:text-gray-500",
    // hover
    "hover:text-gray-700 dark:hover:text-gray-400",
    // selected
    "data-[state=active]:border-blue-500 data-[state=active]:text-blue-500",
    // disabled
    "disabled:pointer-events-none disabled:text-gray-300 dark:disabled:text-gray-700"
  ),
  solid: cx(
    // base
    "inline-flex items-center justify-center whitespace-nowrap rounded px-3 py-1 text-sm font-medium transition-all",
    // text color
    "text-gray-500 dark:text-gray-400",
    // hover
    "hover:text-gray-700 dark:hover:text-gray-200",
    // selected
    "data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow",
    "data-[state=active]:dark:bg-gray-900 data-[state=active]:dark:text-gray-50",
    // disabled
    "disabled:pointer-events-none disabled:text-gray-300 dark:disabled:text-gray-700"
  ),
}

interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitives.Trigger> {
  variant?: TabsListVariant
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitives.Trigger>,
  TabsTriggerProps
>(({ className, variant = "line", children, ...props }, forwardedRef) => (
  <TabsPrimitives.Trigger
    ref={forwardedRef}
    className={cx(tabTriggerStyles[variant], focusRing, className)}
    {...props}
  >
    {children}
  </TabsPrimitives.Trigger>
))

TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitives.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitives.Content>
>(({ className, ...props }, forwardedRef) => (
  <TabsPrimitives.Content
    ref={forwardedRef}
    className={cx("mt-4 outline-none", focusRing, className)}
    {...props}
  />
))

TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
export type { TabsListProps, TabsTriggerProps }
