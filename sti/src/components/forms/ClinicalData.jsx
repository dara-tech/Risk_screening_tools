import React, { useState, useCallback } from 'react'
import { Input } from '../ui/input'
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '../ui/select'
import { Checkbox } from '../ui/checkbox'
import { FiActivity, FiDroplet, FiHeart, FiCalendar, FiAlertCircle, FiShield, FiTrendingUp, FiInfo, FiCheck } from 'react-icons/fi'
import { Activity, Droplets, Heart, Calendar, AlertTriangle, Shield, TrendingUp, Stethoscope, TestTube } from 'lucide-react'

// Enhanced FieldWrapper with better visual feedback
const FieldWrapper = ({ children, label, required = false, icon: Icon, className = "", tooltip = "", status = "default" }) => {
    const [showTooltip, setShowTooltip] = useState(false)
    
    return (
        <div className={`group relative ${className}`}>
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                        <Icon className="w-4 h-4 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" />
                    </div>
                )}
                {children}
                {required && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    </div>
                )}
                {tooltip && (
                    <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                        <div 
                            className="relative"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                        >
                            <FiInfo className="w-4 h-4 text-gray-400 hover:text-green-500 cursor-help transition-colors duration-200" />
                            {showTooltip && (
                                <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50">
                                    {tooltip}
                                    <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {label && (
                <label className="block text-xs font-semibold text-gray-700 mt-2 tracking-wide uppercase">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
        </div>
    )
}

// Enhanced SectionHeader with better visual design
const SectionHeader = ({ icon: Icon, title, subtitle, gradient = "from-green-500 to-emerald-500", badge = null, severity = null }) => (
    <div className="flex items-center space-x-4 mb-8">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
            <div className="flex items-center space-x-3">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h3>
                {badge && (
                    <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                        {badge}
                    </span>
                )}
                {severity && (
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        severity === 'critical' ? 'bg-red-100 text-red-800' :
                        severity === 'warning' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                    }`}>
                        {severity.toUpperCase()}
                    </span>
                )}
            </div>
            {subtitle && (
                <p className="text-sm text-gray-600 font-medium mt-1">{subtitle}</p>
            )}
        </div>
    </div>
)

// Enhanced ClinicalCheckbox with better visual feedback
const ClinicalCheckbox = ({ checked, onChange, label, description, severity = "normal", tooltip = "" }) => {
    const [showTooltip, setShowTooltip] = useState(false)
    
    const getSeverityColor = (level) => {
        switch (level) {
            case "critical": return "border-red-200 bg-red-50 hover:bg-red-100 focus:ring-red-200"
            case "warning": return "border-orange-200 bg-orange-50 hover:bg-orange-100 focus:ring-orange-200"
            case "info": return "border-blue-200 bg-blue-50 hover:bg-blue-100 focus:ring-blue-200"
            default: return "border-gray-200 bg-gray-50 hover:bg-gray-100 focus:ring-gray-200"
        }
    }

    const getSeverityIcon = (level) => {
        switch (level) {
            case "critical": return <AlertTriangle className="w-4 h-4 text-red-600" />
            case "warning": return <TrendingUp className="w-4 h-4 text-orange-600" />
            case "info": return <Shield className="w-4 h-4 text-blue-600" />
            default: return <Activity className="w-4 h-4 text-gray-600" />
        }
    }

    const handleCardClick = () => {
        onChange({ target: { checked: !checked } })
    }

    return (
        <div 
            className={`relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${getSeverityColor(severity)} ${checked ? 'ring-2 ring-green-200 bg-green-100 shadow-md' : 'hover:shadow-sm'}`}
            onClick={handleCardClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleCardClick()
                }
            }}
            tabIndex={0}
            role="checkbox"
            aria-checked={checked}
        >
            {/* Hidden checkbox for accessibility */}
            <Checkbox
                checked={checked}
                onChange={onChange}
                className="sr-only"
            />
            
            {/* Success indicator - positioned at top-right */}
            {checked && (
                <div className="absolute top-2 right-2 z-10">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-md">
                        <FiCheck className="w-3 h-3 text-white" />
                    </div>
                </div>
            )}
            
            <div className="relative">
                <div className="flex items-start space-x-3">
                    {/* Custom checkbox indicator */}
                    <div className="flex-shrink-0 mt-0.5">
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                            checked 
                                ? 'bg-blue-500 border-blue-500' 
                                : 'bg-white border-gray-300'
                        }`}>
                            {checked && (
                                <FiCheck className="w-3 h-3 text-white" />
                            )}
                        </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                            {getSeverityIcon(severity)}
                            <label className="text-sm font-semibold text-gray-900 cursor-pointer">
                                {label}
                            </label>
                        </div>
                        {description && (
                            <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
                        )}
                    </div>
                </div>
                
                {/* Information icon - positioned at bottom end */}
                {tooltip && (
                    <div 
                        className="absolute bottom-0 right-0"
                        onClick={(e) => e.stopPropagation()}
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                    >
                        <FiInfo className="w-4 h-4 text-gray-400 hover:text-green-500 cursor-help transition-colors duration-200" />
                        {showTooltip && (
                            <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50">
                                {tooltip}
                                <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

// Clinical Summary Component
const ClinicalSummary = ({ formData }) => {
    const testResults = [
        { field: 'hivTestPast6Months', label: 'HIV Test (6 months)', value: formData.hivTestPast6Months },
        { field: 'hivTestResult', label: 'HIV Test Result', value: formData.hivTestResult },
        { field: 'stiSymptoms', label: 'STI Symptoms', value: formData.stiSymptoms },
        { field: 'syphilisPositive', label: 'Syphilis Test', value: formData.syphilisPositive }
    ].filter(item => item.value && item.value !== '')

    const prepStatus = [
        { field: 'currentlyOnPrep', label: 'Currently on PrEP', value: formData.currentlyOnPrep },
        { field: 'everOnPrep', label: 'Ever on PrEP', value: formData.everOnPrep }
    ].filter(item => item.value && item.value !== '')

    return (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 mt-6">
            <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h4 className="text-lg font-bold text-green-800">Clinical Summary</h4>
                    <p className="text-green-700 text-sm">Key clinical information and test results</p>
                </div>
            </div>
            
            {testResults.length > 0 && (
                <div className="mb-4">
                    <h5 className="text-sm font-semibold text-green-800 mb-2">Test Results</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {testResults.map((item, index) => (
                            <div key={index} className="p-3 bg-white rounded-lg border border-green-200">
                                <div className="text-xs text-green-600 font-medium">{item.label}</div>
                                <div className="text-sm font-semibold text-gray-900">{item.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {prepStatus.length > 0 && (
                <div>
                    <h5 className="text-sm font-semibold text-green-800 mb-2">PrEP Status</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {prepStatus.map((item, index) => (
                            <div key={index} className="p-3 bg-white rounded-lg border border-green-200">
                                <div className="text-xs text-green-600 font-medium">{item.label}</div>
                                <div className="text-sm font-semibold text-gray-900">{item.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

const ClinicalData = ({ formData, updateFormData, formOptions = {} }) => {
    const [focusedField, setFocusedField] = useState(null)
    const [hoveredField, setHoveredField] = useState(null)

    const handleInputChange = useCallback((field, value) => {
        updateFormData({ [field]: value })
    }, [updateFormData])

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Enhanced Header */}
            <div className="text-center space-y-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                    <Activity className="w-10 h-10 text-white" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Clinical Data</h2>
                    <p className="text-gray-600 text-lg font-medium mt-2">Medical information and test results</p>
                </div>
                
                {/* Clinical Summary */}
                <ClinicalSummary formData={formData} />
            </div>

            {/* HIV Testing Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <SectionHeader 
                    icon={TestTube} 
                    title="HIV Testing" 
                    subtitle="Recent HIV test results and history"
                    gradient="from-red-500 to-pink-500"
                    badge="Critical"
                    severity="critical"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FieldWrapper 
                        label="HIV Test Past 6 Months"
                        tooltip="Whether client has been tested for HIV in the past 6 months"
                        status={formData.hivTestPast6Months ? "success" : "default"}
                    >
                        <Select value={formData.hivTestPast6Months} onValueChange={(value) => handleInputChange('hivTestPast6Months', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select answer" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="Yes" className="hover:bg-red-50 py-3">Yes</SelectItem>
                                <SelectItem value="No" className="hover:bg-red-50 py-3">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                    
                    <FieldWrapper 
                        label="HIV Test Result"
                        tooltip="Result of the most recent HIV test"
                        status={formData.hivTestResult ? "success" : "default"}
                    >
                        <Select value={formData.hivTestResult} onValueChange={(value) => handleInputChange('hivTestResult', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select result" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="Negative" className="hover:bg-red-50 py-3">Negative</SelectItem>
                                <SelectItem value="Positive" className="hover:bg-red-50 py-3">Positive</SelectItem>
                                <SelectItem value="Unknown" className="hover:bg-red-50 py-3">Unknown</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                    
                    <FieldWrapper 
                        label="Last HIV Test Date"
                        icon={Calendar}
                        tooltip="Date of the most recent HIV test"
                        status={formData.lastHivTestDate ? "success" : "default"}
                    >
                        <Input
                            type="date"
                            value={formData.lastHivTestDate}
                            onChange={(e) => handleInputChange('lastHivTestDate', e.target.value)}
                            className="pl-10 pr-4 h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all duration-300 hover:border-gray-300"
                            onFocus={() => setFocusedField('lastHivTestDate')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </FieldWrapper>
                </div>
            </div>

            {/* STI Symptoms Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <SectionHeader 
                    icon={AlertTriangle} 
                    title="STI Symptoms" 
                    subtitle="Current symptoms and STI indicators"
                    gradient="from-orange-500 to-red-500"
                    badge="Important"
                    severity="warning"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FieldWrapper 
                        label="STI Symptoms"
                        tooltip="Any current symptoms of sexually transmitted infections"
                        status={formData.stiSymptoms ? "success" : "default"}
                    >
                        <Select value={formData.stiSymptoms} onValueChange={(value) => handleInputChange('stiSymptoms', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-orange-300 focus:ring-4 focus:ring-orange-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select answer" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="Yes" className="hover:bg-orange-50 py-3">Yes</SelectItem>
                                <SelectItem value="No" className="hover:bg-orange-50 py-3">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                    
                    <FieldWrapper 
                        label="Syphilis Positive"
                        tooltip="Positive syphilis test result"
                        status={formData.syphilisPositive ? "success" : "default"}
                    >
                        <Select value={formData.syphilisPositive} onValueChange={(value) => handleInputChange('syphilisPositive', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-orange-300 focus:ring-4 focus:ring-orange-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select result" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="Yes" className="hover:bg-orange-50 py-3">Yes</SelectItem>
                                <SelectItem value="No" className="hover:bg-orange-50 py-3">No</SelectItem>
                                <SelectItem value="Unknown" className="hover:bg-orange-50 py-3">Unknown</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                </div>
            </div>

            {/* PrEP Status Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <SectionHeader 
                    icon={Shield} 
                    title="PrEP Status" 
                    subtitle="Pre-exposure prophylaxis information"
                    gradient="from-blue-500 to-indigo-500"
                    badge="Prevention"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FieldWrapper 
                        label="Currently on PrEP"
                        tooltip="Whether client is currently taking PrEP medication"
                        status={formData.currentlyOnPrep ? "success" : "default"}
                    >
                        <Select value={formData.currentlyOnPrep} onValueChange={(value) => handleInputChange('currentlyOnPrep', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select answer" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="Yes" className="hover:bg-blue-50 py-3">Yes</SelectItem>
                                <SelectItem value="No" className="hover:bg-blue-50 py-3">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                    
                    <FieldWrapper 
                        label="Ever on PrEP"
                        tooltip="Whether client has ever taken PrEP medication"
                        status={formData.everOnPrep ? "success" : "default"}
                    >
                        <Select value={formData.everOnPrep} onValueChange={(value) => handleInputChange('everOnPrep', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select answer" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="Yes" className="hover:bg-blue-50 py-3">Yes</SelectItem>
                                <SelectItem value="No" className="hover:bg-blue-50 py-3">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                </div>
            </div>

            {/* Clinical Assessment Complete */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                        <Stethoscope className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-green-800">Clinical Assessment Complete</h4>
                        <p className="text-green-700 text-sm">Review the clinical data above and proceed to risk calculation.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ClinicalData
