import React from "react"
import * as AccordionPrimitives from "@radix-ui/react-accordion"
import { cx } from "../../utils/cx"
import { focusRing } from "../../utils/focusRing"

const Accordion = AccordionPrimitives.Root

Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitives.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitives.Item>
>(({ className, ...props }, forwardedRef) => (
  <AccordionPrimitives.Item
    ref={forwardedRef}
    className={cx("border-b border-gray-200 dark:border-gray-800", className)}
    {...props}
  />
))

AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitives.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitives.Trigger>
>(({ className, children, ...props }, forwardedRef) => (
  <AccordionPrimitives.Header className="flex">
    <AccordionPrimitives.Trigger
      ref={forwardedRef}
      className={cx(
        // base
        "group flex flex-1 cursor-pointer items-center justify-between py-4 text-left text-sm font-medium outline-none transition",
        // text color
        "text-gray-900 dark:text-gray-50",
        // disabled
        "disabled:cursor-default disabled:text-gray-400 dark:disabled:text-gray-600",
        // focus
        focusRing,
        className
      )}
      {...props}
    >
      {children}
      <svg
        className={cx(
          // base
          "size-5 shrink-0 text-gray-400 transition-transform duration-150 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180",
          // disabled
          "group-disabled:text-gray-300 dark:group-disabled:text-gray-600"
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </AccordionPrimitives.Trigger>
  </AccordionPrimitives.Header>
))

AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitives.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitives.Content>
>(({ className, children, ...props }, forwardedRef) => (
  <AccordionPrimitives.Content
    ref={forwardedRef}
    className={cx(
      // base
      "transform-gpu overflow-hidden text-sm",
      // text color
      "text-gray-700 dark:text-gray-300",
      // animation
      "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    )}
    {...props}
  >
    <div className={cx("pb-4", className)}>{children}</div>
  </AccordionPrimitives.Content>
))

AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
