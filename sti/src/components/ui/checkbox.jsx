import React from 'react'
import { cn } from '../../lib/utils'

const Checkbox = React.forwardRef(({ className, checked, onChange, label, ...props }, ref) => {
  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer" onClick={() => onChange({ target: { checked: !checked } })}>
      <input
        type="checkbox"
        ref={ref}
        checked={checked}
        onChange={onChange}
        className={cn(
          "h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-2 mt-0.5 flex-shrink-0",
          className
        )}
        {...props}
      />
      {label && (
        <label className="text-sm sm:text-base font-medium text-gray-700 cursor-pointer leading-relaxed">
          {label}
        </label>
      )}
    </div>
  )
})

Checkbox.displayName = 'Checkbox'

export { Checkbox }
