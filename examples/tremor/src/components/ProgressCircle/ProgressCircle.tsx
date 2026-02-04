import React from "react"
import { cx } from "../../utils/cx"

type ProgressCircleVariant = "default" | "success" | "warning" | "error" | "neutral"

interface ProgressCircleProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  radius?: number
  strokeWidth?: number
  showAnimation?: boolean
  variant?: ProgressCircleVariant
  children?: React.ReactNode
}

const sizes = {
  xs: { size: 36, strokeWidth: 3, fontSize: "text-xs" },
  sm: { size: 48, strokeWidth: 3, fontSize: "text-xs" },
  md: { size: 64, strokeWidth: 4, fontSize: "text-sm" },
  lg: { size: 80, strokeWidth: 4, fontSize: "text-base" },
  xl: { size: 96, strokeWidth: 5, fontSize: "text-lg" },
}

const variantColors: Record<ProgressCircleVariant, string> = {
  default: "stroke-blue-500",
  success: "stroke-emerald-500",
  warning: "stroke-yellow-500",
  error: "stroke-red-500",
  neutral: "stroke-gray-500",
}

const ProgressCircle = React.forwardRef<HTMLDivElement, ProgressCircleProps>(
  (
    {
      value = 0,
      max = 100,
      size = "md",
      radius: customRadius,
      strokeWidth: customStrokeWidth,
      showAnimation = false,
      variant = "default",
      className,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const sizeConfig = sizes[size]
    const svgSize = sizeConfig.size
    const strokeWidth = customStrokeWidth ?? sizeConfig.strokeWidth
    const radius = customRadius ?? (svgSize - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const normalizedValue = Math.min(Math.max(value, 0), max)
    const offset = circumference - (normalizedValue / max) * circumference

    return (
      <div
        ref={forwardedRef}
        className={cx("relative inline-flex items-center justify-center", className)}
        style={{ width: svgSize, height: svgSize }}
        {...props}
      >
        <svg
          className="rotate-[-90deg]"
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background circle */}
          <circle
            className="stroke-gray-200 dark:stroke-gray-800"
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            className={cx(
              variantColors[variant],
              showAnimation && "transition-[stroke-dashoffset] duration-500 ease-in-out"
            )}
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        {children && (
          <div className={cx("absolute inset-0 flex items-center justify-center", sizeConfig.fontSize)}>
            {children}
          </div>
        )}
      </div>
    )
  }
)

ProgressCircle.displayName = "ProgressCircle"

export { ProgressCircle }
export type { ProgressCircleProps, ProgressCircleVariant }
