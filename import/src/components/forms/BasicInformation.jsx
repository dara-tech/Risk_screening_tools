import React, { useState, useCallback, useEffect } from 'react'
import { FiUser, FiCalendar, FiMapPin, FiHome } from 'react-icons/fi'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Input } from '../ui/input'
import FieldWrapper from './FieldWrapper'
import SectionHeader from './SectionHeader'

const BasicInformation = ({ 
    formData, 
    updateFormData, 
    orgUnits = [], 
    selectedOrgUnit, 
    setSelectedOrgUnit, 
    formOptions = {}, 
    hideHeaders = false, 
    kmLabels = {} 
}) => {
    const [focusedField, setFocusedField] = useState(null)

    const handleInputChange = useCallback((field, value) => {
        updateFormData({ [field]: value })
    }, [updateFormData])

    const handleOrgUnitChange = useCallback((orgUnitId) => {
        setSelectedOrgUnit(orgUnitId)
        updateFormData({ orgUnit: orgUnitId })
    }, [setSelectedOrgUnit, updateFormData])

    // Calculate age from date of birth
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

    // Calculate date of birth from age
    const calculateDateOfBirth = useCallback((age) => {
        if (!age || isNaN(age) || age < 0 || age > 120) return ''
        const today = new Date()
        const birthYear = today.getFullYear() - parseInt(age)
        // Use current month and day as approximation
        const birthDate = new Date(birthYear, today.getMonth(), today.getDate())
        return birthDate.toISOString().split('T')[0]
    }, [])

    const handleDateOfBirthChange = useCallback((dateOfBirth) => {
        console.log('Date of birth changed:', dateOfBirth)
        const age = calculateAge(dateOfBirth)
        console.log('Calculated age:', age)
        updateFormData({ 
            dateOfBirth: dateOfBirth,
            age: age
        })
    }, [calculateAge, updateFormData])

    const handleAgeChange = useCallback((age) => {
        console.log('Age changed:', age)
        const dateOfBirth = calculateDateOfBirth(age)
        console.log('Calculated date of birth:', dateOfBirth)
        updateFormData({ 
            age: age,
            dateOfBirth: dateOfBirth
        })
    }, [calculateDateOfBirth, updateFormData])

    // Auto-generate UUIC in real-time when required fields change
    const autoGenerateUUIC = useCallback(() => {
        const { familyName, lastName, sex, dateOfBirth } = formData
        console.log('Auto-generating UUIC with:', { familyName, lastName, sex, dateOfBirth })

        if (familyName && lastName && sex && dateOfBirth) {
            try {
                // For Khmer names: familyName = first name, lastName = last name
                // Extract first 2 consonant characters from last name (remove vowels)
                const lastNamePart = extractConsonants(lastName, 2)
                
                // Extract first 2 consonant characters from first name (remove vowels)
                const firstNamePart = extractConsonants(familyName, 2)
                
                // Sex: 1 for Male, 2 for Female
                const sexPart = sex === 'Male' ? '1' : sex === 'Female' ? '2' : ''
                
                // Parse date of birth
                const date = new Date(dateOfBirth)
                const day = date.getDate().toString().padStart(2, '0')
                const month = (date.getMonth() + 1).toString().padStart(2, '0')
                const year = date.getFullYear().toString().slice(-2) // Last 2 digits
                
                // Combine all parts: [Last Name] [First Name] [Sex] [Day] [Month] [Year]
                const calculatedUUIC = `${lastNamePart}${firstNamePart}${sexPart}${day}${month}${year}`
                console.log('UUIC Components:', {
                    lastNamePart,
                    firstNamePart,
                    sexPart,
                    day,
                    month,
                    year,
                    calculatedUUIC
                })
                updateFormData({ uuic: calculatedUUIC })
            } catch (error) {
                console.error('Error auto-generating UUIC:', error)
            }
        } else {
            console.log('Missing required fields for UUIC generation')
        }
    }, [formData, updateFormData])

    // Helper function to extract consonants from Khmer names
    const extractConsonants = useCallback((name, count) => {
        if (!name) return ''
        
        // Khmer consonant characters (basic set)
        const khmerConsonants = [
            'ក', 'ខ', 'គ', 'ឃ', 'ង', 'ច', 'ឆ', 'ជ', 'ឈ', 'ញ',
            'ដ', 'ឋ', 'ឌ', 'ឍ', 'ណ', 'ត', 'ថ', 'ទ', 'ធ', 'ន',
            'ប', 'ផ', 'ព', 'ភ', 'ម', 'យ', 'រ', 'ល', 'វ', 'ស',
            'ហ', 'ឡ', 'អ', 'ឣ', 'ឤ', 'ឥ', 'ឦ', 'ឧ', 'ឨ', 'ឩ',
            'ឪ', 'ឫ', 'ឬ', 'ឭ', 'ឮ', 'ឯ', 'ឰ', 'ឱ', 'ឲ', 'ឳ'
        ]
        
        let consonants = ''
        let consonantCount = 0
        
        for (let i = 0; i < name.length && consonantCount < count; i++) {
            const char = name[i]
            if (khmerConsonants.includes(char)) {
                consonants += char
                consonantCount++
            }
        }
        
        // If not enough Khmer consonants, fall back to first characters
        if (consonantCount < count) {
            consonants = name.substring(0, count)
        }
        
        console.log(`Extracted consonants from "${name}": "${consonants}"`)
        return consonants
    }, [])

    // Auto-generate UUIC when required fields change
    useEffect(() => {
        autoGenerateUUIC()
    }, [formData.familyName, formData.lastName, formData.sex, formData.dateOfBirth, autoGenerateUUIC])



    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {!hideHeaders && (
                <div className="text-center space-y-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-100">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                        <FiUser className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">ព័ត៌មានមូលដ្ឋាន</h2>
                        <p className="text-gray-600 text-lg font-medium mt-2">Basic Information</p>
                    </div>
                </div>
            )}

            {/* Personal Information */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                {!hideHeaders && (
                    <SectionHeader
                        icon={FiUser}
                        title="ព័ត៌មានផ្ទាល់ខ្លួន"
                        subtitle="Personal Information"
                        gradient="from-blue-500 to-purple-500"
                        badge="Required"
                    />
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FieldWrapper
                        label={kmLabels.lastName || "នាមត្រកូល / Last Name"}
                        tooltip="Client's last name"
                        status={formData.lastName ? "success" : "default"}
                    >
                        <Input
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            placeholder="Enter last name"
                            className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300 hover:border-gray-300"
                            onFocus={() => setFocusedField('lastName')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </FieldWrapper>
                    <FieldWrapper
                        label={kmLabels.familyName || "ឈ្មោះ / Family Name"}
                        tooltip="Client's family name"
                        status={formData.familyName ? "success" : "default"}
                    >
                        <Input
                            value={formData.familyName}
                            onChange={(e) => handleInputChange('familyName', e.target.value)}
                            placeholder="Enter family name"
                            className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300 hover:border-gray-300"
                            onFocus={() => setFocusedField('familyName')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </FieldWrapper>

                    <FieldWrapper
                        label={kmLabels.sex || "ភេទ / Sex"}
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
                                <SelectItem value="Other" className="hover:bg-blue-50 py-3">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>

                    <FieldWrapper
                        label={kmLabels.dateOfBirth || "ថ្ងៃខែឆ្នាំកំណើត / Date of Birth"}
                        tooltip="Client's date of birth"
                        status={formData.dateOfBirth ? "success" : "default"}
                    >
                        <Input
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) => handleDateOfBirthChange(e.target.value)}
                            className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300 hover:border-gray-300"
                            onFocus={() => setFocusedField('dateOfBirth')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </FieldWrapper>

                    <FieldWrapper
                        label={kmLabels.age || "អាយុ / Age"}
                        tooltip="Client's age (can be manually entered or auto-calculated from date of birth)"
                        status={formData.age ? "success" : "default"}
                    >
                        <Input
                            value={formData.age}
                            onChange={(e) => handleAgeChange(e.target.value)}
                            placeholder="Enter age to auto-calculate date of birth"
                            className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300 hover:border-gray-300"
                            onFocus={() => setFocusedField('age')}
                            onBlur={() => setFocusedField(null)}
                        />
                    </FieldWrapper>

                    <FieldWrapper
                        label={kmLabels.uuic || "លេខកូដអតិថិជន / UUIC"}
                        tooltip="Auto-generated from Family Name, Last Name, Sex, and Date of Birth"
                        status={formData.uuic ? "success" : "default"}
                    >
                        <Input
                            value={formData.uuic}
                            onChange={(e) => handleInputChange('uuic', e.target.value)}
                            placeholder="Auto-generated when all required fields are filled"
                            className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300 hover:border-gray-300 font-mono"
                            onFocus={() => setFocusedField('uuic')}
                            onBlur={() => setFocusedField(null)}
                        />
                        {(!formData.familyName || !formData.lastName || !formData.sex || !formData.dateOfBirth) && (
                            <p className="text-xs text-gray-500 mt-1">
                                Fill in Family Name, Last Name, Sex, and Date of Birth to auto-generate UUIC
                            </p>
                        )}
                    </FieldWrapper>

           
                </div>
            </div>

            {/* Location Information */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                {!hideHeaders && (
                    <SectionHeader
                        icon={FiHome}
                        title="ទីតាំង"
                        subtitle="Location Information"
                        gradient="from-green-500 to-emerald-500"
                        badge="Required"
                    />
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FieldWrapper
                        label={kmLabels.province || "ខេត្ត / Province"}
                        tooltip="Client's province"
                        status={formData.province ? "success" : "default"}
                    >
                        <Select value={formData.province} onValueChange={(value) => handleInputChange('province', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-green-300 focus:ring-4 focus:ring-green-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select province" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                {formOptions.provinces?.map((province) => (
                                    <SelectItem key={province} value={province} className="hover:bg-green-50 py-3">
                                        {province}
                                    </SelectItem>
                                )) || (
                                    <>
                                        <SelectItem value="Phnom Penh" className="hover:bg-green-50 py-3">Phnom Penh</SelectItem>
                                        <SelectItem value="Battambang" className="hover:bg-green-50 py-3">Battambang</SelectItem>
                                        <SelectItem value="Siem Reap" className="hover:bg-green-50 py-3">Siem Reap</SelectItem>
                                    </>
                                )}
                            </SelectContent>
                        </Select>
                    </FieldWrapper>

                    <FieldWrapper
                        label={kmLabels.district || "ស្រុក / District"}
                        tooltip="Client's district"
                        status={formData.district ? "success" : "default"}
                    >
                        <Select value={formData.district} onValueChange={(value) => handleInputChange('district', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-green-300 focus:ring-4 focus:ring-green-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select district" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                {formOptions.districts?.map((district) => (
                                    <SelectItem key={district} value={district} className="hover:bg-green-50 py-3">
                                        {district}
                                    </SelectItem>
                                )) || (
                                    <>
                                        <SelectItem value="District 1" className="hover:bg-green-50 py-3">District 1</SelectItem>
                                        <SelectItem value="District 2" className="hover:bg-green-50 py-3">District 2</SelectItem>
                                        <SelectItem value="District 3" className="hover:bg-green-50 py-3">District 3</SelectItem>
                                    </>
                                )}
                            </SelectContent>
                        </Select>
                    </FieldWrapper>

                    <FieldWrapper
                        label={kmLabels.commune || "ឃុំ / Commune"}
                        tooltip="Client's commune"
                        status={formData.commune ? "success" : "default"}
                    >
                        <Select value={formData.commune} onValueChange={(value) => handleInputChange('commune', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-green-300 focus:ring-4 focus:ring-green-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select commune" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                {formOptions.communes?.map((commune) => (
                                    <SelectItem key={commune} value={commune} className="hover:bg-green-50 py-3">
                                        {commune}
                                    </SelectItem>
                                )) || (
                                    <>
                                        <SelectItem value="Commune 1" className="hover:bg-green-50 py-3">Commune 1</SelectItem>
                                        <SelectItem value="Commune 2" className="hover:bg-green-50 py-3">Commune 2</SelectItem>
                                        <SelectItem value="Commune 3" className="hover:bg-green-50 py-3">Commune 3</SelectItem>
                                    </>
                                )}
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                </div>
            </div>

            {/* Organization Unit */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                {!hideHeaders && (
                    <SectionHeader
                        icon={FiMapPin}
                        title="ស្ថាប័នព្យាបាល"
                        subtitle="Organization Unit"
                        gradient="from-orange-500 to-red-500"
                        badge="Required"
                    />
                )}
                
                <div className="grid grid-cols-1 gap-6">
                    <FieldWrapper
                        label={kmLabels.orgUnit || "ស្ថាប័នព្យាបាល / Organization Unit"}
                        tooltip="Select the organization unit where the client is being served"
                        status={selectedOrgUnit ? "success" : "default"}
                    >
                        <Select value={selectedOrgUnit} onValueChange={handleOrgUnitChange}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-orange-300 focus:ring-4 focus:ring-orange-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select organization unit" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                {orgUnits.map((orgUnit) => (
                                    <SelectItem key={orgUnit.id} value={orgUnit.id} className="hover:bg-orange-50 py-3">
                                        {orgUnit.displayName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                    <FieldWrapper
                        label={kmLabels.sexAtBirth || "១. តើភេទពីកំណើតជាអ្វី? / 1. What is your sex at birth?"}
                        tooltip="Biological sex assigned at birth"
                        status={formData.sexAtBirth ? "success" : "default"}
                    >
                        <Select value={formData.sexAtBirth} onValueChange={(value) => handleInputChange('sexAtBirth', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select sex at birth" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="Male" className="hover:bg-blue-50 py-3">Male</SelectItem>
                                <SelectItem value="Female" className="hover:bg-blue-50 py-3">Female</SelectItem>
                                <SelectItem value="Intersex" className="hover:bg-blue-50 py-3">Intersex</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>

                    <FieldWrapper
                        label={kmLabels.genderIdentity || "២.តើអ្នកកំណត់អត្តសញ្ញាណភេទជាអ្វី? / 2. How do you identify your gender?"}
                        tooltip="How the person identifies their gender"
                        status={formData.genderIdentity ? "success" : "default"}
                    >
                        <Select value={formData.genderIdentity} onValueChange={(value) => handleInputChange('genderIdentity', value)}>
                            <SelectTrigger className="h-14 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl focus:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-300 hover:border-gray-300">
                                <SelectValue placeholder="Select gender identity" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl">
                                <SelectItem value="Male" className="hover:bg-blue-50 py-3">Male</SelectItem>
                                <SelectItem value="Female" className="hover:bg-blue-50 py-3">Female</SelectItem>
                                <SelectItem value="Transgender" className="hover:bg-blue-50 py-3">Transgender</SelectItem>
                                <SelectItem value="Non-binary" className="hover:bg-blue-50 py-3">Non-binary</SelectItem>
                                <SelectItem value="Other" className="hover:bg-blue-50 py-3">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </FieldWrapper>
                </div>
            </div>
        </div>
    )
}

export default BasicInformation
