import React, { useState, useCallback } from 'react'
import { FiShield, FiActivity } from 'react-icons/fi'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import FieldWrapper from './FieldWrapper'
import SectionHeader from './SectionHeader'

const RiskAssessment = ({ 
    formData, 
    updateFormData, 
    formOptions = {}, 
    hideHeaders = false, 
    kmLabels = {} 
}) => {
    const [focusedField, setFocusedField] = useState(null)

    const handleInputChange = useCallback((field, value) => {
        updateFormData({ [field]: value })
    }, [updateFormData])

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {!hideHeaders && (
                <div className="text-center space-y-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl p-8 border border-red-100">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-red-500 to-pink-600 shadow-lg">
                        <FiShield className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">ធ្លាប់ព្រួយបារម្ភសុខភាព</h2>
                        <p className="text-gray-600 text-lg font-medium mt-2">Concern health - Question 3</p>
                    </div>
                </div>
            )}

            {/* Question 3: Sexual Health Concerns */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                {!hideHeaders && (
                    <SectionHeader
                        icon={FiActivity}
                        title="ធ្លាប់ព្រួយបារម្ភសុខភាព"
                        subtitle="Concern health"
                        gradient="from-red-500 to-pink-500"
                        badge="Required"
                    />
                )}
                
                <div className="grid grid-cols-1 gap-6">
                    <FieldWrapper
                        label={kmLabels.sexualHealthConcerns || "តើធ្លាប់មានការព្រួយបារម្ភអំពីសុខភាពផ្លូវភេទដែរឬទេ? / Have you ever been concerned about your sexual health?"}
                        tooltip="Concerned about sexually transmitted infections (STIs), HIV, or other sexual health issues"
                        status={formData.sexualHealthConcerns ? "success" : "default"}
                    >
                        <Select value={formData.sexualHealthConcerns} onValueChange={(value) => handleInputChange('sexualHealthConcerns', value)}>
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
        </div>
    )
}

export default RiskAssessment
