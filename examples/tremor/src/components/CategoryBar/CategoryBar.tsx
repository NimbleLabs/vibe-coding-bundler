import React from "react"
import { cx } from "../../utils/cx"
import { getColorClassName, AvailableChartColors } from "../../utils/chartColors"

interface CategoryBarProps extends React.HTMLAttributes<HTMLDivElement> {
  values: number[]
  colors?: AvailableChartColors[]
  markerValue?: number
  showLabels?: boolean
  showAnimation?: boolean
}

const defaultColors: AvailableChartColors[] = [
  "blue",
  "cyan",
  "emerald",
  "yellow",
  "orange",
  "red",
  "violet",
  "gray",
]

const CategoryBar = React.forwardRef<HTMLDivElement, CategoryBarProps>(
  (
    {
      values,
      colors = defaultColors,
      markerValue,
      showLabels = false,
      showAnimation = false,
      className,
      ...props
    },
    forwardedRef
  ) => {
    const total = values.reduce((sum, value) => sum + value, 0)
    let cumulative = 0

    const widths = values.map((value) => {
      const width = total > 0 ? (value / total) * 100 : 0
      return width
    })

    return (
      <div ref={forwardedRef} className={cx("relative", className)} {...props}>
        <div className={cx("flex h-2 w-full items-center overflow-hidden rounded-full")}>
          {values.map((value, index) => {
            const width = widths[index]
            const color = colors[index % colors.length]
            const bgColor = getColorClassName(color, "bg")

            return (
              <div
                key={index}
                className={cx(
                  bgColor,
                  "h-full",
                  showAnimation && "transition-all duration-500 ease-in-out",
                  index === 0 && "rounded-l-full",
                  index === values.length - 1 && "rounded-r-full"
                )}
                style={{ width: `${width}%` }}
              />
            )
          })}
        </div>

        {/* Marker */}
        {markerValue !== undefined && total > 0 && (
          <div
            className={cx(
              "absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-gray-900 dark:bg-gray-50 rounded-full",
              showAnimation && "transition-all duration-500 ease-in-out"
            )}
            style={{
              left: `${Math.min(Math.max((markerValue / total) * 100, 0), 100)}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}

        {/* Labels */}
        {showLabels && (
          <div className="mt-2 flex w-full text-xs text-gray-500 dark:text-gray-400">
            <span>0</span>
            <span className="ml-auto">{total}</span>
          </div>
        )}
      </div>
    )
  }
)

CategoryBar.displayName = "CategoryBar"

export { CategoryBar }
export type { CategoryBarProps }
