import React from "react"
import { cx } from "../../utils/cx"
import { AvailableChartColors, getColorClassName } from "../../utils/chartColors"

interface AreaChartDataPoint {
  [key: string]: string | number
}

interface AreaChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: AreaChartDataPoint[]
  index: string
  categories: string[]
  colors?: AvailableChartColors[]
  showAnimation?: boolean
  showLegend?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  showGridLines?: boolean
  height?: number
}

const defaultColors: AvailableChartColors[] = ["blue", "emerald", "violet", "amber", "rose"]

const AreaChart = React.forwardRef<HTMLDivElement, AreaChartProps>(
  (
    {
      data,
      index,
      categories,
      colors = defaultColors,
      showAnimation = false,
      showLegend = true,
      showXAxis = true,
      showYAxis = true,
      showGridLines = true,
      height = 300,
      className,
      ...props
    },
    forwardedRef
  ) => {
    if (!data || data.length === 0) {
      return <div ref={forwardedRef} className={className} {...props}>No data</div>
    }

    const padding = { top: 20, right: 20, bottom: 40, left: 50 }
    const width = 500
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Calculate min/max values
    const allValues = data.flatMap((d) => categories.map((cat) => Number(d[cat]) || 0))
    const minValue = Math.min(...allValues, 0)
    const maxValue = Math.max(...allValues)
    const valueRange = maxValue - minValue || 1

    // Create paths for each category
    const paths = categories.map((category, catIndex) => {
      const color = colors[catIndex % colors.length]
      const strokeColor = getColorClassName(color, "stroke")
      const fillColor = getColorClassName(color, "fill")

      const points = data.map((d, i) => {
        const x = padding.left + (i / (data.length - 1)) * chartWidth
        const y = padding.top + chartHeight - ((Number(d[category]) || 0) - minValue) / valueRange * chartHeight
        return { x, y }
      })

      const linePath = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ")
      const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`

      return { linePath, areaPath, strokeColor, fillColor, color }
    })

    return (
      <div ref={forwardedRef} className={cx("w-full", className)} {...props}>
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          className={cx(showAnimation && "animate-fade-in")}
        >
          {/* Grid lines */}
          {showGridLines && (
            <g className="text-gray-200 dark:text-gray-800">
              {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
                const y = padding.top + chartHeight * (1 - tick)
                return (
                  <line
                    key={i}
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="currentColor"
                    strokeDasharray="2,2"
                    className="stroke-gray-200 dark:stroke-gray-800"
                  />
                )
              })}
            </g>
          )}

          {/* Areas and lines */}
          {paths.map((path, i) => (
            <g key={i}>
              <path d={path.areaPath} className={cx(path.fillColor, "opacity-20")} />
              <path
                d={path.linePath}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={path.strokeColor}
                fill="none"
              />
            </g>
          ))}

          {/* Y Axis */}
          {showYAxis && (
            <g>
              {[0, 0.5, 1].map((tick, i) => {
                const y = padding.top + chartHeight * (1 - tick)
                const value = minValue + valueRange * tick
                return (
                  <text
                    key={i}
                    x={padding.left - 8}
                    y={y}
                    textAnchor="end"
                    alignmentBaseline="middle"
                    className="text-xs fill-gray-500 dark:fill-gray-400"
                  >
                    {Math.round(value)}
                  </text>
                )
              })}
            </g>
          )}

          {/* X Axis */}
          {showXAxis && (
            <g>
              {data.filter((_, i) => i % Math.ceil(data.length / 5) === 0 || i === data.length - 1).map((d, i, arr) => {
                const actualIndex = data.indexOf(d)
                const x = padding.left + (actualIndex / (data.length - 1)) * chartWidth
                return (
                  <text
                    key={i}
                    x={x}
                    y={height - 10}
                    textAnchor="middle"
                    className="text-xs fill-gray-500 dark:fill-gray-400"
                  >
                    {String(d[index]).slice(0, 8)}
                  </text>
                )
              })}
            </g>
          )}
        </svg>

        {/* Legend */}
        {showLegend && (
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {categories.map((category, i) => {
              const color = colors[i % colors.length]
              const bgColor = getColorClassName(color, "bg")
              return (
                <div key={category} className="flex items-center gap-2">
                  <div className={cx("size-3 rounded-full", bgColor)} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{category}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }
)

AreaChart.displayName = "AreaChart"

export { AreaChart }
export type { AreaChartProps, AreaChartDataPoint }
