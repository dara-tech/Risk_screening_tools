import React, { useState, useEffect, useCallback } from 'react'
import { useDataEngine } from '@dhis2/app-runtime'
import { useLocation } from 'react-router-dom'
import { t } from '../lib/i18n'
import { useToast } from './ui/ui/toast'
import { Card, CardContent } from './ui/card'
import {  fetchAndUpdateProgramStageData } from '../lib/programStageData'
import { useDHIS2FormData } from '../lib/dhis2FormData'
import { config } from '../lib/config'

import BasicInformation from './forms/BasicInformation'
import RiskAssessment from './forms/RiskAssessment'
import ClinicalData from './forms/ClinicalData'
import Summary from './forms/Summary'
import { Shield, Target, User } from 'lucide-react'

// Import new components
import Header from './Header'
import FieldMappingStatus from './FieldMappingStatus'
import StatusMessage from './StatusMessage'
import SavedRecords from './SavedRecords'

// Base configuration
const programId = 'gmO3xUubvMb'
const programStageId = 'hqJKFmOU6s7'

const RiskScreeningTool = () => {
    const location = useLocation()
    const [mode, setMode] = useState('create') // 'create', 'edit', 'view'
    const [originalRecordId, setOriginalRecordId] = useState(null)
    const [hasLoadedEditData, setHasLoadedEditData] = useState(false) // Track if we've loaded edit data
    const [formData, setFormData] = useState({
        // Tracked Entity Attributes (Person Information)
        systemId: '',
        uuic: '',
        familyName: '',
        lastName: '',
        sex: '',
        dateOfBirth: '',
        province: '',
        od: '',
        district: '',
        commune: '',
        donor: '',
        ngo: '',
        
        // Program Stage Data Elements
        sexAtBirth: '',
        genderIdentity: '',
        sexualHealthConcerns: '',
        hadSexPast6Months: '',
        partnerMale: '',
        partnerFemale: '',
        partnerTGW: '',
        numberOfSexualPartners: '',
        past6MonthsPractices: '',
        hivTestPast6Months: '',
        hivTestResult: '',
        riskScreeningResult: '',
        sexWithHIVPartner: '',
        sexWithoutCondom: '',
        stiSymptoms: '',
        syphilisPositive: '',
        receiveMoneyForSex: '',
        paidForSex: '',
        injectedDrugSharedNeedle: '',
        alcoholDrugBeforeSex: '',
        groupSexChemsex: '',
        currentlyOnPrep: '',
        lastHivTestDate: '',
        abortion: '',
        forcedSex: '',
        riskScreeningScore: 0,
        noneOfAbove: '',
        everOnPrep: '',
        
        // Calculated fields
        riskScore: 0,
        riskLevel: '',
        riskFactors: [],
        recommendations: []
    })
    
    const [savedRecords, setSavedRecords] = useState([])
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(null)
    const [orgUnits, setOrgUnits] = useState([])
    const [selectedOrgUnit, setSelectedOrgUnit] = useState('')
    const [programStageDetails, setProgramStageDetails] = useState(null)
    const [fieldMappings, setFieldMappings] = useState({})
    const [formOptions, setFormOptions] = useState({})
    const [kmLabels, setKmLabels] = useState({})
    const [dataElementOptionsById, setDataElementOptionsById] = useState({})
    const [programTeAttributes, setProgramTeAttributes] = useState({})
    const [kmTeaLabels, setKmTeaLabels] = useState({})
    
    const engine = useDataEngine()
    const { showToast } = useToast()
    const { fetchFormData } = useDHIS2FormData()



    // Load data on mount
    useEffect(() => {
        fetchOrgUnits()
        fetchProgramStageDetails()
        fetchProgramStageData()
        fetchFormOptions()
        fetchProgramTeiAttributes()
    }, [])

    // Handle edit/view mode from navigation - only run once when data is available
    useEffect(() => {
        // Only load data if we haven't already loaded it and we have navigation state
        if (!hasLoadedEditData && location.state?.mode && location.state?.recordData) {
            const { mode: navMode, recordData } = location.state
            
            console.log('[EDIT MODE] Loading record data:', recordData)
            console.log('[EDIT MODE] everOnPrep value:', recordData.everOnPrep)
            console.log('[EDIT MODE] currentlyOnPrep value:', recordData.currentlyOnPrep)
            
            setMode(navMode)
            setOriginalRecordId(recordData.id)
            setHasLoadedEditData(true) // Mark as loaded to prevent re-loading
            
            // Populate form with record data - ensure all fields are properly mapped
            const populatedData = {
                // Tracked Entity Attributes
                systemId: recordData.systemId || '',
                uuic: recordData.uuic || '',
                familyName: recordData.familyName || '',
                lastName: recordData.lastName || '',
                sex: recordData.sex || '',
                dateOfBirth: recordData.dateOfBirth || '',
                province: recordData.province || '',
                od: recordData.od || '',
                district: recordData.district || '',
                commune: recordData.commune || '',
                donor: recordData.donor || '',
                ngo: recordData.ngo || '',
                
                // Program Stage Data Elements - ensure proper value mapping
                sexAtBirth: recordData.sexAtBirth || '',
                genderIdentity: recordData.genderIdentity || '',
                sexualHealthConcerns: recordData.sexualHealthConcerns || '',
                hadSexPast6Months: recordData.hadSexPast6Months || '',
                partnerMale: recordData.partnerMale || '',
                partnerFemale: recordData.partnerFemale || '',
                partnerTGW: recordData.partnerTGW || '',
                numberOfSexualPartners: recordData.numberOfSexualPartners || '',
                past6MonthsPractices: recordData.past6MonthsPractices || '',
                hivTestPast6Months: recordData.hivTestPast6Months || '',
                hivTestResult: recordData.hivTestResult || '',
                riskScreeningResult: recordData.riskScreeningResult || '',
                sexWithHIVPartner: recordData.sexWithHIVPartner || '',
                sexWithoutCondom: recordData.sexWithoutCondom || '',
                stiSymptoms: recordData.stiSymptoms || '',
                syphilisPositive: recordData.syphilisPositive || '',
                receiveMoneyForSex: recordData.receiveMoneyForSex || '',
                paidForSex: recordData.paidForSex || '',
                injectedDrugSharedNeedle: recordData.injectedDrugSharedNeedle || '',
                alcoholDrugBeforeSex: recordData.alcoholDrugBeforeSex || '',
                groupSexChemsex: recordData.groupSexChemsex || '',
                currentlyOnPrep: recordData.currentlyOnPrep || '',
                lastHivTestDate: recordData.lastHivTestDate || '',
                abortion: recordData.abortion || '',
                forcedSex: recordData.forcedSex || '',
                riskScreeningScore: recordData.riskScreeningScore || 0,
                noneOfAbove: recordData.noneOfAbove || '',
                // Normalize everOnPrep value to match Select options
                everOnPrep: (() => {
                    const val = recordData.everOnPrep || ''
                    // Map numeric codes to text
                    if (val === '10' || val === 10) return 'Yes'
                    if (val === '11' || val === 11) return 'No'
                    if (val === '12' || val === 12) return 'Never Know'
                    // Ensure it matches one of the Select options
                    if (val === 'Yes' || val === 'No' || val === 'Never Know') return val
                    // If it's a different value, try to normalize
                    const lowerVal = String(val).toLowerCase()
                    if (lowerVal === 'yes' || lowerVal === 'true') return 'Yes'
                    if (lowerVal === 'no' || lowerVal === 'false') return 'No'
                    return val // Return as-is if can't normalize
                })(),
                
                // Calculated fields
                riskScore: recordData.riskScore || 0,
                riskLevel: recordData.riskLevel || '',
                riskFactors: recordData.riskFactors || [],
                recommendations: recordData.recommendations || []
            }
            
            console.log('[EDIT MODE] Setting form data:', populatedData)
            console.log('[EDIT MODE] everOnPrep in populatedData:', populatedData.everOnPrep)
            console.log('[EDIT MODE] currentlyOnPrep in populatedData:', populatedData.currentlyOnPrep)
            setFormData(populatedData)
            
            // Set organization unit if available
            if (recordData.orgUnit) {
                setSelectedOrgUnit(recordData.orgUnit)
            }
            
            // Show appropriate message
            if (navMode === 'edit') {
                showToast({
                    title: 'Edit Mode',
                    description: `Editing record: ${recordData.systemId || recordData.id}`,
                    variant: 'default'
                })
            } else if (navMode === 'view') {
                showToast({
                    title: 'View Mode',
                    description: `Viewing record: ${recordData.systemId || recordData.id}`,
                    variant: 'default'
                })
            }
            
            // Clean up navigation state after loading
            setTimeout(() => {
                window.history.replaceState({}, document.title)
            }, 100)
        }
    }, [location.state, hasLoadedEditData, showToast])

    const fetchFormOptions = useCallback(async () => {
        try {
            const { formFieldOptions, dataElementOptions } = await fetchFormData(programStageId)
            setFormOptions(formFieldOptions)
            setDataElementOptionsById(dataElementOptions || {})
        } catch (error) {
            console.error('Error fetching form options:', error)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // Only run once on mount

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
                        fields: 'id,name,programStageDataElements[dataElement[id,name,formName,valueType,code,translations[property,locale,value]]]'
                    }
                }
            })
            
            const details = response.programStage
            setProgramStageDetails(details)
            
            // Create dynamic field mappings
            const mappings = {}
            const labels = {}
            details.programStageDataElements?.forEach(psde => {
                const dataElement = psde.dataElement
                const elementName = dataElement.name.toLowerCase()
                const kmName = (dataElement.translations || []).find(tr => tr.locale === 'km' && tr.property === 'NAME')?.value || dataElement.name
                
                // Map data elements to form fields
                if (elementName.includes('gender') && elementName.includes('identify')) {
                    mappings.genderIdentity = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                    labels.genderIdentity = kmName
                } else if (elementName.includes('used to have sex in the past 6months') || (elementName.includes('have sex') && elementName.includes('past 6months')) || elementName.includes('had sex') && elementName.includes('past 6months')) {
                    mappings.hadSexPast6Months = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                    labels.hadSexPast6Months = kmName
                } else if (elementName.includes('how many sexual partner')) {
                    mappings.numberOfSexualPartners = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                    labels.numberOfSexualPartners = kmName
                } else if (elementName.includes('sex without a condom')) {
                    mappings.sexWithoutCondom = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                    labels.sexWithoutCondom = kmName
                } else if (elementName.includes('sex with known hiv')) {
                    mappings.sexWithHIVPartner = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                    labels.sexWithHIVPartner = kmName
                } else if (elementName.includes('sti symptom')) {
                    mappings.stiSymptoms = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                    labels.stiSymptoms = kmName
                } else if (elementName.includes('had test for hiv in past 6 months')) {
                    mappings.hivTestPast6Months = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                    labels.hivTestPast6Months = kmName
                } else if (elementName.includes('result of hiv test')) {
                    mappings.hivTestResult = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                    labels.hivTestResult = kmName
                } else if (elementName.includes('last hiv test')) {
                    mappings.lastHivTestDate = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                    labels.lastHivTestDate = kmName
                } else if (elementName.includes('currently on prep')) {
                    mappings.currentlyOnPrep = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                    labels.currentlyOnPrep = kmName
                } else if (elementName.includes('ever on prep')) {
                    mappings.everOnPrep = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                    labels.everOnPrep = kmName
                } else if (elementName.includes('concerns/worries about your sexual health')) {
                    mappings.sexualHealthConcerns = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                    labels.sexualHealthConcerns = kmName
                } else if (elementName.includes('receive money or goods for sex')) {
                    mappings.receiveMoneyForSex = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                    labels.receiveMoneyForSex = kmName
                } else if (elementName.includes('paid for sex')) {
                    mappings.paidForSex = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                    labels.paidForSex = kmName
                } else if (elementName.includes('injected drug')) {
                    mappings.injectedDrugSharedNeedle = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                    labels.injectedDrugSharedNeedle = kmName
                } else if (elementName.includes('alcohol/drug before sex')) {
                    mappings.alcoholDrugBeforeSex = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                    labels.alcoholDrugBeforeSex = kmName
                } else if (elementName.includes('group sex or chemsex')) {
                    mappings.groupSexChemsex = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                    labels.groupSexChemsex = kmName
                } else if (elementName.includes('abortion')) {
                    mappings.abortion = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                    labels.abortion = kmName
                } else if (elementName.includes('forced to have sex')) {
                    mappings.forcedSex = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                    labels.forcedSex = kmName
                } else if (elementName.includes('non-above')) {
                    mappings.noneOfAbove = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                    labels.noneOfAbove = kmName
                } else if (elementName.includes('syphilis positive')) {
                    mappings.syphilisPositive = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                    labels.syphilisPositive = kmName
                } else if (elementName.includes('partner\'s sexual identify is male')) {
                    mappings.partnerMale = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                    labels.partnerMale = kmName
                } else if (elementName.includes('partner\'s sexual identify is female')) {
                    mappings.partnerFemale = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                    labels.partnerFemale = kmName
                } else if (elementName.includes('partner\'s sexual identify is tgw')) {
                    mappings.partnerTGW = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                    labels.partnerTGW = kmName
                } else if (elementName.includes('have had the following practice')) {
                    mappings.past6MonthsPractices = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                    labels.past6MonthsPractices = kmName
                } else if (elementName.includes('risk screening result')) {
                    mappings.riskScreeningResult = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                    labels.riskScreeningResult = kmName
                } else if (elementName.includes('risk screening score')) {
                    mappings.riskScreeningScore = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                    labels.riskScreeningScore = kmName
                } else if (elementName.includes('what is your sex at birth')) {
                    mappings.sexAtBirth = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                    labels.sexAtBirth = kmName
                } else if (elementName.includes('ever on prep') || elementName.includes('ever used prep') || elementName.includes('ever used pr') || elementName.includes('ever on pr')) {
                    mappings.everOnPrep = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                    labels.everOnPrep = kmName
                } else if (elementName.includes('currently on prep') || elementName.includes('currently using prep') || elementName.includes('currently using pr') || elementName.includes('currently on pr')) {
                    mappings.currentlyOnPrep = { id: dataElement.id, name: dataElement.name, valueType: dataElement.valueType }
                    labels.currentlyOnPrep = kmName
                }
            })
            
            // Debug logging for field mappings
            if (process.env.NODE_ENV === 'development') {
                console.log('[DEBUG] Field mappings created:', mappings)
                console.log('[DEBUG] PrEP mappings:', {
                    everOnPrep: mappings.everOnPrep,
                    currentlyOnPrep: mappings.currentlyOnPrep
                })
            }
            
            setFieldMappings(mappings)
            setKmLabels(labels)
        } catch (error) {
            console.error('Error loading program stage details:', error)
            showToast({
                title: 'Error',
                description: 'Failed to load program stage details',
                variant: 'error'
            })
        }
    }, [engine, showToast])

    // Load TEI attributes from Program (not just trackedEntityType)
    const fetchProgramTeiAttributes = useCallback(async () => {
        try {
            const resp = await engine.query({
                program: {
                    resource: 'programs',
                    id: programId,
                    params: {
                        fields: 'id,name,programTrackedEntityAttributes[mandatory,trackedEntityAttribute[id,name,code,valueType,unique,translations[property,locale,value]]]'
                    }
                }
            })

            const pteas = resp?.program?.programTrackedEntityAttributes || []
            const dynamicMap = {}
            const teaLabels = {}

            pteas.forEach(ptea => {
                const tea = ptea.trackedEntityAttribute
                if (!tea?.id || !tea?.name) return
                const kmName = (tea.translations || []).find(tr => tr.locale === 'km' && tr.property === 'NAME')?.value || tea.name
                const n = (tea.name || '').toLowerCase()

                if (n.includes('system') && n.includes('id')) { dynamicMap.systemId = tea.id; teaLabels.systemId = kmName }
                else if (n.includes('uuic')) { dynamicMap.uuic = tea.id; teaLabels.uuic = kmName }
                else if ((n.includes('family') && n.includes('name')) || n.includes('fname') || n.includes('family_name') || n.includes('first name')) { dynamicMap.familyName = tea.id; teaLabels.familyName = kmName }
                else if ((n.includes('last') && n.includes('name')) || n.includes('lname') || n.includes('last_name')) { dynamicMap.lastName = kmName ? tea.id : tea.id; teaLabels.lastName = kmName }
                else if (n === 'sex' || (n.includes('sex') && !n.includes('birth'))) { dynamicMap.sex = tea.id; teaLabels.sex = kmName }
                else if (n.includes('date of birth') || n === 'dob') { dynamicMap.dateOfBirth = tea.id; teaLabels.dateOfBirth = kmName }
                else if (n.includes('province')) { dynamicMap.province = tea.id; teaLabels.province = kmName }
                else if (n === 'od' || n.includes('operational district')) { dynamicMap.od = tea.id; teaLabels.od = kmName }
                else if (n.includes('district')) { dynamicMap.district = tea.id; teaLabels.district = kmName }
                else if (n.includes('commune')) { dynamicMap.commune = tea.id; teaLabels.commune = kmName }
                else if (n.includes('donor')) { dynamicMap.donor = tea.id; teaLabels.donor = kmName }
                else if (n.includes('ngo')) { dynamicMap.ngo = tea.id; teaLabels.ngo = kmName }
            })

            setProgramTeAttributes(dynamicMap)
            setKmTeaLabels(teaLabels)
            console.log('[PROGRAM TE ATTR] Loaded from program:', dynamicMap)
        } catch (error) {
            console.error('Failed to load program TEI attributes:', error)
        }
    }, [engine])

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



    // Basic advanced validation for critical fields and logical constraints
    const validateForm = useCallback(() => {
        const errors = []

        // Required TEA fields
        if (!formData.familyName || !formData.familyName.trim()) errors.push('Family name is required')
        if (!formData.lastName || !formData.lastName.trim()) errors.push('Last name is required')
        if (!formData.sex) errors.push('Sex is required')
        if (!formData.dateOfBirth) errors.push('Date of birth is required')
        if (!selectedOrgUnit) errors.push('Organization unit is required')

        // Required location
        if (!formData.province) errors.push('Province is required')
        if (!formData.district) errors.push('District is required')
        if (!formData.commune) errors.push('Commune is required')

        // Date of birth constraints
        if (formData.dateOfBirth) {
            const dob = new Date(formData.dateOfBirth)
            const today = new Date()
            if (dob > today) errors.push('Date of birth cannot be in the future')
            const age = today.getFullYear() - dob.getFullYear() - (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0)
            if (age < 10) errors.push('Age must be at least 10 years')
            if (age > 100) errors.push('Age seems invalid (>100)')
        }

        // Option validations
        const yesNo = new Set(['Yes', 'No', 'true', 'false'])
        if (formData.hadSexPast6Months && !yesNo.has(String(formData.hadSexPast6Months))) errors.push('Had sex in past 6 months must be Yes or No')
        if (formData.hivTestPast6Months && !yesNo.has(String(formData.hivTestPast6Months))) errors.push('HIV test (6 months) must be Yes or No')

        // Number of partners if provided
        if (formData.numberOfSexualPartners && !['0','1','2','3','4','5','6+'].includes(String(formData.numberOfSexualPartners))) {
            errors.push('Number of sexual partners has an invalid value')
        }

        return errors
    }, [formData, selectedOrgUnit])

    const simpleTest = async () => {
        // Ensure we have an org unit (fallback to first available level-4 OU)
        const orgUnitId = selectedOrgUnit || orgUnits[0]?.id
        if (!orgUnitId) {
            showToast({
                title: 'Validation Error',
                description: 'No organization unit available. Please select one first.',
                variant: 'error'
            })
            return
        }

        setLoading(true)
        try {
            const simpleTei = {
                trackedEntityType: config.program.trackedEntityType,
                orgUnit: orgUnitId,
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

            console.log('Simple test TEI payload:', simpleTei)

            const result = await engine.mutate({
                resource: 'trackedEntityInstances',
                type: 'create',
                data: { trackedEntityInstances: [simpleTei] }
            })

            console.log('Simple test TEI response:', result)

            const summary = result?.response?.importSummaries?.[0]
            if (summary?.reference) {
                showToast({
                    title: 'Simple Test Success',
                    description: `TEI created: ${summary.reference}`,
                    variant: 'success'
                })
                return
            }

            const conflicts = summary?.conflicts?.map(c => `${c.object}: ${c.value}`).join('; ') || ''
            const description = summary?.description || 'Unknown error'
            const details = [description, conflicts].filter(Boolean).join(' | ')
            throw new Error(details)
        } catch (error) {
            // Try to surface full server response if available
            const serverData = error?.response?.data
            const serverSummaries = serverData?.importSummaries
            let details = error.message
            if (serverSummaries && serverSummaries.length > 0) {
                const s = serverSummaries[0]
                const conflicts = s?.conflicts?.map(c => `${c.object}: ${c.value}`).join('; ') || ''
                const description = s?.description || ''
                const composed = [description, conflicts].filter(Boolean).join(' | ')
                if (composed) details = composed
                console.error('Simple test server import summary:', s)
            }
            console.error('Simple test failed:', error)
            showToast({ title: 'Simple Test Failed', description: details, variant: 'error' })
        } finally {
            setLoading(false)
        }
    }

    const testProgramStage = async () => {
        // Test basic TEI creation
        setLoading(true)
        try {
            console.log('🧪 [TEST] Testing basic TEI creation...')
            
            const orgUnitId = selectedOrgUnit || orgUnits[0]?.id
            if (!orgUnitId) {
                throw new Error('No organization unit selected')
            }
            
            const testTeiPayload = {
                trackedEntityInstances: [{
                    trackedEntityType: config.program.trackedEntityType,
                    orgUnit: orgUnitId,
                    attributes: [
                        {
                            attribute: config.mapping.trackedEntityAttributes.System_ID,
                            value: `TEST_${Date.now()}`
                        },
                        {
                            attribute: config.mapping.trackedEntityAttributes.UUIC,
                            value: `TEST_UUIC_${Date.now()}`
                        }
                    ]
                }]
            }
            
            console.log('🧪 [TEST] TEI payload:', testTeiPayload)
            
            const teiRes = await engine.mutate({
                resource: 'trackedEntityInstances',
                type: 'create',
                data: testTeiPayload
            })
            
            console.log('🧪 [TEST] TEI response:', teiRes)
            
            if (teiRes?.response?.status === 'SUCCESS') {
                showToast({
                    title: 'Test Success',
                    description: 'Basic TEI creation works!',
                    variant: 'success'
                })
            } else {
                console.error('🧪 [TEST] TEI creation failed:', teiRes)
                throw new Error('TEI creation failed - check console for details')
            }
        } catch (error) {
            console.error('🧪 [TEST] Error:', error)
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
        // Validate before saving
        const errors = validateForm()
        if (errors.length > 0) {
            showToast({
                title: 'Validation errors',
                description: errors.join('\n'),
                variant: 'error'
            })
            setStatus({ type: 'error', message: `Validation failed: ${errors.length} issue(s)` })
            return
        }
        const orgUnitId = selectedOrgUnit || orgUnits[0]?.id
        if (!orgUnitId) {
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
            
            // Check if we're in edit mode
            if (mode === 'edit' && originalRecordId) {
                // UPDATE EXISTING RECORD
                console.log('[UPDATE] Editing existing event:', originalRecordId)
                
                // Get the record data from location state to access trackedEntityInstance
                const trackedEntityInstanceId = location.state?.recordData?.trackedEntityInstance
                
                // 1) Update Tracked Entity Attributes if we have the TEI ID
                if (trackedEntityInstanceId) {
                    try {
                        const teiAttributes = prepareTrackedEntityAttributes(finalData)
                        const teiUpdatePayload = {
                            trackedEntityInstance: trackedEntityInstanceId,
                            trackedEntityType: config.program.trackedEntityType,
                            orgUnit: orgUnitId,
                            attributes: teiAttributes
                        }
                        
                        console.log('[UPDATE] TEI payload:', teiUpdatePayload)
                        await engine.mutate({
                            resource: `trackedEntityInstances/${trackedEntityInstanceId}`,
                            type: 'update',
                            data: teiUpdatePayload
                        })
                        console.log('[UPDATE] TEI updated successfully')
                    } catch (error) {
                        console.error('[UPDATE] TEI update error:', error)
                        // Continue with event update even if TEI update fails
                    }
                }
                
                // 2) Prepare data values for event update
                if (!fieldMappings || Object.keys(fieldMappings).length === 0) {
                    throw new Error('Field mappings not loaded. Please refresh the page and try again.')
                }
                
                const dataValues = []
                Object.entries(fieldMappings).forEach(([formField, mapping]) => {
                    const deId = mapping.id
                    const raw = finalData[formField]
                    if (raw === undefined || raw === '') return
                    
                    // Debug logging for PrEP fields
                    if (formField === 'everOnPrep' || formField === 'currentlyOnPrep') {
                        console.log(`[DEBUG] Processing ${formField}:`, { raw, deId, valueType: mapping.valueType })
                    }

                    // Try to normalize value based on element type
                    const options = dataElementOptionsById[deId] || []
                    let value = raw

                    // TRUE_ONLY: include only if truthy
                    if ((mapping.valueType === 'TRUE_ONLY' || mapping.valueType === 'BOOLEAN') && typeof raw === 'string') {
                        const v = raw.toLowerCase()
                        if (mapping.valueType === 'TRUE_ONLY') {
                            if (v === 'yes' || v === 'true') value = 'true'; else return
                        } else {
                            value = (v === 'yes' || v === 'true') ? 'true' : 'false'
                        }
                    }

                    // Option sets: map label to option code if options present
                    if (options.length > 0) {
                        const lower = String(raw).toLowerCase()
                        const match = options.find(o => o.code?.toLowerCase() === lower || o.name?.toLowerCase() === lower)
                        if (match?.code) value = match.code
                    }

                    dataValues.push({ dataElement: deId, value: String(value) })
                    
                    // Debug logging for PrEP fields final values
                    if (formField === 'everOnPrep' || formField === 'currentlyOnPrep') {
                        console.log(`[DEBUG] Final value for ${formField}:`, String(value))
                    }
                })
                
                // 3) Update event
                const updatePayload = {
                    event: originalRecordId,
                    program: config.program.id,
                    programStage: config.program.stageId,
                    orgUnit: orgUnitId,
                    eventDate: finalData.eventDate || new Date().toISOString().split('T')[0],
                    status: 'COMPLETED',
                    dataValues
                }
                
                console.log('[UPDATE] Event payload:', updatePayload)
                const updateRes = await engine.mutate({
                    resource: `events/${originalRecordId}`,
                    type: 'update',
                    data: updatePayload
                })
                
                console.log('[UPDATE] Event response:', updateRes)
                
                showToast({ 
                    title: 'Success', 
                    description: `Record updated successfully!`,
                    variant: 'success' 
                })
                setStatus({ type: 'success', message: 'Record updated in DHIS2' })
                
                // Reset mode and record ID
                setMode('create')
                setOriginalRecordId(null)
                setHasLoadedEditData(false) // Reset so we can load another record for editing
                
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
                
                return
            }
            
            // CREATE NEW RECORD
            // Generate unique IDs (only if not already set)
            if (!finalData.systemId) {
                finalData.systemId = `RISK_${Date.now()}_${Math.floor(Math.random() * 10000)}`
            }
            // Only auto-generate UUIC if not already calculated by the form
            if (!finalData.uuic || finalData.uuic === '') {
                finalData.uuic = `UUIC_${Date.now()}_${Math.floor(Math.random() * 10000)}`
            }

            console.log('[SAVE] Org unit for DHIS2:', orgUnitId)
            console.log('[SAVE] Final data:', finalData)

            // 1) Create TEI
            const teiAttributes = prepareTrackedEntityAttributes(finalData)
            const teiPayload = {
                trackedEntityType: config.program.trackedEntityType,
                orgUnit: orgUnitId,
                attributes: teiAttributes
            }
            console.log('[SAVE] TEI payload:', teiPayload)
            const teiRes = await engine.mutate({
                resource: 'trackedEntityInstances',
                type: 'create',
                data: { trackedEntityInstances: [teiPayload] }
            })
            console.log('[SAVE] TEI response:', teiRes)
            const teiSummary = teiRes?.response?.importSummaries?.[0]
            const teiId = teiSummary?.reference
            if (!teiId) {
                const conflicts = teiSummary?.conflicts?.map(c => `${c.object}: ${c.value}`).join('; ')
                const description = teiSummary?.description || 'Failed to create TEI'
                throw new Error([description, conflicts].filter(Boolean).join(' | '))
            }

            // 2) Enroll
            const enrollment = {
                trackedEntityInstance: teiId,
                program: config.program.id,
                orgUnit: orgUnitId,
                enrollmentDate: new Date().toISOString().split('T')[0],
                incidentDate: new Date().toISOString().split('T')[0]
            }
            console.log('[SAVE] Enrollment payload:', enrollment)
            const enrRes = await engine.mutate({
                resource: 'enrollments',
                type: 'create',
                data: { enrollments: [enrollment] }
            })
            console.log('[SAVE] Enrollment response:', enrRes)
            const enrSummary = enrRes?.response?.importSummaries?.[0]
            const enrollmentId = enrSummary?.reference
            if (!enrollmentId) {
                const conflicts = enrSummary?.conflicts?.map(c => `${c.object}: ${c.value}`).join('; ')
                const description = enrSummary?.description || 'Failed to create enrollment'
                throw new Error([description, conflicts].filter(Boolean).join(' | '))
            }

            // 3) Event
            if (!fieldMappings || Object.keys(fieldMappings).length === 0) {
                throw new Error('Field mappings not loaded. Please refresh the page and try again.')
            }
            const dataValues = []
            Object.entries(fieldMappings).forEach(([formField, mapping]) => {
                const deId = mapping.id
                const raw = finalData[formField]
                if (raw === undefined || raw === '') return
                
                // Debug logging for PrEP fields
                if (formField === 'everOnPrep' || formField === 'currentlyOnPrep') {
                    console.log(`[DEBUG] Processing ${formField}:`, { raw, deId, valueType: mapping.valueType })
                }

                // Try to normalize value based on element type
                const options = dataElementOptionsById[deId] || []
                let value = raw

                // TRUE_ONLY: include only if truthy
                if ((mapping.valueType === 'TRUE_ONLY' || mapping.valueType === 'BOOLEAN') && typeof raw === 'string') {
                    const v = raw.toLowerCase()
                    if (mapping.valueType === 'TRUE_ONLY') {
                        if (v === 'yes' || v === 'true') value = 'true'; else return
                    } else {
                        value = (v === 'yes' || v === 'true') ? 'true' : 'false'
                    }
                }

                // Option sets: map label to option code if options present
                if (options.length > 0) {
                    const lower = String(raw).toLowerCase()
                    const match = options.find(o => o.code?.toLowerCase() === lower || o.name?.toLowerCase() === lower)
                    if (match?.code) value = match.code
                }

                dataValues.push({ dataElement: deId, value: String(value) })
                
                // Debug logging for PrEP fields final values
                if (formField === 'everOnPrep' || formField === 'currentlyOnPrep') {
                    console.log(`[DEBUG] Final value for ${formField}:`, String(value))
                }
            })
            const eventDate = new Date().toISOString().split('T')[0]
            const eventPayload = {
                trackedEntityInstance: teiId,
                program: config.program.id,
                programStage: config.program.stageId,
                orgUnit: orgUnitId,
                enrollment: enrollmentId,
                eventDate,
                status: 'COMPLETED',
                dataValues
            }
            console.log('[SAVE] Event payload:', eventPayload)
            const evtRes = await engine.mutate({
                resource: 'events',
                type: 'create',
                data: { events: [eventPayload] }
            })
            console.log('[SAVE] Event response:', evtRes)
            const evtSummary = evtRes?.response?.importSummaries?.[0]
            const eventId = evtSummary?.reference
            if (!eventId) {
                const conflicts = evtSummary?.conflicts?.map(c => `${c.object}: ${c.value}`).join('; ')
                const description = evtSummary?.description || 'Failed to create event'
                throw new Error([description, conflicts].filter(Boolean).join(' | '))
            }

            // Save to local list for UI
            const newRecord = {
                id: Date.now(),
                teiId,
                enrollmentId,
                eventId,
                ...finalData,
                orgUnit: orgUnitId,
                eventDate,
                createdAt: new Date().toISOString()
            }
            setSavedRecords(prev => [newRecord, ...prev])
            setStatus({ type: 'success', message: 'Saved to DHIS2' })
            showToast({ title: 'Success', description: `Saved! TEI: ${teiId}`, variant: 'success' })

            // Reset form (keep org unit)
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

        } catch (error) {
            console.error('[SAVE] Failed:', error)
            setStatus({ type: 'error', message: error.message })
            showToast({ title: 'Error', description: error.message, variant: 'error' })
        } finally {
            setLoading(false)
        }
    }

    const prepareTrackedEntityAttributes = (formData) => {
        const attributes = []
        // Prefer program-based TE attribute IDs; fall back to config mapping if not available
        const configMappings = {
            systemId: config.mapping.trackedEntityAttributes.System_ID,
            uuic: config.mapping.trackedEntityAttributes.UUIC,
            donor: config.mapping.trackedEntityAttributes.Donor,
            ngo: config.mapping.trackedEntityAttributes.NGO,
            familyName: config.mapping.trackedEntityAttributes.Family_Name,
            lastName: config.mapping.trackedEntityAttributes.Last_Name,
            sex: config.mapping.trackedEntityAttributes.Sex,
            dateOfBirth: config.mapping.trackedEntityAttributes.DOB,
            province: config.mapping.trackedEntityAttributes.Province,
            od: config.mapping.trackedEntityAttributes.OD,
            district: config.mapping.trackedEntityAttributes.District,
            commune: config.mapping.trackedEntityAttributes.Commune
        }
        
        // Merge program attributes with config fallbacks
        const attributeMappings = { ...configMappings, ...programTeAttributes }

        Object.entries(attributeMappings).forEach(([formField, attributeId]) => {
            if (attributeId && formData[formField] && formData[formField] !== '') {
                attributes.push({ attribute: attributeId, value: String(formData[formField]) })
            }
        })
        
        // Ensure critical fields are always included
        if (formData.familyName && formData.familyName.trim() !== '' && !attributes.find(a => a.attribute === config.mapping.trackedEntityAttributes.Family_Name)) {
            attributes.push({ attribute: config.mapping.trackedEntityAttributes.Family_Name, value: String(formData.familyName) })
        }
        
        if (formData.lastName && formData.lastName.trim() !== '' && !attributes.find(a => a.attribute === config.mapping.trackedEntityAttributes.Last_Name)) {
            attributes.push({ attribute: config.mapping.trackedEntityAttributes.Last_Name, value: String(formData.lastName) })
        }

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

    // Helper function to display Yes/No values properly
    const displayYesNo = (value) => {
        if (value === 'Yes' || value === 'true' || value === true) return 'បាទ/ចាស'
        if (value === 'No' || value === 'false' || value === false) return 'ទេ'
        if (value === 'Never Know') return 'មិនដឹង' // Special case for everOnPrep Never Know
        if (value === '10' || value === 10) return 'បាទ/ចាស' // Numeric code for Yes
        if (value === '11' || value === 11) return 'ទេ' // Numeric code for No
        if (value === '12' || value === 12) return 'មិនដឹង' // Numeric code for Never Know
        return value || 'មិនបានបញ្ជាក់'
    }

    const renderAllSections = () => {
        const isViewMode = mode === 'view'
        const isEditMode = mode === 'edit'
        const labelsCombined = { ...kmLabels, ...kmTeaLabels }
        
        return (
            <div className="space-y-8">
                {/* Section 1: Basic Information (Questions 1-2) */}
                <div className="relative">
                    <div className="absolute -left-4 top-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold z-10">
                        1
                    </div>
                    <BasicInformation 
                        formData={formData} 
                        updateFormData={updateFormData}
                        orgUnits={orgUnits}
                        selectedOrgUnit={selectedOrgUnit}
                        setSelectedOrgUnit={setSelectedOrgUnit}
                        formOptions={formOptions}
                        mode={mode}
                        isViewMode={isViewMode}
                        isEditMode={isEditMode}
                        showToast={showToast}
                        hideHeaders
                        kmLabels={labelsCombined}
                    />
                </div>

                {/* Section 2: Sexual Health Concerns (Question 3) */}
                <div className="relative">
                    <div className="absolute -left-4 top-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold z-10">
                        2
                    </div>
                    <RiskAssessment 
                        formData={formData} 
                        updateFormData={updateFormData}
                        formOptions={formOptions}
                        mode={mode}
                        isViewMode={isViewMode}
                        isEditMode={isEditMode}
                        hideHeaders
                        kmLabels={kmLabels}
                    />
                </div>

                {/* Section 3: Clinical Data */}
                <div className="relative">
                    <div className="absolute -left-4 top-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold z-10">
                        3
                    </div>
                    <ClinicalData 
                        formData={formData} 
                        updateFormData={updateFormData}
                        formOptions={formOptions}
                        mode={mode}
                        isViewMode={isViewMode}
                        isEditMode={isEditMode}
                        hideHeaders
                        kmLabels={kmLabels}
                    />
                </div>


                {/* Section 5: Summary */}
                {/* <div className="relative">
                    <div className="absolute -left-4 top-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold z-10">
                        5
                    </div>
                    <Summary 
                        formData={formData}
                        savedRecords={savedRecords}
                        calculateRiskScore={calculateRiskScore}
                        mode={mode}
                        isViewMode={isViewMode}
                        isEditMode={isEditMode}
                        hideHeaders
                    />
                </div> */}
            </div>
        )
    }

    return (
        <div className="min-h-screen py-4 sm:py-8">
            <div className=" mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Header */}
                <Header selectedOrgUnit={selectedOrgUnit} orgUnits={orgUnits} mode={mode} />

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

                {/* Main Content - Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Input Form */}
                    <div className="space-y-8">
                        {renderAllSections()}
                    </div>

                    {/* Right Column - Live Preview */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 sticky top-4">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Live Preview</h3>
                                <p className="text-gray-600">Real-time preview following form sections</p>
                            </div>
                            
                            {/* Section 1: Basic Information Preview */}
                            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                                <div className="flex items-center space-x-2 mb-3">
                                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                                    <h4 className="font-semibold text-blue-900">ព័ត៌មានមូលដ្ឋាន / Basic Information</h4>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-blue-700 font-medium">ឈ្មោះ / Name:</span>
                                        <span className="text-gray-900">{formData.familyName} {formData.lastName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-blue-700 font-medium">ភេទ / Sex:</span>
                                        <span className="text-gray-900">{formData.sex || 'មិនបានបញ្ជាក់'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-blue-700 font-medium">អាយុ / Age:</span>
                                        <span className="text-gray-900">{formData.age || 'មិនបានគណនា'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-blue-700 font-medium">លេខកូដ UUIC:</span>
                                        <span className="text-gray-900 font-mono text-xs">{formData.uuic || 'មិនបានបង្កើត'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-blue-700 font-medium">ទីតាំង / Location:</span>
                                        <span className="text-gray-900">{formData.province}, {formData.district}, {formData.commune}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-blue-700 font-medium">១. តើភេទពីកំណើតជាអ្វី? / Sex at Birth:</span>
                                        <span className="text-gray-900">{formData.sexAtBirth || 'មិនបានបញ្ជាក់'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-blue-700 font-medium">២.តើអ្នកកំណត់អត្តសញ្ញាណភេទជាអ្វី? / Gender Identity:</span>
                                        <span className="text-gray-900">{formData.genderIdentity || 'មិនបានបញ្ជាក់'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Sexual Health Concerns Preview */}
                            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200">
                                <div className="flex items-center space-x-2 mb-3">
                                    <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                                    <h4 className="font-semibold text-red-900">ធ្លាប់ព្រួយបារម្ភសុខភាព / Sexual Health Concerns</h4>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-red-700">៣. Have you ever concerns/worries about your sexual health?</span>
                                        <span className="text-gray-900">{displayYesNo(formData.sexualHealthConcerns)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Clinical Data Preview */}
                            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                                <div className="flex items-center space-x-2 mb-3">
                                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                                    <h4 className="font-semibold text-green-900">ធ្លាប់រួមភេទ / Clinical Data</h4>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-green-700">៤. Have you had sex(Oral, Anal or vaginal) in the past 6months?</span>
                                        <span className="text-gray-900">{displayYesNo(formData.hadSexPast6Months)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-green-700">៤.១ Your partner's sexual identify is Male</span>
                                        <span className="text-gray-900">{displayYesNo(formData.partnerMale)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-green-700">៤.២ Your partner's sexual identify is Female</span>
                                        <span className="text-gray-900">{displayYesNo(formData.partnerFemale)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-green-700">៤.៣ Your partner's sexual identify is TGW</span>
                                        <span className="text-gray-900">{displayYesNo(formData.partnerTGW)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-green-700">៥. How many sexual partner do you have?</span>
                                        <span className="text-gray-900">{formData.numberOfSexualPartners || 'មិនបានបញ្ជាក់'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-green-700">៦.៤ Sex without a condom</span>
                                        <span className="text-gray-900">{displayYesNo(formData.sexWithoutCondom)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-green-700">៦.៥ Have a STI symptom</span>
                                        <span className="text-gray-900">{displayYesNo(formData.stiSymptoms)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-green-700">៦.៣ Sex with known HIV+ partner(s)</span>
                                        <span className="text-gray-900">{displayYesNo(formData.sexWithHIVPartner)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-green-700">៦.១ Receive money or goods for sex</span>
                                        <span className="text-gray-900">{displayYesNo(formData.receiveMoneyForSex)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-green-700">៦.២ Paid for sex</span>
                                        <span className="text-gray-900">{displayYesNo(formData.paidForSex)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-green-700">៦.៦ Abortion</span>
                                        <span className="text-gray-900">{displayYesNo(formData.abortion)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-green-700">៦.៧ Alcohol/drug before sex</span>
                                        <span className="text-gray-900">{displayYesNo(formData.alcoholDrugBeforeSex)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-green-700">៦.៨ Joint high fun or group sex or chemsex</span>
                                        <span className="text-gray-900">{displayYesNo(formData.groupSexChemsex)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-green-700">៦.៩ Injected drug/shared needle</span>
                                        <span className="text-gray-900">{displayYesNo(formData.injectedDrugSharedNeedle)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-green-700">៦.១០ Non-Above</span>
                                        <span className="text-gray-900">{displayYesNo(formData.noneOfAbove)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-green-700">៧. Have you ever forced to have sex against your wishes in past 6 months</span>
                                        <span className="text-gray-900">{displayYesNo(formData.forcedSex)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-green-700">៩. តើអ្នកធ្លាប់ប្រើប្រាស់ប្រីពដែរឬទេ? / Have you ever used PrEP?</span>
                                        <span className="text-gray-900">{displayYesNo(formData.everOnPrep)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-green-700">១០. កំពុងប្រើប្រាស់ប្រីព / Currently using PrEP</span>
                                        <span className="text-gray-900">{displayYesNo(formData.currentlyOnPrep)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-green-700">១១. When did your last HIV test?</span>
                                        <span className="text-gray-900">{formData.lastHivTestDate || 'មិនបានបញ្ជាក់'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-green-700">១២. Result of HIV test if you can tell?</span>
                                        <span className="text-gray-900">
                                            {formData.hivTestResult === 'Positive' ? 'Positive' : 
                                             formData.hivTestResult === 'Negative' ? 'Negative' : 
                                             formData.hivTestResult === 'Unknown' ? 'Unknown' : 
                                             formData.hivTestResult ? formData.hivTestResult : 'មិនបានបញ្ជាក់'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Risk Assessment Results */}
                            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                                <h4 className="font-semibold text-purple-900 mb-3 flex items-center space-x-2">
                                    <Target className="w-4 h-4" />
                                    <span>លទ្ធផលវាយតម្លៃកម្រិតប្រឈម / Risk Assessment Results</span>
                                </h4>
                                <div className="text-center mb-4">
                                    <div className="text-4xl font-bold text-purple-900 mb-2">
                                        {(() => {
                                            const riskData = calculateRiskScore()
                                            return riskData.score || 0
                                        })()}
                                    </div>
                                    <div className="text-sm text-purple-700 mb-3">ពិន្ទុវាយតម្លៃកម្រិតប្រឈម / Risk Score</div>
                                    <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                                        (() => {
                                            const riskData = calculateRiskScore()
                                            switch (riskData.riskLevel) {
                                                case 'Very High': return 'bg-red-100 text-red-800'
                                                case 'High': return 'bg-orange-100 text-orange-800'
                                                case 'Medium': return 'bg-yellow-100 text-yellow-800'
                                                case 'Low': return 'bg-green-100 text-green-800'
                                                default: return 'bg-gray-100 text-gray-800'
                                            }
                                        })()
                                    }`}>
                                        {(() => {
                                            const riskData = calculateRiskScore()
                                            return riskData.riskLevel || 'មិនបានគណនា'
                                        })()}
                                    </div>
                                </div>
                                
                                {/* Risk Factors Summary */}
                                <div className="mb-4">
                                    <h5 className="font-medium text-purple-900 mb-2">កត្តាហានិភ័យដែលបានកំណត់ / Risk Factors Identified:</h5>
                                    <div className="text-sm">
                                        {(() => {
                                            const riskData = calculateRiskScore()
                                            return riskData.riskFactors && riskData.riskFactors.length > 0 ? (
                                                <ul className="list-disc ml-5 space-y-1">
                                                    {riskData.riskFactors.map((factor, index) => (
                                                        <li key={index} className="text-purple-800">{factor}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-purple-700">មិនមានកត្តាហានិភ័យជាក់លាក់ត្រូវបានកំណត់</p>
                                            )
                                        })()}
                                    </div>
                                </div>

                                {/* Recommendations */}
                                <div>
                                    <h5 className="font-medium text-purple-900 mb-2">អនុសាសន៍ / Recommendations:</h5>
                                    <div className="text-sm">
                                        {(() => {
                                            const riskData = calculateRiskScore()
                                            return riskData.recommendations && riskData.recommendations.length > 0 ? (
                                                <ul className="list-disc ml-5 space-y-1">
                                                    {riskData.recommendations.map((rec, index) => (
                                                        <li key={index} className="text-purple-800">{rec}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-purple-700">បំពេញការវាយតម្លៃដើម្បីទទួលបានអនុសាសន៍</p>
                                            )
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors flex items-center space-x-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <span>Save Risk Screening Record</span>
                            </>
                        )}
                    </button>
                    
                    <button
                        onClick={() => window.location.href = '/records-list'}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                    >
                        View Records
                    </button>
                </div>

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
