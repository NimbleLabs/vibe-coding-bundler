import React from "react"
import { cx } from "../../utils/cx"
import { AvailableChartColors, getColorClassName } from "../../utils/chartColors"

interface ComboChartDataPoint {
  [key: string]: string | number
}

interface ComboChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ComboChartDataPoint[]
  index: string
  barCategories: string[]
  lineCategories: string[]
  barColors?: AvailableChartColors[]
  lineColors?: AvailableChartColors[]
  showAnimation?: boolean
  showLegend?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
  showGridLines?: boolean
  height?: number
}

const defaultBarColors: AvailableChartColors[] = ["blue", "emerald", "violet"]
const defaultLineColors: AvailableChartColors[] = ["amber", "rose"]

const ComboChart = React.forwardRef<HTMLDivElement, ComboChartProps>(
  (
    {
      data,
      index,
      barCategories,
      lineCategories,
      barColors = defaultBarColors,
      lineColors = defaultLineColors,
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

    const padding = { top: 20, right: 50, bottom: 40, left: 50 }
    const width = 500
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom

    // Calculate max values for bars and lines separately
    const barValues = data.flatMap((d) => barCategories.map((cat) => Number(d[cat]) || 0))
    const lineValues = data.flatMap((d) => lineCategories.map((cat) => Number(d[cat]) || 0))

    const maxBarValue = Math.max(...barValues) || 1
    const maxLineValue = Math.max(...lineValues) || 1

    // Bar dimensions
    const barGap = 2
    const groupWidth = chartWidth / data.length
    const barWidth = (groupWidth - barGap * (barCategories.length + 1)) / barCategories.length

    // Create line paths
    const linePaths = lineCategories.map((category, catIndex) => {
      const color = lineColors[catIndex % lineColors.length]
      const strokeColor = getColorClassName(color, "stroke")
      const fillColor = getColorClassName(color, "fill")

      const points = data.map((d, i) => {
        const x = padding.left + i * groupWidth + groupWidth / 2
        const y = padding.top + chartHeight - ((Number(d[category]) || 0) / maxLineValue) * chartHeight
        return { x, y }
      })

      const linePath = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ")

      return { linePath, points, strokeColor, fillColor, color }
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
                {barCategories.map((category, catIndex) => {
                  const value = Number(d[category]) || 0
                  const barHeight = (value / maxBarValue) * chartHeight
                  const x = groupX + catIndex * (barWidth + barGap)
                  const y = padding.top + chartHeight - barHeight
                  const color = barColors[catIndex % barColors.length]
                  const fillColor = getColorClassName(color, "fill")

                  return (
                    <rect
                      key={category}
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx={2}
                      className={cx(fillColor, "opacity-80", showAnimation && "transition-all duration-500")}
                    />
                  )
                })}
              </g>
            )
          })}

          {/* Lines */}
          {linePaths.map((path, i) => (
            <g key={i}>
              <path
                d={path.linePath}
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={path.strokeColor}
                fill="none"
              />
              {path.points.map((point, j) => (
                <circle
                  key={j}
                  cx={point.x}
                  cy={point.y}
                  r={4}
                  className={cx(path.fillColor, "stroke-white stroke-2")}
                />
              ))}
            </g>
          ))}

          {/* Left Y Axis (bars) */}
          {showYAxis && (
            <g>
              {[0, 0.5, 1].map((tick, i) => {
                const y = padding.top + chartHeight * (1 - tick)
                const value = maxBarValue * tick
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

          {/* Right Y Axis (lines) */}
          {showYAxis && lineCategories.length > 0 && (
            <g>
              {[0, 0.5, 1].map((tick, i) => {
                const y = padding.top + chartHeight * (1 - tick)
                const value = maxLineValue * tick
                return (
                  <text
                    key={i}
                    x={width - padding.right + 8}
                    y={y}
                    textAnchor="start"
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
        {showLegend && (
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {barCategories.map((category, i) => {
              const color = barColors[i % barColors.length]
              const bgColor = getColorClassName(color, "bg")
              return (
                <div key={category} className="flex items-center gap-2">
                  <div className={cx("size-3 rounded", bgColor)} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{category}</span>
                </div>
              )
            })}
            {lineCategories.map((category, i) => {
              const color = lineColors[i % lineColors.length]
              const bgColor = getColorClassName(color, "bg")
              return (
                <div key={category} className="flex items-center gap-2">
                  <div className={cx("h-0.5 w-4 rounded-full", bgColor)} />
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

ComboChart.displayName = "ComboChart"

export { ComboChart }
export type { ComboChartProps, ComboChartDataPoint }
