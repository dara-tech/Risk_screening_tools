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
import { FiActivity, FiDroplet, FiHeart, FiCalendar, FiAlertCircle, FiShield, FiTrendingUp } from 'react-icons/fi'
import { Activity, Droplets, Heart, Calendar, AlertTriangle, Shield, TrendingUp } from 'lucide-react'

const ClinicalData = ({ formData, updateFormData, formOptions = {} }) => {
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
                        <Icon className="w-4 h-4 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" />
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

    const SectionHeader = ({ icon: Icon, title, subtitle, gradient = "from-green-500 to-emerald-500" }) => (
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

    const ClinicalCheckbox = ({ checked, onChange, label, description, severity = "normal" }) => {
        const getSeverityColor = (level) => {
            switch (level) {
                case "critical": return "border-red-200 bg-red-50 hover:bg-red-100 focus:ring-red-200"
                case "warning": return "border-orange-200 bg-orange-50 hover:bg-orange-100 focus:ring-orange-200"
                case "info": return "border-blue-200 bg-blue-50 hover:bg-blue-100 focus:ring-blue-200"
                default: return "border-gray-200 bg-gray-50 hover:bg-gray-100 focus:ring-gray-200"
            }
        }

        return (
            <div className={`relative p-4 rounded-xl border transition-all duration-200 ${getSeverityColor(severity)} ${checked ? 'ring-2 ring-green-200 bg-green-100' : ''}`}>
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
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                    <Activity className="w-8 h-8 text-green-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Clinical Data</h2>
                    <p className="text-gray-600 text-sm font-medium mt-1">Medical information and test results</p>
                </div>
            </div>

            {/* HIV Status and Testing */}
            <div className="space-y-6">
                <SectionHeader 
                    icon={Droplets} 
                    title="HIV Status & Testing" 
                    subtitle="Testing history and results"
                    gradient="from-red-500 to-pink-500"
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FieldWrapper label="HIV Test (Past 6 Months)">
                        <Select value={formData.hivTestPast6Months} onValueChange={(value) => handleInputChange('hivTestPast6Months', value)}>
                            <SelectTrigger className="h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all duration-200 hover:border-gray-300">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl">
                                <SelectItem value="Yes" className="hover:bg-red-50">Yes</SelectItem>
                                <SelectItem value="No" className="hover:bg-red-50">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                    
                    <FieldWrapper label="HIV Test Result" >
                        <Select value={formData.hivTestResult} onValueChange={(value) => handleInputChange('hivTestResult', value)}>
                            <SelectTrigger className="h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all duration-200 hover:border-gray-300">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl">
                                <SelectItem value="Positive" className="hover:bg-red-50">Positive</SelectItem>
                                <SelectItem value="Negative" className="hover:bg-red-50">Negative</SelectItem>
                                <SelectItem value="Unknown" className="hover:bg-red-50">Unknown</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                    
                    <FieldWrapper label="Last HIV Test Date" icon={FiCalendar}>
                        <Input
                            type="date"
                            value={formData.lastHivTestDate}
                            onChange={(e) => handleInputChange('lastHivTestDate', e.target.value)}
                            className="pl-10 pr-4 h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all duration-200 hover:border-gray-300"
                            onFocus={() => setFocusedField('lastHivTestDate')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </FieldWrapper>
                </div>
            </div>

            {/* STI Symptoms and Conditions */}
            <div className="space-y-6">
                <SectionHeader 
                    icon={AlertTriangle} 
                    title="STI Symptoms & Conditions" 
                    subtitle="Current symptoms and diagnoses"
                    gradient="from-orange-500 to-red-500"
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ClinicalCheckbox
                        checked={formData.stiSymptoms === 'true'}
                        onChange={(e) => handleInputChange('stiSymptoms', e.target.checked ? 'true' : 'false')}
                        label="STI Symptoms"
                        description="Current symptoms present"
                        severity="warning"
                    />
                    
                    <ClinicalCheckbox
                        checked={formData.syphilisPositive === 'true'}
                        onChange={(e) => handleInputChange('syphilisPositive', e.target.checked ? 'true' : 'false')}
                        label="Tested syphilis positive"
                        description="Confirmed syphilis diagnosis"
                        severity="critical"
                    />
                </div>
            </div>

            {/* Risk Assessment */}
            <div className="space-y-6">
                <SectionHeader 
                    icon={TrendingUp} 
                    title="Risk Assessment" 
                    subtitle="Screening results and scoring"
                    gradient="from-blue-500 to-indigo-500"
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FieldWrapper label="Risk Screening Result" icon={FiTrendingUp}>
                        <Select value={formData.riskScreeningResult} onValueChange={(value) => handleInputChange('riskScreeningResult', value)}>
                            <SelectTrigger className="h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl">
                                <SelectItem value="High Risk" className="hover:bg-blue-50">High Risk</SelectItem>
                                <SelectItem value="Medium Risk" className="hover:bg-blue-50">Medium Risk</SelectItem>
                                <SelectItem value="Low Risk" className="hover:bg-blue-50">Low Risk</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                    
                    <FieldWrapper label="Risk Screening Score" icon={FiTrendingUp}>
                        <Input
                            type="number"
                            value={formData.riskScreeningScore}
                            onChange={(e) => handleInputChange('riskScreeningScore', e.target.value)}
                            placeholder="Enter score"
                            className="pl-10 pr-4 h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300"
                            onFocus={() => setFocusedField('riskScreeningScore')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </FieldWrapper>
                </div>
            </div>

            {/* PrEP Status */}
            <div className="space-y-6">
                <SectionHeader 
                    icon={Shield} 
                    title="PrEP Status" 
                    subtitle="Pre-exposure prophylaxis information"
                    gradient="from-purple-500 to-pink-500"
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ClinicalCheckbox
                        checked={formData.everOnPrep === 'true'}
                        onChange={(e) => handleInputChange('everOnPrep', e.target.checked ? 'true' : 'false')}
                        label="Ever on PrEP"
                        description="Previous PrEP use"
                        severity="info"
                    />
                    
                    <ClinicalCheckbox
                        checked={formData.currentlyOnPrep === 'true'}
                        onChange={(e) => handleInputChange('currentlyOnPrep', e.target.checked ? 'true' : 'false')}
                        label="Currently on PrEP"
                        description="Active PrEP medication"
                        severity="info"
                    />
                </div>
            </div>

            {/* Health Concerns */}
            <div className="space-y-6">
                <SectionHeader 
                    icon={Heart} 
                    title="Health Concerns" 
                    subtitle="Patient-reported concerns"
                    gradient="from-green-500 to-teal-500"
                />
                
                <div className="max-w-md">
                    <ClinicalCheckbox
                        checked={formData.sexualHealthConcerns === 'true'}
                        onChange={(e) => handleInputChange('sexualHealthConcerns', e.target.checked ? 'true' : 'false')}
                        label="Sexual health concerns"
                        description="Patient has concerns about sexual health"
                        severity="normal"
                    />
                </div>
            </div>
        </div>
    )
}

export default ClinicalData
