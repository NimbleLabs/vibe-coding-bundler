import React from "react"
import * as SliderPrimitives from "@radix-ui/react-slider"
import { cx } from "../../utils/cx"
import { focusRing } from "../../utils/focusRing"

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitives.Root> {}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitives.Root>,
  SliderProps
>(({ className, defaultValue, value, onValueChange, ...props }, forwardedRef) => {
  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? [0]
  )

  const handleValueChange = React.useCallback(
    (newValue: number[]) => {
      setInternalValue(newValue)
      onValueChange?.(newValue)
    },
    [onValueChange]
  )

  const currentValue = value ?? internalValue

  return (
    <SliderPrimitives.Root
      ref={forwardedRef}
      className={cx(
        // base
        "relative flex w-full touch-none select-none items-center",
        // disabled
        "data-[disabled]:pointer-events-none",
        className
      )}
      defaultValue={defaultValue}
      value={value}
      onValueChange={handleValueChange}
      {...props}
    >
      <SliderPrimitives.Track
        className={cx(
          // base
          "relative h-1.5 grow overflow-hidden rounded-full",
          // background
          "bg-gray-200 dark:bg-gray-800",
          // disabled
          "data-[disabled]:bg-gray-200 dark:data-[disabled]:bg-gray-800"
        )}
      >
        <SliderPrimitives.Range
          className={cx(
            // base
            "absolute h-full",
            // background
            "bg-blue-500",
            // disabled
            "data-[disabled]:bg-gray-300 dark:data-[disabled]:bg-gray-700"
          )}
        />
      </SliderPrimitives.Track>
      {currentValue.map((_, index) => (
        <SliderPrimitives.Thumb
          key={index}
          className={cx(
            // base
            "block size-4 shrink-0 rounded-full border-2 shadow transition-all",
            // border
            "border-blue-500",
            // background
            "bg-white",
            // disabled
            "data-[disabled]:pointer-events-none data-[disabled]:bg-gray-50 data-[disabled]:border-gray-300 dark:data-[disabled]:border-gray-600",
            // focus
            focusRing
          )}
        />
      ))}
    </SliderPrimitives.Root>
  )
})

Slider.displayName = "Slider"

export { Slider }
export type { SliderProps }
