// Tremor Tracker [v1.0.0] - Simplified version

import React from "react"

import { cx } from "../../utils/cx"

interface TrackerBlockProps {
  key?: string | number
  color?: string
  tooltip?: string
}

const Block = ({
  color,
  tooltip,
  defaultBackgroundColor,
}: TrackerBlockProps & { defaultBackgroundColor?: string }) => {
  return (
    <div
      className="size-full overflow-hidden px-[0.5px] transition first:rounded-l-[4px] first:pl-0 last:rounded-r-[4px] last:pr-0 sm:px-px"
      title={tooltip}
    >
      <div
        className={cx(
          "size-full rounded-[1px]",
          color || defaultBackgroundColor,
          "hover:opacity-70 transition-opacity cursor-pointer",
        )}
      />
    </div>
  )
}

Block.displayName = "Block"

interface TrackerProps extends React.HTMLAttributes<HTMLDivElement> {
  data: TrackerBlockProps[]
  defaultBackgroundColor?: string
}

const Tracker = React.forwardRef<HTMLDivElement, TrackerProps>(
  (
    {
      data = [],
      defaultBackgroundColor = "bg-gray-400 dark:bg-gray-400",
      className,
      ...props
    },
    forwardedRef,
  ) => {
    return (
      <div
        ref={forwardedRef}
        className={cx("group flex h-8 w-full items-center", className)}
        {...props}
      >
        {data.map((props, index) => (
          <Block
            key={props.key ?? index}
            defaultBackgroundColor={defaultBackgroundColor}
            {...props}
          />
        ))}
      </div>
    )
  },
)

Tracker.displayName = "Tracker"

export { Tracker, type TrackerBlockProps }
