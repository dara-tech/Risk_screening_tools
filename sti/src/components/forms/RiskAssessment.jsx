import React, { useState } from 'react'
import { Input } from '../ui/input'
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '../ui/select'
import { Checkbox } from '../ui/checkbox'
import { FiHeart, FiUsers, FiActivity, FiAlertTriangle, FiShield } from 'react-icons/fi'
import { Shield, Activity, Users, AlertTriangle } from 'lucide-react'

const RiskAssessment = ({ formData, updateFormData, formOptions = {} }) => {
    const [focusedField, setFocusedField] = useState(null)
    const [hoveredField, setHoveredField] = useState(null)

    const handleInputChange = (field, value) => {
        updateFormData({ [field]: value })
    }

    const FieldWrapper = ({ children, label, required = false, icon: Icon, className = "" }) => (
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
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                    </div>
                )}
            </div>
            {label && (
                <label className="block text-xs font-medium text-gray-600 mt-2 tracking-wide uppercase">
                    {label}
                </label>
            )}
        </div>
    )

    const SectionHeader = ({ icon: Icon, title, subtitle, gradient = "from-red-500 to-pink-500" }) => (
        <div className="flex items-center space-x-3 mb-6">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-900 tracking-tight">{title}</h3>
                {subtitle && (
                    <p className="text-sm text-gray-500 font-medium">{subtitle}</p>
                )}
            </div>
        </div>
    )

    const RiskCheckbox = ({ checked, onChange, label, description, riskLevel = "medium" }) => {
        const getRiskColor = (level) => {
            switch (level) {
                case "high": return "border-red-200 bg-red-50 hover:bg-red-100 focus:ring-red-200"
                case "medium": return "border-orange-200 bg-orange-50 hover:bg-orange-100 focus:ring-orange-200"
                case "low": return "border-yellow-200 bg-yellow-50 hover:bg-yellow-100 focus:ring-yellow-200"
                default: return "border-gray-200 bg-gray-50 hover:bg-gray-100 focus:ring-gray-200"
            }
        }

        return (
            <div className={`relative p-4 rounded-xl border transition-all duration-200 ${getRiskColor(riskLevel)} ${checked ? 'ring-2 ring-red-200 bg-red-100' : ''}`}>
                <div className="flex items-start space-x-3">
                    <Checkbox
                        checked={checked}
                        onChange={onChange}
                        className="mt-1"
                    />
                    <div className="flex-1">
                        <label className="text-sm font-medium text-gray-900 cursor-pointer">
                            {label}
                        </label>
                        {description && (
                            <p className="text-xs text-gray-600 mt-1">{description}</p>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-red-50 to-pink-50 border border-red-100">
                    <Shield className="w-8 h-8 text-red-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Risk Assessment</h2>
                    <p className="text-gray-600 text-sm font-medium mt-1">Sexual behavior and risk factors</p>
                </div>
            </div>

            {/* Sexual Behavior */}
            <div className="space-y-6">
                <SectionHeader 
                    icon={FiHeart} 
                    title="Sexual Behavior" 
                    subtitle="Past 6 months activity"
                    gradient="from-red-500 to-pink-500"
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FieldWrapper label="Had sex in past 6 months?">
                        <Select value={formData.hadSexPast6Months} onValueChange={(value) => handleInputChange('hadSexPast6Months', value)}>
                            <SelectTrigger className="h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all duration-200 hover:border-gray-300">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl">
                                <SelectItem value="Yes" className="hover:bg-red-50">Yes</SelectItem> 
                                <SelectItem value="No" className="hover:bg-red-50">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                    
                    <FieldWrapper label="Number of sexual partners">
                        <Select value={formData.numberOfSexualPartners} onValueChange={(value) => handleInputChange('numberOfSexualPartners', value)}>
                            <SelectTrigger className="h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all duration-200 hover:border-gray-300">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl">
                                <SelectItem value="0" className="hover:bg-red-50">0</SelectItem>
                                <SelectItem value="1" className="hover:bg-red-50">1</SelectItem>
                                <SelectItem value="2" className="hover:bg-red-50">2</SelectItem>
                                <SelectItem value="3" className="hover:bg-red-50">3</SelectItem>
                                <SelectItem value="4" className="hover:bg-red-50">4</SelectItem>
                                <SelectItem value="5" className="hover:bg-red-50">5</SelectItem>
                                <SelectItem value="6+" className="hover:bg-red-50">6+</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                    
                    <FieldWrapper label="Past 6 months practices" i>
                        <Select value={formData.past6MonthsPractices} onValueChange={(value) => handleInputChange('past6MonthsPractices', value)}>
                            <SelectTrigger className="h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all duration-200 hover:border-gray-300">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl">
                                <SelectItem value="Yes" className="hover:bg-red-50">Yes</SelectItem>
                                <SelectItem value="No" className="hover:bg-red-50">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                </div>
            </div>

            {/* High Risk Behaviors */}
            <div className="space-y-6">
                <SectionHeader 
                    icon={AlertTriangle} 
                    title="High Risk Behaviors" 
                    subtitle="Critical risk factors"
                    gradient="from-orange-500 to-red-500"
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <RiskCheckbox
                        checked={formData.sexWithoutCondom === 'true'}
                        onChange={(e) => handleInputChange('sexWithoutCondom', e.target.checked ? 'true' : 'false')}
                        label="Sex without a condom"
                        description="Unprotected sexual activity"
                        riskLevel="high"
                    />
                    
                    <RiskCheckbox
                        checked={formData.sexWithHIVPartner === 'true'}
                        onChange={(e) => handleInputChange('sexWithHIVPartner', e.target.checked ? 'true' : 'false')}
                        label="Sex with known HIV+ partner(s)"
                        description="Direct exposure to HIV"
                        riskLevel="high"
                    />
                    
                    <RiskCheckbox
                        checked={formData.receiveMoneyForSex === 'true'}
                        onChange={(e) => handleInputChange('receiveMoneyForSex', e.target.checked ? 'true' : 'false')}
                        label="Receive money or goods for sex"
                        description="Sex work activities"
                        riskLevel="high"
                    />
                    
                    <RiskCheckbox
                        checked={formData.injectedDrugSharedNeedle === 'true'}
                        onChange={(e) => handleInputChange('injectedDrugSharedNeedle', e.target.checked ? 'true' : 'false')}
                        label="Injected drug/shared needle"
                        description="Needle sharing risk"
                        riskLevel="high"
                    />
                </div>
            </div>

            {/* Medium Risk Behaviors */}
            <div className="space-y-6">
                <SectionHeader 
                    icon={Activity} 
                    title="Medium Risk Behaviors" 
                    subtitle="Moderate risk factors"
                    gradient="from-yellow-500 to-orange-500"
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <RiskCheckbox
                        checked={formData.paidForSex === 'true'}
                        onChange={(e) => handleInputChange('paidForSex', e.target.checked ? 'true' : 'false')}
                        label="Paid for sex"
                        description="Commercial sex activity"
                        riskLevel="medium"
                    />
                    
                    <RiskCheckbox
                        checked={formData.alcoholDrugBeforeSex === 'true'}
                        onChange={(e) => handleInputChange('alcoholDrugBeforeSex', e.target.checked ? 'true' : 'false')}
                        label="Alcohol/drug before sex"
                        description="Substance use during sex"
                        riskLevel="medium"
                    />
                    
                    <RiskCheckbox
                        checked={formData.groupSexChemsex === 'true'}
                        onChange={(e) => handleInputChange('groupSexChemsex', e.target.checked ? 'true' : 'false')}
                        label="Group sex or chemsex"
                        description="Multiple partners or drug-enhanced sex"
                        riskLevel="medium"
                    />
                </div>
            </div>

            {/* Additional Factors */}
            <div className="space-y-6">
                <SectionHeader 
                    icon={FiShield} 
                    title="Additional Factors" 
                    subtitle="Other relevant factors"
                    gradient="from-blue-500 to-indigo-500"
                 
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <RiskCheckbox
                        checked={formData.abortion === 'true'}
                        onChange={(e) => handleInputChange('abortion', e.target.checked ? 'true' : 'false')}
                        label="Abortion"
                        description="Pregnancy termination"
                        riskLevel="low"
                       
                    />
                    
                    <div className="sm:col-span-2">
                        <FieldWrapper label="Forced to have sex" icon={AlertTriangle}>
                            <Select value={formData.forcedSex} onValueChange={(value) => handleInputChange('forcedSex', value)} >
                                <SelectTrigger className="h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300">
                                    <SelectValue placeholder="Select" className="text-gray-500" />
                                </SelectTrigger>
                                <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl">
                                    <SelectItem value="Yes" className="hover:bg-blue-50">Yes</SelectItem>
                                    <SelectItem value="No" className="hover:bg-blue-50">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </FieldWrapper>
                    </div>
                    
                    <div className="sm:col-span-2">
                        <FieldWrapper label="None of the above" icon={FiShield}>
                            <Select value={formData.noneOfAbove} onValueChange={(value) => handleInputChange('noneOfAbove', value)}>
                                <SelectTrigger className="h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl">
                                    <SelectItem value="Yes" className="hover:bg-blue-50">Yes</SelectItem>
                                    <SelectItem value="No" className="hover:bg-blue-50">No</SelectItem>
                                </SelectContent>
                            </Select>
                        </FieldWrapper>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RiskAssessment
