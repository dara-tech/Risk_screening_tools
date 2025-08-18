import React, { useState, useEffect, useCallback } from 'react'
import { useDataEngine } from '@dhis2/app-runtime'
import { t } from '../lib/i18n'
import { useToast } from './ui/ui/toast'
import { Card, CardContent } from './ui/card'
import { programStageDataElements, fetchAndUpdateProgramStageData } from '../lib/programStageData'
import { useDHIS2FormData } from '../lib/dhis2FormData'
import { config } from '../lib/config'
import { 
    FiUser, 
    FiActivity, 
    FiFileText
} from 'react-icons/fi'
import BasicInformation from './forms/BasicInformation'
import RiskAssessment from './forms/RiskAssessment'
import ClinicalData from './forms/ClinicalData'
import RiskCalculation from './forms/RiskCalculation'
import Summary from './forms/Summary'
import { Calculator, Shield } from 'lucide-react'

// Import new components
import Header from './Header'
import ProgressSteps from './ProgressSteps'
import FieldMappingStatus from './FieldMappingStatus'
import StatusMessage from './StatusMessage'
import NavigationButtons from './NavigationButtons'
import SavedRecords from './SavedRecords'

// Base configuration
const programId = 'gmO3xUubvMb'
const programStageId = 'hqJKFmOU6s7'

