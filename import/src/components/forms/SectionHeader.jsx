import React from 'react'

// Simple inline Badge component to avoid dependency issues
const Badge = ({ children, className, ...props }) => (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${className}`} {...props}>
        {children}
    </span>
)

const SectionHeader = ({ 
    icon: Icon, 
    title, 
    subtitle, 
    gradient = "from-blue-500 to-purple-500", 
    badge, 
    severity = "default",
    riskLevel 
}) => {
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'text-red-600'
            case 'warning': return 'text-orange-600'
            case 'info': return 'text-blue-600'
            default: return 'text-gray-600'
        }
    }

    const getRiskLevelColor = (level) => {
        switch (level) {
            case 'high': return 'bg-red-100 text-red-800 border-red-200'
            case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200'
            case 'low': return 'bg-green-100 text-green-800 border-green-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
                    {Icon && <Icon className="w-6 h-6 text-white" />}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h3>
                    <p className={`text-sm font-medium ${getSeverityColor(severity)}`}>{subtitle}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {badge && (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        {badge}
                    </Badge>
                )}
                {riskLevel && (
                    <Badge className={getRiskLevelColor(riskLevel)}>
                        {riskLevel} Risk
                    </Badge>
                )}
            </div>
        </div>
    )
}

export default SectionHeader
