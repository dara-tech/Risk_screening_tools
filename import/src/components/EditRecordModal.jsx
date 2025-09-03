import React, { useState, useEffect } from 'react'
import { Modal } from './ui/modal'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { useToast } from './ui/ui/toast'
import { useDataEngine } from '@dhis2/app-runtime'
import { FiSave, FiX, FiActivity, FiFileText, FiEdit3 } from 'react-icons/fi'
import { Calculator, Shield, Activity, User } from 'lucide-react'
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

    const tabs = [
        {
            id: 'basic',
            title: 'ព័ត៌មានមូលដ្ឋាន',
            titleEn: 'Basic Information',
            icon: User,
            component: BasicInformation
        },
        {
            id: 'clinical',
            title: 'ទិន្នន័យគ្លីនិក',
            titleEn: 'Clinical Data',
            icon: Activity,
            component: ClinicalData
        },
        {
            id: 'risk',
            title: 'ការវាយតម្លៃហានិភ័យ',
            titleEn: 'Risk Assessment',
            icon: Shield,
            component: RiskAssessment
        },
        {
            id: 'calculation',
            title: 'ពិន្ទុហានិភ័យ',
            titleEn: 'Risk Score',
            icon: Calculator,
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
            
            // Validate required fields
            if (!formData.trackedEntityInstance) {
                throw new Error('No tracked entity instance ID found')
            }
            
            if (!record?.id) {
                throw new Error('No event ID found')
            }
            
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
            // Note: We'll check for sex in tracked entity attributes later when we build the attributes array
            
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
                // Skip TEI updates for now - focus only on event data updates
                console.log('Skipping TEI updates to focus on event data updates only')
                
                // Note: Personal information updates (TEI attributes) are temporarily disabled
                // due to DHIS2 validation issues. Only event data will be updated.

                // Then try to update event data values one by one
                if (dataValues.length > 0) {
                    console.log('Attempting to update event data values...')
                    
                    try {
                        // Build a single event payload with required context
                        const eventPayload = {
                            event: record.id,
                            program: currentEvent.program,
                            programStage: currentEvent.programStage,
                            orgUnit: currentEvent.orgUnit,
                            eventDate: currentEvent.eventDate,
                            status: currentEvent.status || 'COMPLETED',
                            dataValues: dataValues
                        }
                        
                        const bulkPayload = { events: [eventPayload] }
                        console.log('Bulk event update payload:', bulkPayload)
                        
                        const response = await engine.mutate({
                            type: 'create',
                            resource: 'events',
                            params: { importStrategy: 'UPDATE' },
                            data: bulkPayload
                        })
                        
                        console.log('Bulk event update response:', response)
                        
                        const importSummary = response?.response || response
                        const stats = importSummary?.stats || importSummary?.importCount
                        const updated = stats?.updated || stats?.updatedInstances || 0
                        const ignored = stats?.ignored || 0
                        
                        if (ignored > 0) {
                            showToast({
                                title: 'Partial Update',
                                description: 'Some event values could not be updated. Please review your changes.',
                                variant: 'default'
                            })
                        } else if (updated > 0) {
                            showToast({
                                title: 'Update Successful',
                                description: `Updated ${dataValues.length} event data values successfully. Note: Personal information updates are temporarily disabled.`,
                                variant: 'default'
                            })
                        } else {
                            showToast({
                                title: 'Update Failed',
                                description: 'Event data could not be updated. Please try again.',
                                variant: 'error'
                            })
                        }
                    } catch (error) {
                        console.error('Bulk event update failed:', error)
                        const msg = error.response?.data?.message || error.message || 'Unknown error'
                        showToast({
                            title: 'Update Failed',
                            description: `Event update failed: ${msg}`,
                            variant: 'error'
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
                } else if (error.response?.status === 409) {
                    errorMessage = 'Record was modified by another user. Please refresh and try again.'
                }
                
                showToast({
                    title: 'Update Failed',
                    description: errorMessage,
                    variant: 'error'
                })
            } finally {
                setSaving(false)
            }
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

    const CurrentStepComponent = tabs[currentStep]?.component

    if (!isOpen || !record) return null

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center space-x-3">
                    <FiEdit3 className="w-5 h-5 text-blue-600" />
                    <div>
                        <div className="font-semibold text-gray-900">កែប្រែកំណត់ត្រា / Edit Record</div>
                        <div className="text-sm text-gray-500 font-mono">{record?.systemId || record?.id || 'Unknown'}</div>
                    </div>
                </div>
            }
            size="xl"
            className="max-h-[90vh] overflow-hidden"
        >
            <div className="flex flex-col h-full max-h-[calc(90vh-200px)]">
                {/* Error Display */}
                {error && (
                    <Card className="mb-4 border-red-200 bg-red-50">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <div className="text-red-800 font-medium">កំហុស / Error: {error}</div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Record Summary */}
                <Card className="mb-6">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <User className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">ឈ្មោះ / Name:</span>
                                    <span className="font-medium">{record?.familyName} {record?.lastName}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Shield className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">ពិន្ទុ / Score:</span>
                                    <Badge variant="outline" className="font-mono">
                                        {(() => {
                                            const riskData = calculateRiskScore()
                                            return riskData.score || 0
                                        })()}
                                    </Badge>
                                </div>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                                {(() => {
                                    const riskData = calculateRiskScore()
                                    return riskData.riskLevel || 'Not calculated'
                                })()}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs Navigation */}
                <Tabs value={tabs[currentStep]?.id} className="flex-1 flex flex-col">
                    <TabsList className="grid w-full grid-cols-4 mb-6">
                        {tabs.map((tab, index) => (
                            <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                onClick={() => setCurrentStep(index)}
                                className="flex items-center space-x-2 text-xs"
                            >
                                <tab.icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{tab.title}</span>
                                <span className="sm:hidden">{tab.titleEn}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {/* Form Content */}
                    <div className="flex-1 overflow-y-auto min-h-0">
                        {CurrentStepComponent ? (
                            <TabsContent value={tabs[currentStep]?.id} className="mt-0">
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
                            </TabsContent>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-gray-500">កំពុងផ្ទុក... / Loading...</div>
                            </div>
                        )}
                    </div>
                </Tabs>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
                    <Button
                        onClick={onClose}
                        variant="outline"
                        size="sm"
                        className="flex items-center space-x-2"
                    >
                        <FiX className="w-4 h-4" />
                        <span>បោះបង់ / Cancel</span>
                    </Button>

                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>កំពុងរក្សាទុក... / Saving...</span>
                            </>
                        ) : (
                            <>
                                <FiSave className="w-4 h-4" />
                                <span>រក្សាទុកការផ្លាស់ប្តូរ / Save Changes</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default EditRecordModal

