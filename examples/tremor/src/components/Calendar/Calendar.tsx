import React from "react"
import { cx } from "../../utils/cx"
import { focusRing } from "../../utils/focusRing"

interface CalendarProps {
  value?: Date
  onChange?: (date: Date) => void
  className?: string
  minDate?: Date
  maxDate?: Date
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ value, onChange, className, minDate, maxDate }, forwardedRef) => {
    const [currentMonth, setCurrentMonth] = React.useState(() => {
      const d = value ?? new Date()
      return new Date(d.getFullYear(), d.getMonth(), 1)
    })

    const getDaysInMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    }

    const prevMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
    }

    const nextMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
    }

    const handleDateSelect = (day: number) => {
      const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      onChange?.(newDate)
    }

    const isSelected = (day: number) => {
      if (!value) return false
      return (
        value.getDate() === day &&
        value.getMonth() === currentMonth.getMonth() &&
        value.getFullYear() === currentMonth.getFullYear()
      )
    }

    const isToday = (day: number) => {
      const today = new Date()
      return (
        today.getDate() === day &&
        today.getMonth() === currentMonth.getMonth() &&
        today.getFullYear() === currentMonth.getFullYear()
      )
    }

    const isDisabled = (day: number) => {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      if (minDate && date < minDate) return true
      if (maxDate && date > maxDate) return true
      return false
    }

    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth)

    const days: (number | null)[] = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return (
      <div
        ref={forwardedRef}
        className={cx(
          "w-72 rounded-lg border p-4",
          "border-gray-200 dark:border-gray-800",
          "bg-white dark:bg-gray-950",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className={cx(
              "p-1.5 rounded-md text-gray-600 dark:text-gray-400",
              "hover:bg-gray-100 dark:hover:bg-gray-800",
              focusRing
            )}
            type="button"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-50">
            {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button
            onClick={nextMonth}
            className={cx(
              "p-1.5 rounded-md text-gray-600 dark:text-gray-400",
              "hover:bg-gray-100 dark:hover:bg-gray-800",
              focusRing
            )}
            type="button"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((day) => (
            <div
              key={day}
              className="h-8 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => (
            <div key={i} className="h-8">
              {day && (
                <button
                  onClick={() => handleDateSelect(day)}
                  disabled={isDisabled(day)}
                  className={cx(
                    "w-full h-full flex items-center justify-center rounded text-sm transition",
                    // Base
                    "text-gray-900 dark:text-gray-50",
                    // Hover
                    !isSelected(day) && !isDisabled(day) && "hover:bg-gray-100 dark:hover:bg-gray-800",
                    // Selected
                    isSelected(day) && "bg-blue-500 text-white hover:bg-blue-600",
                    // Today
                    isToday(day) && !isSelected(day) && "ring-1 ring-blue-500",
                    // Disabled
                    isDisabled(day) && "text-gray-300 dark:text-gray-700 cursor-not-allowed",
                    focusRing
                  )}
                  type="button"
                >
                  {day}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }
)

Calendar.displayName = "Calendar"

export { Calendar }
export type { CalendarProps }
