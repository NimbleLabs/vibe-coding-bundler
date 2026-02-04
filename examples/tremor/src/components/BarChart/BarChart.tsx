import React from "react"
import { cx } from "../../utils/cx"
import { AvailableChartColors, getColorClassName } from "../../utils/chartColors"

interface BarChartDataPoint {
  [key: string]: string | number
}

interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: BarChartDataPoint[]
  index: string
  categories: string[]
  colors?: AvailableChartColors[]
  showAnimation?: boolean
  showLegend?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  showGridLines?: boolean
  layout?: "horizontal" | "vertical"
  barGap?: number
  height?: number
}

const defaultColors: AvailableChartColors[] = ["blue", "emerald", "violet", "amber", "rose"]

const BarChart = React.forwardRef<HTMLDivElement, BarChartProps>(
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
      layout = "vertical",
      barGap = 2,
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

    // Calculate max value
    const allValues = data.flatMap((d) => categories.map((cat) => Number(d[cat]) || 0))
    const maxValue = Math.max(...allValues) || 1

    // Bar dimensions
    const groupWidth = chartWidth / data.length
    const barWidth = (groupWidth - barGap * (categories.length + 1)) / categories.length

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
            <g>
              {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
                const y = padding.top + chartHeight * (1 - tick)
                return (
                  <line
                    key={i}
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    strokeDasharray="2,2"
                    className="stroke-gray-200 dark:stroke-gray-800"
                  />
                )
              })}
            </g>
          )}

          {/* Bars */}
          {data.map((d, dataIndex) => {
            const groupX = padding.left + dataIndex * groupWidth + barGap

            return (
              <g key={dataIndex}>
                {categories.map((category, catIndex) => {
                  const value = Number(d[category]) || 0
                  const barHeight = (value / maxValue) * chartHeight
                  const x = groupX + catIndex * (barWidth + barGap)
                  const y = padding.top + chartHeight - barHeight
                  const color = colors[catIndex % colors.length]
                  const fillColor = getColorClassName(color, "fill")

                  return (
                    <rect
                      key={category}
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx={2}
                      className={cx(fillColor, showAnimation && "transition-all duration-500")}
                    />
                  )
                })}
              </g>
            )
          })}

          {/* Y Axis */}
          {showYAxis && (
            <g>
              {[0, 0.5, 1].map((tick, i) => {
                const y = padding.top + chartHeight * (1 - tick)
                const value = maxValue * tick
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
              {data.map((d, i) => {
                const x = padding.left + i * groupWidth + groupWidth / 2
                return (
                  <text
                    key={i}
                    x={x}
                    y={height - 10}
                    textAnchor="middle"
                    className="text-xs fill-gray-500 dark:fill-gray-400"
                  >
                    {String(d[index]).slice(0, 6)}
                  </text>
                )
              })}
            </g>
          )}
        </svg>

        {/* Legend */}
        {showLegend && categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {categories.map((category, i) => {
              const color = colors[i % colors.length]
              const bgColor = getColorClassName(color, "bg")
              return (
                <div key={category} className="flex items-center gap-2">
                  <div className={cx("size-3 rounded", bgColor)} />
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

BarChart.displayName = "BarChart"

export { BarChart }
export type { BarChartProps, BarChartDataPoint }
