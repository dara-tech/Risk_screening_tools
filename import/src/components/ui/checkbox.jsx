import React from 'react'
import { cn } from '../../lib/utils'

// The 'ref' is passed as the second argument from forwardRef
const Checkbox = React.forwardRef(({ className, checked, onChange, onCheckedChange, label, ...props }, ref) => {
  
  // This handler ensures the component works with BOTH native onChange and library-style onCheckedChange
  const handleChange = (e) => {
    // For native `onChange` (which you are using)
    if (onChange) {
      onChange(e);
    }
    // For library compatibility (like shadcn/ui)
    if (onCheckedChange) {
      onCheckedChange(e.target.checked);
    }
  };
  
  return (
    <label className={cn("flex items-center space-x-2", { 'cursor-pointer': !!label })}>
      <input
        type="checkbox"
        ref={ref} // Corrected: use the ref from the arguments
        checked={checked}
        onChange={handleChange} // Use our new flexible handler
        className={cn(
          "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-0 cursor-pointer",
          className
        )}
        {...props}
      />
      {label && (
        <span className="text-sm text-gray-700 select-none">
          {label}
        </span>
      )}
    </label>
  )
})

Checkbox.displayName = 'Checkbox'

export { Checkbox }