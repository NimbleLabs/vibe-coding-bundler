import React from "react"
import * as DropdownMenuPrimitives from "@radix-ui/react-dropdown-menu"
import { cx } from "../../utils/cx"

const DropdownMenu = DropdownMenuPrimitives.Root

DropdownMenu.displayName = "DropdownMenu"

const DropdownMenuTrigger = DropdownMenuPrimitives.Trigger

DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuGroup = DropdownMenuPrimitives.Group

DropdownMenuGroup.displayName = "DropdownMenuGroup"

const DropdownMenuSubMenu = DropdownMenuPrimitives.Sub

DropdownMenuSubMenu.displayName = "DropdownMenuSubMenu"

const DropdownMenuRadioGroup = DropdownMenuPrimitives.RadioGroup

DropdownMenuRadioGroup.displayName = "DropdownMenuRadioGroup"

const DropdownMenuSubMenuTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitives.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitives.SubTrigger>
>(({ className, children, ...props }, forwardedRef) => (
  <DropdownMenuPrimitives.SubTrigger
    ref={forwardedRef}
    className={cx(
      // base
      "relative flex cursor-default select-none items-center gap-x-2 rounded py-1.5 pl-2 pr-1 outline-none transition-colors data-[state=checked]:font-semibold sm:text-sm",
      // text color
      "text-gray-900 dark:text-gray-50",
      // disabled
      "data-[disabled]:pointer-events-none data-[disabled]:text-gray-400 dark:data-[disabled]:text-gray-600",
      // focus
      "focus:bg-gray-100 data-[state=open]:bg-gray-100 dark:focus:bg-gray-900 dark:data-[state=open]:bg-gray-900",
      className
    )}
    {...props}
  >
    {children}
    <svg
      className="ml-auto size-4 shrink-0 text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
    </svg>
  </DropdownMenuPrimitives.SubTrigger>
))

DropdownMenuSubMenuTrigger.displayName = "DropdownMenuSubMenuTrigger"

const DropdownMenuSubMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitives.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitives.SubContent>
>(({ className, ...props }, forwardedRef) => (
  <DropdownMenuPrimitives.Portal>
    <DropdownMenuPrimitives.SubContent
      ref={forwardedRef}
      className={cx(
        // base
        "z-50 overflow-hidden rounded-md border p-1 shadow-xl shadow-black/[2.5%]",
        // width
        "min-w-32",
        // border color
        "border-gray-200 dark:border-gray-800",
        // background color
        "bg-white dark:bg-gray-950",
        // animation
        "data-[state=open]:animate-slideUpAndFade data-[state=closed]:animate-slideDownAndFade",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitives.Portal>
))

DropdownMenuSubMenuContent.displayName = "DropdownMenuSubMenuContent"

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitives.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitives.Content>
>(({ className, sideOffset = 8, ...props }, forwardedRef) => (
  <DropdownMenuPrimitives.Portal>
    <DropdownMenuPrimitives.Content
      ref={forwardedRef}
      sideOffset={sideOffset}
      className={cx(
        // base
        "z-50 overflow-hidden rounded-md border p-1 shadow-xl shadow-black/[2.5%]",
        // width
        "min-w-48",
        // border color
        "border-gray-200 dark:border-gray-800",
        // background color
        "bg-white dark:bg-gray-950",
        // text color
        "text-gray-900 dark:text-gray-50",
        // animation
        "data-[state=open]:animate-slideUpAndFade data-[state=closed]:animate-slideDownAndFade",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitives.Portal>
))

DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitives.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitives.Item> & {
    shortcut?: string
  }
>(({ className, shortcut, children, ...props }, forwardedRef) => (
  <DropdownMenuPrimitives.Item
    ref={forwardedRef}
    className={cx(
      // base
      "group relative flex cursor-pointer select-none items-center gap-x-2 rounded py-1.5 pl-2 pr-1 outline-none transition-colors sm:text-sm",
      // text color
      "text-gray-900 dark:text-gray-50",
      // disabled
      "data-[disabled]:pointer-events-none data-[disabled]:text-gray-400 dark:data-[disabled]:text-gray-600",
      // focus
      "focus:bg-gray-100 dark:focus:bg-gray-900",
      className
    )}
    {...props}
  >
    {children}
    {shortcut && (
      <span className="ml-auto text-xs tracking-widest text-gray-400">
        {shortcut}
      </span>
    )}
  </DropdownMenuPrimitives.Item>
))

DropdownMenuItem.displayName = "DropdownMenuItem"

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitives.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitives.CheckboxItem>
>(({ className, children, checked, ...props }, forwardedRef) => (
  <DropdownMenuPrimitives.CheckboxItem
    ref={forwardedRef}
    className={cx(
      // base
      "relative flex cursor-pointer select-none items-center gap-x-2 rounded py-1.5 pl-8 pr-1 outline-none transition-colors sm:text-sm",
      // text color
      "text-gray-900 dark:text-gray-50",
      // disabled
      "data-[disabled]:pointer-events-none data-[disabled]:text-gray-400 dark:data-[disabled]:text-gray-600",
      // focus
      "focus:bg-gray-100 dark:focus:bg-gray-900",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex size-4 items-center justify-center">
      <DropdownMenuPrimitives.ItemIndicator>
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
      </DropdownMenuPrimitives.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitives.CheckboxItem>
))

DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem"

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitives.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitives.RadioItem>
>(({ className, children, ...props }, forwardedRef) => (
  <DropdownMenuPrimitives.RadioItem
    ref={forwardedRef}
    className={cx(
      // base
      "relative flex cursor-pointer select-none items-center gap-x-2 rounded py-1.5 pl-8 pr-1 outline-none transition-colors sm:text-sm",
      // text color
      "text-gray-900 dark:text-gray-50",
      // disabled
      "data-[disabled]:pointer-events-none data-[disabled]:text-gray-400 dark:data-[disabled]:text-gray-600",
      // focus
      "focus:bg-gray-100 dark:focus:bg-gray-900",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex size-4 items-center justify-center">
      <DropdownMenuPrimitives.ItemIndicator>
        <div className="size-2 rounded-full bg-blue-500" />
      </DropdownMenuPrimitives.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitives.RadioItem>
))

DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem"

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitives.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitives.Label>
>(({ className, ...props }, forwardedRef) => (
  <DropdownMenuPrimitives.Label
    ref={forwardedRef}
    className={cx(
      // base
      "px-2 py-1.5 text-xs font-medium tracking-wide",
      // text color
      "text-gray-500 dark:text-gray-500",
      className
    )}
    {...props}
  />
))

DropdownMenuLabel.displayName = "DropdownMenuLabel"

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitives.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitives.Separator>
>(({ className, ...props }, forwardedRef) => (
  <DropdownMenuPrimitives.Separator
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

DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSubMenu,
  DropdownMenuSubMenuContent,
  DropdownMenuSubMenuTrigger,
  DropdownMenuTrigger,
}
