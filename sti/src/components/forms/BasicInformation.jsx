import React, { useState, useCallback } from 'react'
import { Input } from '../ui/input'
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '../ui/select'
import { FiUser, FiMapPin, FiCalendar, FiChevronDown, FiCheck, FiInfo, FiStar, FiAward, FiShield } from 'react-icons/fi'
import { Shield, Heart, MapPin, Building2 } from 'lucide-react'

// Enhanced FieldWrapper with better visual feedback
const FieldWrapper = ({ children, label, required = false, icon: Icon, className = "", tooltip = "", status = "default" }) => {
    const [showTooltip, setShowTooltip] = useState(false)
    
    const getStatusColors = () => {
        switch (status) {
            case "success": return "border-green-300 focus:border-green-400 focus:ring-green-100"
            case "error": return "border-red-300 focus:border-red-400 focus:ring-red-100"
            case "warning": return "border-yellow-300 focus:border-yellow-400 focus:ring-yellow-100"
            default: return "border-gray-200 focus:border-blue-300 focus:ring-blue-100"
        }
    }

    return (
        <div className={`group relative ${className}`}>
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                        <Icon className="w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
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
                            <FiInfo className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-help transition-colors duration-200" />
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
const SectionHeader = ({ icon: Icon, title, subtitle, gradient = "from-blue-500 to-purple-500", badge = null }) => (
    <div className="flex items-center space-x-4 mb-8">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
            <div className="flex items-center space-x-3">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h3>
                {badge && (
                    <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                        {badge}
                    </span>
                )}
            </div>
            {subtitle && (
                <p className="text-sm text-gray-600 font-medium mt-1">{subtitle}</p>
            )}
        </div>
    </div>
)

// Progress indicator component
const ProgressIndicator = ({ current, total }) => (
    <div className="flex items-center space-x-2 mb-6">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(current / total) * 100}%` }}
            ></div>
        </div>
        <span className="text-sm font-semibold text-gray-600">
            {current} of {total}
        </span>
    </div>
)

const BasicInformation = ({ formData, updateFormData, orgUnits, selectedOrgUnit, setSelectedOrgUnit, formOptions = {}, mode = 'create', isViewMode = false, isEditMode = false }) => {
    const [focusedField, setFocusedField] = useState(null)
    const [hoveredField, setHoveredField] = useState(null)

    const handleInputChange = useCallback((field, value) => {
        updateFormData({ [field]: value })
    }, [updateFormData])

    const calculateAge = useCallback((dateOfBirth) => {
        if (!dateOfBirth) return ''
        const today = new Date()
        const birthDate = new Date(dateOfBirth)
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        return age.toString()
    }, [])

    const handleDateOfBirthChange = useCallback((value) => {
        handleInputChange('dateOfBirth', value)
        const age = calculateAge(value)
        handleInputChange('age', age)
    }, [handleInputChange, calculateAge])

    const calculateDateOfBirth = useCallback((age) => {
        if (!age || isNaN(age)) return ''
        const today = new Date()
        const birthYear = today.getFullYear() - parseInt(age)
        const birthDate = new Date(birthYear, today.getMonth(), today.getDate())
        return birthDate.toISOString().split('T')[0]
    }, [])

    const handleAgeChange = useCallback((value) => {
        handleInputChange('age', value)
        const dateOfBirth = calculateDateOfBirth(value)
        handleInputChange('dateOfBirth', dateOfBirth)
    }, [handleInputChange, calculateDateOfBirth])

    // Calculate completion percentage
    const requiredFields = ['familyName', 'lastName', 'sex', 'dateOfBirth', 'province', 'od', 'district', 'commune', 'sexAtBirth', 'genderIdentity']
    const completedFields = requiredFields.filter(field => formData[field] && formData[field].trim() !== '').length
    const completionPercentage = Math.round((completedFields / requiredFields.length) * 100)

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Enhanced Header with Progress */}
            <div className="text-center space-y-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-100">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                    <FiUser className="w-10 h-10 text-white" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Client Information</h2>
                    <p className="text-gray-600 text-lg font-medium mt-2">Complete the basic demographic details</p>
                </div>
                
                {/* Progress Bar */}
                <div className="max-w-md mx-auto">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">Form Completion</span>
                        <span className="text-sm font-bold text-blue-600">{completionPercentage}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-3">
                        <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${completionPercentage}%` }}
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        {completedFields} of {requiredFields.length} required fields completed
                    </p>
                </div>
            </div>

            {/* Basic Information Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <SectionHeader 
                    icon={FiUser} 
                    title="Personal Information" 
                    subtitle="Core demographic and identification data"
                    gradient="from-blue-500 to-indigo-500"
                    badge="Required"
                />
                
                {/* Row 1: System ID, UUIC, Family Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <FieldWrapper 
                        label="System ID" 
                        icon={FiAward}
                        tooltip="Auto-generated unique identifier for the client"
                        status={formData.systemId ? "success" : "default"}
                    >
                        <Input
                            value={formData.systemId}
                            onChange={(e) => handleInputChange('systemId', e.target.value)}
                            placeholder="Auto-generated"
                            disabled={isViewMode}
                            className={`pl-10 pr-4 h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300 hover:border-gray-300 ${isViewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                            onFocus={() => setFocusedField('systemId')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </FieldWrapper>
                    
                    <FieldWrapper 
                        label="UUIC" 
                        icon={FiUser}
                        tooltip="Unique User Identification Code"
                    >
                        <Input
                            value={formData.uuic}
                            onChange={(e) => handleInputChange('uuic', e.target.value)}
                            placeholder="Enter UUIC code"
                            disabled={isViewMode}
                            className={`pl-10 pr-4 h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300 hover:border-gray-300 ${isViewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                            onFocus={() => setFocusedField('uuic')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </FieldWrapper>
                    
                    <FieldWrapper 
                        label="Family Name" 
                        required 
                        icon={FiUser}
                        tooltip="Client's family name or surname"
                        status={formData.familyName ? "success" : "default"}
                    >
                        <Input
                            value={formData.familyName}
                            onChange={(e) => handleInputChange('familyName', e.target.value)}
                            placeholder="Enter family name"
                            className="pl-10 pr-8 h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300 hover:border-gray-300"
                            onFocus={() => setFocusedField('familyName')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </FieldWrapper>
                </div>

                {/* Row 2: Last Name, Sex, Date of Birth */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <FieldWrapper 
                        label="Last Name" 
                        required 
                        icon={FiUser}
                        tooltip="Client's last name or given name"
                        status={formData.lastName ? "success" : "default"}
                    >
                        <Input
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            placeholder="Enter last name"
                            className="pl-10 pr-8 h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300 hover:border-gray-300"
                            onFocus={() => setFocusedField('lastName')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </FieldWrapper>
                    
                    <FieldWrapper 
                        label="Sex" 
                        required
                        tooltip="Client's biological sex"
                        status={formData.sex ? "success" : "default"}
                    >
                        <Select value={formData.sex} onValueChange={(value) => handleInputChange('sex', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select sex" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="Male" className="hover:bg-blue-50 py-3">Male</SelectItem>
                                <SelectItem value="Female" className="hover:bg-blue-50 py-3">Female</SelectItem>
                                <SelectItem value="Intersex" className="hover:bg-blue-50 py-3">Intersex</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                    
                    <FieldWrapper 
                        label="Date of Birth" 
                        required 
                        icon={FiCalendar}
                        tooltip="Client's date of birth (age will be auto-calculated)"
                        status={formData.dateOfBirth ? "success" : "default"}
                    >
                        <Input
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => handleDateOfBirthChange(e.target.value)}
                            className="pl-10 pr-4 h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300 hover:border-gray-300"
                            onFocus={() => setFocusedField('dateOfBirth')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </FieldWrapper>
                </div>

                {/* Row 3: Age (calculated), Donor, NGO */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FieldWrapper 
                        label="Age" 
                        icon={FiCalendar}
                        tooltip="Auto-calculated age based on date of birth"
                        status={formData.age ? "success" : "default"}
                    >
                        <Input
                            value={formData.age}
                            onChange={(e) => handleAgeChange(e.target.value)}
                            placeholder="Auto-calculated"
                            disabled={isViewMode}
                            className={`pl-10 pr-4 h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300 hover:border-gray-300 ${isViewMode ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                            onFocus={() => setFocusedField('age')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </FieldWrapper>

                    <FieldWrapper 
                        label="Donor" 
                        icon={FiAward}
                        tooltip="Funding organization (e.g., USAID, GFATM, PEPFAR)"
                    >
                        <Input
                            value={formData.donor}
                            onChange={(e) => handleInputChange('donor', e.target.value)}
                            placeholder="Enter donor organization"
                            className="pl-10 pr-4 h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300 hover:border-gray-300"
                            onFocus={() => setFocusedField('donor')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </FieldWrapper>

                    <FieldWrapper 
                        label="NGO" 
                        icon={Building2}
                        tooltip="Non-governmental organization providing services"
                    >
                        <Input
                            value={formData.ngo}
                            onChange={(e) => handleInputChange('ngo', e.target.value)}
                            placeholder="Enter NGO name"
                            className="pl-10 pr-4 h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300 hover:border-gray-300"
                            onFocus={() => setFocusedField('ngo')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </FieldWrapper>
                </div>
            </div>

            {/* Location Information Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <SectionHeader 
                    icon={MapPin} 
                    title="Location Information" 
                    subtitle="Geographic and administrative details"
                    gradient="from-green-500 to-emerald-500"
                    badge="Required"
                />
                
                {/* Row 1: Province, OD */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <FieldWrapper 
                        label="Province" 
                        icon={MapPin}
                        tooltip="Client's province of residence"
                        status={formData.province ? "success" : "default"}
                    >
                        <Input
                            value={formData.province}
                            onChange={(e) => handleInputChange('province', e.target.value)}
                            placeholder="Enter province (e.g., Phnom Penh, Battambang)"
                            className="pl-10 pr-4 h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-green-300 focus:ring-4 focus:ring-green-100 transition-all duration-300 hover:border-gray-300"
                            onFocus={() => setFocusedField('province')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </FieldWrapper>
                    
                    <FieldWrapper 
                        label="OD (Operational District)" 
                        icon={MapPin}
                        tooltip="Operational District for service delivery"
                        status={formData.od ? "success" : "default"}
                    >
                        <Input
                            value={formData.od}
                            onChange={(e) => handleInputChange('od', e.target.value)}
                            placeholder="Enter OD (e.g., OD001, OD002)"
                            className="pl-10 pr-4 h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-green-300 focus:ring-4 focus:ring-green-100 transition-all duration-300 hover:border-gray-300"
                            onFocus={() => setFocusedField('od')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </FieldWrapper>
                </div>

                {/* Row 2: District, Commune */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FieldWrapper 
                        label="District" 
                        icon={MapPin}
                        tooltip="Client's district within the province"
                        status={formData.district ? "success" : "default"}
                    >
                        <Input
                            value={formData.district}
                            onChange={(e) => handleInputChange('district', e.target.value)}
                            placeholder="Enter district (e.g., District 1, District 2)"
                            className="pl-10 pr-4 h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-green-300 focus:ring-4 focus:ring-green-100 transition-all duration-300 hover:border-gray-300"
                            onFocus={() => setFocusedField('district')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </FieldWrapper>
                    
                    <FieldWrapper 
                        label="Commune" 
                        icon={MapPin}
                        tooltip="Client's commune within the district"
                        status={formData.commune ? "success" : "default"}
                    >
                        <Input
                            value={formData.commune}
                            onChange={(e) => handleInputChange('commune', e.target.value)}
                            placeholder="Enter commune (e.g., Commune A, Commune B)"
                            className="pl-10 pr-4 h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-green-300 focus:ring-4 focus:ring-green-100 transition-all duration-300 hover:border-gray-300"
                            onFocus={() => setFocusedField('commune')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </FieldWrapper>
                </div>
            </div>

            {/* Identity Information Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <SectionHeader 
                    icon={Heart} 
                    title="Identity Information" 
                    subtitle="Gender identity and birth information"
                    gradient="from-purple-500 to-pink-500"
                    badge="Required"
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FieldWrapper 
                        label="Sex at Birth" 
                        required
                        tooltip="Biological sex assigned at birth"
                        status={formData.sexAtBirth ? "success" : "default"}
                    >
                        <Select value={formData.sexAtBirth} onValueChange={(value) => handleInputChange('sexAtBirth', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-purple-300 focus:ring-4 focus:ring-purple-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select sex at birth" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="Male" className="hover:bg-purple-50 py-3">Male</SelectItem>
                                <SelectItem value="Female" className="hover:bg-purple-50 py-3">Female</SelectItem>
                                <SelectItem value="Intersex" className="hover:bg-purple-50 py-3">Intersex</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>

                    <FieldWrapper 
                        label="Gender Identity" 
                        required
                        tooltip="How the client identifies their gender"
                        status={formData.genderIdentity ? "success" : "default"}
                    >
                        <Select value={formData.genderIdentity} onValueChange={(value) => handleInputChange('genderIdentity', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-purple-300 focus:ring-4 focus:ring-purple-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select gender identity" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="Male" className="hover:bg-purple-50 py-3">Male</SelectItem>
                                <SelectItem value="Female" className="hover:bg-purple-50 py-3">Female</SelectItem>
                                <SelectItem value="Transgender Woman" className="hover:bg-purple-50 py-3">Transgender Woman</SelectItem>
                                <SelectItem value="Transgender Man" className="hover:bg-purple-50 py-3">Transgender Man</SelectItem>
                                <SelectItem value="Non-binary" className="hover:bg-purple-50 py-3">Non-binary</SelectItem>
                                <SelectItem value="Other" className="hover:bg-purple-50 py-3">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                </div>
            </div>

            {/* Organization Unit Selection */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <SectionHeader 
                    icon={Building2} 
                    title="Organization Unit" 
                    subtitle="Required for DHIS2 integration"
                    gradient="from-red-500 to-orange-500"
                    badge="Required"
                />
                
                <div className="max-w-md">
                    <FieldWrapper 
                        label="Select Organization Unit" 
                        required
                        tooltip="The organization unit where this client will be registered in DHIS2"
                        status={selectedOrgUnit ? "success" : "default"}
                    >
                        <Select value={selectedOrgUnit} onValueChange={(value) => setSelectedOrgUnit(value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-red-300 focus:ring-4 focus:ring-red-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select organization unit" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl max-h-60">
                                {orgUnits.map(ou => (
                                    <SelectItem key={ou.id} value={ou.id} className="hover:bg-red-50 py-3">
                                        {ou.displayName || ou.id}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                    <div className="mt-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="flex items-start space-x-3">
                            <FiInfo className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-blue-800 mb-1">DHIS2 Integration Required</p>
                                <p className="text-xs text-blue-700">
                                    This organization unit is required to save the risk screening data to DHIS2. 
                                    Please select the appropriate facility or organization unit.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Completion Summary */}
            {completionPercentage === 100 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                            <FiCheck className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-green-800">All Required Fields Completed!</h4>
                            <p className="text-green-700">You can now proceed to the next step.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BasicInformation
