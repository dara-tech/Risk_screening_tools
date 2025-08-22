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
import { FiHeart, FiUsers, FiActivity, FiAlertTriangle, FiShield, FiInfo, FiCheck, FiX } from 'react-icons/fi'
import { Shield, Activity, Users, AlertTriangle, Heart, Zap } from 'lucide-react'

// Enhanced FieldWrapper with better visual feedback
const FieldWrapper = ({ children, label, required = false, icon: Icon, className = "", tooltip = "", status = "default" }) => {
    const [showTooltip, setShowTooltip] = useState(false)
    
    return (
        <div className={`group relative ${className}`}>
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                        <Icon className="w-4 h-4 text-gray-400 group-focus-within:text-red-500 transition-colors duration-200" />
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
                            <FiInfo className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-help transition-colors duration-200" />
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
const SectionHeader = ({ icon: Icon, title, subtitle, gradient = "from-red-500 to-pink-500", badge = null, riskLevel = null }) => (
    <div className="flex items-center space-x-4 mb-8">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
            <div className="flex items-center space-x-3">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h3>
                {badge && (
                    <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                        {badge}
                    </span>
                )}
                {riskLevel && (
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                        riskLevel === 'medium' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                    }`}>
                        {riskLevel.toUpperCase()} RISK
                    </span>
                )}
            </div>
            {subtitle && (
                <p className="text-sm text-gray-600 font-medium mt-1">{subtitle}</p>
            )}
        </div>
    </div>
)

// Enhanced RiskCheckbox with better visual feedback
const RiskCheckbox = ({ checked, onChange, label, description, riskLevel = "medium", tooltip = "" }) => {
    const [showTooltip, setShowTooltip] = useState(false)
    
    const getRiskColor = (level) => {
        switch (level) {
            case "high": return "border-red-200 bg-red-50 hover:bg-red-100 focus:ring-red-200"
            case "medium": return "border-orange-200 bg-orange-50 hover:bg-orange-100 focus:ring-orange-200"
            case "low": return "border-yellow-200 bg-yellow-50 hover:bg-yellow-100 focus:ring-yellow-200"
            default: return "border-gray-200 bg-gray-50 hover:bg-gray-100 focus:ring-gray-200"
        }
    }

    const getRiskIcon = (level) => {
        switch (level) {
            case "high": return <AlertTriangle className="w-4 h-4 text-red-600" />
            case "medium": return <Activity className="w-4 h-4 text-orange-600" />
            case "low": return <Shield className="w-4 h-4 text-yellow-600" />
            default: return <Shield className="w-4 h-4 text-gray-600" />
        }
    }

    const handleCardClick = () => {
        onChange({ target: { checked: !checked } })
    }

    return (
        <div 
            className={`relative p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${getRiskColor(riskLevel)} ${checked ? 'ring-2 ring-red-200 bg-red-100 shadow-md' : 'hover:shadow-sm'}`}
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
                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-md">
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
                            {getRiskIcon(riskLevel)}
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
                        <FiInfo className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-help transition-colors duration-200" />
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

// Risk Level Indicator Component
const RiskLevelIndicator = ({ riskFactors }) => {
    const highRiskCount = riskFactors.filter(factor => factor.riskLevel === 'high' && factor.checked).length
    const mediumRiskCount = riskFactors.filter(factor => factor.riskLevel === 'medium' && factor.checked).length
    const lowRiskCount = riskFactors.filter(factor => factor.riskLevel === 'low' && factor.checked).length
    
    const totalRisk = highRiskCount * 3 + mediumRiskCount * 2 + lowRiskCount
    
    const getRiskLevel = () => {
        if (totalRisk >= 6) return { level: 'HIGH', color: 'red', bg: 'bg-red-50', border: 'border-red-200' }
        if (totalRisk >= 3) return { level: 'MEDIUM', color: 'orange', bg: 'bg-orange-50', border: 'border-orange-200' }
        return { level: 'LOW', color: 'green', bg: 'bg-green-50', border: 'border-green-200' }
    }
    
    const riskInfo = getRiskLevel()
    
    return (
        <div className={`p-6 rounded-2xl border-2 ${riskInfo.bg} ${riskInfo.border} shadow-lg`}>
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-900">Risk Assessment Summary</h4>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold bg-${riskInfo.color}-100 text-${riskInfo.color}-800`}>
                    {riskInfo.level} RISK
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-red-100 rounded-xl">
                    <div className="text-2xl font-bold text-red-600">{highRiskCount}</div>
                    <div className="text-xs text-red-700 font-semibold">High Risk</div>
                </div>
                <div className="p-3 bg-orange-100 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600">{mediumRiskCount}</div>
                    <div className="text-xs text-orange-700 font-semibold">Medium Risk</div>
                </div>
                <div className="p-3 bg-yellow-100 rounded-xl">
                    <div className="text-2xl font-bold text-yellow-600">{lowRiskCount}</div>
                    <div className="text-xs text-yellow-700 font-semibold">Low Risk</div>
                </div>
            </div>
        </div>
    )
}

const RiskAssessment = ({ formData, updateFormData, formOptions = {} }) => {
    const [focusedField, setFocusedField] = useState(null)
    const [hoveredField, setHoveredField] = useState(null)

    const handleInputChange = useCallback((field, value) => {
        updateFormData({ [field]: value })
    }, [updateFormData])

    // Calculate risk factors for summary
    const riskFactors = [
        { field: 'sexWithoutCondom', label: 'Sex without condom', riskLevel: 'high', checked: formData.sexWithoutCondom === 'true' },
        { field: 'sexWithHIVPartner', label: 'Sex with HIV+ partner', riskLevel: 'high', checked: formData.sexWithHIVPartner === 'true' },
        { field: 'receiveMoneyForSex', label: 'Receive money for sex', riskLevel: 'high', checked: formData.receiveMoneyForSex === 'true' },
        { field: 'injectedDrugSharedNeedle', label: 'Injected drug/shared needle', riskLevel: 'high', checked: formData.injectedDrugSharedNeedle === 'true' },
        { field: 'paidForSex', label: 'Paid for sex', riskLevel: 'medium', checked: formData.paidForSex === 'true' },
        { field: 'alcoholDrugBeforeSex', label: 'Alcohol/drug before sex', riskLevel: 'medium', checked: formData.alcoholDrugBeforeSex === 'true' },
        { field: 'groupSexChemsex', label: 'Group sex or chemsex', riskLevel: 'medium', checked: formData.groupSexChemsex === 'true' },
        { field: 'abortion', label: 'Abortion', riskLevel: 'low', checked: formData.abortion === 'true' }
    ]

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Enhanced Header with Progress */}
            <div className="text-center space-y-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl p-8 border border-red-100">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500 to-pink-600 shadow-lg">
                    <Shield className="w-10 h-10 text-white" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Risk Assessment</h2>
                    <p className="text-gray-600 text-lg font-medium mt-2">Evaluate sexual behavior and risk factors</p>
                </div>
                
                {/* Risk Summary */}
                <RiskLevelIndicator riskFactors={riskFactors} />
            </div>

            {/* Sexual Behavior Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <SectionHeader 
                    icon={Heart} 
                    title="Sexual Behavior" 
                    subtitle="Past 6 months activity assessment"
                    gradient="from-red-500 to-pink-500"
                    badge="Required"
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FieldWrapper 
                        label="Had sex in past 6 months?"
                        tooltip="Whether the client has been sexually active in the past 6 months"
                        status={formData.hadSexPast6Months ? "success" : "default"}
                    >
                        <Select value={formData.hadSexPast6Months} onValueChange={(value) => handleInputChange('hadSexPast6Months', value)}>
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
                        label="Number of sexual partners"
                        tooltip="Total number of sexual partners in the past 6 months"
                        status={formData.numberOfSexualPartners ? "success" : "default"}
                    >
                        <Select value={formData.numberOfSexualPartners} onValueChange={(value) => handleInputChange('numberOfSexualPartners', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select number" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="0" className="hover:bg-red-50 py-3">0</SelectItem>
                                <SelectItem value="1" className="hover:bg-red-50 py-3">1</SelectItem>
                                <SelectItem value="2" className="hover:bg-red-50 py-3">2</SelectItem>
                                <SelectItem value="3" className="hover:bg-red-50 py-3">3</SelectItem>
                                <SelectItem value="4" className="hover:bg-red-50 py-3">4</SelectItem>
                                <SelectItem value="5" className="hover:bg-red-50 py-3">5</SelectItem>
                                <SelectItem value="6+" className="hover:bg-red-50 py-3">6+</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                    
                    <FieldWrapper 
                        label="Past 6 months practices"
                        tooltip="Any specific sexual practices in the past 6 months"
                        status={formData.past6MonthsPractices ? "success" : "default"}
                    >
                        <Select value={formData.past6MonthsPractices} onValueChange={(value) => handleInputChange('past6MonthsPractices', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select answer" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="Yes" className="hover:bg-red-50 py-3">Yes</SelectItem>
                                <SelectItem value="No" className="hover:bg-red-50 py-3">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                </div>
            </div>

            {/* High Risk Behaviors Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <SectionHeader 
                    icon={AlertTriangle} 
                    title="High Risk Behaviors" 
                    subtitle="Critical risk factors requiring immediate attention"
                    gradient="from-orange-500 to-red-500"
                    riskLevel="high"
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <RiskCheckbox
                        checked={formData.sexWithoutCondom === 'true'}
                        onChange={(e) => handleInputChange('sexWithoutCondom', e.target.checked ? 'true' : 'false')}
                        label="Sex without a condom"
                        description="Unprotected sexual activity increases STI transmission risk"
                        riskLevel="high"
                        tooltip="Unprotected sex significantly increases the risk of STI transmission"
                    />
                    
                    <RiskCheckbox
                        checked={formData.sexWithHIVPartner === 'true'}
                        onChange={(e) => handleInputChange('sexWithHIVPartner', e.target.checked ? 'true' : 'false')}
                        label="Sex with known HIV+ partner(s)"
                        description="Direct exposure to HIV infection"
                        riskLevel="high"
                        tooltip="Sexual contact with HIV-positive partners requires immediate testing and prevention measures"
                    />
                    
                    <RiskCheckbox
                        checked={formData.receiveMoneyForSex === 'true'}
                        onChange={(e) => handleInputChange('receiveMoneyForSex', e.target.checked ? 'true' : 'false')}
                        label="Receive money or goods for sex"
                        description="Sex work activities with multiple partners"
                        riskLevel="high"
                        tooltip="Sex work often involves multiple partners and inconsistent condom use"
                    />
                    
                    <RiskCheckbox
                        checked={formData.injectedDrugSharedNeedle === 'true'}
                        onChange={(e) => handleInputChange('injectedDrugSharedNeedle', e.target.checked ? 'true' : 'false')}
                        label="Injected drug/shared needle"
                        description="Needle sharing risk for blood-borne infections"
                        riskLevel="high"
                        tooltip="Sharing needles is a major risk factor for HIV and hepatitis transmission"
                    />
                </div>
            </div>

            {/* Medium Risk Behaviors Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <SectionHeader 
                    icon={Activity} 
                    title="Medium Risk Behaviors" 
                    subtitle="Moderate risk factors requiring attention"
                    gradient="from-yellow-500 to-orange-500"
                    riskLevel="medium"
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <RiskCheckbox
                        checked={formData.paidForSex === 'true'}
                        onChange={(e) => handleInputChange('paidForSex', e.target.checked ? 'true' : 'false')}
                        label="Paid for sex"
                        description="Commercial sex activity with unknown partners"
                        riskLevel="medium"
                        tooltip="Commercial sex may involve partners with unknown STI status"
                    />
                    
                    <RiskCheckbox
                        checked={formData.alcoholDrugBeforeSex === 'true'}
                        onChange={(e) => handleInputChange('alcoholDrugBeforeSex', e.target.checked ? 'true' : 'false')}
                        label="Alcohol/drug before sex"
                        description="Substance use affecting decision making"
                        riskLevel="medium"
                        tooltip="Substance use can impair judgment and lead to risky sexual behavior"
                    />
                    
                    <RiskCheckbox
                        checked={formData.groupSexChemsex === 'true'}
                        onChange={(e) => handleInputChange('groupSexChemsex', e.target.checked ? 'true' : 'false')}
                        label="Group sex or chemsex"
                        description="Multiple partners or drug-enhanced sex"
                        riskLevel="medium"
                        tooltip="Group sex and chemsex often involve multiple partners and increased risk"
                    />
                </div>
            </div>

            {/* Additional Factors Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <SectionHeader 
                    icon={Shield} 
                    title="Additional Factors" 
                    subtitle="Other relevant health and social factors"
                    gradient="from-blue-500 to-indigo-500"
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <RiskCheckbox
                        checked={formData.abortion === 'true'}
                        onChange={(e) => handleInputChange('abortion', e.target.checked ? 'true' : 'false')}
                        label="Abortion"
                        description="Pregnancy termination history"
                        riskLevel="low"
                        tooltip="Abortion history may indicate unprotected sex or contraceptive issues"
                    />
                    
                    <div className="sm:col-span-2">
                        <FieldWrapper 
                            label="Forced to have sex" 
                            icon={AlertTriangle}
                            tooltip="History of sexual coercion or assault"
                            status={formData.forcedSex ? "success" : "default"}
                        >
                            <Select value={formData.forcedSex} onValueChange={(value) => handleInputChange('forcedSex', value)} >
                                <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300 hover:border-gray-300">
                                    <SelectValue placeholder="Select answer" className="text-gray-500" />
                                </SelectTrigger>
                                <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                    <SelectItem value="Yes" className="hover:bg-blue-50 py-3">Yes</SelectItem>
                                    <SelectItem value="No" className="hover:bg-blue-50 py-3">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </FieldWrapper>
                    </div>
                    
                    <div className="sm:col-span-2">
                        <FieldWrapper 
                            label="None of the above" 
                            icon={Shield}
                            tooltip="If none of the risk factors apply"
                            status={formData.noneOfAbove ? "success" : "default"}
                        >
                            <Select value={formData.noneOfAbove} onValueChange={(value) => handleInputChange('noneOfAbove', value)}>
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
            </div>

            {/* Risk Assessment Summary */}
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-red-800">Risk Assessment Complete</h4>
                        <p className="text-red-700 text-sm">Review the risk factors above and proceed to the next step.</p>
                    </div>
                </div>
                <RiskLevelIndicator riskFactors={riskFactors} />
            </div>
        </div>
    )
}

export default RiskAssessment
