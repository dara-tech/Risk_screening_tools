import React, { useState, useEffect } from 'react'
import { useDataEngine } from '@dhis2/app-runtime'
import { Modal } from './ui/modal'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Checkbox } from './ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { FiSave, FiX, FiCheckCircle, FiAlertCircle, FiEdit3, FiUser, FiShield, FiActivity, FiDroplet } from 'react-icons/fi'
import config from '../lib/config'
import { useToast } from './ui/ui/toast'

const SimpleEditModal = ({ isOpen, onClose, record, onRecordUpdated }) => {
    const [formData, setFormData] = useState({})
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState('risk')
    
    const engine = useDataEngine()
    const { showToast } = useToast()

    // Initialize form data when record changes
    useEffect(() => {
        if (record) {
            console.log('SimpleEditModal: Initializing with record:', record)
            
            // Only include event data fields that can be updated
            const initialData = {
                // Risk Assessment Results
                riskScreeningResult: record.riskScreeningResult || '',
                riskScreeningScore: record.riskScreeningScore || '',
                
                // Clinical Data
                genderIdentity: record.genderIdentity || '',
                hadSexPast6Months: record.hadSexPast6Months || '',
                numberOfSexualPartners: record.numberOfSexualPartners || '',
                hivTestPast6Months: record.hivTestPast6Months || '',
                hivTestResult: record.hivTestResult || '',
                lastHivTestDate: record.lastHivTestDate || '',
                currentlyOnPrep: record.currentlyOnPrep || '',
                everOnPrep: record.everOnPrep || '',
                
                // Risk Factors
                sexWithHIVPartner: record.sexWithHIVPartner || '',
                sexWithoutCondom: record.sexWithoutCondom || '',
                stiSymptoms: record.stiSymptoms || '',
                syphilisPositive: record.syphilisPositive || '',
                receiveMoneyForSex: record.receiveMoneyForSex || '',
                paidForSex: record.paidForSex || '',
                injectedDrugSharedNeedle: record.injectedDrugSharedNeedle || '',
                alcoholDrugBeforeSex: record.alcoholDrugBeforeSex || '',
                groupSexChemsex: record.groupSexChemsex || '',
                abortion: record.abortion || '',
                forcedSex: record.forcedSex || '',
                noneOfAbove: record.noneOfAbove || '',
                
                // Partner Information
                partnerMale: record.partnerMale || '',
                partnerFemale: record.partnerFemale || '',
                partnerTGW: record.partnerTGW || '',
                
                // Other
                sexualHealthConcerns: record.sexualHealthConcerns || '',
                past6MonthsPractices: record.past6MonthsPractices || '',
                sexAtBirth: record.sexAtBirth || ''
            }
            
            setFormData(initialData)
            setError(null)
        }
    }, [record])

    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        if (!record?.id) {
            setError('No record to update')
            return
        }

        setSaving(true)
        setError(null)
        
        try {
            console.log('SimpleEditModal: Starting update for record:', record.id)
            
            // Get current event data
            const currentEventResponse = await engine.query({
                event: {
                    resource: `events/${record.id}`,
                    params: {
                        fields: 'event,eventDate,orgUnit,dataValues,program,programStage,status'
                    }
                }
            })
            
            const currentEvent = currentEventResponse.event
            console.log('SimpleEditModal: Current event data:', currentEvent)
            
            // Build current data values map
            const currentDataValues = currentEvent?.dataValues || []
            const currentDataValuesMap = {}
            currentDataValues.forEach(dv => {
                currentDataValuesMap[dv.dataElement] = dv.value
            })
            
            console.log('SimpleEditModal: Current data values map:', currentDataValuesMap)
            
            // Prepare data values for update
            const dataValues = []
            const programStageKeys = Object.keys(config.mapping.programStageDataElements)
            
            programStageKeys.forEach(key => {
                const newValue = formData[key]
                if (newValue !== undefined && newValue !== '') {
                    const dataElementId = config.mapping.programStageDataElements[key]
                    const currentValue = currentDataValuesMap[dataElementId]
                    const newValueStr = newValue.toString()
                    
                    if (currentValue === undefined || currentValue === null || currentValue === '' || newValueStr !== currentValue) {
                        dataValues.push({
                            dataElement: dataElementId,
                            value: newValueStr
                        })
                        console.log(`SimpleEditModal: Adding data value: ${key} = ${currentValue} -> ${newValueStr}`)
                    }
                }
            })

            console.log('SimpleEditModal: Data values to update:', dataValues)

            if (dataValues.length === 0) {
                setError('No changes detected')
                showToast({
                    title: 'No Changes',
                    description: 'There were no changes to save.',
                    variant: 'default'
                })
                return
            }

            // Build event payload
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
            console.log('SimpleEditModal: Bulk event update payload:', bulkPayload)
            
            // Perform bulk update
            const response = await engine.mutate({
                type: 'create',
                resource: 'events',
                params: { importStrategy: 'UPDATE' },
                data: bulkPayload
            })
            
            console.log('SimpleEditModal: Bulk event update response:', response)
            console.log('SimpleEditModal: Response details:', {
                httpStatus: response?.httpStatus,
                status: response?.status,
                message: response?.message,
                hasResponse: !!response?.response
            })
            
            // Check for successful response
            const isSuccess = response?.httpStatus === 'OK' && 
                            (response?.status === 'OK' || response?.status === 'SUCCESS') &&
                            response?.message?.includes('successful')
            
            console.log('SimpleEditModal: Success check result:', isSuccess)
            
            if (isSuccess) {
                console.log('SimpleEditModal: Update successful')
                showToast({
                    title: 'Update Successful',
                    description: 'Record changes were saved to DHIS2.',
                    variant: 'success'
                })
                onClose()
                if (onRecordUpdated) {
                    onRecordUpdated()
                }
            } else {
                // Try to get more detailed error info
                const importSummary = response?.response || response
                const stats = importSummary?.stats || importSummary?.importCount
                const updated = stats?.updated || stats?.updatedInstances || 0
                const ignored = stats?.ignored || 0
                
                if (updated > 0) {
                    console.log('SimpleEditModal: Update successful (via stats)')
                    showToast({
                        title: 'Update Successful',
                        description: 'Record changes were saved to DHIS2.',
                        variant: 'success'
                    })
                    onClose()
                    if (onRecordUpdated) {
                        onRecordUpdated()
                    }
                } else {
                    const errorMessage = response?.message || importSummary?.description || 'Update failed - no records were updated'
                    setError(errorMessage)
                    showToast({
                        title: 'Update Failed',
                        description: errorMessage,
                        variant: 'error'
                    })
                }
            }
            
        } catch (error) {
            console.error('SimpleEditModal: Update failed:', error)
            const errorMsg = error.response?.data?.message || error.message || 'Unknown error occurred'
            setError(`Update failed: ${errorMsg}`)
            showToast({
                title: 'Update Failed',
                description: errorMsg,
                variant: 'error'
            })
        } finally {
            setSaving(false)
        }
    }

    const getRiskLevelColor = (level) => {
        switch (level?.toLowerCase()) {
            case 'low': return 'text-gray-700 bg-gray-50 border-gray-200'
            case 'medium': return 'text-gray-800 bg-gray-100 border-gray-300'
            case 'high': return 'text-gray-900 bg-gray-200 border-gray-400'
            case 'very high': return 'text-gray-900 bg-gray-300 border-gray-500'
            default: return 'text-gray-600 bg-gray-50 border-gray-200'
        }
    }

    const tabs = [
        { 
            id: 'risk', 
            label: 'ការវាយតម្លៃហានិភ័យ', 
            labelEn: 'Risk Assessment', 
            icon: FiShield 
        },
        { 
            id: 'clinical', 
            label: 'ទិន្នន័យគ្លីនិក', 
            labelEn: 'Clinical Data', 
            icon: FiUser 
        },
        { 
            id: 'factors', 
            label: 'កត្តាហានិភ័យ', 
            labelEn: 'Risk Factors', 
            icon: FiActivity 
        },
        { 
            id: 'hiv', 
            label: 'ការធ្វើតេស្តអេដស៍', 
            labelEn: 'HIV Testing', 
            icon: FiDroplet 
        }
    ]

    if (!isOpen || !record) return null

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div className="flex items-center space-x-3">
                    <FiEdit3 className="w-5 h-5 text-gray-600" />
                    <div>
                        <div className="font-semibold text-gray-900">កែប្រែកំណត់ត្រា / Edit Record</div>
                        <div className="text-sm text-gray-500 font-mono">{record?.systemId || record?.id || 'Unknown'}</div>
                    </div>
                </div>
            }
            size="2xl"
            className="min-h-screen overflow-y-auto"
        >
            <div className="flex flex-col h-full max-h-[calc(90vh-200px)]">
                {/* Error Display */}
                {error && (
                    <div className="px-6 pt-6">
                        <Card className="border-gray-300 bg-gray-50">
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-2">
                                    <FiAlertCircle className="w-4 h-4 text-gray-600" />
                                    <div className="text-gray-800 font-medium">កំហុស / Error: {error}</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Record Summary */}
                <div className="px-6 pt-6">
                    <Card className="border-gray-200 bg-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-8">
                                    <div className="flex items-center space-x-3">
                                        <FiUser className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">ឈ្មោះ / Name:</span>
                                        <span className="font-medium text-gray-900">{record?.familyName} {record?.lastName}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <FiShield className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-600">ពិន្ទុ / Score:</span>
                                        <Badge variant="outline" className="font-mono bg-gray-50 border-gray-300 text-gray-700">
                                            {formData.riskScreeningScore || '0'}
                                        </Badge>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-gray-300">
                                    {formData.riskScreeningResult || 'Not calculated'}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs Navigation */}
                <div className="px-6 pt-8">
                    <Tabs value={activeTab} className="flex-1 flex flex-col">
                        <TabsList className="grid w-full grid-cols-4 bg-gray-50 border border-gray-200">
                            {tabs.map((tab) => (
                                <TabsTrigger
                                    key={tab.id}
                                    value={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className="flex items-center justify-center space-x-2 py-3 text-xs data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:border-gray-300 text-gray-600 hover:text-gray-800"
                                >
                                    <tab.icon className="w-4 h-4" />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                    <span className="sm:hidden">{tab.labelEn}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {/* Form Content */}
                        <div className="flex-1 overflow-y-auto min-h-0 pt-8">
                            <TabsContent value="risk" className="mt-0 px-0">
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div>
                                                <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                                                    លទ្ធផលវាយតម្លៃហានិភ័យ / Risk Screening Result
                                                </Label>
                                                <Select 
                                                    value={formData.riskScreeningResult || ''} 
                                                    onValueChange={(value) => updateFormData('riskScreeningResult', value)}
                                                >
                                                    <SelectTrigger className="w-full h-12">
                                                        <SelectValue placeholder="ជ្រើសរើសកម្រិតហានិភ័យ... / Select risk level..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Low">ទាប / Low Risk</SelectItem>
                                                        <SelectItem value="Medium">មធ្យម / Medium Risk</SelectItem>
                                                        <SelectItem value="High">ខ្ពស់ / High Risk</SelectItem>
                                                        <SelectItem value="Very High">ខ្ពស់ណាស់ / Very High Risk</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {formData.riskScreeningResult && (
                                                    <div className={`mt-3 px-4 py-3 rounded-lg border ${getRiskLevelColor(formData.riskScreeningResult)}`}>
                                                        <span className="font-medium">{formData.riskScreeningResult} Risk Level</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                                                    ពិន្ទុហានិភ័យ / Risk Score
                                                </Label>
                                                <Input
                                                    type="number"
                                                    value={formData.riskScreeningScore || ''}
                                                    onChange={(e) => updateFormData('riskScreeningScore', e.target.value)}
                                                    placeholder="បញ្ចូលពិន្ទុ / Enter numerical score"
                                                    min="0"
                                                    max="100"
                                                    className="h-12"
                                                />
                                            </div>
                                        </div>

                                        <Card className="bg-gray-50 border-gray-200">
                                            <CardContent className="p-6">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                    <FiShield className="w-5 h-5 mr-2" />
                                                    សង្ខេបការវាយតម្លៃហានិភ័យ / Risk Assessment Summary
                                                </h3>
                                                <div className="space-y-3 text-sm text-gray-700">
                                                    <div className="flex justify-between items-center">
                                                        <span>កម្រិតហានិភ័យបច្ចុប្បន្ន / Current Risk Level:</span>
                                                        <span className="font-medium">{formData.riskScreeningResult || 'មិនទាន់វាយតម្លៃ / Not assessed'}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span>ពិន្ទុហានិភ័យ / Risk Score:</span>
                                                        <span className="font-medium">{formData.riskScreeningScore || 'មិនទាន់គណនា / Not calculated'}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span>កាលបរិច្ឆេទវាយតម្លៃ / Assessment Date:</span>
                                                        <span className="font-medium">{new Date().toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="clinical" className="mt-0 px-0">
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div>
                                                <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                                                    អត្តសញ្ញាណភេទ / Gender Identity
                                                </Label>
                                                <Select 
                                                    value={formData.genderIdentity || ''} 
                                                    onValueChange={(value) => updateFormData('genderIdentity', value)}
                                                >
                                                    <SelectTrigger className="w-full h-12">
                                                        <SelectValue placeholder="ជ្រើសរើសអត្តសញ្ញាណភេទ... / Select gender identity..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Male">ប្រុស / Male</SelectItem>
                                                        <SelectItem value="Female">ស្រី / Female</SelectItem>
                                                        <SelectItem value="Transgender">ប្លែងភេទ / Transgender</SelectItem>
                                                        <SelectItem value="Non-binary">មិនមែនគូ / Non-binary</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                                                    សកម្មភាពផ្លូវភេទ (៦ខែចុងក្រោយ) / Sexual Activity (Past 6 Months)
                                                </Label>
                                                <Select 
                                                    value={formData.hadSexPast6Months || ''} 
                                                    onValueChange={(value) => updateFormData('hadSexPast6Months', value)}
                                                >
                                                    <SelectTrigger className="w-full h-12">
                                                        <SelectValue placeholder="ជ្រើសរើស... / Select..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Yes">បាទ / Yes</SelectItem>
                                                        <SelectItem value="No">ទេ / No</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                                                    ចំនួនដៃគូរួមភេទ / Number of Sexual Partners
                                                </Label>
                                                <Select 
                                                    value={formData.numberOfSexualPartners || ''} 
                                                    onValueChange={(value) => updateFormData('numberOfSexualPartners', value)}
                                                >
                                                    <SelectTrigger className="w-full h-12">
                                                        <SelectValue placeholder="ជ្រើសរើសចំនួន... / Select number..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="0">០ ដៃគូ / 0 partners</SelectItem>
                                                        <SelectItem value="1">១ ដៃគូ / 1 partner</SelectItem>
                                                        <SelectItem value="2">២ ដៃគូ / 2 partners</SelectItem>
                                                        <SelectItem value="3-5">៣-៥ ដៃគូ / 3-5 partners</SelectItem>
                                                        <SelectItem value="6+">៦+ ដៃគូ / 6+ partners</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <Card className="bg-gray-50 border-gray-200">
                                            <CardContent className="p-6">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                    <FiUser className="w-5 h-5 mr-2" />
                                                    សង្ខេបគ្លីនិក / Clinical Summary
                                                </h3>
                                                <div className="space-y-3 text-sm text-gray-700">
                                                    <div className="flex justify-between items-center">
                                                        <span>អត្តសញ្ញាណភេទ / Gender Identity:</span>
                                                        <span className="font-medium">{formData.genderIdentity || 'មិនទាន់បញ្ជាក់ / Not specified'}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span>សកម្មភាពផ្លូវភេទ / Sexual Activity:</span>
                                                        <span className="font-medium">{formData.hadSexPast6Months || 'មិនទាន់បញ្ជាក់ / Not specified'}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span>ដៃគូ / Partners:</span>
                                                        <span className="font-medium">{formData.numberOfSexualPartners || 'មិនទាន់បញ្ជាក់ / Not specified'}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="factors" className="mt-0 px-0">
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                                <FiActivity className="w-5 h-5 mr-2" />
                                                ជ្រើសរើសកត្តាហានិភ័យ / Select Risk Factors
                                            </h3>
                                            
                                            <div className="space-y-4">
                                                {[
                                                    { key: 'sexWithHIVPartner', label: 'រួមភេទជាមួយអ្នកផ្ទុកអេដស៍ / Sex with HIV+ Partner' },
                                                    { key: 'sexWithoutCondom', label: 'រួមភេទដោយមិនប្រើស្រោមអនាម័យ / Sex without Condom' },
                                                    { key: 'stiSymptoms', label: 'រោគសញ្ញា STI / STI Symptoms' },
                                                    { key: 'syphilisPositive', label: 'មេរោគស្វាយមានប្រតិកម្ម / Syphilis Positive' },
                                                    { key: 'receiveMoneyForSex', label: 'ទទួលលុយដោយរួមភេទ / Receive Money for Sex' },
                                                    { key: 'paidForSex', label: 'ទិញសេវាផ្លូវភេទ / Paid for Sex' },
                                                    { key: 'injectedDrugSharedNeedle', label: 'ចាក់គ្រឿងញៀន/ប្រើម្ជុលរួម / Injected Drug/Shared Needle' },
                                                    { key: 'alcoholDrugBeforeSex', label: 'ប្រើស្រវឹង/សារធាតុញៀនមុនរួមភេទ / Alcohol/Drug Before Sex' },
                                                    { key: 'groupSexChemsex', label: 'រួមភេទជាក្រុម/chemsex / Group Sex/Chemsex' },
                                                    { key: 'abortion', label: 'រំលូតកូន / Abortion' },
                                                    { key: 'forcedSex', label: 'ត្រូវបានបង្ខំឱ្យរួមភេទ / Forced Sex' },
                                                    { key: 'noneOfAbove', label: 'មិនមែនទាំងអស់ / None of Above' }
                                                ].map(({ key, label }) => (
                                                    <div key={key} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                        <Checkbox
                                                            checked={formData[key] === 'true'}
                                                            onCheckedChange={(checked) => updateFormData(key, checked ? 'true' : 'false')}
                                                        />
                                                        <Label className="text-sm font-medium text-gray-700 cursor-pointer flex-1 leading-relaxed">
                                                            {label}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <Card className="bg-gray-50 border-gray-200">
                                            <CardContent className="p-6">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                    <FiActivity className="w-5 h-5 mr-2" />
                                                    សង្ខេបកត្តាហានិភ័យ / Risk Factors Summary
                                                </h3>
                                                <div className="space-y-3 text-sm text-gray-700">
                                                    {Object.entries(formData).filter(([key, value]) => 
                                                        ['sexWithHIVPartner', 'sexWithoutCondom', 'stiSymptoms', 'syphilisPositive', 
                                                         'receiveMoneyForSex', 'paidForSex', 'injectedDrugSharedNeedle', 
                                                         'alcoholDrugBeforeSex', 'groupSexChemsex', 'abortion', 'forcedSex', 'noneOfAbove']
                                                        .includes(key) && value === 'true'
                                                    ).map(([key, value]) => (
                                                        <div key={key} className="flex items-center space-x-3">
                                                            <FiCheckCircle className="w-4 h-4 text-gray-600" />
                                                            <span className="font-medium">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                                                        </div>
                                                    ))}
                                                    {Object.entries(formData).filter(([key, value]) => 
                                                        ['sexWithHIVPartner', 'sexWithoutCondom', 'stiSymptoms', 'syphilisPositive', 
                                                         'receiveMoneyForSex', 'paidForSex', 'injectedDrugSharedNeedle', 
                                                         'alcoholDrugBeforeSex', 'groupSexChemsex', 'abortion', 'forcedSex', 'noneOfAbove']
                                                        .includes(key) && value === 'true'
                                                    ).length === 0 && (
                                                        <span className="text-gray-500 italic">មិនមានកត្តាហានិភ័យត្រូវបានជ្រើសរើស / No risk factors selected</span>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="hiv" className="mt-0 px-0">
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div>
                                                <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                                                    ការធ្វើតេស្តអេដស៍ (៦ខែចុងក្រោយ) / HIV Test (Past 6 Months)
                                                </Label>
                                                <Select 
                                                    value={formData.hivTestPast6Months || ''} 
                                                    onValueChange={(value) => updateFormData('hivTestPast6Months', value)}
                                                >
                                                    <SelectTrigger className="w-full h-12">
                                                        <SelectValue placeholder="ជ្រើសរើស... / Select..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Yes">បាទ / Yes</SelectItem>
                                                        <SelectItem value="No">ទេ / No</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                                                    លទ្ធផលតេស្តអេដស៍ / HIV Test Result
                                                </Label>
                                                <Select 
                                                    value={formData.hivTestResult || ''} 
                                                    onValueChange={(value) => updateFormData('hivTestResult', value)}
                                                >
                                                    <SelectTrigger className="w-full h-12">
                                                        <SelectValue placeholder="ជ្រើសរើសលទ្ធផល... / Select result..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Positive">មានប្រតិកម្ម / Positive</SelectItem>
                                                        <SelectItem value="Negative">គ្មានប្រតិកម្ម / Negative</SelectItem>
                                                        <SelectItem value="Unknown">មិនដឹង / Unknown</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                                                    កាលបរិច្ឆេទតេស្តអេដស៍ចុងក្រោយ / Last HIV Test Date
                                                </Label>
                                                <Input
                                                    type="date"
                                                    value={formData.lastHivTestDate || ''}
                                                    onChange={(e) => updateFormData('lastHivTestDate', e.target.value)}
                                                    className="h-12"
                                                />
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                    <Checkbox
                                                        checked={formData.currentlyOnPrep === 'true'}
                                                        onCheckedChange={(checked) => updateFormData('currentlyOnPrep', checked ? 'true' : 'false')}
                                                    />
                                                    <Label className="text-sm font-medium text-gray-700 cursor-pointer flex-1">
                                                        កំពុងប្រើប្រាស់ប្រីព / Currently on PrEP
                                                    </Label>
                                                </div>
                                                
                                                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                    <Checkbox
                                                        checked={formData.everOnPrep === 'true'}
                                                        onCheckedChange={(checked) => updateFormData('everOnPrep', checked ? 'true' : 'false')}
                                                    />
                                                    <Label className="text-sm font-medium text-gray-700 cursor-pointer flex-1">
                                                        ធ្លាប់ប្រើប្រាស់ប្រីព / Ever on PrEP
                                                    </Label>
                                                </div>
                                            </div>
                                        </div>

                                        <Card className="bg-gray-50 border-gray-200">
                                            <CardContent className="p-6">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                    <FiDroplet className="w-5 h-5 mr-2" />
                                                    សង្ខេបការធ្វើតេស្តអេដស៍ / HIV Testing Summary
                                                </h3>
                                                <div className="space-y-3 text-sm text-gray-700">
                                                    <div className="flex justify-between items-center">
                                                        <span>តេស្ត៦ខែចុងក្រោយ / Test Past 6 Months:</span>
                                                        <span className="font-medium">{formData.hivTestPast6Months || 'មិនទាន់បញ្ជាក់ / Not specified'}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span>លទ្ធផលតេស្ត / Test Result:</span>
                                                        <span className={`font-medium ${
                                                            formData.hivTestResult === 'Positive' ? 'text-gray-800' : 
                                                            formData.hivTestResult === 'Negative' ? 'text-gray-600' : 'text-gray-500'
                                                        }`}>
                                                            {formData.hivTestResult || 'មិនទាន់បញ្ជាក់ / Not specified'}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span>កាលបរិច្ឆេទតេស្តចុងក្រោយ / Last Test Date:</span>
                                                        <span className="font-medium">{formData.lastHivTestDate || 'មិនទាន់បញ្ជាក់ / Not specified'}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span>កំពុងប្រើប្រាស់ប្រីព / Currently on PrEP:</span>
                                                        <span className="font-medium">{formData.currentlyOnPrep === 'true' ? 'បាទ / Yes' : 'ទេ / No'}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span>ធ្លាប់ប្រើប្រាស់ប្រីព / Ever on PrEP:</span>
                                                        <span className="font-medium">{formData.everOnPrep === 'true' ? 'បាទ / Yes' : 'ទេ / No'}</span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between px-6 py-6 mt-8 border-t border-gray-200 bg-gray-50">
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">កំណត់ត្រា ID / Record ID:</span> {record.id}
                    </div>
                    <div className="flex items-center space-x-4">
                        <Button
                            onClick={onClose}
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-2 px-6 py-2 h-10"
                        >
                            <FiX className="w-4 h-4" />
                            <span>បោះបង់ / Cancel</span>
                        </Button>

                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            size="sm"
                            className="bg-gray-800 hover:bg-gray-900 text-white flex items-center space-x-2 px-6 py-2 h-10"
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
            </div>
        </Modal>
    )
}

export default SimpleEditModal
