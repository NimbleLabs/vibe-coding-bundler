import React from "react"
import { cx } from "../../utils/cx"
import { AvailableChartColors, getColorClassName } from "../../utils/chartColors"

type SparkChartType = "line" | "bar" | "area"

interface SparkChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: number[]
  type?: SparkChartType
  color?: AvailableChartColors
  showAnimation?: boolean
  height?: number
}

const SparkChart = React.forwardRef<HTMLDivElement, SparkChartProps>(
  (
    {
      data,
      type = "line",
      color = "blue",
      showAnimation = false,
      height = 32,
      className,
      ...props
    },
    forwardedRef
  ) => {
    if (!data || data.length === 0) {
      return null
    }

    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1

    const strokeColor = getColorClassName(color, "stroke")
    const fillColor = getColorClassName(color, "fill")
    const bgColor = getColorClassName(color, "bg")

    const padding = 2
    const width = 128
    const chartHeight = height - padding * 2
    const barWidth = (width - padding * 2) / data.length - 1

    // Normalize values to chart coordinates
    const points = data.map((value, index) => {
      const x = padding + (index / (data.length - 1)) * (width - padding * 2)
      const y = padding + chartHeight - ((value - min) / range) * chartHeight
      return { x, y, value }
    })

    // Create path for line/area
    const linePath = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ")
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`

    return (
      <div
        ref={forwardedRef}
        className={cx("inline-flex", className)}
        {...props}
      >
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cx(showAnimation && "animate-fade-in")}
        >
          {type === "bar" && (
            <>
              {data.map((value, index) => {
                const barHeight = ((value - min) / range) * chartHeight || 1
                const x = padding + index * (barWidth + 1)
                const y = height - padding - barHeight

                return (
                  <rect
                    key={index}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx={1}
                    className={cx(fillColor, "opacity-70")}
                  />
                )
              })}
            </>
          )}

          {type === "area" && (
            <>
              <path
                d={areaPath}
                className={cx(fillColor, "opacity-20")}
              />
              <path
                d={linePath}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cx(strokeColor)}
                fill="none"
              />
            </>
          )}

          {type === "line" && (
            <path
              d={linePath}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cx(strokeColor)}
              fill="none"
            />
          )}
        </svg>
      </div>
    )
  }
)

SparkChart.displayName = "SparkChart"

export { SparkChart }
export type { SparkChartProps, SparkChartType }
