import React, { useState, useCallback } from 'react'
import { Input } from '../ui/input'
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '../ui/select'
import { FiUser, FiMapPin, FiCalendar, FiChevronDown, FiCheck } from 'react-icons/fi'
import { Shield } from 'lucide-react'

// Move FieldWrapper outside component to prevent recreation
const FieldWrapper = ({ children, label, required = false, icon: Icon, className = "" }) => (
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

// Move SectionHeader outside component to prevent recreation
const SectionHeader = ({ icon: Icon, title, subtitle, gradient = "from-blue-500 to-purple-500" }) => (
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

const BasicInformation = ({ formData, updateFormData, orgUnits, selectedOrgUnit, setSelectedOrgUnit, formOptions = {} }) => {
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



    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
                    <FiUser className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Basic Information</h2>
                    <p className="text-gray-600 text-sm font-medium mt-1">Client demographic details</p>
                </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-6">
                <SectionHeader 
                    icon={FiUser} 
                    title="Personal Information" 
                    subtitle="Core demographic data"
                    gradient="from-blue-500 to-indigo-500"
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FieldWrapper label="System ID" icon={FiUser}>
                        <Input
                            value={formData.systemId}
                            onChange={(e) => handleInputChange('systemId', e.target.value)}
                            placeholder="Auto-generated"
                            className="pl-10 pr-4 h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300"
                            onFocus={() => setFocusedField('systemId')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </FieldWrapper>
                    
                    <FieldWrapper label="UUIC" icon={FiUser}>
                        <Input
                            value={formData.uuic}
                            onChange={(e) => handleInputChange('uuic', e.target.value)}
                            placeholder="Enter UUIC"
                            className="pl-10 pr-4 h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300"
                            onFocus={() => setFocusedField('uuic')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </FieldWrapper>
                    
                    <FieldWrapper label="Family Name" required icon={FiUser}>
                        <Input
                            value={formData.familyName}
                            onChange={(e) => handleInputChange('familyName', e.target.value)}
                            placeholder="Enter family name"
                            className="pl-10 pr-8 h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300"
                            onFocus={() => setFocusedField('familyName')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </FieldWrapper>
                    
                    <FieldWrapper label="Last Name" required icon={FiUser}>
                        <Input
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            placeholder="Enter last name"
                            className="pl-10 pr-8 h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300"
                            onFocus={() => setFocusedField('lastName')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </FieldWrapper>
                    
                    <FieldWrapper label="Sex" required>
                        <Select value={formData.sex} onValueChange={(value) => handleInputChange('sex', value)}>
                            <SelectTrigger className="h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300">
                                <SelectValue placeholder="Select sex" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl">
                                <SelectItem value="Male" className="hover:bg-blue-50">Male</SelectItem>
                                <SelectItem value="Female" className="hover:bg-blue-50">Female</SelectItem>
                                <SelectItem value="Intersex" className="hover:bg-blue-50">Intersex</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                    
                    <FieldWrapper label="Date of Birth" required icon={FiCalendar}>
                        <Input
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => handleDateOfBirthChange(e.target.value)}
                            className="pl-10 pr-4 h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200 hover:border-gray-300"
                            onFocus={() => setFocusedField('dateOfBirth')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </FieldWrapper>
                </div>
            </div>

            {/* Location Information */}
            <div className="space-y-6">
                <SectionHeader 
                    icon={FiMapPin} 
                    title="Location Information" 
                    subtitle="Geographic details"
                    gradient="from-green-500 to-emerald-500"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FieldWrapper label="Province" icon={FiMapPin}>
                        <Input
                            value={formData.province}
                            onChange={(e) => handleInputChange('province', e.target.value)}
                            placeholder="Enter province"
                            className="pl-10 pr-4 h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-green-300 focus:ring-2 focus:ring-green-100 transition-all duration-200 hover:border-gray-300"
                            onFocus={() => setFocusedField('province')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </FieldWrapper>
                    
                    <FieldWrapper label="OD" icon={FiMapPin}>
                        <Input
                            value={formData.od}
                            onChange={(e) => handleInputChange('od', e.target.value)}
                            placeholder="Enter OD"
                            className="pl-10 pr-4 h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-green-300 focus:ring-2 focus:ring-green-100 transition-all duration-200 hover:border-gray-300"
                            onFocus={() => setFocusedField('od')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </FieldWrapper>
                    
                    <FieldWrapper label="District" icon={FiMapPin}>
                        <Input
                            value={formData.district}
                            onChange={(e) => handleInputChange('district', e.target.value)}
                            placeholder="Enter district"
                            className="pl-10 pr-4 h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-green-300 focus:ring-2 focus:ring-green-100 transition-all duration-200 hover:border-gray-300"
                            onFocus={() => setFocusedField('district')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </FieldWrapper>
                    
                    <FieldWrapper label="Commune" icon={FiMapPin}>
                        <Input
                            value={formData.commune}
                            onChange={(e) => handleInputChange('commune', e.target.value)}
                            placeholder="Enter commune"
                            className="pl-10 pr-4 h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-green-300 focus:ring-2 focus:ring-green-100 transition-all duration-200 hover:border-gray-300"
                            onFocus={() => setFocusedField('commune')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </FieldWrapper>
                </div>
            </div>

            {/* Risk Assessment Information */}
            <div className="space-y-6">
                <SectionHeader 
                    icon={Shield} 
                    title="Risk Assessment Information" 
                    subtitle="Identity and partner details"
                    gradient="from-purple-500 to-pink-500"
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FieldWrapper label="Gender Identity" required>
                        <Select value={formData.genderIdentity} onValueChange={(value) => handleInputChange('genderIdentity', value)}>
                            <SelectTrigger className="h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all duration-200 hover:border-gray-300">
                                <SelectValue placeholder="Select gender identity" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl">
                                <SelectItem value="Male" className="hover:bg-purple-50">Male</SelectItem>
                                <SelectItem value="Female" className="hover:bg-purple-50">Female</SelectItem>
                                <SelectItem value="Transgender Woman" className="hover:bg-purple-50">Transgender Woman</SelectItem>
                                <SelectItem value="Transgender Man" className="hover:bg-purple-50">Transgender Man</SelectItem>
                                <SelectItem value="Non-binary" className="hover:bg-purple-50">Non-binary</SelectItem>
                                <SelectItem value="Other" className="hover:bg-purple-50">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                    
                    <FieldWrapper label="Sexual Health Concerns">
                        <Select value={formData.sexualHealthConcerns} onValueChange={(value) => handleInputChange('sexualHealthConcerns', value)}>
                            <SelectTrigger className="h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all duration-200 hover:border-gray-300">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl">
                                <SelectItem value="Yes" className="hover:bg-purple-50">Yes</SelectItem>
                                <SelectItem value="No" className="hover:bg-purple-50">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                    
                    <FieldWrapper label="Partner - Male">
                        <Select value={formData.partnerMale} onValueChange={(value) => handleInputChange('partnerMale', value)}>
                            <SelectTrigger className="h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all duration-200 hover:border-gray-300">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl">
                                <SelectItem value="Yes" className="hover:bg-purple-50">Yes</SelectItem>
                                <SelectItem value="No" className="hover:bg-purple-50">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                    
                    <FieldWrapper label="Partner - Female">
                        <Select value={formData.partnerFemale} onValueChange={(value) => handleInputChange('partnerFemale', value)}>
                            <SelectTrigger className="h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all duration-200 hover:border-gray-300">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl">
                                <SelectItem value="Yes" className="hover:bg-purple-50">Yes</SelectItem>
                                <SelectItem value="No" className="hover:bg-purple-50">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                    
                    <FieldWrapper label="Partner - TGW">
                        <Select value={formData.partnerTGW} onValueChange={(value) => handleInputChange('partnerTGW', value)}>
                            <SelectTrigger className="h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all duration-200 hover:border-gray-300">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl">
                                <SelectItem value="Yes" className="hover:bg-purple-50">Yes</SelectItem>
                                <SelectItem value="No" className="hover:bg-purple-50">No</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                </div>
            </div>

            {/* Organization Unit Selection */}
            <div className="space-y-6">
                <SectionHeader 
                    icon={FiMapPin} 
                    title="Organization Unit" 
                    subtitle="Required for DHIS2 integration"
                    gradient="from-red-500 to-orange-500"
                />
                
                <div className="max-w-md">
                    <FieldWrapper label="Select Organization Unit" required>
                        <Select value={selectedOrgUnit} onValueChange={(value) => setSelectedOrgUnit(value)}>
                            <SelectTrigger className="h-12 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all duration-200 hover:border-gray-300">
                                <SelectValue placeholder="Select organization unit" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl max-h-60">
                                {orgUnits.map(ou => (
                                    <SelectItem key={ou.id} value={ou.id} className="hover:bg-red-50">
                                        {ou.displayName || ou.id}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                    <p className="text-xs text-gray-500 mt-2 font-medium">
                        This is required to save the risk screening to DHIS2
                    </p>
                </div>
            </div>
        </div>
    )
}

export default BasicInformation
