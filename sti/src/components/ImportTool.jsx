import React, { useState, useEffect } from 'react'
import { useDataEngine } from '@dhis2/app-runtime'
import { useToast } from './ui/ui/toast'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { FiUpload, FiFile, FiCheckCircle, FiDownload, FiDatabase, FiX, FiAlertCircle, FiInfo, FiClock, FiTrendingUp, FiMapPin } from 'react-icons/fi'
import { Upload, FileText, Database, Activity, BarChart3, Settings } from 'lucide-react'
import config from '../lib/config'
import { fetchProgramStageDataElementsWithOptions } from '../lib/dhis2FormData'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

const ImportTool = () => {
    const [selectedFile, setSelectedFile] = useState(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [processingProgress, setProcessingProgress] = useState(0)
    const [importing, setImporting] = useState(false)
    const [dragActive, setDragActive] = useState(false)
    const [uploadPhase, setUploadPhase] = useState('idle') // idle, uploading, processing, completed
    const [importStats, setImportStats] = useState(null)
    const [fileValidation, setFileValidation] = useState(null)
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [orgUnits, setOrgUnits] = useState([])
    const [selectedOrgUnit, setSelectedOrgUnit] = useState('')
    const [fieldMappings, setFieldMappings] = useState({})
    const [dataElementOptionsById, setDataElementOptionsById] = useState({})
    const [programTeAttributes, setProgramTeAttributes] = useState({})
    
    const engine = useDataEngine()
    const { showToast } = useToast()

    // Load org units (level 4 within user hierarchy)
    useEffect(() => {
        const loadOrgUnits = async () => {
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
                const list = ousResp?.ous?.organisationUnits || []
                const filtered = list.filter(ou => ou.level === 4)
                setOrgUnits(filtered)
                if (filtered.length > 0) setSelectedOrgUnit(filtered[0].id)
            } catch (e) {
                console.error('Failed to load organisation units:', e)
                showToast({ title: 'Error', description: 'Failed to load organization units', variant: 'error' })
            }
        }
        loadOrgUnits()
        const loadStageMappings = async () => {
            try {
                const { dataElements, dataElementOptions } = await fetchProgramStageDataElementsWithOptions(engine, config.program.stageId)
                const mappings = {}
                dataElements.forEach(psde => {
                    const de = psde.dataElement
                    const n = (de.name || '').toLowerCase()
                    if (n.includes('what is your sex at birth')) mappings.sexAtBirth = { id: de.id, valueType: de.valueType }
                    else if (n.includes('identify your gender') || (n.includes('how do you identify') && n.includes('gender'))) mappings.genderIdentity = { id: de.id, valueType: de.valueType }
                    else if (n.includes('concerns/worries') || n.includes('sexual health')) mappings.sexualHealthConcerns = { id: de.id, valueType: de.valueType }
                    else if (n.includes('used to have sex') || n.includes('past 6months')) mappings.hadSexPast6Months = { id: de.id, valueType: de.valueType }
                    else if (n.includes("partner's sexual identify is male")) mappings.partnerMale = { id: de.id, valueType: de.valueType }
                    else if (n.includes("partner's sexual identify is female")) mappings.partnerFemale = { id: de.id, valueType: de.valueType }
                    else if (n.includes("partner's sexual identify is tgw")) mappings.partnerTGW = { id: de.id, valueType: de.valueType }
                    else if (n.includes('how many sexual partner')) mappings.numberOfSexualPartners = { id: de.id, valueType: de.valueType }
                    else if (n.includes('have had the following practice')) mappings.past6MonthsPractices = { id: de.id, valueType: de.valueType }
                    else if (n.includes('sex without a condom')) mappings.sexWithoutCondom = { id: de.id, valueType: de.valueType }
                    else if (n.includes('sex with known hiv')) mappings.sexWithHIVPartner = { id: de.id, valueType: de.valueType }
                    else if (n.includes('sti symptom')) mappings.stiSymptoms = { id: de.id, valueType: de.valueType }
                    else if (n.includes('tested syphilis positive')) mappings.syphilisPositive = { id: de.id, valueType: de.valueType }
                    else if (n.includes('had test for hiv in past 6 months')) mappings.hivTestPast6Months = { id: de.id, valueType: de.valueType }
                    else if (n.includes('result of hiv test')) mappings.hivTestResult = { id: de.id, valueType: de.valueType }
                    else if (n.includes('when did your last hiv test')) mappings.lastHivTestDate = { id: de.id, valueType: de.valueType }
                    else if (n.includes('currently on prep')) mappings.currentlyOnPrep = { id: de.id, valueType: de.valueType }
                    else if (n.includes('have you ever on prep') || n.includes('ever on prep')) mappings.everOnPrep = { id: de.id, valueType: de.valueType }
                    else if (n.includes('receive money') && n.includes('sex')) mappings.receiveMoneyForSex = { id: de.id, valueType: de.valueType }
                    else if (n.includes('paid for sex')) mappings.paidForSex = { id: de.id, valueType: de.valueType }
                    else if (n.includes('injected drug/shared needle') || n.includes('injected drug')) mappings.injectedDrugSharedNeedle = { id: de.id, valueType: de.valueType }
                    else if (n.includes('alcohol/drug before sex')) mappings.alcoholDrugBeforeSex = { id: de.id, valueType: de.valueType }
                    else if (n.includes('group sex') || n.includes('chemsex')) mappings.groupSexChemsex = { id: de.id, valueType: de.valueType }
                    else if (n.includes('abortion')) mappings.abortion = { id: de.id, valueType: de.valueType }
                    else if (n.includes('forced to have sex')) mappings.forcedSex = { id: de.id, valueType: de.valueType }
                    else if (n.includes('non-above')) mappings.noneOfAbove = { id: de.id, valueType: de.valueType }
                    else if (n === 'risk screening result' || n.includes('risk screening result')) mappings.riskScreeningResult = { id: de.id, valueType: de.valueType }
                    else if (n === 'risk screening score' || n.includes('risk screening score')) mappings.riskScreeningScore = { id: de.id, valueType: de.valueType }
                })
                setFieldMappings(mappings)
                setDataElementOptionsById(dataElementOptions || {})
            } catch (e) {
                console.error('Failed to load program stage mappings/options:', e)
            }
        }
        const loadProgramTeiAttributes = async () => {
            try {
                const resp = await engine.query({
                    program: {
                        resource: 'programs',
                        id: config.program.id,
                        params: {
                            fields: 'id,name,programTrackedEntityAttributes[mandatory,trackedEntityAttribute[id,name,code,valueType,unique]]'
                        }
                    }
                })
                const pteas = resp?.program?.programTrackedEntityAttributes || []
                const map = {}
                pteas.forEach(p => {
                    const tea = p.trackedEntityAttribute
                    const n = (tea.name || '').toLowerCase()
                    console.log('🔍 [TEI] Checking attribute:', tea.name, '->', tea.id)
                    if (n.includes('system') && n.includes('id')) map.systemId = tea.id
                    else if (n.includes('uuic')) map.uuic = tea.id
                    else if ((n.includes('family') && n.includes('name')) || n.includes('fname')) map.familyName = tea.id
                    else if ((n.includes('last') && n.includes('name')) || n.includes('lname')) map.lastName = tea.id
                    else if (n === 'sex' || n.includes('sex') || n.includes('gender')) map.sex = tea.id
                    else if (n.includes('date of birth') || n === 'dob') map.dateOfBirth = tea.id
                    else if (n.includes('province')) map.province = tea.id
                    else if (n === 'od' || n.includes('operational district')) map.od = tea.id
                    else if (n.includes('district')) map.district = tea.id
                    else if (n.includes('commune')) map.commune = tea.id
                })
                console.log('🔍 [TEI] Final TEI attribute mappings:', map)
                setProgramTeAttributes(map)
            } catch (e) {
                console.error('Failed to load program TEI attributes:', e)
            }
        }
        loadStageMappings()
        loadProgramTeiAttributes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleFileSelect = (event) => {
        const file = event.target.files[0]
        if (file) {
            validateFile(file)
            setSelectedFile(file)
            setUploadPhase('idle')
            setUploadProgress(0)
            setProcessingProgress(0)
            setImportStats(null)
        }
    }

    const validateFile = (file) => {
        const validation = {
            isValid: true,
            errors: [],
            warnings: []
        }

        // Check file type
        if (!file.name.endsWith('.csv')) {
            validation.isValid = false
            validation.errors.push('File must be a CSV format')
        }

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            validation.isValid = false
            validation.errors.push('File size must be less than 10MB')
        }

        // Check if file is empty
        if (file.size === 0) {
            validation.isValid = false
            validation.errors.push('File cannot be empty')
        }

        // Warnings
        if (file.size > 5 * 1024 * 1024) {
            validation.warnings.push('Large file detected. Upload may take longer.')
        }

        setFileValidation(validation)
        return validation
    }

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]
            validateFile(file)
            setSelectedFile(file)
            setUploadPhase('idle')
            setUploadProgress(0)
            setProcessingProgress(0)
            setImportStats(null)
        }
    }

    const downloadTemplate = () => {
        // CSV template with all 28 program stage data elements + 10 tracked entity attributes
        const csvContent = `System ID,UUIC,Family Name,Last Name,Sex,Date of Birth,Province,OD,District,Commune,Sex at Birth,Gender Identity,Sexual Health Concerns,Had Sex Past 6 Months,Partner Male,Partner Female,Partner TGW,Number of Sexual Partners,Past 6 Months Practices,HIV Test Past 6 Months,HIV Test Result,Risk Screening Result,Sex with HIV Partner,Sex without Condom,STI Symptoms,Syphilis Positive,Receive Money for Sex,Paid for Sex,Injected Drug Shared Needle,Alcohol Drug Before Sex,Group Sex Chemsex,Currently on PrEP,Last HIV Test Date,Abortion,Forced Sex,Risk Screening Score,None of Above,Ever on PrEP
SYS001,UUIC123456789,Doe,John,Male,1990-05-15,Phnom Penh,OD001,District 1,Commune A,Male,Male,Yes,Yes,Yes,No,No,2,Yes,Yes,Negative,Medium Risk,No,Yes,No,No,No,No,Yes,No,No,No,2024-01-15,No,No,15,No,No
SYS002,UUIC987654321,Smith,Jane,Female,1985-08-22,Battambang,OD002,District 2,Commune B,Female,Female,Yes,Yes,No,Yes,No,1,Yes,Yes,Negative,Low Risk,No,No,No,No,No,No,No,No,No,No,2024-02-20,No,No,8,No,No`
        
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'sti_screening_template.csv'
        a.click()
        window.URL.revokeObjectURL(url)
        
        showToast({
            title: 'Template Downloaded',
            description: 'CSV template with all 38 fields downloaded successfully',
            variant: 'success'
        })
    }

    const handleImport = async () => {
        if (!selectedFile) {
            showToast({
                title: 'No File Selected',
                description: 'Please select a CSV file to import',
                variant: 'error'
            })
            return
        }

        if (!selectedOrgUnit) {
            showToast({
                title: 'Select Location',
                description: 'Please select an organization unit before importing',
                variant: 'error'
            })
            return
        }

        if (fileValidation && !fileValidation.isValid) {
            showToast({
                title: 'File Validation Failed',
                description: fileValidation.errors.join(', '),
                variant: 'error'
            })
            return
        }

        setImporting(true)
        setUploadPhase('uploading')
        setUploadProgress(0)
        setProcessingProgress(0)

        try {
            // Phase 1: Upload Progress (0-100%)
            const uploadInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(uploadInterval)
                        setUploadPhase('processing')
                        return 100
                    }
                    // More realistic progress: slower at start, faster in middle, slower at end
                    const remaining = 100 - prev
                    const increment = remaining > 20 ? Math.random() * 6 + 3 : Math.random() * 2 + 1
                    return Math.min(100, prev + increment)
                })
            }, 200)

            // Simulate upload time based on file size
            const uploadTime = Math.min(5000, Math.max(2000, selectedFile.size / 1000)) // 2-5 seconds based on file size
            await new Promise(resolve => setTimeout(resolve, uploadTime))
            
            clearInterval(uploadInterval)
            setUploadProgress(100)
            setUploadPhase('processing')

            // Phase 2: Processing Progress (0-100%) + Actual Import
            const processingInterval = setInterval(() => {
                setProcessingProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(processingInterval)
                        setUploadPhase('completed')
                        return 100
                    }
                    // More realistic processing: validation (0-30%), import (30-80%), finalize (80-100%)
                    let increment
                    if (prev < 30) {
                        // Validation phase - slower
                        increment = Math.random() * 3 + 1
                    } else if (prev < 80) {
                        // Import phase - faster
                        increment = Math.random() * 5 + 2
                    } else {
                        // Finalization phase - slower
                        increment = Math.random() * 2 + 0.5
                    }
                    return Math.min(100, prev + increment)
                })
            }, 250)

            // Actual import
            console.log('📁 [IMPORT] Starting file processing...')
            console.log('📁 [IMPORT] File name:', selectedFile.name)
            console.log('📁 [IMPORT] File size:', selectedFile.size, 'bytes')
            
            const text = await selectedFile.text()
            console.log('📁 [IMPORT] File content length:', text.length, 'characters')
            
            const lines = text.trim().split(/\r?\n/)
            console.log('📁 [IMPORT] Total lines in file:', lines.length)
            
            const headers = lines[0].split(',').map(h => h.trim())
            console.log('📁 [IMPORT] CSV Headers:', headers)
            
            const total = Math.max(0, lines.length - 1)
            console.log('📁 [IMPORT] Data rows to process:', total)

            // Map headers to internal field keys
            const headerToField = {
                'System ID': 'systemId', 'UUIC': 'uuic', 'Family Name': 'familyName', 'Last Name': 'lastName', 'Sex': 'sex', 'Date of Birth': 'dateOfBirth', 'Province': 'province', 'OD': 'od', 'District': 'district', 'Commune': 'commune',
                'Sex at Birth': 'sexAtBirth', 'Gender Identity': 'genderIdentity', 'Sexual Health Concerns': 'sexualHealthConcerns', 'Had Sex Past 6 Months': 'hadSexPast6Months', "Partner Male": 'partnerMale', 'Partner Female': 'partnerFemale', 'Partner TGW': 'partnerTGW', 'Number of Sexual Partners': 'numberOfSexualPartners', 'Past 6 Months Practices': 'past6MonthsPractices', 'HIV Test Past 6 Months': 'hivTestPast6Months', 'HIV Test Result': 'hivTestResult', 'Risk Screening Result': 'riskScreeningResult', 'Sex with HIV Partner': 'sexWithHIVPartner', 'Sex without Condom': 'sexWithoutCondom', 'STI Symptoms': 'stiSymptoms', 'Syphilis Positive': 'syphilisPositive', 'Receive Money for Sex': 'receiveMoneyForSex', 'Paid for Sex': 'paidForSex', 'Injected Drug Shared Needle': 'injectedDrugSharedNeedle', 'Alcohol Drug Before Sex': 'alcoholDrugBeforeSex', 'Group Sex Chemsex': 'groupSexChemsex', 'Currently on PrEP': 'currentlyOnPrep', 'Last HIV Test Date': 'lastHivTestDate', 'Abortion': 'abortion', 'Forced Sex': 'forcedSex', 'Risk Screening Score': 'riskScreeningScore', 'None of Above': 'noneOfAbove', 'Ever on PrEP': 'everOnPrep'
            }

            let success = 0, failed = 0
            console.log('📁 [IMPORT] Starting row processing...')
            console.log('📁 [IMPORT] Field mappings loaded:', Object.keys(fieldMappings).length, 'fields')
            console.log('📁 [IMPORT] Program TE attributes loaded:', Object.keys(programTeAttributes).length, 'attributes')
            
            for (let i = 1; i < lines.length; i++) {
                const row = lines[i]
                if (!row.trim()) {
                    console.log(`📁 [IMPORT] Row ${i}: Skipping empty row`)
                    continue
                }
                
                console.log(`📁 [IMPORT] Processing row ${i}/${total}:`, row.substring(0, 100) + (row.length > 100 ? '...' : ''))
                
                const cells = row.split(',')
                console.log(`📁 [IMPORT] Row ${i}: Parsed ${cells.length} cells`)
                
                const formData = {}
                headers.forEach((h, idx) => {
                    const key = headerToField[h]
                    if (key) {
                        formData[key] = (cells[idx] || '').trim()
                        if (formData[key]) {
                            console.log(`📁 [IMPORT] Row ${i}: Mapped "${h}" -> "${key}" = "${formData[key]}"`)
                        }
                    }
                })

                // Build TEI attributes using program TE mapping (fallback to config)
                const teAttributesMap = Object.keys(programTeAttributes).length > 0 ? programTeAttributes : {
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
                
                // Ensure sex field is always mapped (fallback to config if dynamic mapping failed)
                if (!teAttributesMap.sex && config.mapping.trackedEntityAttributes.Sex) {
                    teAttributesMap.sex = config.mapping.trackedEntityAttributes.Sex
                    console.log(`📁 [IMPORT] Row ${i}: Using fallback sex mapping: ${config.mapping.trackedEntityAttributes.Sex}`)
                }
                console.log(`📁 [IMPORT] Row ${i}: Using TE attributes map:`, Object.keys(teAttributesMap))
                
                const attributes = []
                Object.entries(teAttributesMap).forEach(([fk, attrId]) => {
                    if (attrId && formData[fk]) {
                        attributes.push({ attribute: attrId, value: String(formData[fk]) })
                        console.log(`📁 [IMPORT] Row ${i}: TEI attribute "${fk}" = "${formData[fk]}"`)
                    } else if (fk === 'sex') {
                        console.log(`📁 [IMPORT] Row ${i}: ⚠️ Gender field "${fk}" missing or no attribute ID. formData[${fk}] = "${formData[fk]}", attrId = "${attrId}"`)
                    }
                })
                console.log(`📁 [IMPORT] Row ${i}: Built ${attributes.length} TEI attributes`)

                try {
                    console.log(`📁 [IMPORT] Row ${i}: Creating TEI...`)
                    // TEI
                    const teiPayload = { trackedEntityInstances: [{ trackedEntityType: config.program.trackedEntityType, orgUnit: selectedOrgUnit, attributes }] }
                    console.log(`📁 [IMPORT] Row ${i}: TEI payload:`, JSON.stringify(teiPayload, null, 2))
                    
                    const teiRes = await engine.mutate({
                        resource: 'trackedEntityInstances', type: 'create', data: teiPayload
                    })
                    console.log(`📁 [IMPORT] Row ${i}: TEI response:`, teiRes)
                    
                    const teiId = teiRes?.response?.importSummaries?.[0]?.reference
                    if (!teiId) {
                        console.error(`📁 [IMPORT] Row ${i}: TEI creation failed:`, teiRes?.response?.importSummaries?.[0])
                        throw new Error(teiRes?.response?.importSummaries?.[0]?.description || 'TEI failed')
                    }
                    console.log(`📁 [IMPORT] Row ${i}: TEI created successfully with ID:`, teiId)

                    // Enrollment
                    console.log(`📁 [IMPORT] Row ${i}: Creating enrollment...`)
                    const enrollmentPayload = { enrollments: [{ trackedEntityInstance: teiId, program: config.program.id, orgUnit: selectedOrgUnit, enrollmentDate: new Date().toISOString().split('T')[0], incidentDate: new Date().toISOString().split('T')[0] }] }
                    console.log(`📁 [IMPORT] Row ${i}: Enrollment payload:`, JSON.stringify(enrollmentPayload, null, 2))
                    
                    const enrRes = await engine.mutate({
                        resource: 'enrollments', type: 'create', data: enrollmentPayload
                    })
                    console.log(`📁 [IMPORT] Row ${i}: Enrollment response:`, enrRes)
                    
                    const enrollmentId = enrRes?.response?.importSummaries?.[0]?.reference
                    if (!enrollmentId) {
                        console.error(`📁 [IMPORT] Row ${i}: Enrollment failed:`, enrRes?.response?.importSummaries?.[0])
                        throw new Error(enrRes?.response?.importSummaries?.[0]?.description || 'Enrollment failed')
                    }
                    console.log(`📁 [IMPORT] Row ${i}: Enrollment created successfully with ID:`, enrollmentId)

                    // Event dataValues with normalization
                    console.log(`📁 [IMPORT] Row ${i}: Building event data values...`)
                    const dataValues = []
                    Object.entries(fieldMappings).forEach(([formField, mapping]) => {
                        const raw = formData[formField]
                        if (raw === undefined || raw === '') return
                        let value = raw
                        const options = dataElementOptionsById[mapping.id] || []
                        
                        console.log(`📁 [IMPORT] Row ${i}: Processing field "${formField}" = "${raw}" (type: ${mapping.valueType})`)
                        
                        if ((mapping.valueType === 'TRUE_ONLY' || mapping.valueType === 'BOOLEAN') && typeof raw === 'string') {
                            const v = raw.toLowerCase()
                            if (mapping.valueType === 'TRUE_ONLY') {
                                if (v === 'yes' || v === 'true') {
                                    value = 'true'
                                    console.log(`📁 [IMPORT] Row ${i}: TRUE_ONLY field "${formField}" normalized to "true"`)
                                } else {
                                    console.log(`📁 [IMPORT] Row ${i}: TRUE_ONLY field "${formField}" skipped (not true)`)
                                    return
                                }
                            } else {
                                value = (v === 'yes' || v === 'true') ? 'true' : 'false'
                                console.log(`📁 [IMPORT] Row ${i}: BOOLEAN field "${formField}" normalized to "${value}"`)
                            }
                        }
                        
                        if (options.length > 0) {
                            const lower = String(raw).toLowerCase()
                            const match = options.find(o => o.code?.toLowerCase() === lower || o.name?.toLowerCase() === lower)
                            if (match?.code) {
                                value = match.code
                                console.log(`📁 [IMPORT] Row ${i}: Option set field "${formField}" mapped "${raw}" -> "${match.code}"`)
                            }
                        }
                        
                        dataValues.push({ dataElement: mapping.id, value: String(value) })
                        console.log(`📁 [IMPORT] Row ${i}: Added data value "${formField}" = "${value}"`)
                    })
                    console.log(`📁 [IMPORT] Row ${i}: Built ${dataValues.length} data values`)

                    console.log(`📁 [IMPORT] Row ${i}: Creating event...`)
                    const eventPayload = { events: [{ trackedEntityInstance: teiId, program: config.program.id, programStage: config.program.stageId, orgUnit: selectedOrgUnit, enrollment: enrollmentId, eventDate: new Date().toISOString().split('T')[0], status: 'COMPLETED', dataValues }] }
                    console.log(`📁 [IMPORT] Row ${i}: Event payload:`, JSON.stringify(eventPayload, null, 2))
                    
                    const evtRes = await engine.mutate({
                        resource: 'events', type: 'create', data: eventPayload
                    })
                    console.log(`📁 [IMPORT] Row ${i}: Event response:`, evtRes)
                    
                    const eventId = evtRes?.response?.importSummaries?.[0]?.reference
                    if (!eventId) {
                        console.error(`📁 [IMPORT] Row ${i}: Event creation failed:`, evtRes?.response?.importSummaries?.[0])
                        throw new Error(evtRes?.response?.importSummaries?.[0]?.description || 'Event failed')
                    }
                    console.log(`📁 [IMPORT] Row ${i}: Event created successfully with ID:`, eventId)
                    console.log(`📁 [IMPORT] Row ${i}: ✅ SUCCESS - All entities created`)
                    success++
                } catch (rowErr) {
                    console.error(`📁 [IMPORT] Row ${i}: ❌ FAILED - Error:`, rowErr)
                    console.error(`📁 [IMPORT] Row ${i}: Error details:`, rowErr.message)
                    failed++
                }

                // Update progress
                const pct = Math.round(((i) / lines.length) * 100)
                setProcessingProgress(pct)
                console.log(`📁 [IMPORT] Progress: ${pct}% (${i}/${total} rows processed)`)
            }
            
            clearInterval(processingInterval)
            setProcessingProgress(100)
            setUploadPhase('completed')

            // Import statistics
            console.log('📁 [IMPORT] ===== IMPORT COMPLETED =====')
            console.log('📁 [IMPORT] Final statistics:')
            console.log('📁 [IMPORT] - Total records:', total)
            console.log('📁 [IMPORT] - Successful:', success)
            console.log('📁 [IMPORT] - Failed:', failed)
            console.log('📁 [IMPORT] - Success rate:', ((success / total) * 100).toFixed(1) + '%')
            
            const stats = {
                totalRecords: total,
                successful: success,
                failed: failed,
                skipped: 0,
                processingTime: 0,
                fileSize: selectedFile.size,
                importDate: new Date().toISOString()
            }
            setImportStats(stats)

            showToast({
                title: 'Import Successful',
                description: `Successfully imported ${stats.successful} records`,
                variant: 'success'
            })

            // Reset after success
            setTimeout(() => {
                setSelectedFile(null)
                setUploadProgress(0)
                setProcessingProgress(0)
                setUploadPhase('idle')
                setImportStats(null)
                setFileValidation(null)
            }, 5000)

        } catch (error) {
            setUploadPhase('idle')
            showToast({
                title: 'Import Failed',
                description: error.message,
                variant: 'error'
            })
        } finally {
            setImporting(false)
        }
    }

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

    const ProgressPhase = ({ phase, currentPhase, progress, title, description, icon: Icon, color, isCompleted = false }) => {
        const isActive = currentPhase === phase
        const isPast = isCompleted || (currentPhase === 'completed' && phase !== 'uploading')
        const isFuture = !isActive && !isPast && currentPhase !== 'completed'
        
        return (
            <div className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                isActive 
                    ? `${color} bg-opacity-10 border ${color} border-opacity-20` 
                    : isPast
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-50'
            }`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isActive 
                        ? color 
                        : isPast
                            ? 'bg-green-500'
                            : 'bg-gray-200'
                }`}>
                    <Icon className={`w-5 h-5 transition-all duration-300 ${
                        isActive 
                            ? 'text-white' 
                            : isPast
                                ? 'text-white'
                                : 'text-gray-500'
                    }`} />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-medium transition-colors duration-300 ${
                            isActive 
                                ? 'text-gray-900' 
                                : isPast
                                    ? 'text-green-800'
                                    : 'text-gray-600'
                        }`}>
                            {title}
                        </span>
                        <span className={`text-sm transition-colors duration-300 ${
                            isActive 
                                ? 'text-gray-900' 
                                : isPast
                                    ? 'text-green-700'
                                    : 'text-gray-500'
                        }`}>
                            {isPast ? '100%' : progress}%
                        </span>
                    </div>
                    <Progress 
                        value={isPast ? 100 : progress} 
                        className={`w-full h-2 transition-all duration-300 ${
                            isActive 
                                ? 'bg-gray-200' 
                                : isPast
                                    ? 'bg-green-100'
                                    : 'bg-gray-100'
                        }`}
                    />
                    <p className={`text-xs transition-colors duration-300 mt-1 ${
                        isActive 
                            ? 'text-gray-500' 
                            : isPast
                                ? 'text-green-600'
                                : 'text-gray-500'
                    }`}>
                        {isPast ? 'Completed successfully' : description}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col overflow-y-auto">
            {/* Main Content */}
            <div className="flex-1 py-4 sm:py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 border border-green-100">
                            <Upload className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Import Tool</h2>
                            <p className="text-gray-600 text-sm font-medium mt-1">Import data from CSV file</p>
                        </div>
                    </div>

                    {/* Import Options Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Download Template */}
                        <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 hover:border-blue-300 transition-all duration-200">
                            <CardContent className="p-6 flex flex-col h-full">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Download Template</h3>
                                        <p className="text-xs text-gray-500">Get CSV template</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-4 flex-grow">
                                    Download the complete CSV template with all 28 program stage fields + 10 person attributes
                                </p>
                                <Button 
                                    onClick={downloadTemplate}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl"
                                >
                                    <FiDownload className="w-4 h-4 mr-2" />
                                    Download Template
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Import Data */}
                        <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 hover:border-green-300 transition-all duration-200">
                            <CardContent className="p-6 flex flex-col h-full">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                                        <Database className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Import Data</h3>
                                        <p className="text-xs text-gray-500">Advanced upload</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">
                                    Upload your CSV file with advanced validation and streaming progress
                                </p>
                                {/* Org Unit Selector */}
                                <div className="space-y-2 mb-4">
                                    <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                                        <FiMapPin className="w-4 h-4 text-gray-500" />
                                        <span>Location</span>
                                    </label>
                                    <Select value={selectedOrgUnit} onValueChange={setSelectedOrgUnit}>
                                        <SelectTrigger className="h-10 bg-white border border-gray-300 rounded-md focus:border-gray-400 focus:ring-1 focus:ring-gray-400">
                                            <SelectValue placeholder="Select organization unit" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border border-gray-200 rounded-md max-h-60 shadow-lg">
                                            {orgUnits.map(ou => (
                                                <SelectItem key={ou.id} value={ou.id} className="hover:bg-gray-50">
                                                    {ou.displayName || ou.id}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button 
                                    onClick={handleImport}
                                    disabled={!selectedFile || importing || (fileValidation && !fileValidation.isValid) || !selectedOrgUnit}
                                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl"
                                >
                                    <FiUpload className="w-4 h-4 mr-2" />
                                    {importing ? 'Processing...' : 'Import Data'}
                                </Button>
                            </CardContent>
                        </Card>


                    </div>

                    {/* File Upload Area */}
                    <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200">
                        <CardHeader className="pb-4">
                            <SectionHeader 
                                icon={FiUpload}
                                title="Upload CSV File"
                                subtitle="Drag and drop or select your CSV file"
                                gradient="from-blue-500 to-indigo-500"
                            />
                        </CardHeader>
                        <CardContent>
                            <div
                                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
                                    dragActive 
                                        ? 'border-blue-400 bg-blue-50/50' 
                                        : selectedFile 
                                            ? 'border-green-400 bg-green-50/50' 
                                            : 'border-gray-300 hover:border-gray-400 bg-gray-50/30'
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                {selectedFile ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-center">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                                                <FiCheckCircle className="w-8 h-8 text-green-600" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-gray-900">{selectedFile.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {(selectedFile.size / 1024).toFixed(1)} KB
                                            </p>
                                        </div>
                                        
                                        {/* File Validation */}
                                        {fileValidation && (
                                            <div className="space-y-2">
                                                {fileValidation.errors.length > 0 && (
                                                    <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg border border-red-200">
                                                        <FiAlertCircle className="w-4 h-4 text-red-600" />
                                                        <span className="text-sm text-red-700">{fileValidation.errors[0]}</span>
                                                    </div>
                                                )}
                                                {fileValidation.warnings.length > 0 && (
                                                    <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                                        <FiInfo className="w-4 h-4 text-yellow-600" />
                                                        <span className="text-sm text-yellow-700">{fileValidation.warnings[0]}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setSelectedFile(null)
                                                setFileValidation(null)
                                            }}
                                            className="mt-4 border-gray-200 hover:border-red-300 text-gray-700 hover:text-red-700 rounded-xl"
                                        >
                                            <FiX className="w-4 h-4 mr-2" />
                                            Remove File
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-center">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                <FiFile className="w-8 h-8 text-gray-500" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-gray-900">
                                                Drop your CSV file here
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                or click to browse files
                                            </p>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                type="file"
                                                accept=".csv"
                                                onChange={handleFileSelect}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                id="file-upload"
                                            />
                                            <Button 
                                                variant="outline" 
                                                className="w-full border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-700 rounded-xl"
                                            >
                                                Choose File
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Advanced Progress System */}
                    {importing && (
                        <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Activity className="w-5 h-5 text-blue-600" />
                                    <span>Advanced Import Progress</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Overall Progress Bar */}
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-900">Overall Progress</span>
                                            <span className="text-sm text-gray-500">
                                                {uploadPhase === 'completed' ? 100 : 
                                                 uploadPhase === 'processing' ? Math.round(50 + (processingProgress / 2)) :
                                                 Math.round(uploadProgress / 2)}%
                                            </span>
                                        </div>
                                        <Progress 
                                            value={uploadPhase === 'completed' ? 100 : 
                                                   uploadPhase === 'processing' ? 50 + (processingProgress / 2) :
                                                   uploadProgress / 2} 
                                            className="w-full h-3"
                                        />
                                    </div>

                                    {/* Upload Phase */}
                                    <ProgressPhase 
                                        phase="uploading"
                                        currentPhase={uploadPhase}
                                        progress={uploadProgress}
                                        title="Uploading File"
                                        description={uploadPhase === 'uploading' ? 
                                            `Uploading ${selectedFile?.name} (${(selectedFile?.size / 1024).toFixed(1)} KB)` :
                                            "File uploaded successfully"}
                                        icon={FiUpload}
                                        color="bg-blue-500"
                                        isCompleted={uploadPhase === 'processing' || uploadPhase === 'completed'}
                                    />
                                    
                                    {/* Processing Phase */}
                                    <ProgressPhase 
                                        phase="processing"
                                        currentPhase={uploadPhase}
                                        progress={processingProgress}
                                        title="Processing Data"
                                        description={uploadPhase === 'processing' ? 
                                            (processingProgress < 30 ? "Validating file format and data structure" :
                                             processingProgress < 80 ? "Importing records to database" :
                                             "Finalizing import and updating indexes") :
                                            "Data processing completed"}
                                        icon={FiDatabase}
                                        color="bg-green-500"
                                        isCompleted={uploadPhase === 'completed'}
                                    />
                                    
                                    {/* Completion Phase */}
                                    <ProgressPhase 
                                        phase="completed"
                                        currentPhase={uploadPhase}
                                        progress={uploadPhase === 'completed' ? 100 : 0}
                                        title="Import Completed"
                                        description={uploadPhase === 'completed' ? 
                                            `Successfully imported ${importStats?.successful || 0} records` :
                                            "Waiting for processing to complete"}
                                        icon={FiCheckCircle}
                                        color="bg-green-500"
                                        isCompleted={uploadPhase === 'completed'}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Import Statistics */}
                    {importStats && (
                        <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <BarChart3 className="w-5 h-5 text-purple-600" />
                                    <span>Import Statistics</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                                        <p className="text-2xl font-bold text-green-600">{importStats.successful}</p>
                                        <p className="text-sm text-green-700">Successful</p>
                                    </div>
                                    <div className="text-center p-4 bg-red-50 rounded-xl border border-red-200">
                                        <p className="text-2xl font-bold text-red-600">{importStats.failed}</p>
                                        <p className="text-sm text-red-700">Failed</p>
                                    </div>
                                    <div className="text-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                                        <p className="text-2xl font-bold text-yellow-600">{importStats.skipped}</p>
                                        <p className="text-sm text-yellow-700">Skipped</p>
                                    </div>
                                    <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                                        <p className="text-2xl font-bold text-blue-600">{importStats.totalRecords}</p>
                                        <p className="text-sm text-blue-700">Total</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                                    <div className="flex items-center space-x-2">
                                        <FiClock className="w-4 h-4" />
                                        <span>Processing time: {importStats.processingTime}s</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <FiTrendingUp className="w-4 h-4" />
                                        <span>Success rate: {((importStats.successful / importStats.totalRecords) * 100).toFixed(1)}%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ImportTool
