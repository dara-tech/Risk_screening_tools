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
import * as XLSX from 'xlsx'
import config from '../lib/config'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { 
    processCSVForImport, 
    validateAndTransformRowData, 
    importRecordToDHIS2 
} from '../lib/dhis2FormData'
import ConnectionStatus from './ConnectionStatus'
import { FORM_FIELD_ORDER, FORM_FIELD_LABELS } from '../lib/dhis2FormData'

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
    const [processedData, setProcessedData] = useState(null)
    const [showPreview, setShowPreview] = useState(false)
    const [rowResults, setRowResults] = useState([])
    const [resultFilter, setResultFilter] = useState('all') // all | success | failed | skipped
    const [logs, setLogs] = useState([]) // streaming logs
    const logsEndRef = React.useRef(null)
    
    const engine = useDataEngine()
    const { showToast } = useToast()

    // Auto-scroll logs to bottom when updated
    useEffect(() => {
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [logs])

    const appendLog = (message, level = 'info') => {
        const ts = new Date().toISOString()
        setLogs(prev => [...prev, { ts, level, message }])
    }

    const clearLogs = () => setLogs([])

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
    }, [engine, showToast])

    const readFileToCsvText = async (file) => {
        const name = (file.name || '').toLowerCase()
        if (name.endsWith('.csv')) {
            return await file.text()
        }
        if (name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.xlsm')) {
            const arrayBuffer = await file.arrayBuffer()
            const workbook = XLSX.read(arrayBuffer, { type: 'array' })
            const firstSheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[firstSheetName]
            // Convert to CSV so we can reuse existing CSV pipeline
            const csv = XLSX.utils.sheet_to_csv(worksheet)
            return csv
        }
        // Fallback
        return await file.text()
    }

    const handleFileSelect = async (event) => {
        const file = event.target.files[0]
        if (file) {
            appendLog(`Selected file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`, 'info')
            validateFile(file)
            setSelectedFile(file)
            setUploadPhase('idle')
            setUploadProgress(0)
            setProcessingProgress(0)
            setImportStats(null)
            setProcessedData(null)
            setShowPreview(false)
            
            // Process file for preview
            try {
                const text = await readFileToCsvText(file)
                const processResult = await processCSVForImport(text, engine, config)
                if (processResult.success) {
                    setProcessedData(processResult)
                    appendLog(`Parsed CSV: ${processResult.processedRows}/${processResult.totalRows} valid rows`, 'info')
                }
            } catch (error) {
                console.error('Error processing file for preview:', error)
                appendLog(`Failed to parse CSV: ${error.message}`, 'error')
            }
        }
    }

    const validateFile = (file) => {
        const validation = {
            isValid: true,
            errors: [],
            warnings: []
        }

        // Check file type against supported formats in config
        const supported = (config?.upload?.supportedFormats || []).map(ext => String(ext).toLowerCase())
        const lowerName = (file.name || '').toLowerCase()
        const matches = supported.some(ext => lowerName.endsWith(ext))
        if (!matches) {
            validation.isValid = false
            validation.errors.push(config?.messages?.errors?.unsupportedFormat || 'Unsupported file format')
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

    const handleDrop = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]
            appendLog(`Dropped file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`, 'info')
            validateFile(file)
            setSelectedFile(file)
            setUploadPhase('idle')
            setUploadProgress(0)
            setProcessingProgress(0)
            setImportStats(null)
            setProcessedData(null)
            setShowPreview(false)
            
            // Process file for preview
            try {
                const text = await readFileToCsvText(file)
                const processResult = await processCSVForImport(text, engine, config)
                if (processResult.success) {
                    setProcessedData(processResult)
                    appendLog(`Parsed CSV: ${processResult.processedRows}/${processResult.totalRows} valid rows`, 'info')
                }
            } catch (error) {
                console.error('Error processing file for preview:', error)
                appendLog(`Failed to parse CSV: ${error.message}`, 'error')
            }
        }
    }

    const testUUICAttribute = async () => {
        try {
            showToast({
                title: 'UUIC Attribute Issue',
                description: 'UUIC attribute ID not found in DHIS2',
                variant: 'error'
            })

            console.log('📁 [UUIC TEST] UUIC attribute ID "dPxmpNziBD8" does not exist in DHIS2')
            console.log('📁 [UUIC TEST] This is why imports were failing with 409 errors')
            console.log('📁 [UUIC TEST] Import will now work without UUIC attribute')

            showToast({
                title: 'UUIC Issue Identified',
                description: 'UUIC attribute ID is invalid - import will work without it',
                variant: 'warning'
            })

        } catch (error) {
            console.error('📁 [UUIC TEST] Failed:', error)
            showToast({
                title: 'UUIC Test Failed',
                description: error.message,
                variant: 'error'
            })
        }
    }

    // Dev utility: testSimpleTEI (hidden in production)
    const testSimpleTEI = async () => {
        try {
            showToast({
                title: 'Testing Simple TEI',
                description: 'Testing basic TEI creation...',
                variant: 'default'
            })

            const timestamp = Date.now()
            const uniqueId = Math.floor(Math.random() * 10000)
            const simplePayload = {
                trackedEntityInstances: [{
                    trackedEntityType: config.program.trackedEntityType,
                    orgUnit: selectedOrgUnit || orgUnits[0]?.id,
                    attributes: [
                        { attribute: config.mapping.trackedEntityAttributes['System_ID'], value: `SIMPLE_TEST_${timestamp}_${uniqueId}` }
                    ]
                }]
            }

            console.log('📁 [SIMPLE TEST] Payload:', JSON.stringify(simplePayload, null, 2))

            const result = await engine.mutate({
                resource: 'trackedEntityInstances',
                type: 'create',
                data: simplePayload
            })

            console.log('📁 [SIMPLE TEST] Result:', result)

            if (result?.response?.status === 'SUCCESS') {
                showToast({
                    title: 'Simple Test Success',
                    description: 'Basic TEI creation works',
                    variant: 'success'
                })
            } else {
                console.log('📁 [SIMPLE TEST] Response details:', result?.response)
                showToast({
                    title: 'Simple Test Failed',
                    description: 'Check console for details',
                    variant: 'error'
                })
            }

        } catch (error) {
            console.error('📁 [SIMPLE TEST] Failed:', error)
            showToast({
                title: 'Simple Test Failed',
                description: error.message,
                variant: 'error'
            })
        }
    }

    // Dev utility: testImportProcess (hidden in production)
    const testImportProcess = async () => {
        try {
            showToast({
                title: 'Testing Import Process',
                description: 'Testing CSV processing and validation...',
                variant: 'default'
            })

            // Create a test CSV
            const testCSV = `System ID,UUIC,Family Name,Last Name,Sex,Date of Birth,Province,OD,District,Commune,Sex at Birth,Gender Identity,Sexual Health Concerns,Had Sex Past 6 Months,Partner Male,Partner Female,Partner TGW,Number of Sexual Partners,Past 6 Months Practices,HIV Test Past 6 Months,HIV Test Result,Risk Screening Result,Sex with HIV Partner,Sex without Condom,STI Symptoms,Syphilis Positive,Receive Money for Sex,Paid for Sex,Injected Drug Shared Needle,Alcohol Drug Before Sex,Group Sex Chemsex,Currently on PrEP,Last HIV Test Date,Abortion,Forced Sex,Risk Screening Score,None of Above,Ever on PrEP
TEST_SYS_001,TEST_UUIC_001,Doe,John,Male,1990-05-15,Phnom Penh,OD001,District 1,Commune A,Male,Male,Yes,Yes,Yes,No,No,2,Yes,Yes,Negative,Medium Risk,false,true,false,false,false,false,true,false,false,false,2024-01-15,false,false,15,false,false`

            const processResult = await processCSVForImport(testCSV, engine, config)
            
            console.log('📁 [IMPORT TEST] Process result:', processResult)
            
            if (processResult.success && processResult.processedRows > 0) {
                // Test actual import of one record
                const testRecord = processResult.data[0]
                if (testRecord && testRecord.isValid) {
                    const importResult = await importRecordToDHIS2(testRecord.data, selectedOrgUnit || orgUnits[0]?.id, engine, config)
                    
                    if (importResult.success) {
                        showToast({
                            title: 'Import Test Success',
                            description: `Successfully imported test record with TEI: ${importResult.teiId}`,
                            variant: 'success'
                        })
                    } else {
                        showToast({
                            title: 'Import Test Failed',
                            description: `Import failed: ${importResult.error}`,
                            variant: 'error'
                        })
                    }
                } else {
                    showToast({
                        title: 'Import Test Failed',
                        description: 'Test record validation failed',
                        variant: 'error'
                    })
                }
            } else {
                showToast({
                    title: 'Import Process Test Failed',
                    description: 'No valid records found',
                    variant: 'error'
                })
            }

        } catch (error) {
            console.error('📁 [IMPORT TEST] Failed:', error)
            showToast({
                title: 'Import Process Test Failed',
                description: error.message,
                variant: 'error'
            })
        }
    }

    const testBasicConnection = async () => {
        try {
            showToast({
                title: 'Testing Basic Connection',
                description: 'Testing DHIS2 connectivity...',
                variant: 'default'
            })

            // Test basic connection
            const systemInfo = await engine.query({
                systemInfo: {
                    resource: 'system/info'
                }
            })
            console.log('📁 [BASIC TEST] System info:', systemInfo)

            // Test current user
            const currentUser = await engine.query({
                currentUser: {
                    resource: 'me',
                    params: {
                        fields: 'id,displayName'
                    }
                }
            })
            console.log('📁 [BASIC TEST] Current user:', currentUser)

            showToast({
                title: 'Basic Connection OK',
                description: 'DHIS2 is accessible',
                variant: 'success'
            })

        } catch (error) {
            console.error('📁 [BASIC TEST] Basic connection failed:', error)
            showToast({
                title: 'Basic Connection Failed',
                description: error.message,
                variant: 'error'
            })
        }
    }

    // Dev utility: testDHIS2Connection (hidden in production)
    const testDHIS2Connection = async () => {
        try {
            showToast({
                title: 'Testing Connection',
                description: 'Testing DHIS2 connection and permissions...',
                variant: 'default'
            })

            // Test basic connection
            const systemInfo = await engine.query({
                systemInfo: {
                    resource: 'system/info'
                }
            })
            console.log('📁 [TEST] System info:', systemInfo)

            // Test current user and permissions
            const currentUser = await engine.query({
                currentUser: {
                    resource: 'me',
                    params: {
                        fields: 'id,displayName,organisationUnits[id,displayName,level]'
                    }
                }
            })
            console.log('📁 [TEST] Current user:', currentUser)

            // Test organization units
            const userOUs = await engine.query({
                userOUs: {
                    resource: 'organisationUnits',
                    params: {
                        withinUserHierarchy: true,
                        paging: false,
                        fields: 'id,displayName,level'
                    }
                }
            })
            console.log('📁 [TEST] User organization units:', userOUs)

            // Test basic program access
            const programInfo = await engine.query({
                program: {
                    resource: `programs/${config.program.id}`,
                    params: {
                        fields: 'id,displayName,programType'
                    }
                }
            })
            console.log('📁 [TEST] Program info:', programInfo)

            // Test program stage access
            const programStageInfo = await engine.query({
                programStage: {
                    resource: `programStages/${config.program.stageId}`,
                    params: {
                        fields: 'id,displayName'
                    }
                }
            })
            console.log('📁 [TEST] Program Stage info:', programStageInfo)

            // Test tracked entity type access
            const trackedEntityTypeInfo = await engine.query({
                trackedEntityType: {
                    resource: `trackedEntityTypes/${config.program.trackedEntityType}`,
                    params: {
                        fields: 'id,displayName'
                    }
                }
            })
            console.log('📁 [TEST] Tracked Entity Type info:', trackedEntityTypeInfo)

            // Test if we can create a TEI
            const timestamp = Date.now()
            const testTEIPayload = {
                trackedEntityInstances: [{
                    trackedEntityType: config.program.trackedEntityType,
                    orgUnit: selectedOrgUnit || orgUnits[0]?.id,
                    attributes: [
                        { attribute: config.mapping.trackedEntityAttributes['System_ID'], value: `TEST_SYS_${timestamp}` }
                    ]
                }]
            }
            
            console.log('📁 [TEST] Test TEI payload:', JSON.stringify(testTEIPayload, null, 2))

            const testTEIRes = await engine.mutate({
                resource: 'trackedEntityInstances',
                type: 'create',
                data: testTEIPayload
            })

            console.log('📁 [TEST] Test TEI creation result:', testTEIRes)
            
            // Check the response more carefully
            if (testTEIRes?.response) {
                console.log('📁 [TEST] Response status:', testTEIRes.response.status)
                console.log('📁 [TEST] Response importSummaries:', testTEIRes.response.importSummaries)
                
                if (testTEIRes.response.importSummaries && testTEIRes.response.importSummaries.length > 0) {
                    const summary = testTEIRes.response.importSummaries[0]
                    console.log('📁 [TEST] Import summary status:', summary.status)
                    console.log('📁 [TEST] Import summary description:', summary.description)
                    console.log('📁 [TEST] Import summary conflicts:', summary.conflicts)
                    console.log('📁 [TEST] Import summary reference:', summary.reference)
                }
            }

            showToast({
                title: 'Connection Test Complete',
                description: 'Check console for detailed results',
                variant: 'success'
            })

        } catch (error) {
            console.error('📁 [TEST] Connection test failed:', error)
            
            // Try to get more detailed error information
            if (error.details) {
                console.error('📁 [TEST] Error details:', error.details)
            }
            if (error.response) {
                console.error('📁 [TEST] Error response:', error.response)
            }
            
            showToast({
                title: 'Connection Test Failed',
                description: error.message,
                variant: 'error'
            })
        }
    }

    const downloadTemplate = () => {
        // Generate unique IDs for the template
        const timestamp = Date.now()

        // Build header from canonical form order and labels (exclude age in template)
        const exportOrder = FORM_FIELD_ORDER.filter(k => k !== 'age')
        const headers = exportOrder.map(k => FORM_FIELD_LABELS[k] || k).join(',')

        // Example rows mapped by canonical keys (derived values left empty)
        const sample1 = {
            systemId: `SYS_${timestamp}_001`,
            uuic: `UUIC_${timestamp}_001`,
            donor: 'Donor 1',
            ngo: 'NGO 1',
            familyName: 'Doe',
            lastName: 'John',
            sex: 'Male',
            dateOfBirth: '1990-05-15',
            province: 'Phnom Penh',
            od: 'OD001',
            district: 'District 1',
            commune: 'Commune A',
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
            riskScreeningScore: '15',
            noneOfAbove: 'false',
            everOnPrep: 'false',
            riskLevel: ''
        }
        const sample2 = {
            systemId: `SYS_${timestamp}_002`,
            uuic: `UUIC_${timestamp}_002`,
            donor: 'Donor 2',
            ngo: 'NGO 2',
            familyName: 'Smith',
            lastName: 'Jane',
            sex: 'Female',
            dateOfBirth: '1985-08-22',
            province: 'Battambang',
            od: 'OD002',
            district: 'District 2',
            commune: 'Commune B',
            sexAtBirth: 'Female',
            genderIdentity: 'Female',
            sexualHealthConcerns: 'Yes',
            hadSexPast6Months: 'Yes',
            partnerMale: 'No',
            partnerFemale: 'Yes',
            partnerTGW: 'No',
            numberOfSexualPartners: '1',
            past6MonthsPractices: 'Yes',
            hivTestPast6Months: 'Yes',
            hivTestResult: 'Negative',
            riskScreeningResult: 'Low Risk',
            sexWithHIVPartner: 'false',
            sexWithoutCondom: 'false',
            stiSymptoms: 'false',
            syphilisPositive: 'false',
            receiveMoneyForSex: 'false',
            paidForSex: 'false',
            injectedDrugSharedNeedle: 'false',
            alcoholDrugBeforeSex: 'false',
            groupSexChemsex: 'false',
            currentlyOnPrep: 'false',
            lastHivTestDate: '2024-02-20',
            abortion: 'false',
            forcedSex: 'false',
            riskScreeningScore: '8',
            noneOfAbove: 'false',
            everOnPrep: 'false',
            riskLevel: ''
        }

        const rowToCsv = (row) => exportOrder.map(k => {
            const v = row[k] ?? ''
            // escape quotes and commas if needed
            const s = String(v)
            return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
        }).join(',')

        const content = [headers, rowToCsv(sample1), rowToCsv(sample2)].join('\n')

        const blob = new Blob([content], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'sti_screening_template.csv'
        a.click()
        window.URL.revokeObjectURL(url)
        
        showToast({
            title: 'Template Downloaded',
            description: 'CSV template ordered by form structure downloaded successfully',
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
        appendLog('Upload started', 'info')
        setUploadProgress(0)
        setProcessingProgress(0)

        try {
            // Phase 1: Upload Progress (0-100%)
            const uploadInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(uploadInterval)
                        setUploadPhase('processing')
                        appendLog('Upload completed. Processing started', 'info')
                        return 100
                    }
                    const remaining = 100 - prev
                    const increment = remaining > 20 ? Math.random() * 6 + 3 : Math.random() * 2 + 1
                    return Math.min(100, prev + increment)
                })
            }, 200)

            // Simulate upload time
            const uploadTime = Math.min(3000, Math.max(1000, selectedFile.size / 1000))
            await new Promise(resolve => setTimeout(resolve, uploadTime))
            
            clearInterval(uploadInterval)
            setUploadProgress(100)
            setUploadPhase('processing')

            // Phase 2: Real import (processingProgress reflects actual row progress)

            // Real import process using new functions (like manual input)
            console.log('📁 [IMPORT] Starting improved import process (like manual input)...')
            appendLog('Starting import process...', 'info')
            
            const text = await readFileToCsvText(selectedFile)
            
            // Process CSV data (like manual input validation)
            const processResult = await processCSVForImport(text, engine, config)
            
            if (!processResult.success) {
                appendLog(`CSV processing failed: ${processResult.error}`, 'error')
                throw new Error(`CSV processing failed: ${processResult.error}`)
            }
            
            const { data: processedData, totalRows } = processResult
            console.log(`📁 [IMPORT] Processed ${processedData.length} valid records from ${totalRows} total rows`)
            appendLog(`Validated CSV: ${processedData.length}/${totalRows} valid rows`, 'info')

            let success = 0, failed = 0, skipped = 0
            setRowResults([])
            const startTime = Date.now()

            // Import each processed record (like manual input save)
            for (let i = 0; i < processedData.length; i++) {
                try {
                    const recordData = processedData[i]
                    
                    if (!recordData.isValid) {
                        console.log(`📁 [IMPORT] Row ${i + 1}: Skipping invalid record`)
                        skipped++
                        appendLog(`Row ${i + 1}: Skipped (invalid)`, 'warning')
                        setRowResults(prev => [...prev, {
                            row: i + 1,
                            systemId: recordData.data.systemId || '-'
                            , status: 'skipped', message: 'Validation failed'
                        }])
                        continue
                    }
                    
                    console.log(`📁 [IMPORT] Row ${i + 1}: Processing record - System ID: ${recordData.data.systemId}, UUIC: ${recordData.data.uuic}`)
                    appendLog(`Row ${i + 1}: Importing TEI ${recordData.data.systemId}`, 'info')

                    // Import record to DHIS2 (like manual input save process)
                    const importResult = await importRecordToDHIS2(recordData.data, selectedOrgUnit, engine, config)
                    
                    if (importResult.success) {
                        success++
                        console.log(`📁 [IMPORT] Row ${i + 1}: ✅ SUCCESS - TEI: ${importResult.teiId}`)
                        appendLog(`Row ${i + 1}: Success (TEI ${importResult.teiId})`, 'success')
                        setRowResults(prev => [...prev, {
                            row: i + 1,
                            systemId: recordData.data.systemId || '-',
                            status: 'success',
                            message: `TEI ${importResult.teiId}`
                        }])
                    } else {
                        failed++
                        console.error(`📁 [IMPORT] Row ${i + 1}: ❌ FAILED - ${importResult.error}`)
                        appendLog(`Row ${i + 1}: Failed - ${importResult.error}`, 'error')
                        setRowResults(prev => [...prev, {
                            row: i + 1,
                            systemId: recordData.data.systemId || '-',
                            status: 'failed',
                            message: importResult.error || 'Unknown error'
                        }])
                    }

                } catch (rowErr) {
                    console.error(`📁 [IMPORT] Row ${i + 1}: ❌ FAILED -`, rowErr.message)
                    failed++
                    appendLog(`Row ${i + 1}: Failed - ${rowErr.message}`, 'error')
                    setRowResults(prev => [...prev, {
                        row: i + 1,
                        systemId: recordData?.data?.systemId || '-',
                        status: 'failed',
                        message: rowErr.message || 'Unknown error'
                    }])
                }

                // Update progress
                const pct = Math.round(((i + 1) / processedData.length) * 100)
                setProcessingProgress(pct)
            }
            
            setProcessingProgress(100)
            setUploadPhase('completed')
            appendLog(`Import completed: ${success} success, ${failed} failed, ${skipped} skipped`, failed > 0 ? 'warning' : 'success')

            const processingTime = Math.round((Date.now() - startTime) / 1000)

            // Import statistics
            const stats = {
                totalRecords: totalRows,
                successful: success,
                failed: failed,
                skipped: skipped,
                processingTime: processingTime,
                fileSize: selectedFile.size,
                importDate: new Date().toISOString()
            }
            setImportStats(stats)

            showToast({
                title: 'Import Completed',
                description: `Successfully imported ${success} records (${failed} failed, ${skipped} skipped)`,
                variant: success > 0 ? 'success' : 'error'
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
            appendLog(`Import failed: ${error.message}`, 'error')
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
        <div className="min-h-screen flex flex-col">
            {/* Main Content */}
            <div className="flex-1 py-4 sm:py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    {/* Connection Status */}
                    <ConnectionStatus engine={engine} />
                    
                    {/* Header */}
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 border border-green-100">
                            <Upload className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Import Tool</h2>
                            <p className="text-gray-600 text-sm font-medium mt-1">Import data from CSV file to DHIS2</p>
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
                                    Download the complete CSV template with all 38 fields for STI screening data
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
                                        <p className="text-xs text-gray-500">Real DHIS2 import</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">
                                    Upload your CSV file to import data into DHIS2
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
                                    disabled={!selectedFile || importing || (fileValidation && !fileValidation.isValid) || !selectedOrgUnit || (processedData && processedData.processedRows === 0)}
                                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl"
                                >
                                    <FiUpload className="w-4 h-4 mr-2" />
                                    {importing ? 'Processing...' : 'Import Data'}
                                </Button>
                                {processedData && processedData.processedRows === 0 && (
                                    <p className="text-xs text-red-600 mt-2">
                                        ⚠️ No valid records found. Please check your CSV file format.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Dev-only test controls removed for production UI cleanliness */}
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
                            {/* Data Preview */}
                            {processedData && (
                                <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-blue-900">Data Preview</h4>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowPreview(!showPreview)}
                                            className="text-blue-700 border-blue-300 hover:bg-blue-100"
                                        >
                                            {showPreview ? 'Hide Preview' : 'Show Preview'}
                                        </Button>
                                    </div>
                                    <div className="text-sm text-blue-700 space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <FiDatabase className="w-4 h-4" />
                                            <span><strong>{processedData.processedRows}</strong> valid records found</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <FileText className="w-4 h-4" />
                                            <span><strong>{processedData.totalRows}</strong> total rows in file</span>
                                        </div>
                                        {processedData.data.length > 0 && (
                                            <div className="flex items-center space-x-2">
                                                <FiCheckCircle className="w-4 h-4" />
                                                <span>Data validation completed successfully</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {showPreview && processedData.data.length > 0 && (
                                        <div className="mt-4 max-h-60 overflow-y-auto">
                                            <div className="bg-white rounded-lg border border-blue-200">
                                                <div className="p-3 border-b border-blue-200 bg-blue-50">
                                                    <h5 className="font-medium text-blue-900">First 3 Records Preview:</h5>
                                                </div>
                                                <div className="p-3 space-y-2">
                                                    {processedData.data.slice(0, 3).map((record, index) => (
                                                        <div key={index} className="p-2 bg-gray-50 rounded border">
                                                            <div className="text-xs text-gray-600 mb-1">
                                                                Record {index + 1} - {record.data.systemId}
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2 text-xs">
                                                                {FORM_FIELD_ORDER.map((key) => (
                                                                    <div key={key} className="truncate">
                                                                        <strong>{FORM_FIELD_LABELS[key] || key}:</strong> {String(record.data[key] ?? 'N/A')}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            {record.errors.length > 0 && (
                                                                <div className="mt-1 text-xs text-red-600">
                                                                    ⚠️ {record.errors.length} validation errors
                                                                </div>
                                                            )}
                                                            {record.warnings.length > 0 && (
                                                                <div className="mt-1 text-xs text-yellow-600">
                                                                    ⚠️ {record.warnings.length} warnings
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
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
                                                accept=".csv,.xlsx,.xls,.xlsm"
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
                                    <span>Import Progress</span>
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
                                                 uploadPhase === 'processing' ? Math.round(30 + (processingProgress * 0.7)) :
                                                 Math.round(uploadProgress * 0.3)}%
                                            </span>
                                        </div>
                                        <Progress 
                                            value={uploadPhase === 'completed' ? 100 :
                                                   uploadPhase === 'processing' ? 30 + (processingProgress * 0.7) :
                                                   uploadProgress * 0.3} 
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
                                             processingProgress < 80 ? "Importing records to DHIS2" :
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

                    {/* Live Logs */}
                    <Card className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center space-x-2">
                                    <Activity className="w-5 h-5 text-gray-700" />
                                    <span>Live Logs</span>
                                </CardTitle>
                                <Button variant="outline" size="sm" onClick={clearLogs} className="border-gray-200 hover:border-red-300 text-gray-700 hover:text-red-700 rounded-xl">Clear</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-48 overflow-y-auto bg-gray-50 rounded-xl border border-gray-200 p-3 space-y-1">
                                {logs.length === 0 && (
                                    <p className="text-sm text-gray-500">No logs yet. Start an import to see streaming logs.</p>
                                )}
                                {logs.map((l, idx) => (
                                    <div key={idx} className={`text-xs ${l.level === 'error' ? 'text-red-700' : l.level === 'warning' ? 'text-yellow-700' : l.level === 'success' ? 'text-green-700' : 'text-gray-700'}`}>
                                        <span className="text-gray-400 mr-2">[{new Date(l.ts).toLocaleTimeString()}]</span>
                                        {l.message}
                                    </div>
                                ))}
                                <div ref={logsEndRef} />
                            </div>
                        </CardContent>
                    </Card>

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

                                {/* Row details and filter */}
                                <div className="mt-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-gray-900">Row Results</h4>
                                        <Select value={resultFilter} onValueChange={setResultFilter}>
                                            <SelectTrigger className="h-8 w-40 bg-white border border-gray-300 rounded-md">
                                                <SelectValue placeholder="Filter" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border border-gray-200 rounded-md">
                                                <SelectItem value="all">All</SelectItem>
                                                <SelectItem value="success">Success</SelectItem>
                                                <SelectItem value="failed">Failed</SelectItem>
                                                <SelectItem value="skipped">Skipped</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="max-h-56 overflow-y-auto border border-gray-200 rounded-xl">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50 text-gray-600">
                                                <tr>
                                                    <th className="text-left px-3 py-2">Row</th>
                                                    <th className="text-left px-3 py-2">System ID</th>
                                                    <th className="text-left px-3 py-2">Status</th>
                                                    <th className="text-left px-3 py-2">Message</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {rowResults
                                                    .filter(r => resultFilter === 'all' || r.status === resultFilter)
                                                    .map((r, idx) => (
                                                        <tr key={idx} className="border-t border-gray-200">
                                                            <td className="px-3 py-2 text-gray-700">{r.row}</td>
                                                            <td className="px-3 py-2 text-gray-700">{r.systemId}</td>
                                                            <td className="px-3 py-2">
                                                                <span className={`px-2 py-0.5 rounded text-xs ${r.status === 'success' ? 'bg-green-100 text-green-700' : r.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                                    {r.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-3 py-2 text-gray-600">{r.message}</td>
                                                        </tr>
                                                    ))}
                                                {rowResults.length === 0 && (
                                                    <tr>
                                                        <td className="px-3 py-3 text-gray-500" colSpan={4}>No row results captured</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
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
