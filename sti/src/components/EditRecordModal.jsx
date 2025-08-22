import React, { useState, useEffect } from 'react'
import { Modal } from './ui/modal'
import { Button } from './ui/button'
import { useToast } from './ui/ui/toast'
import { useDataEngine } from '@dhis2/app-runtime'
import { FiSave, FiX, FiUser, FiActivity, FiFileText } from 'react-icons/fi'
import { Calculator } from 'lucide-react'
import BasicInformation from './forms/BasicInformation'
import ClinicalData from './forms/ClinicalData'
import RiskAssessment from './forms/RiskAssessment'
import RiskCalculation from './forms/RiskCalculation'
import config from '../lib/config'

const EditRecordModal = ({ 
    isOpen, 
    onClose, 
    record, 
    orgUnits, 
    selectedOrgUnit, 
    setSelectedOrgUnit,
    onRecordUpdated 
}) => {
    const [formData, setFormData] = useState({})
    const [currentStep, setCurrentStep] = useState(0)
    const [saving, setSaving] = useState(false)
    const [formOptions, setFormOptions] = useState({})
    const [error, setError] = useState(null)
    
    const engine = useDataEngine()
    const { showToast } = useToast()

    // Initialize form data when record changes
    useEffect(() => {
        if (record) {
            console.log('Initializing form data with record:', record)
            console.log('Sex value from record:', record.sex)
            console.log('Sex mapping ID:', config.mapping.trackedEntityAttributes.Sex)
            console.log('Record object keys:', Object.keys(record))
            console.log('Record sex field type:', typeof record.sex)
            console.log('Record sex field value:', record.sex)
            console.log('Record sex field length:', record.sex?.length)
            
            // Helper function to reverse map DHIS2 values to form values
            const reverseMapValue = (fieldName, dhValue) => {
                if (config.mapping.valueMappings && config.mapping.valueMappings[fieldName]) {
                    const mapping = config.mapping.valueMappings[fieldName]
                    const reverseMapping = Object.fromEntries(
                        Object.entries(mapping).map(([key, value]) => [value, key])
                    )
                    if (reverseMapping[dhValue]) {
                        console.log(`Reverse mapped ${fieldName}: ${dhValue} -> ${reverseMapping[dhValue]}`)
                        return reverseMapping[dhValue]
                    }
                }
                return dhValue
            }
            const initialData = {
                // Basic Information
                systemId: record.systemId || '',
                uuic: record.uuic || '',
                familyName: record.familyName || '',
                lastName: record.lastName || '',
                sex: reverseMapValue('sex', record.sex) || '',
                dateOfBirth: record.dateOfBirth || '',
                age: record.age || '',
                province: record.province || '',
                od: record.od || '',
                district: record.district || '',
                commune: record.commune || '',
                
                // Clinical Data
                genderIdentity: reverseMapValue('genderIdentity', record.genderIdentity) || '',
                sexualHealthConcerns: record.sexualHealthConcerns || '',
                hadSexPast6Months: record.hadSexPast6Months || '',
                partnerMale: record.partnerMale || '',
                partnerFemale: record.partnerFemale || '',
                partnerTGW: record.partnerTGW || '',
                numberOfSexualPartners: record.numberOfSexualPartners || '',
                sexWithHIVPartner: record.sexWithHIVPartner || '',
                sexWithoutCondom: record.sexWithoutCondom || '',
                stiSymptoms: record.stiSymptoms || '',
                syphilisPositive: record.syphilisPositive || '',
                hivTestPast6Months: record.hivTestPast6Months || '',
                hivTestResult: record.hivTestResult || '',
                lastHivTestDate: record.lastHivTestDate || '',
                currentlyOnPrep: record.currentlyOnPrep || '',
                everOnPrep: record.everOnPrep || '',
                receiveMoneyForSex: record.receiveMoneyForSex || '',
                paidForSex: record.paidForSex || '',
                injectedDrugSharedNeedle: record.injectedDrugSharedNeedle || '',
                alcoholDrugBeforeSex: record.alcoholDrugBeforeSex || '',
                groupSexChemsex: record.groupSexChemsex || '',
                abortion: record.abortion || '',
                forcedSex: record.forcedSex || '',
                noneOfAbove: record.noneOfAbove || '',
                sexAtBirth: record.sexAtBirth || '',
                past6MonthsPractices: record.past6MonthsPractices || '',
                
                // Risk Assessment Results
                riskScreeningResult: record.riskScreeningResult || '',
                riskScreeningScore: record.riskScreeningScore || '',
                
                // Event information
                eventId: record.id,
                eventDate: record.eventDate || new Date().toISOString().split('T')[0],
                orgUnit: record.orgUnit || selectedOrgUnit,
                trackedEntityInstance: record.trackedEntityInstance
            }
            setFormData(initialData)
            setError(null)
        } else {
            // Initialize with empty values to prevent controlled/uncontrolled warnings
            setFormData({
                systemId: '',
                uuic: '',
                familyName: '',
                lastName: '',
                sex: '',
                dateOfBirth: '',
                age: '',
                province: '',
                od: '',
                district: '',
                commune: '',
                genderIdentity: '',
                sexualHealthConcerns: '',
                hadSexPast6Months: '',
                partnerMale: '',
                partnerFemale: '',
                partnerTGW: '',
                numberOfSexualPartners: '',
                sexWithHIVPartner: '',
                sexWithoutCondom: '',
                stiSymptoms: '',
                syphilisPositive: '',
                hivTestPast6Months: '',
                hivTestResult: '',
                lastHivTestDate: '',
                currentlyOnPrep: '',
                everOnPrep: '',
                receiveMoneyForSex: '',
                paidForSex: '',
                injectedDrugSharedNeedle: '',
                alcoholDrugBeforeSex: '',
                groupSexChemsex: '',
                abortion: '',
                forcedSex: '',
                noneOfAbove: '',
                sexAtBirth: '',
                past6MonthsPractices: '',
                riskScreeningResult: '',
                riskScreeningScore: '',
                eventId: '',
                eventDate: new Date().toISOString().split('T')[0],
                orgUnit: selectedOrgUnit || '',
                trackedEntityInstance: ''
            })
        }
    }, [record, selectedOrgUnit])

    const updateFormData = (updates) => {
        setFormData(prev => ({ ...prev, ...updates }))
    }

    // Risk calculation function
    const calculateRiskScore = () => {
        let score = 0
        const riskFactors = []
        
        // Basic risk factors
        if (formData.sexWithHIVPartner === 'true') {
            score += 15
            riskFactors.push('Sex with HIV+ partner')
        }
        
        if (formData.sexWithoutCondom === 'true') {
            score += 10
            riskFactors.push('Unprotected sex')
        }
        
        if (formData.stiSymptoms === 'true') {
            score += 12
            riskFactors.push('STI symptoms')
        }
        
        if (formData.syphilisPositive === 'true') {
            score += 15
            riskFactors.push('Syphilis positive')
        }
        
        if (formData.receiveMoneyForSex === 'true') {
            score += 8
            riskFactors.push('Sex work')
        }
        
        if (formData.paidForSex === 'true') {
            score += 6
            riskFactors.push('Paid for sex')
        }
        
        if (formData.injectedDrugSharedNeedle === 'true') {
            score += 12
            riskFactors.push('Shared needles')
        }
        
        if (formData.alcoholDrugBeforeSex === 'true') {
            score += 5
            riskFactors.push('Substance use before sex')
        }
        
        if (formData.groupSexChemsex === 'true') {
            score += 8
            riskFactors.push('Group sex/chemsex')
        }
        
        if (formData.forcedSex === 'true') {
            score += 10
            riskFactors.push('Forced sex')
        }
        
        // Partner type scoring
        const partnerCount = parseInt(formData.numberOfSexualPartners) || 0
        if (partnerCount > 5) {
            score += 8
            riskFactors.push('Multiple partners (>5)')
        } else if (partnerCount > 2) {
            score += 4
            riskFactors.push('Multiple partners (3-5)')
        }
        
        // Determine risk level
        let riskLevel = 'Low'
        if (score >= 50) riskLevel = 'Very High'
        else if (score >= 35) riskLevel = 'High'
        else if (score >= 20) riskLevel = 'Medium'
        
        // Generate recommendations based on risk factors
        const recommendations = []
        if (score >= 35) {
            recommendations.push('Immediate HIV and STI testing recommended')
            recommendations.push('Consider PrEP initiation')
            recommendations.push('Refer to specialized sexual health services')
        } else if (score >= 20) {
            recommendations.push('Regular HIV and STI testing recommended')
            recommendations.push('Consider PrEP discussion')
            recommendations.push('Safe sex counseling recommended')
        } else {
            recommendations.push('Regular health check-ups recommended')
            recommendations.push('Safe sex practices encouraged')
        }
        
        return {
            score,
            riskLevel,
            riskFactors,
            recommendations,
            riskScreeningResult: riskLevel,
            riskScreeningScore: score.toString()
        }
    }

    const steps = [
        {
            id: 'basic',
            title: 'Basic Information',
            icon: FiUser,
            component: BasicInformation
        },
        {
            id: 'clinical',
            title: 'Clinical Data',
            icon: FiActivity,
            component: ClinicalData
        },
        {
            id: 'risk',
            title: 'Risk Assessment',
            icon: Calculator,
            component: RiskAssessment
        },
        {
            id: 'calculation',
            title: 'Risk Calculation',
            icon: FiFileText,
            component: RiskCalculation
        }
    ]

    const handleSave = async () => {
        if (!record?.id) {
            showToast({
                title: 'Error',
                description: 'No record to update',
                variant: 'error'
            })
            return
        }

        // Validate required fields
        const requiredFields = ['orgUnit', 'eventDate']
        const missingFields = requiredFields.filter(field => !formData[field])
        
        if (missingFields.length > 0) {
            showToast({
                title: 'Validation Error',
                description: `Missing required fields: ${missingFields.join(', ')}`,
                variant: 'error'
            })
            return
        }

        setSaving(true)
        setError(null)
        
        try {
            console.log('Saving record with form data:', formData)
            console.log('Sex value in form data:', formData.sex)
            console.log('Sex mapping configuration:', config.mapping.trackedEntityAttributes.Sex)
            console.log('Sex value mappings:', config.mapping.valueMappings?.sex)
            console.log('Sex field in formData:', formData.sex)
            console.log('Sex field type:', typeof formData.sex)
            console.log('Sex field length:', formData.sex?.length)
            console.log('🔍 TEST: Sex field value:', formData.sex)
            console.log('🔍 TEST: Sex field empty check:', formData.sex === '')
            console.log('🔍 TEST: Sex field undefined check:', formData.sex === undefined)
            console.log('🔍 TEST: Sex field null check:', formData.sex === null)
            
            // Test: Check if sex field is being processed correctly
            console.log('🔍 TEST: Sex field processing test')
            console.log('🔍 TEST: formData.sex =', formData.sex)
            console.log('🔍 TEST: config.mapping.trackedEntityAttributes.Sex =', config.mapping.trackedEntityAttributes.Sex)
            console.log('🔍 TEST: config.mapping.valueMappings.sex =', config.mapping.valueMappings?.sex)
            
            // First, get the current event data to ensure we have the latest version
            console.log('Fetching current event data...')
            const currentEventResponse = await engine.query({
                event: {
                    resource: `events/${record.id}`,
                    params: {
                        fields: 'event,eventDate,orgUnit,dataValues,program,programStage'
                    }
                }
            })
            
            const currentEvent = currentEventResponse.event
            console.log('Current event data:', currentEvent)
            
            // Prepare data values for DHIS2 update
            const dataValues = []
            
            // Get current data values from the event
            const currentDataValues = currentEvent?.dataValues || []
            const currentDataValuesMap = {}
            currentDataValues.forEach(dv => {
                currentDataValuesMap[dv.dataElement] = dv.value
            })
            
            console.log('Current data values map:', currentDataValuesMap)
            
            // Add program stage data elements that have actually changed
            // Also handle sex field as a program stage data element if it's not a tracked entity attribute
            const programStageKeys = [...Object.keys(config.mapping.programStageDataElements)]
            if (formData.sex && !attributes.find(attr => attr.attribute === config.mapping.trackedEntityAttributes.Sex)) {
                // If sex is not being saved as tracked entity attribute, save it as sexAtBirth
                programStageKeys.push('sexAtBirth')
            }
            
            programStageKeys.forEach(key => {
                let newValue = formData[key]
                // If processing sexAtBirth but formData has sex, use that value
                if (key === 'sexAtBirth' && formData.sex && !formData.sexAtBirth) {
                    newValue = formData.sex
                    console.log(`🔍 Using sex value for sexAtBirth: ${newValue}`)
                }
                const dataElementId = config.mapping.programStageDataElements[key]
                const currentValue = currentDataValuesMap[dataElementId]
                
                // Only add if value is defined and different from current
                // Also handle the case where current value is undefined but new value is meaningful
                if (newValue !== undefined && newValue !== '') {
                    const newValueStr = newValue.toString()
                    if (currentValue === undefined || currentValue === null || currentValue === '') {
                        // Only add if new value is not empty
                        if (newValueStr !== '' && newValueStr !== 'undefined' && newValueStr !== 'null') {
                            dataValues.push({
                                dataElement: dataElementId,
                                value: newValueStr
                            })
                            console.log(`Data value added: ${key} = ${currentValue} -> ${newValueStr}`)
                        }
                    } else if (newValueStr !== currentValue) {
                        dataValues.push({
                            dataElement: dataElementId,
                            value: newValueStr
                        })
                        console.log(`Data value changed: ${key} = ${currentValue} -> ${newValueStr}`)
                    }
                }
            })

            console.log('Data values to update:', dataValues)

            // Check if we have any data to update
            if (dataValues.length === 0) {
                showToast({
                    title: 'No Changes',
                    description: 'No data changes detected. Record not updated.',
                    variant: 'default'
                })
                onClose()
                return
            }

            // Attempt to update the record with improved error handling
            console.log('Attempting to update record with improved approach...')
            
            try {
                // First, try to update tracked entity attributes (personal information)
                if (formData.trackedEntityInstance) {
                    const attributes = []
                    
                    // Add tracked entity attributes
                    console.log('🔍 Processing tracked entity attributes for keys:', Object.keys(config.mapping.trackedEntityAttributes))
                    console.log('🔍 Form data keys:', Object.keys(formData))
                    console.log('🔍 Form data sex value:', formData.sex)
                    Object.keys(config.mapping.trackedEntityAttributes).forEach(key => {
                        const value = formData[key]
                        console.log(`🔍 Processing ${key}: value = "${value}", type = ${typeof value}`)
                        if (key === 'sex' || key === 'Sex') {
                            console.log(`🔍 Special check for sex field: value = "${value}", empty = ${value === ''}, undefined = ${value === undefined}`)
                        }
                        if (value !== undefined && value !== '') {
                            let mappedValue = value.toString()
                            
                            // Apply value mapping if available
                            if (config.mapping.valueMappings && config.mapping.valueMappings[key]) {
                                const mapping = config.mapping.valueMappings[key]
                                if (mapping[value]) {
                                    mappedValue = mapping[value]
                                    console.log(`Mapped ${key} value: ${value} -> ${mappedValue}`)
                                }
                            }
                            
                            attributes.push({
                                attribute: config.mapping.trackedEntityAttributes[key],
                                value: mappedValue
                            })
                            console.log(`Added tracked entity attribute: ${key} = ${mappedValue} (${config.mapping.trackedEntityAttributes[key]})`)
                        }
                    })

                    if (attributes.length > 0) {
                        console.log('Updating tracked entity attributes:', attributes)
                        console.log('🔍 Sex attribute in update:', attributes.find(attr => attr.attribute === config.mapping.trackedEntityAttributes.Sex))
                        
                        const teiUpdateData = {
                            trackedEntityInstance: formData.trackedEntityInstance,
                            attributes: attributes
                        }

                        console.log('TEI update data:', teiUpdateData)

                        const teiResponse = await engine.mutate({
                            type: 'update',
                            resource: `trackedEntityInstances/${formData.trackedEntityInstance}`,
                            data: teiUpdateData
                        })

                        console.log('TEI update response:', teiResponse)
                        
                        showToast({
                            title: 'Personal Information Updated',
                            description: 'Personal information updated successfully.',
                            variant: 'default'
                        })
                    }
                }

                // Then try to update event data values one by one
                if (dataValues.length > 0) {
                    console.log('Attempting to update event data values...')
                    
                    let successCount = 0
                    let failureCount = 0
                    
                    for (const dataValue of dataValues) {
                        try {
                            console.log(`Updating data value: ${dataValue.dataElement} = ${dataValue.value}`)
                            
                            const updateData = {
                                event: formData.id,
                                dataValues: [dataValue]
                            }
                            
                            const response = await engine.mutate({
                                type: 'update',
                                resource: 'events',
                                data: updateData
                            })
                            
                            console.log(`Successfully updated ${dataValue.dataElement}:`, response)
                            successCount++
                            
                            // Add a small delay between updates to avoid overwhelming the server
                            await new Promise(resolve => setTimeout(resolve, 100))
                            
                        } catch (error) {
                            console.error(`Failed to update ${dataValue.dataElement}:`, error)
                            failureCount++
                        }
                    }
                    
                    if (successCount > 0) {
                        showToast({
                            title: 'Update Successful',
                            description: `Updated ${successCount} data values successfully.${failureCount > 0 ? ` ${failureCount} values could not be updated.` : ''}`,
                            variant: 'default'
                        })
                    } else if (failureCount > 0) {
                        showToast({
                            title: 'Partial Update',
                            description: 'Personal information was updated, but event data could not be modified.',
                            variant: 'default'
                        })
                    }
                }
                
                // Close modal and refresh records
                onClose()
                if (onRecordUpdated) {
                    onRecordUpdated()
                }
                
            } catch (error) {
                console.error('Update failed:', error)
                
                // Show user-friendly error message
                let errorMessage = 'Failed to update record. Please try again.'
                
                if (error.message && error.message.includes('409')) {
                    errorMessage = 'Record is currently being used by another user. Please try again in a moment.'
                } else if (error.message && error.message.includes('import summary')) {
                    errorMessage = 'Some data could not be updated. Please check your changes and try again.'
                }
                
                showToast({
                    title: 'Update Failed',
                    description: errorMessage,
                    variant: 'error'
                })
            }

            // Update tracked entity attributes if needed
            if (formData.trackedEntityInstance) {
                const attributes = []
                
                // Add tracked entity attributes
                Object.keys(config.mapping.trackedEntityAttributes).forEach(key => {
                    const value = formData[key]
                    if (value !== undefined && value !== '') {
                        attributes.push({
                            attribute: config.mapping.trackedEntityAttributes[key],
                            value: value.toString()
                        })
                    }
                })

                if (attributes.length > 0) {
                    console.log('Updating tracked entity attributes:', attributes)
                    
                    const teiUpdateData = {
                        trackedEntityInstance: formData.trackedEntityInstance,
                        attributes: attributes
                    }

                    console.log('TEI update data:', teiUpdateData)

                    const teiResponse = await engine.mutate({
                        type: 'update',
                        resource: `trackedEntityInstances/${formData.trackedEntityInstance}`,
                        data: teiUpdateData
                    })

                    console.log('TEI update response:', teiResponse)
                }
            }

            showToast({
                title: 'Success',
                description: 'Record updated successfully',
                variant: 'default'
            })

            // Call the callback to refresh the records list
            if (onRecordUpdated) {
                onRecordUpdated()
            }

            onClose()
        } catch (error) {
            console.error('Error updating record:', error)
            
            // Handle specific error types
            let errorMessage = 'Failed to update record. Please try again.'
            
            if (error.message) {
                errorMessage = error.message
            } else if (error.details) {
                errorMessage = error.details
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message
            }
            
            // Handle 409 Conflict error specifically
            if (error.response?.status === 409 || errorMessage.includes('conflict')) {
                errorMessage = 'Record was modified by another user. Please refresh and try again.'
            }
            
            // Handle network errors
            if (error.message?.includes('network error')) {
                errorMessage = 'Network error. Please check your connection and try again.'
            }
            
            setError(errorMessage)
            showToast({
                title: 'Error',
                description: errorMessage,
                variant: 'error'
            })
        } finally {
            setSaving(false)
        }
    }

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const CurrentStepComponent = steps[currentStep]?.component

    if (!isOpen || !record) return null

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Edit Record - ${record?.systemId || record?.id || 'Unknown'}`}
            size="xl"
            className="max-h-[90vh] overflow-hidden"
        >
            <div className="flex flex-col h-full max-h-[calc(90vh-200px)]">
                {/* Error Display */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="text-red-800 font-medium">Error: {error}</div>
                    </div>
                )}

                {/* Step Navigation */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        {steps.map((step, index) => (
                            <button
                                key={step.id}
                                onClick={() => setCurrentStep(index)}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors cursor-pointer hover:shadow-sm ${
                                    index === currentStep
                                        ? 'bg-blue-100 text-blue-700'
                                        : index < currentStep
                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                            >
                                <step.icon className="w-4 h-4" />
                                <span className="text-sm font-medium hidden sm:inline">
                                    {step.title}
                                </span>
                            </button>
                        ))}
                    </div>
                    <div className="text-sm text-gray-500">
                        Step {currentStep + 1} of {steps.length}
                    </div>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    {CurrentStepComponent ? (
                        <CurrentStepComponent
                            formData={formData}
                            updateFormData={updateFormData}
                            orgUnits={orgUnits}
                            selectedOrgUnit={formData.orgUnit || selectedOrgUnit}
                            setSelectedOrgUnit={(orgUnit) => {
                                setSelectedOrgUnit(orgUnit)
                                updateFormData({ orgUnit })
                            }}
                            formOptions={formOptions}
                            mode="edit"
                            isEditMode={true}
                            isViewMode={false}
                            calculateRiskScore={calculateRiskScore}
                        />
                    ) : (
                        <div className="text-center py-8">
                            <div className="text-gray-500">Loading form component...</div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
                    <div className="flex items-center space-x-3">
                        <Button
                            onClick={onClose}
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-2"
                        >
                            <FiX className="w-4 h-4" />
                            <span>Cancel</span>
                        </Button>
                    </div>

                    <div className="flex items-center space-x-3">
                        {currentStep > 0 && (
                            <Button
                                onClick={handlePrevious}
                                variant="outline"
                                size="sm"
                            >
                                Previous
                            </Button>
                        )}
                        
                        {currentStep < steps.length - 1 ? (
                            <Button
                                onClick={handleNext}
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
                            >
                                {saving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiSave className="w-4 h-4" />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default EditRecordModal
