import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useDataEngine } from '@dhis2/app-runtime'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useToast } from './ui/ui/toast'
import { programStageDataElements, fetchAndUpdateProgramStageData } from '../lib/programStageData'
import { importRecordToDHIS2, FORM_FIELD_LABELS_KH, calculateRiskScoreFromData } from '../lib/dhis2FormData'
import { getDHIS2ServerURL } from '../lib/utils'
import config from '../lib/config'
import { Search, RefreshCw, Save, Zap } from 'lucide-react'

const QuestionForm = () => {
    const engine = useDataEngine()
    const { showToast } = useToast()
    const [dataElements, setDataElements] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [formData, setFormData] = useState({})
    const [optionSets, setOptionSets] = useState({})
    const [optionSetOptions, setOptionSetOptions] = useState({})
    const [provinceOptions, setProvinceOptions] = useState([])
    const [orgUnits, setOrgUnits] = useState([])
    const [selectedOrgUnit, setSelectedOrgUnit] = useState('')
    const [nextSystemId, setNextSystemId] = useState(null)
    const [nextUUIC, setNextUUIC] = useState(null)
    const [age, setAge] = useState('')
    const [testDataCounter, setTestDataCounter] = useState(1)
    const [teiData, setTeiData] = useState({
        systemId: '',
        uuic: '',
        donor: '',
        ngo: '',
        familyName: '',
        lastName: '',
        sex: '',
        dateOfBirth: '',
        province: '',
        od: '',
        district: '',
        commune: ''
    })

    useEffect(() => {
        loadDataElements()
        fetchOrgUnits()
        fetchProvinceOptionSet()
    }, [])

    // Fetch province option set if it exists
    const fetchProvinceOptionSet = useCallback(async () => {
        try {
            const provinceAttrId = config.mapping.trackedEntityAttributes.Province
            if (!provinceAttrId) {
                console.log('[QuestionForm] No province attribute ID configured')
                return
            }
            
            const response = await engine.query({
                trackedEntityAttribute: {
                    resource: `trackedEntityAttributes/${provinceAttrId}`,
                    params: {
                        fields: 'id,name,valueType,optionSet[id,name,options[id,name,code]]'
                    }
                }
            })
            
            const attr = response.trackedEntityAttribute
            if (attr?.optionSet?.options && attr.optionSet.options.length > 0) {
                setProvinceOptions(attr.optionSet.options.map(opt => ({
                    id: opt.id,
                    name: opt.name,
                    code: opt.code || opt.name
                })))
            }
        } catch (error) {
            // 404 is OK - attribute might not exist or not have option set
            const is404 = error.message?.includes('404') || 
                         error.details?.httpStatusCode === 404 ||
                         error.response?.status === 404
            
            if (is404) {
                console.log('[QuestionForm] Province attribute not found (404) - using text input')
            } else {
                console.warn('[QuestionForm] Province attribute may not have an option set:', error)
            }
        }
    }, [engine])

    useEffect(() => {
        if (selectedOrgUnit) {
            fetchNextIds()
        }
    }, [selectedOrgUnit])

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
                variant: 'destructive'
            })
        }
    }, [engine, selectedOrgUnit, showToast])

    const fetchNextIds = useCallback(async () => {
        if (!selectedOrgUnit) return

        try {
            const systemIdAttr = config.mapping.trackedEntityAttributes.System_ID
            const uuicAttr = config.mapping.trackedEntityAttributes.UUIC
            const programId = config.program.id

            // Fetch existing TEIs to find the highest System ID and UUIC
            const teisResp = await engine.query({
                teis: {
                    resource: 'trackedEntityInstances',
                    params: {
                        program: programId,
                        ou: selectedOrgUnit,
                        fields: `attributes[attribute,value]`,
                        pageSize: 1000,
                        order: 'created:desc'
                    }
                }
            })

            const teis = teisResp?.teis?.trackedEntityInstances || []
            
            // Extract System IDs and UUICs
            let maxSystemIdNum = 0
            let maxUUICNum = 0

            teis.forEach(tei => {
                const attrs = tei.attributes || []
                
                // Find System ID
                const systemIdAttrObj = attrs.find(a => a.attribute === systemIdAttr)
                if (systemIdAttrObj?.value) {
                    const sysId = systemIdAttrObj.value
                    // Extract number from formats like SYS1234567, SYS_1234567, etc.
                    const match = sysId.match(/SYS[_\s]*(\d+)/i)
                    if (match) {
                        const num = parseInt(match[1], 10)
                        if (num > maxSystemIdNum) maxSystemIdNum = num
                    }
                }

                // Find UUIC
                const uuicAttrObj = attrs.find(a => a.attribute === uuicAttr)
                if (uuicAttrObj?.value) {
                    const uuic = uuicAttrObj.value
                    // Extract number from formats like កយសត1234567, UUIC1234567, etc.
                    const match = uuic.match(/(?:កយសត|UUIC)[_\s]*(\d+)/i)
                    if (match) {
                        const num = parseInt(match[1], 10)
                        if (num > maxUUICNum) maxUUICNum = num
                    }
                }
            })

            // Generate next IDs
            const nextSysId = maxSystemIdNum > 0 ? maxSystemIdNum + 1 : 1000000
            const nextUUICNum = maxUUICNum > 0 ? maxUUICNum + 1 : 1150689

            setNextSystemId(`SYS${nextSysId}`)
            setNextUUIC(`កយសត${nextUUICNum}`)

            // Auto-fill System ID if empty (UUIC is auto-generated from form fields, so don't override)
            setTeiData(prev => {
                if (!prev.systemId) {
                    return { ...prev, systemId: `SYS${nextSysId}` }
                }
                return prev
            })
        } catch (error) {
            console.error('Error fetching next IDs:', error)
            // Fallback to default values
            const fallbackSysId = `SYS${Date.now()}`
            const fallbackUUIC = `កយសត${1150689 + Math.floor(Math.random() * 1000)}`
            setNextSystemId(fallbackSysId)
            setNextUUIC(fallbackUUIC)
            
            // Auto-fill System ID fallback if empty (UUIC is auto-generated from form fields)
            setTeiData(prev => {
                if (!prev.systemId) {
                    return { ...prev, systemId: fallbackSysId }
                }
                return prev
            })
        }
    }, [selectedOrgUnit, engine])

    const loadDataElements = async () => {
        setLoading(true)
        try {
            // Fetch from DHIS2 using the correct program stage ID from config
            const updatedElements = await fetchAndUpdateProgramStageData(engine, config.program.stageId)
            
            // Create reverse mapping: dataElementId -> formName from config
            const formNameMap = {}
            Object.entries(config.mapping.programStageDataElements).forEach(([formName, dataElementId]) => {
                if (dataElementId && dataElementId.match(/^[a-zA-Z0-9]{11}$/)) {
                    formNameMap[dataElementId] = formName
                }
            })
            console.log('[QuestionForm] FormName mapping from config:', Object.keys(formNameMap).length, 'mappings')
            
            // Use updated elements or fallback to static data
            const elements = updatedElements.length > 0 
                ? updatedElements.map(item => {
                    // Find Khmer translation (locale: 'km', property: 'NAME')
                    const kmTranslation = (item.translations || item.dataElement?.translations || [])
                        .find(tr => tr.locale === 'km' && tr.property === 'NAME')
                    
                    const elementId = item.dataElement?.id || item.id
                    // Get formName from API response, or fallback to config mapping
                    const formName = item.dataElement?.formName || item.formName || formNameMap[elementId]
                    
                    return {
                        id: elementId,
                        name: item.dataElement?.name || item.name,
                        shortName: item.dataElement?.shortName || item.shortName,
                        valueType: item.dataElement?.valueType || item.valueType,
                        formName: formName, // Use API formName or config mapping
                        code: item.dataElement?.code || item.code,
                        translation: kmTranslation?.value || item.translations?.[0]?.value || item.dataElement?.translation
                    }
                })
                : programStageDataElements.map(item => ({
                    id: item.id,
                    name: item.name,
                    valueType: item.valueType,
                    formName: item.formName || formNameMap[item.id], // Use static formName or config mapping
                    translation: item.translations?.find(tr => tr.locale === 'km' && tr.property === 'NAME')?.value || item.translations?.[0]?.value
                }))

            setDataElements(elements)
            
            // Log elements without formName
            const elementsWithoutFormName = elements.filter(el => el.id && !el.formName)
            if (elementsWithoutFormName.length > 0) {
                console.warn('[QuestionForm] ⚠️ Elements without formName:', elementsWithoutFormName.map(el => ({
                    id: el.id,
                    name: el.name,
                    valueType: el.valueType
                })))
            }
            console.log('[QuestionForm] Elements with formName:', elements.filter(el => el.formName).length, 'of', elements.length)
            
            // Initialize form data
            const initialFormData = {}
            elements.forEach(el => {
                if (el.id) {
                    initialFormData[el.id] = []
                }
            })
            setFormData(initialFormData)
            
            // Create option set map and fetch detailed info
            const optionSetMap = {}
            const optionSetOptionsMap = {}
            
            // Get all element IDs
            const elementIds = elements.map(e => e.id).filter(Boolean)
            
            // Fetch detailed information for each element
            // Process in smaller batches to avoid overwhelming the API
            const batchSize = 5
            for (let i = 0; i < elementIds.length; i += batchSize) {
                const batch = elementIds.slice(i, i + batchSize)
                await Promise.all(batch.map(async (elementId) => {
                    try {
                        const detailResponse = await engine.query({
                            dataElement: {
                                resource: 'dataElements',
                                id: elementId,
                                params: {
                                    fields: 'id,name,shortName,code,valueType,formName,description,aggregationType,domainType,displayFormName,zeroIsSignificant,url,dimensionItem,categoryCombo[id,name],optionSet[id,name,options[id,name,code]],translations[property,locale,value]'
                                }
                            }
                        })
                    
                    const de = detailResponse.dataElement
                    if (de) {
                        if (de.optionSet && de.optionSet.id) {
                            optionSetMap[elementId] = {
                                id: de.optionSet.id,
                                name: de.optionSet.name || 'Unnamed Option Set'
                            }
                            
                            // Get options from the response
                            if (de.optionSet.options && de.optionSet.options.length > 0) {
                                optionSetOptionsMap[elementId] = de.optionSet.options
                            } else if (de.optionSet.id) {
                                // If options not included in response, fetch them separately
                                try {
                                    const optionSetResponse = await engine.query({
                                        optionSet: {
                                            resource: `optionSets/${de.optionSet.id}`,
                                            params: {
                                                fields: 'id,name,options[id,name,code]'
                                            }
                                        }
                                    })
                                    if (optionSetResponse.optionSet?.options) {
                                        optionSetOptionsMap[elementId] = optionSetResponse.optionSet.options
                                    }
                                } catch (optErr) {
                                    // 404 is OK - option set might not exist or be accessible
                                    const is404 = optErr.message?.includes('404') || optErr.details?.httpStatusCode === 404
                                    if (!is404) {
                                        console.warn(`Failed to fetch options for option set ${de.optionSet.id}:`, optErr)
                                    }
                                }
                            }
                        }
                    }
                    } catch (err) {
                        // 404 is OK - data element might not exist or be accessible
                        const is404 = err.message?.includes('404') || err.details?.httpStatusCode === 404
                        // CORS/network errors are also OK - we'll skip and continue
                        const isNetworkError = err.message?.includes('network') || 
                                             err.message?.includes('CORS') ||
                                             err.message?.includes('access control')
                        
                        if (is404) {
                            console.log(`[QuestionForm] Data element ${elementId} not found (404) - skipping`)
                        } else if (isNetworkError) {
                            console.log(`[QuestionForm] Network/CORS error for ${elementId} - skipping (will use data from program stage)`)
                        } else {
                            console.warn(`[QuestionForm] Failed to fetch details for ${elementId}:`, err.message || err)
                        }
                    }
                }))
                
                // Small delay between batches to avoid overwhelming the API
                if (i + batchSize < elementIds.length) {
                    await new Promise(resolve => setTimeout(resolve, 100))
                }
            }
            
            // Also fetch option set for riskScreeningResult if it's not in the data elements list
            const riskResultElementId = config.mapping.programStageDataElements.riskScreeningResult
            if (riskResultElementId && !optionSetOptionsMap[riskResultElementId]) {
                try {
                    const riskResultResponse = await engine.query({
                        dataElement: {
                            resource: `dataElements/${riskResultElementId}`,
                            params: {
                                fields: 'id,name,optionSet[id,name,options[id,name,code]]'
                            }
                        }
                    })
                    const de = riskResultResponse.dataElement
                    if (de?.optionSet) {
                        if (de.optionSet.options && de.optionSet.options.length > 0) {
                            optionSetOptionsMap[riskResultElementId] = de.optionSet.options
                        } else if (de.optionSet.id) {
                            // Fetch options separately if not included
                            try {
                                const optionSetResponse = await engine.query({
                                    optionSet: {
                                        resource: `optionSets/${de.optionSet.id}`,
                                        params: {
                                            fields: 'id,name,options[id,name,code]'
                                        }
                                    }
                                })
                                if (optionSetResponse.optionSet?.options) {
                                    optionSetOptionsMap[riskResultElementId] = optionSetResponse.optionSet.options
                                }
                            } catch (optErr) {
                                // 404 is OK - option set might not exist
                                const is404 = optErr.message?.includes('404') || optErr.details?.httpStatusCode === 404
                                if (!is404) {
                                    console.warn(`[QuestionForm] Failed to fetch options for risk result option set:`, optErr)
                                }
                            }
                        }
                    }
                } catch (err) {
                    // 404 is OK - data element might not exist
                    const is404 = err.message?.includes('404') || err.details?.httpStatusCode === 404
                    if (!is404) {
                        console.warn(`[QuestionForm] Failed to fetch riskScreeningResult option set:`, err)
                    }
                }
            }
            
            setOptionSets(optionSetMap)
            setOptionSetOptions(optionSetOptionsMap)
            
            // Log summary
            console.log('[QuestionForm] Data elements loaded:', {
                total: elements.length,
                withOptionSets: Object.keys(optionSetMap).length,
                withOptions: Object.keys(optionSetOptionsMap).length
            })
        } catch (error) {
            console.error('[QuestionForm] Error loading data elements:', error)
            
            // Check if it's a 404 error
            const is404 = error.message?.includes('404') || 
                         error.details?.httpStatusCode === 404 ||
                         error.response?.status === 404
            
            if (is404) {
                console.warn('[QuestionForm] 404 error - some data elements may not exist. Continuing with available elements...')
                // Don't show error toast for 404 - continue with what we have
            } else {
                showToast({
                    title: 'Error',
                    description: `Failed to load data elements: ${error.message || 'Unknown error'}`,
                    variant: 'destructive'
                })
            }
        } finally {
            setLoading(false)
        }
    }

    // Create order map from programStageDataElements
    const programOrderMap = useMemo(() => {
        const orderMap = {}
        programStageDataElements.forEach((item, index) => {
            orderMap[item.id] = index
        })
        return orderMap
    }, [])

    const filteredElements = useMemo(() => {
        let filtered = dataElements.filter(element => {
            // Exclude "11.Had test for HIV in past 6 months?"
            if (element.name?.includes('11.Had test for HIV in past 6 months?') || 
                element.id === 'upbKDAnhG8T') {
                return false
            }
            
            const matchesSearch = 
                element.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                element.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                element.formName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                element.translation?.toLowerCase().includes(searchTerm.toLowerCase())
            
            return matchesSearch
        })

        // Sort by program order
        filtered = [...filtered].sort((a, b) => {
            const orderA = programOrderMap[a.id] !== undefined ? programOrderMap[a.id] : 9999
            const orderB = programOrderMap[b.id] !== undefined ? programOrderMap[b.id] : 9999
            if (orderA !== orderB) {
                return orderA - orderB
            }
            return (a.name || '').toLowerCase().localeCompare((b.name || '').toLowerCase())
        })

        return filtered
    }, [dataElements, searchTerm, programOrderMap])

    const handleCheckboxChange = (elementId, optionId, checked) => {
        setFormData(prev => {
            const currentValues = prev[elementId] || []
            if (checked) {
                return {
                    ...prev,
                    [elementId]: [...currentValues, optionId]
                }
            } else {
                return {
                    ...prev,
                    [elementId]: currentValues.filter(id => id !== optionId)
                }
            }
        })
    }

    const handleBooleanChange = (elementId, checked) => {
        setFormData(prev => ({
            ...prev,
            [elementId]: checked ? ['true'] : []
        }))
    }

    const extractNumber = (name) => {
        if (!name) return '-'
        const match = name.match(/^(\d+(?:\.\d+)?)\./)
        return match ? match[1] : '-'
    }

    const calculateDateOfBirthFromAge = (ageValue) => {
        if (!ageValue || isNaN(ageValue) || ageValue < 0 || ageValue > 150) {
            return ''
        }
        
        const today = new Date()
        const birthYear = today.getFullYear() - parseInt(ageValue, 10)
        // Use January 1st as the default date (you can adjust this if needed)
        const dateOfBirth = new Date(birthYear, 0, 1)
        return dateOfBirth.toISOString().split('T')[0]
    }

    const handleAgeChange = (ageValue) => {
        setAge(ageValue)
        if (ageValue && !isNaN(ageValue) && ageValue >= 0 && ageValue <= 150) {
            const calculatedDOB = calculateDateOfBirthFromAge(ageValue)
            setTeiData(prev => ({ ...prev, dateOfBirth: calculatedDOB }))
        } else if (!ageValue) {
            // Clear date of birth if age is cleared
            setTeiData(prev => ({ ...prev, dateOfBirth: '' }))
        }
    }

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
        
        return consonants
    }, [])

    // Auto-generate UUIC when required fields change
    useEffect(() => {
        const { familyName, lastName, sex, dateOfBirth, uuic } = teiData
        
        if (familyName && lastName && sex && dateOfBirth) {
            try {
                // Extract first 2 consonant characters from last name
                const lastNamePart = extractConsonants(lastName, 2)
                
                // Extract first 2 consonant characters from family name (first name)
                const firstNamePart = extractConsonants(familyName, 2)
                
                // Sex: 1 for Male, 2 for Female
                const sexPart = sex === 'Male' ? '1' : sex === 'Female' ? '2' : ''
                
                // Parse date of birth
                const date = new Date(dateOfBirth)
                if (!isNaN(date.getTime())) {
                    const day = date.getDate().toString().padStart(2, '0')
                    const month = (date.getMonth() + 1).toString().padStart(2, '0')
                    const year = date.getFullYear().toString().slice(-2) // Last 2 digits
                    
                    // Combine all parts: [Last Name] [First Name] [Sex] [Day] [Month] [Year]
                    const calculatedUUIC = `${lastNamePart}${firstNamePart}${sexPart}${day}${month}${year}`
                    
                    // Only update if the UUIC would be different (prevent infinite loop)
                    if (uuic !== calculatedUUIC) {
                        setTeiData(prev => ({ ...prev, uuic: calculatedUUIC }))
                    }
                }
            } catch (error) {
                console.error('Error auto-generating UUIC:', error)
            }
        }
    }, [teiData.familyName, teiData.lastName, teiData.sex, teiData.dateOfBirth, extractConsonants])

    const handleDateOfBirthChange = (dobValue) => {
        setTeiData(prev => ({ ...prev, dateOfBirth: dobValue }))
        // Calculate age from date of birth
        if (dobValue) {
            const today = new Date()
            const birthDate = new Date(dobValue)
            if (!isNaN(birthDate.getTime())) {
                let calculatedAge = today.getFullYear() - birthDate.getFullYear()
                const monthDiff = today.getMonth() - birthDate.getMonth()
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    calculatedAge--
                }
                if (calculatedAge >= 0 && calculatedAge <= 150) {
                    setAge(String(calculatedAge))
                }
            }
        } else {
            setAge('')
        }
    }

    const handleSubmit = async () => {
        // Validate org unit
        if (!selectedOrgUnit) {
            showToast({
                title: 'Validation Error',
                description: 'Please select an organization unit',
                variant: 'destructive'
            })
            return
        }

        // Validate at least one question answered
        const hasAnswers = Object.values(formData).some(values => values && values.length > 0)
        if (!hasAnswers) {
            showToast({
                title: 'Validation Error',
                description: 'Please answer at least one question',
                variant: 'destructive'
            })
            return
        }

        setSubmitting(true)
        try {
            // Debug: Log formData before mapping
            console.log('[QuestionForm] Raw formData before mapping:', formData)
            console.log('[QuestionForm] FormData entries:', Object.entries(formData).filter(([id, values]) => values && values.length > 0))
            console.log('[QuestionForm] Data elements count:', dataElements.length)
            console.log('[QuestionForm] Data elements with formName:', dataElements.filter(el => el.formName).map(el => ({ id: el.id, name: el.name, formName: el.formName })))
            
            // Map form data to field names expected by importRecordToDHIS2
            const mappedFormData = Object.entries(formData).reduce((acc, [elementId, values]) => {
                if (values && values.length > 0) {
                    const element = dataElements.find(el => el.id === elementId)
                    console.log(`[QuestionForm] Processing element ${elementId}:`, {
                        found: !!element,
                        hasFormName: !!element?.formName,
                        formName: element?.formName,
                        valueType: element?.valueType,
                        values: values,
                        elementName: element?.name
                    })
                    
                    if (element && element.formName) {
                        const value = values[0]
                        // Convert checkbox values to expected format
                        // For boolean/trueOnly, pass 'true' or 'false' (not 'Yes'/'No')
                        // createProgramStageDataValues will handle the conversion
                        if (element.valueType === 'BOOLEAN' || element.valueType === 'TRUE_ONLY') {
                            // Pass as 'true' or 'false' - createProgramStageDataValues expects this
                            acc[element.formName] = value === 'true' ? 'true' : (value === 'false' ? 'false' : '')
                            console.log(`[QuestionForm] ✅ Mapped boolean ${element.formName}:`, acc[element.formName])
                        } else {
                            const option = optionSetOptions[elementId]?.find(opt => 
                                opt.id === value || opt.code === value || opt.name === value
                            )
                            acc[element.formName] = option?.name || option?.code || String(value)
                            console.log(`[QuestionForm] ✅ Mapped option set ${element.formName}:`, {
                                value,
                                option,
                                mapped: acc[element.formName]
                            })
                        }
                    } else {
                        console.warn('[QuestionForm] ❌ Element not found or missing formName:', { 
                            elementId, 
                            element: element?.name,
                            hasElement: !!element,
                            hasFormName: !!element?.formName
                        })
                    }
                }
                return acc
            }, {})
            
            console.log('[QuestionForm] Mapped form data:', mappedFormData)
            console.log('[QuestionForm] Mapped fields count:', Object.keys(mappedFormData).length)

            // Calculate risk screening score and result from the form answers
            // Convert Yes/No to true/false for risk calculation
            const riskCalculationData = {
                ...mappedFormData,
                numberOfSexualPartners: mappedFormData.numberOfSexualPartners || '',
                sexWithoutCondom: mappedFormData.sexWithoutCondom === 'Yes' ? 'true' : 'false',
                sexWithHIVPartner: mappedFormData.sexWithHIVPartner === 'Yes' ? 'true' : 'false',
                stiSymptoms: mappedFormData.stiSymptoms === 'Yes' ? 'true' : 'false',
                syphilisPositive: mappedFormData.syphilisPositive === 'Yes' ? 'true' : 'false',
                hivTestResult: mappedFormData.hivTestResult || '',
                injectedDrugSharedNeedle: mappedFormData.injectedDrugSharedNeedle === 'Yes' ? 'true' : 'false',
                alcoholDrugBeforeSex: mappedFormData.alcoholDrugBeforeSex === 'Yes' ? 'true' : 'false',
                groupSexChemsex: mappedFormData.groupSexChemsex === 'Yes' ? 'true' : 'false',
                receiveMoneyForSex: mappedFormData.receiveMoneyForSex === 'Yes' ? 'true' : 'false',
                paidForSex: mappedFormData.paidForSex === 'Yes' ? 'true' : 'false',
                forcedSex: mappedFormData.forcedSex === 'Yes' ? 'true' : 'false',
                currentlyOnPrep: mappedFormData.currentlyOnPrep === 'Yes' ? 'true' : 'false'
            }

            // Calculate risk screening score and result (same as import tool)
            const riskData = calculateRiskScoreFromData(riskCalculationData)
            
            // Prepare TEI data with auto-generated IDs if not provided
            // Follow the same pattern as import tool - include all calculated risk data
            const submissionData = {
                systemId: teiData.systemId || nextSystemId || `SYS${Date.now()}`,
                uuic: teiData.uuic || nextUUIC || `កយសត${1150689 + Math.floor(Math.random() * 1000)}`,
                familyName: teiData.familyName || 'Form',
                lastName: teiData.lastName || 'Submission',
                sex: teiData.sex || 'Male',
                dateOfBirth: teiData.dateOfBirth || new Date().toISOString().split('T')[0],
                province: teiData.province || 'Unknown',
                od: teiData.od || '',
                district: teiData.district || '',
                commune: teiData.commune || '',
                donor: teiData.donor || '',
                ngo: teiData.ngo || '',
                // Include mapped form data
                ...mappedFormData,
                // Include calculated risk screening data (same as import tool - calculateRiskScoreFromData returns riskScreeningResult)
                riskScreeningScore: String(riskData.riskScreeningScore || 0),
                riskScreeningResult: riskData.riskScreeningResult || riskData.riskLevel || 'Low'
            }

            console.log('Submitting data:', submissionData)
            console.log('Submitting data keys:', Object.keys(submissionData))
            console.log('Mapped form data keys:', Object.keys(mappedFormData))
            console.log('Mapped form data values:', Object.entries(mappedFormData).reduce((acc, [k, v]) => {
                acc[k] = String(v).substring(0, 30)
                return acc
            }, {}))
            console.log('Risk screening data:', { 
                score: riskData.riskScreeningScore, 
                level: riskData.riskLevel,
                result: riskData.riskScreeningResult,
                finalResult: submissionData.riskScreeningResult,
                riskResultElementId: config.mapping.programStageDataElements.riskScreeningResult
            })

            // Import to DHIS2
            // Note: importRecordToDHIS2 will create dataValues from submissionData including riskScreeningScore and riskScreeningResult
            const result = await importRecordToDHIS2(submissionData, selectedOrgUnit, engine, config)
            
            if (result.success) {
                // Count the number of answered questions
                const answeredCount = Object.values(formData).filter(values => values && values.length > 0).length
                
                // Generate Tracker Capture URL
                const dhis2BaseUrl = getDHIS2ServerURL().replace(/\/$/, '')
                const trackerCaptureUrl = `${dhis2BaseUrl}/dhis-web-tracker-capture/index.html#/dashboard?tei=${result.teiId}&program=${config.program.id}&ou=${selectedOrgUnit}`
                
                // Store URL in sessionStorage for easy access
                sessionStorage.setItem('lastTrackerCaptureUrl', trackerCaptureUrl)
                
                showToast({
                    title: 'Success!',
                    description: `Form submitted successfully. ${answeredCount} question(s) answered. Click to view in Tracker Capture.`,
                    variant: 'default'
                })
                
                // Open Tracker Capture in new tab after a short delay
                setTimeout(() => {
                    window.open(trackerCaptureUrl, '_blank', 'noopener,noreferrer')
                }, 500)
                
                // Refresh next IDs for next submission
                await fetchNextIds()
                
                // Reset form after successful submission
                handleReset()
            } else {
                throw new Error(result.error || 'Submission failed')
            }
        } catch (error) {
            console.error('Submission error:', error)
            showToast({
                title: 'Submission Failed',
                description: error.message || 'Failed to submit form data',
                variant: 'destructive'
            })
        } finally {
            setSubmitting(false)
        }
    }

    // Auto-fill test data with incrementing values
    const handleAutoFillTestData = () => {
        const counter = testDataCounter
        setTestDataCounter(prev => prev + 1)
        
        // Generate incrementing test data
        const testSystemId = `TEST_SYS_${String(1000000 + counter).padStart(7, '0')}`
        const testUUIC = `កយសត${String(1150689 + counter).padStart(7, '0')}`
        const testFamilyName = `TestFamily${counter}`
        const testLastName = `TestLast${counter}`
        const testDonor = `Donor ${counter}`
        const testNGO = `NGO ${counter}`
        const testOD = `OD${String(counter).padStart(3, '0')}`
        const testDistrict = `District ${counter}`
        const testCommune = `Commune ${counter}`
        
        // Calculate date of birth (age 25 + counter years)
        const birthYear = new Date().getFullYear() - 25 - (counter % 10)
        const testDateOfBirth = `${birthYear}-01-15`
        const testAge = String(25 + (counter % 10))
        
        // Set TEI data
        setTeiData({
            systemId: testSystemId,
            uuic: testUUIC,
            donor: testDonor,
            ngo: testNGO,
            familyName: testFamilyName,
            lastName: testLastName,
            sex: counter % 2 === 0 ? 'Male' : 'Female',
            dateOfBirth: testDateOfBirth,
            province: provinceOptions.length > 0 ? provinceOptions[0].name : 'Phnom Penh',
            od: testOD,
            district: testDistrict,
            commune: testCommune
        })
        
        // Set age
        setAge(testAge)
        
        // Auto-fill some form answers for testing with incrementing values
        const testFormData = {}
        dataElements.forEach((element, index) => {
            if (element.id) {
                if (element.valueType === 'BOOLEAN' || element.valueType === 'TRUE_ONLY') {
                    // Fill boolean fields - alternate between true/false based on counter
                    const shouldFill = (counter + index) % 3 !== 0 // Fill 2/3 of boolean fields
                    if (shouldFill) {
                        testFormData[element.id] = ['true']
                    }
                } else if (optionSetOptions[element.id] && optionSetOptions[element.id].length > 0) {
                    // Fill with option from option set - cycle through options based on counter
                    const options = optionSetOptions[element.id]
                    const optionIndex = (counter - 1) % options.length
                    const selectedOption = options[optionIndex]
                    testFormData[element.id] = [selectedOption.code || selectedOption.id || selectedOption.name]
                } else if (element.valueType === 'NUMBER') {
                    // Fill number fields with incrementing test values
                    if (element.formName === 'numberOfSexualPartners') {
                        testFormData[element.id] = [String(2 + (counter % 5))] // 2-6 partners
                    }
                } else if (element.valueType === 'TEXT') {
                    // Fill text fields with test values
                    if (element.formName?.includes('Practices')) {
                        testFormData[element.id] = ['Test Practice ' + counter]
                    }
                }
            }
        })
        
        setFormData(testFormData)
        
        showToast({
            title: 'Test Data Filled',
            description: `Auto-filled test data #${counter}. Click again to increment.`,
            variant: 'default'
        })
    }

    const handleReset = () => {
        const initialFormData = {}
        dataElements.forEach(el => {
            if (el.id) {
                initialFormData[el.id] = []
            }
        })
        setFormData(initialFormData)
        setAge('')
        setTeiData({
            systemId: '',
            uuic: '',
            donor: '',
            ngo: '',
            familyName: '',
            lastName: '',
            sex: '',
            dateOfBirth: '',
            province: '',
            od: '',
            district: '',
            commune: ''
        })
        // Don't reset testDataCounter - keep incrementing for continuous testing
        showToast({
            title: 'Form Reset',
            description: 'All answers have been cleared',
        })
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="p-12 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading questions...</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold flex items-center gap-2">
                            📝 Question Form
                            <Badge variant="secondary">{filteredElements.length} questions</Badge>
                        </CardTitle>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleAutoFillTestData}
                                disabled={submitting || loading}
                                className="flex items-center gap-2 border-purple-300 text-purple-700 hover:bg-purple-50"
                                title="Auto-fill test data (increments on each click)"
                            >
                                <Zap className="h-4 w-4" />
                                Auto-Fill Test #{testDataCounter}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={loadDataElements}
                                disabled={loading}
                                className="flex items-center gap-2"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Refresh
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleReset}
                                disabled={submitting}
                                className="flex items-center gap-2"
                            >
                                Reset
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSubmit}
                                disabled={submitting || !selectedOrgUnit}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                            >
                                <Save className="h-4 w-4" />
                                {submitting ? 'Submitting...' : 'Submit'}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Organization Unit Selection */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Organization Unit <span className="text-red-500">*</span>
                        </label>
                        <Select 
                            value={selectedOrgUnit} 
                            onValueChange={setSelectedOrgUnit}
                            disabled={orgUnits.length === 0}
                        >
                            <SelectTrigger className="w-full bg-white">
                                <SelectValue placeholder={orgUnits.length === 0 ? "Loading..." : "Select organization unit"} />
                            </SelectTrigger>
                            <SelectContent>
                                {orgUnits.map(ou => (
                                    <SelectItem key={ou.id} value={ou.id}>
                                        {ou.displayName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Basic Information (Optional) */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Basic Information (Optional)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                    {FORM_FIELD_LABELS_KH.systemId} {nextSystemId && <span className="text-blue-600">(Next: {nextSystemId})</span>}
                                </label>
                                <Input
                                    value={teiData.systemId}
                                    onChange={(e) => setTeiData({...teiData, systemId: e.target.value})}
                                    placeholder={nextSystemId || "Auto-generated if empty"}
                                    className="text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                    {FORM_FIELD_LABELS_KH.uuic}
                                </label>
                                <Input
                                    value={teiData.uuic}
                                    onChange={(e) => setTeiData({...teiData, uuic: e.target.value})}
                                    placeholder="Auto-generated from Name, Sex, and DOB"
                                    className="text-sm font-mono"
                                />
                                {(!teiData.familyName || !teiData.lastName || !teiData.sex || !teiData.dateOfBirth) && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Fill in Family Name, Last Name, Sex, and Date of Birth to auto-generate UUIC
                                    </p>
                                )}
                                {teiData.familyName && teiData.lastName && teiData.sex && teiData.dateOfBirth && teiData.uuic && (
                                    <p className="text-xs text-green-600 mt-1">
                                        ✓ UUIC auto-generated
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">{FORM_FIELD_LABELS_KH.familyName}</label>
                                <Input
                                    value={teiData.familyName}
                                    onChange={(e) => setTeiData({...teiData, familyName: e.target.value})}
                                    placeholder="Optional"
                                    className="text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">{FORM_FIELD_LABELS_KH.lastName}</label>
                                <Input
                                    value={teiData.lastName}
                                    onChange={(e) => setTeiData({...teiData, lastName: e.target.value})}
                                    placeholder="Optional"
                                    className="text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">{FORM_FIELD_LABELS_KH.sex}</label>
                                <Select value={teiData.sex} onValueChange={(value) => setTeiData({...teiData, sex: value})}>
                                    <SelectTrigger className="text-sm">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Intersex">Intersex</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">Age</label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="150"
                                    value={age}
                                    onChange={(e) => handleAgeChange(e.target.value)}
                                    placeholder="Enter age"
                                    className="text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">{FORM_FIELD_LABELS_KH.dateOfBirth}</label>
                                <Input
                                    type="date"
                                    value={teiData.dateOfBirth}
                                    onChange={(e) => handleDateOfBirthChange(e.target.value)}
                                    className="text-sm"
                                />
                                {age && (
                                    <span className="text-xs text-gray-500 mt-1 block">
                                        Calculated from age: {age} years
                                    </span>
                                )}
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">{FORM_FIELD_LABELS_KH.donor}</label>
                                <Input
                                    value={teiData.donor}
                                    onChange={(e) => setTeiData({...teiData, donor: e.target.value})}
                                    placeholder="Optional"
                                    className="text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">{FORM_FIELD_LABELS_KH.ngo}</label>
                                <Input
                                    value={teiData.ngo}
                                    onChange={(e) => setTeiData({...teiData, ngo: e.target.value})}
                                    placeholder="Optional"
                                    className="text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">{FORM_FIELD_LABELS_KH.province}</label>
                                {provinceOptions.length > 0 ? (
                                    <Select value={teiData.province} onValueChange={(value) => setTeiData({...teiData, province: value})}>
                                        <SelectTrigger className="text-sm">
                                            <SelectValue placeholder="Select province" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {provinceOptions.map((option) => (
                                                <SelectItem key={option.id} value={option.code || option.name}>
                                                    {option.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input
                                        value={teiData.province}
                                        onChange={(e) => setTeiData({...teiData, province: e.target.value})}
                                        placeholder="Optional"
                                        className="text-sm"
                                    />
                                )}
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">{FORM_FIELD_LABELS_KH.od}</label>
                                <Input
                                    value={teiData.od}
                                    onChange={(e) => setTeiData({...teiData, od: e.target.value})}
                                    placeholder="Optional"
                                    className="text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">{FORM_FIELD_LABELS_KH.district}</label>
                                <Input
                                    value={teiData.district}
                                    onChange={(e) => setTeiData({...teiData, district: e.target.value})}
                                    placeholder="Optional"
                                    className="text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-600 mb-1">{FORM_FIELD_LABELS_KH.commune}</label>
                                <Input
                                    value={teiData.commune}
                                    onChange={(e) => setTeiData({...teiData, commune: e.target.value})}
                                    placeholder="Optional"
                                    className="text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Questions Table */}
                    <div className="overflow-x-auto max-h-[calc(100vh-300px)] overflow-y-auto border border-gray-300 rounded-lg shadow-sm">
                        <table className="w-full border-collapse bg-white text-sm">
                            <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white sticky top-0 z-10">
                                <tr>
                                    <th className="text-center py-3 px-3 font-semibold text-xs border-r border-blue-500 w-16">
                                        No
                                    </th>
                                    <th className="text-left py-3 px-4 font-semibold text-xs border-r border-blue-500">
                                        Question
                                    </th>
                                    <th className="text-left py-3 px-4 font-semibold text-xs">
                                        Answer
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredElements.map((element, index) => {
                                    const options = optionSetOptions[element.id] || []
                                    const elementNumber = extractNumber(element.name)
                                    const isBoolean = element.valueType === 'BOOLEAN' || element.valueType === 'TRUE_ONLY'
                                    const currentValues = formData[element.id] || []
                                    const isChecked = isBoolean && currentValues.includes('true')

                                    return (
                                        <tr 
                                            key={element.id || index} 
                                            className={`border-b border-gray-200 transition-colors ${
                                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                            } hover:bg-blue-50`}
                                        >
                                            {/* No Column */}
                                            <td className="py-3 px-3 text-center border-r border-gray-200">
                                                <span className="text-base font-bold text-blue-600">
                                                    {elementNumber}
                                                </span>
                                            </td>
                                            
                                            {/* Question Column */}
                                            <td className="py-3 px-4 border-r border-gray-200">
                                                <div className="space-y-1.5">
                                                    <div className="font-medium text-gray-900 text-sm leading-tight">
                                                        {element.name || 'Unnamed Element'}
                                                    </div>
                                                    {element.translation && (
                                                        <div className="text-sm text-gray-700 font-khmer leading-tight font-medium">
                                                            {element.translation}
                                                        </div>
                                                    )}
                                                    {element.formName && (
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <code className="text-xs font-mono bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                                                                {element.formName}
                                                            </code>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            
                                            {/* Answer Column */}
                                            <td className="py-3 px-4">
                                                <div className="space-y-2">
                                                    {isBoolean ? (
                                                        <div className="flex items-center gap-2">
                                                            <Checkbox
                                                                checked={isChecked}
                                                                onChange={(e) => handleBooleanChange(element.id, e.target.checked)}
                                                            />
                                                            <span className="text-sm text-gray-700">Yes</span>
                                                        </div>
                                                    ) : options.length > 0 ? (
                                                        <div className="space-y-2">
                                                            {options.map((option, optIndex) => {
                                                                // Use code as primary identifier (DHIS2 standard), fallback to id or index
                                                                const optionId = option.code || option.id || `opt_${optIndex}`
                                                                const isOptionChecked = currentValues.includes(optionId) || 
                                                                    currentValues.includes(option.code) ||
                                                                    currentValues.includes(option.id) ||
                                                                    currentValues.includes(option.name)
                                                                
                                                                return (
                                                                    <div key={optionId} className="flex items-center gap-2">
                                                                        <Checkbox
                                                                            checked={isOptionChecked}
                                                                            onChange={(e) => handleCheckboxChange(element.id, optionId, e.target.checked)}
                                                                        />
                                                                        <span className="text-sm text-gray-700">
                                                                            {option.name || option.code || `Option ${optIndex + 1}`}
                                                                        </span>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            <Checkbox
                                                                checked={isChecked}
                                                                onChange={(e) => handleBooleanChange(element.id, e.target.checked)}
                                                            />
                                                            <span className="text-sm text-gray-700">
                                                                {element.valueType === 'TRUE_ONLY' ? 'Yes' : 'Yes / No'}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    {filteredElements.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <p>No questions found matching your search.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default QuestionForm

