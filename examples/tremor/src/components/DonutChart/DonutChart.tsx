import React from "react"
import { cx } from "../../utils/cx"
import { AvailableChartColors, getColorClassName } from "../../utils/chartColors"

interface DonutChartDataPoint {
  name: string
  value: number
}

interface DonutChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: DonutChartDataPoint[]
  category: string
  index: string
  colors?: AvailableChartColors[]
  showAnimation?: boolean
  showLegend?: boolean
  showLabel?: boolean
  label?: string
  valueFormatter?: (value: number) => string
  size?: "xs" | "sm" | "md" | "lg"
}

const defaultColors: AvailableChartColors[] = ["blue", "emerald", "violet", "amber", "rose", "cyan", "orange", "indigo"]

const sizes = {
  xs: { size: 80, strokeWidth: 12 },
  sm: { size: 120, strokeWidth: 14 },
  md: { size: 160, strokeWidth: 16 },
  lg: { size: 200, strokeWidth: 18 },
}

const DonutChart = React.forwardRef<HTMLDivElement, DonutChartProps>(
  (
    {
      data,
      category = "value",
      index = "name",
      colors = defaultColors,
      showAnimation = false,
      showLegend = true,
      showLabel = false,
      label,
      valueFormatter = (value) => String(value),
      size = "md",
      className,
      ...props
    },
    forwardedRef
  ) => {
    if (!data || data.length === 0) {
      return <div ref={forwardedRef} className={className} {...props}>No data</div>
    }

    const sizeConfig = sizes[size]
    const svgSize = sizeConfig.size
    const strokeWidth = sizeConfig.strokeWidth
    const radius = (svgSize - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const center = svgSize / 2

    const total = data.reduce((sum, item) => sum + item.value, 0)
    let cumulativePercent = 0

    const segments = data.map((item, i) => {
      const percent = total > 0 ? item.value / total : 0
      const startAngle = cumulativePercent * 360
      cumulativePercent += percent
      const endAngle = cumulativePercent * 360

      const dashArray = percent * circumference
      const dashOffset = (1 - cumulativePercent + percent) * circumference

      const color = colors[i % colors.length]
      const strokeColor = getColorClassName(color, "stroke")

      return {
        ...item,
        percent,
        dashArray,
        dashOffset,
        strokeColor,
        color,
      }
    })

    return (
      <div
        ref={forwardedRef}
        className={cx("flex flex-col items-center gap-4", className)}
        {...props}
      >
        <div className="relative inline-flex items-center justify-center">
          <svg
            width={svgSize}
            height={svgSize}
            viewBox={`0 0 ${svgSize} ${svgSize}`}
            className={cx("rotate-[-90deg]", showAnimation && "animate-fade-in")}
          >
            {/* Background circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              strokeWidth={strokeWidth}
              className="stroke-gray-100 dark:stroke-gray-800"
            />

            {/* Segment circles */}
            {segments.map((segment, i) => (
              <circle
                key={i}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                strokeWidth={strokeWidth}
                strokeDasharray={`${segment.dashArray} ${circumference}`}
                strokeDashoffset={-segment.dashOffset + segment.dashArray}
                strokeLinecap="butt"
                className={cx(
                  segment.strokeColor,
                  showAnimation && "transition-all duration-500 ease-in-out"
                )}
              />
            ))}
          </svg>

          {/* Center label */}
          {showLabel && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                {label ?? valueFormatter(total)}
              </span>
              {!label && (
                <span className="text-xs text-gray-500 dark:text-gray-400">Total</span>
              )}
            </div>
          )}
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            {segments.map((segment, i) => {
              const bgColor = getColorClassName(segment.color, "bg")
              return (
                <div key={i} className="flex items-center gap-2">
                  <div className={cx("size-3 rounded-full", bgColor)} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {segment.name}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    {valueFormatter(segment.value)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }
)

DonutChart.displayName = "DonutChart"

export { DonutChart }
export type { DonutChartProps, DonutChartDataPoint }
