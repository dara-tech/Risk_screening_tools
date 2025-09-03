import React from 'react'
import Tooltip from '../ui/tooltip'

// Simple inline Badge component to avoid dependency issues
const Badge = ({ children, className, ...props }) => (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`} {...props}>
        {children}
    </span>
)

const FieldWrapper = ({ 
    children, 
    label, 
    tooltip, 
    icon: Icon, 
    status = "default",
    required = false 
}) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'success': return 'border-green-300 bg-green-50 text-green-800'
            case 'error': return 'border-red-300 bg-red-50 text-red-800'
            case 'warning': return 'border-orange-300 bg-orange-50 text-orange-800'
            default: return 'border-gray-200 bg-gray-50 text-gray-800'
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'success': return '✓'
            case 'error': return '✗'
            case 'warning': return '⚠'
            default: return null
        }
    }

    const fieldContent = (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4 text-gray-500" />}
                    <label className="text-sm font-medium text-gray-700">
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                </div>
                {status !== 'default' && (
                    <Badge className={`border ${getStatusColor(status)}`}>
                        {getStatusIcon(status)}
                    </Badge>
                )}
            </div>
            {children}
        </div>
    )

    return tooltip ? (
        <Tooltip content={tooltip}>
            {fieldContent}
        </Tooltip>
    ) : (
        fieldContent
    )
}

export default FieldWrapper