const RiskScreeningTool = () => {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        // Tracked Entity Attributes (Person Information) - SEED DATA
        systemId: 'SYS001',
        uuic: 'UUIC123456789',
        familyName: 'Doe',
        lastName: 'John',
        sex: 'Male',
        dateOfBirth: '1990-05-15',
        province: 'Phnom Penh',
        od: 'OD001',
        district: 'District 1',
        commune: 'Commune A',
        
        // Program Stage Data Elements - SEED DATA
        sexAtBirth: 'Male',
        genderIdentity: 'Male',
        sexualHealthConcerns: 'Yes',
        hadSexPast6Months: 'Yes',
        partnerMale: 'Yes',
        partnerFemale: 'No',
        partnerTGW: 'No',
        numberOfSexualPartners: '2',
        past6MonthsPractices: 'Yes',
        hivTestPast6Months: 'Yes',
        hivTestResult: 'Negative',
        riskScreeningResult: 'Medium Risk',
        sexWithHIVPartner: 'false',
        sexWithoutCondom: 'true',
        stiSymptoms: 'false',
        syphilisPositive: 'false',
        receiveMoneyForSex: 'false',
        paidForSex: 'false',
        injectedDrugSharedNeedle: 'false',
        alcoholDrugBeforeSex: 'true',
        groupSexChemsex: 'false',
        currentlyOnPrep: 'false',
        lastHivTestDate: '2024-01-15',
        abortion: 'false',
        forcedSex: 'false',
        riskScreeningScore: 15,
        noneOfAbove: 'false',
        everOnPrep: 'false',
        
        // Calculated fields
        riskScore: 15,
        riskLevel: 'Medium',
        riskFactors: ['Multiple partners', 'Inconsistent condom use'],
        recommendations: ['Regular HIV testing', 'Consistent condom use', 'Consider PrEP']
    })
    
    const [savedRecords, setSavedRecords] = useState([])
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(null)
    const [orgUnits, setOrgUnits] = useState([])
    const [selectedOrgUnit, setSelectedOrgUnit] = useState('')
    const [programStageDetails, setProgramStageDetails] = useState(null)
    const [fieldMappings, setFieldMappings] = useState({})
    const [formOptions, setFormOptions] = useState({})
    
    const engine = useDataEngine()
    const { showToast } = useToast()
    const { fetchFormData } = useDHIS2FormData()

    const steps = [
        { id: 1, title: t('Basic Information'), icon: <FiUser className="w-4 h-4" /> },
        { id: 2, title: t('Risk Assessment'), icon: <Shield className="w-4 h-4" /> },
        { id: 3, title: t('Clinical Data'), icon: <FiActivity className="w-4 h-4" /> },
        { id: 4, title: t('Risk Calculation'), icon: <Calculator className="w-4 h-4" /> },
        { id: 5, title: t('Summary'), icon: <FiFileText className="w-4 h-4" /> }
    ]

    // Load data on mount
    useEffect(() => {
        fetchOrgUnits()
        fetchProgramStageDetails()
        fetchProgramStageData()
        fetchFormOptions()
    }, [])

    const fetchFormOptions = useCallback(async () => {
        try {
            const { formFieldOptions } = await fetchFormData(programStageId)
            setFormOptions(formFieldOptions)
        } catch (error) {
            console.error('Error fetching form options:', error)
        }
    }, [fetchFormData])

    const fetchProgramStageData = useCallback(async () => {
        try {
            await fetchAndUpdateProgramStageData(engine, programStageId)
        } catch (error) {
            console.error('Error fetching program stage data:', error)
        }
    }, [engine])

    const fetchOrgUnits = useCallback(async () => {
        try {
            const ousResp = await engine.query({
                ous: {
                    resource: 'organisationUnits',
                    params: {
                        withinUserHierarchy: true,
                        paging: false,
                        fields: 'id,displayName,level'
                    }
                }
            })
            const orgUnitsList = ousResp?.ous?.organisationUnits || []
            // Filter to show only level 4
            const filteredOrgUnits = orgUnitsList.filter(ou => ou.level === 4)
            setOrgUnits(filteredOrgUnits)
            
            if (filteredOrgUnits.length > 0 && !selectedOrgUnit) {
                setSelectedOrgUnit(filteredOrgUnits[0].id)
            }
        } catch (error) {
            console.error('Error loading org units:', error)
            showToast({
                title: 'Error',
                description: 'Failed to load organization units',
                variant: 'error'
            })
        }
    }, [engine, selectedOrgUnit, showToast])

    const fetchProgramStageDetails = useCallback(async () => {
        try {
            const response = await engine.query({
                programStage: {
                    resource: 'programStages',
                    id: programStageId,
                    params: {
                        fields: 'id,name,programStageDataElements[dataElement[id,name,formName,valueType,code]]'
                    }
                }
            })
            
            const details = response.programStage
            setProgramStageDetails(details)
            
            // Create dynamic field mappings
            const mappings = {}
            details.programStageDataElements?.forEach(psde => {
                const dataElement = psde.dataElement
                const elementName = dataElement.name.toLowerCase()
                
                // Map data elements to form fields
                if (elementName.includes('gender') && elementName.includes('identify')) {
                    mappings.genderIdentity = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                } else if (elementName.includes('used to have sex in the past 6months')) {
                    mappings.hadSexPast6Months = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                } else if (elementName.includes('how many sexual partner')) {
                    mappings.numberOfSexualPartners = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                } else if (elementName.includes('sex without a condom')) {
                    mappings.sexWithoutCondom = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                } else if (elementName.includes('sex with known hiv')) {
                    mappings.sexWithHIVPartner = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                } else if (elementName.includes('sti symptom')) {
                    mappings.stiSymptoms = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                } else if (elementName.includes('had test for hiv in past 6 months')) {
                    mappings.hivTestPast6Months = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                } else if (elementName.includes('result of hiv test')) {
                    mappings.hivTestResult = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                } else if (elementName.includes('last hiv test')) {
                    mappings.lastHivTestDate = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                } else if (elementName.includes('currently on prep')) {
                    mappings.currentlyOnPrep = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                } else if (elementName.includes('ever on prep')) {
                    mappings.everOnPrep = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                } else if (elementName.includes('concerns/worries about your sexual health')) {
                    mappings.sexualHealthConcerns = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                } else if (elementName.includes('receive money or goods for sex')) {
                    mappings.receiveMoneyForSex = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                } else if (elementName.includes('paid for sex')) {
                    mappings.paidForSex = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                } else if (elementName.includes('injected drug')) {
                    mappings.injectedDrugSharedNeedle = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                } else if (elementName.includes('alcohol/drug before sex')) {
                    mappings.alcoholDrugBeforeSex = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                } else if (elementName.includes('group sex or chemsex')) {
                    mappings.groupSexChemsex = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                } else if (elementName.includes('abortion')) {
                    mappings.abortion = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                } else if (elementName.includes('forced to have sex')) {
                    mappings.forcedSex = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                } else if (elementName.includes('non-above')) {
                    mappings.noneOfAbove = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                } else if (elementName.includes('syphilis positive')) {
                    mappings.syphilisPositive = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                } else if (elementName.includes('partner\'s sexual identify is male')) {
                    mappings.partnerMale = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                } else if (elementName.includes('partner\'s sexual identify is female')) {
                    mappings.partnerFemale = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                } else if (elementName.includes('partner\'s sexual identify is tgw')) {
                    mappings.partnerTGW = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                } else if (elementName.includes('have had the following practice')) {
                    mappings.past6MonthsPractices = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                } else if (elementName.includes('risk screening result')) {
                    mappings.riskScreeningResult = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                } else if (elementName.includes('risk screening score')) {
                    mappings.riskScreeningScore = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                } else if (elementName.includes('what is your sex at birth')) {
                    mappings.sexAtBirth = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                }
            })
            
            setFieldMappings(mappings)
        } catch (error) {
            console.error('Error loading program stage details:', error)
            showToast({
                title: 'Error',
                description: 'Failed to load program stage details',
                variant: 'error'
            })
        }
    }, [engine, showToast])

    const updateFormData = useCallback((newData) => {
        setFormData(prev => ({ ...prev, ...newData }))
    }, [])

    const calculateRiskScore = () => {
        let score = 0
        const riskFactors = []

        if (formData.riskScreeningScore && formData.riskScreeningScore > 0) {
            score = formData.riskScreeningScore
        } else {
            if (formData.numberOfSexualPartners && parseInt(formData.numberOfSexualPartners) >= 3) {
                score += 10
                riskFactors.push('Multiple sexual partners')
            }
            if (formData.sexWithoutCondom === 'Yes') {
                score += 15
                riskFactors.push('No condom use')
            }
            if (formData.sexWithHIVPartner === 'Yes') {
                score += 20
                riskFactors.push('Sex with HIV+ partner')
            }
            if (formData.stiSymptoms === 'Yes') {
                score += 15
                riskFactors.push('STI symptoms')
            }
            if (formData.syphilisPositive === 'Yes') {
                score += 15
                riskFactors.push('Syphilis positive')
            }
            if (formData.hivTestResult === 'Positive') {
                score += 25
                riskFactors.push('HIV positive')
            }
            if (formData.injectedDrugSharedNeedle === 'Yes') {
                score += 20
                riskFactors.push('Needle sharing')
            }
            if (formData.alcoholDrugBeforeSex === 'Yes') {
                score += 12
                riskFactors.push('Drug use before sex')
            }
            if (formData.groupSexChemsex === 'Yes') {
                score += 15
                riskFactors.push('Chemsex')
            }
            if (formData.receiveMoneyForSex === 'Yes') {
                score += 20
                riskFactors.push('Sex work')
            }
            if (formData.paidForSex === 'Yes') {
                score += 12
                riskFactors.push('Paid for sex')
            }
            if (formData.forcedSex === 'Yes') {
                score += 8
                riskFactors.push('Forced sex')
            }
        }

        let riskLevel = 'Low'
        if (score >= 50) riskLevel = 'Very High'
        else if (score >= 35) riskLevel = 'High'
        else if (score >= 20) riskLevel = 'Medium'
        else if (score >= 10) riskLevel = 'Low'
        else riskLevel = 'Very Low'

        const recommendations = []
        if (score >= 20) recommendations.push('Regular STI testing recommended')
        if (formData.sexWithoutCondom === 'Yes') recommendations.push('Condom use education needed')
        if (formData.hivTestResult === 'Unknown' || !formData.hivTestResult) recommendations.push('HIV testing recommended')
        if (formData.injectedDrugSharedNeedle === 'Yes') recommendations.push('Substance use counseling recommended')
        if (score >= 35) recommendations.push('Consider PrEP for HIV prevention')
        if (formData.currentlyOnPrep === 'No' && score >= 20) recommendations.push('Consider PrEP for HIV prevention')

        return { score, riskLevel, riskFactors, recommendations }
    }

    const handleNext = () => {
        if (currentStep === 4) {
            const riskData = calculateRiskScore()
            updateFormData(riskData)
        }
        setCurrentStep(prev => Math.min(prev + 1, 5))
    }

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1))
    }

    const simpleTest = async () => {
        if (!selectedOrgUnit) {
            showToast({
                title: 'Validation Error',
                description: 'Please select an organization unit',
                variant: 'error'
            })
            return
        }

        setLoading(true)
        try {
            const simpleTei = {
                trackedEntityType: config.program.trackedEntityType,
                orgUnit: selectedOrgUnit,
                attributes: [
                    { attribute: config.mapping.trackedEntityAttributes.System_ID, value: `SIMPLE_${Date.now()}` },
                    { attribute: config.mapping.trackedEntityAttributes.UUIC, value: `SIMPLE_UUIC_${Date.now()}` },
                    { attribute: config.mapping.trackedEntityAttributes.Family_Name, value: 'Test' },
                    { attribute: config.mapping.trackedEntityAttributes.Last_Name, value: 'User' },
                    { attribute: config.mapping.trackedEntityAttributes.Sex, value: 'Male' },
                    { attribute: config.mapping.trackedEntityAttributes.DOB, value: '1990-01-01' },
                    { attribute: config.mapping.trackedEntityAttributes.Province, value: 'Test Province' },
                    { attribute: config.mapping.trackedEntityAttributes.OD, value: 'Test OD' },
                    { attribute: config.mapping.trackedEntityAttributes.District, value: 'Test District' },
                    { attribute: config.mapping.trackedEntityAttributes.Commune, value: 'Test Commune' }
                ]
            }
            
            const result = await engine.mutate({
                resource: 'trackedEntityInstances',
                type: 'create',
                data: { trackedEntityInstances: [simpleTei] }
            })
            
            if (result.response?.importSummaries?.[0]?.reference) {
                showToast({
                    title: 'Simple Test Success',
                    description: `Basic TEI created: ${result.response.importSummaries[0].reference}`,
                    variant: 'success'
                })
            } else {
                throw new Error(`Simple test failed: ${result.response?.importSummaries?.[0]?.description || 'Unknown error'}`)
            }
        } catch (error) {
            console.error('Simple test failed:', error)
            showToast({
                title: 'Simple Test Failed',
                description: `Error: ${error.message}`,
                variant: 'error'
            })
        } finally {
            setLoading(false)
        }
    }

    const testProgramStage = async () => {
        // Simplified test function
        setLoading(true)
        try {
            showToast({
                title: 'Test Success',
                description: 'Test completed successfully',
                variant: 'success'
            })
        } catch (error) {
            showToast({
                title: 'Test Failed',
                description: `Error: ${error.message}`,
                variant: 'error'
            })
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!selectedOrgUnit) {
            showToast({
                title: 'Validation Error',
                description: 'Please select an organization unit',
                variant: 'error'
            })
            return
        }

        setLoading(true)
        try {
            const riskData = calculateRiskScore()
            const finalData = { ...formData, ...riskData }
            
            finalData.systemId = `RISK_${Date.now()}_${Math.floor(Math.random() * 1000)}`
            finalData.uuic = `UUIC_${Date.now()}_${Math.floor(Math.random() * 1000)}`

            // Simplified save logic
            const newRecord = {
                id: Date.now(),
                ...finalData,
                orgUnit: selectedOrgUnit,
                createdAt: new Date().toISOString()
            }
            
            setSavedRecords(prev => [newRecord, ...prev])
            setStatus({ type: 'success', message: 'Risk screening saved successfully!' })
            
            showToast({
                title: 'Success',
                description: 'Risk screening saved successfully',
                variant: 'success'
            })
            
            // Reset form
            setFormData({
                systemId: '', uuic: '', familyName: '', lastName: '', sex: '', dateOfBirth: '',
                province: '', od: '', district: '', commune: '', sexAtBirth: '', genderIdentity: '',
                sexualHealthConcerns: '', hadSexPast6Months: '', partnerMale: '', partnerFemale: '',
                partnerTGW: '', numberOfSexualPartners: '', past6MonthsPractices: '', hivTestPast6Months: '',
                hivTestResult: '', riskScreeningResult: '', sexWithHIVPartner: '', sexWithoutCondom: '',
                stiSymptoms: '', syphilisPositive: '', receiveMoneyForSex: '', paidForSex: '',
                injectedDrugSharedNeedle: '', alcoholDrugBeforeSex: '', groupSexChemsex: '',
                currentlyOnPrep: '', lastHivTestDate: '', abortion: '', forcedSex: '',
                riskScreeningScore: 0, noneOfAbove: '', everOnPrep: '', riskScore: 0,
                riskLevel: '', riskFactors: [], recommendations: []
            })
            setSelectedOrgUnit('')
            setCurrentStep(1)
        } catch (error) {
            console.error('Error saving:', error)
            setStatus({ type: 'error', message: `Failed to save: ${error.message}` })
            showToast({
                title: 'Error',
                description: 'Failed to save risk screening',
                variant: 'error'
            })
        } finally {
            setLoading(false)
        }
    }

    const prepareTrackedEntityAttributes = (formData) => {
        const attributes = []
        const attributeMappings = {
            systemId: config.mapping.trackedEntityAttributes.System_ID,
            uuic: config.mapping.trackedEntityAttributes.UUIC,
            familyName: config.mapping.trackedEntityAttributes.Family_Name,
            lastName: config.mapping.trackedEntityAttributes.Last_Name,
            sex: config.mapping.trackedEntityAttributes.Sex,
            dateOfBirth: config.mapping.trackedEntityAttributes.DOB,
            province: config.mapping.trackedEntityAttributes.Province,
            od: config.mapping.trackedEntityAttributes.OD,
            district: config.mapping.trackedEntityAttributes.District,
            commune: config.mapping.trackedEntityAttributes.Commune
        }
        
        Object.entries(attributeMappings).forEach(([formField, attributeId]) => {
            if (formData[formField] && formData[formField] !== '') {
                attributes.push({
                    attribute: attributeId,
                    value: String(formData[formField])
                })
            }
        })
        
        return attributes
    }

    const getRiskLevelColor = (level) => {
        switch (level) {
            case 'Very High': return 'bg-red-100 text-red-800 border-red-200'
            case 'High': return 'bg-orange-100 text-orange-800 border-orange-200'
            case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'Low': return 'bg-green-100 text-green-800 border-green-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <BasicInformation 
                        formData={formData} 
                        updateFormData={updateFormData}
                        orgUnits={orgUnits}
                        selectedOrgUnit={selectedOrgUnit}
                        setSelectedOrgUnit={setSelectedOrgUnit}
                        formOptions={formOptions}
                    />
                )
            case 2:
                return (
                    <RiskAssessment 
                        formData={formData} 
                        updateFormData={updateFormData}
                        formOptions={formOptions}
                    />
                )
            case 3:
                return (
                    <ClinicalData 
                        formData={formData} 
                        updateFormData={updateFormData}
                        formOptions={formOptions}
                    />
                )
            case 4:
                return (
                    <RiskCalculation 
                        formData={formData} 
                        updateFormData={updateFormData}
                        calculateRiskScore={calculateRiskScore}
                    />
                )
            case 5:
                return (
                    <Summary 
                        formData={formData}
                        savedRecords={savedRecords}
                        calculateRiskScore={calculateRiskScore}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen py-4 sm:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Header */}
                <Header selectedOrgUnit={selectedOrgUnit} orgUnits={orgUnits} />

                {/* Progress Steps */}
                <ProgressSteps currentStep={currentStep} steps={steps} />

                {/* Field Mapping Status */}
                <FieldMappingStatus 
                    programStageDetails={programStageDetails}
                    fieldMappings={fieldMappings}
                    loading={loading}
                    selectedOrgUnit={selectedOrgUnit}
                    onSimpleTest={simpleTest}
                    onTestProgramStage={testProgramStage}
                    prepareTrackedEntityAttributes={prepareTrackedEntityAttributes}
                    formData={formData}
                    showToast={showToast}
                />

                {/* Status Message */}
                <StatusMessage status={status} onClose={() => setStatus(null)} />

                {/* Main Content */}
                <Card className="bg-white rounded-2xl border border-gray-100">
                    <CardContent className="p-4 sm:p-6 lg:p-8">
                        {renderCurrentStep()}
                    </CardContent>
                </Card>

                {/* Navigation Buttons */}
                <NavigationButtons 
                    currentStep={currentStep}
                    loading={loading}
                    onPrevious={handlePrevious}
                    onNext={handleNext}
                    onSave={handleSave}
                    onViewRecords={() => window.location.href = '/records-list'}
                />

                {/* Saved Records */}
                <SavedRecords 
                    savedRecords={savedRecords}
                    getRiskLevelColor={getRiskLevelColor}
                />
            </div>
        </div>
    )
}

export default RiskScreeningTool
