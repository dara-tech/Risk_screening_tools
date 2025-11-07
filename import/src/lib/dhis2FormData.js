import { useDataEngine } from '@dhis2/app-runtime'

// Canonical form structure order (used for preview and ordered rendering)
export const FORM_FIELD_ORDER = [
    'systemId', 'uuic', 'donor', 'ngo', 'familyName', 'lastName', 'sex', 'dateOfBirth', 'province', 'od', 'district', 'commune',
    'sexAtBirth', 'genderIdentity', 'sexualHealthConcerns', 'hadSexPast6Months',
    'partnerMale', 'partnerFemale', 'partnerTGW', 'numberOfSexualPartners', 'past6MonthsPractices',
    'hivTestPast6Months', 'hivTestResult', 'riskScreeningResult',
    'sexWithHIVPartner', 'sexWithoutCondom', 'stiSymptoms', 'syphilisPositive',
    'receiveMoneyForSex', 'paidForSex', 'injectedDrugSharedNeedle', 'alcoholDrugBeforeSex', 'groupSexChemsex',
    'currentlyOnPrep', 'lastHivTestDate', 'abortion', 'forcedSex', 'riskScreeningScore', 'noneOfAbove', 'everOnPrep',
    'riskLevel'
]

export const FORM_FIELD_LABELS = {
    systemId: 'System ID',
    uuic: 'UUIC',
    donor: 'Donor',
    ngo: 'NGO',
    familyName: 'Family Name',
    lastName: 'Last Name',
    sex: 'Sex',
    dateOfBirth: 'Date of Birth',
    province: 'Province',
    od: 'OD',
    district: 'District',
    commune: 'Commune',
    sexAtBirth: 'Sex at Birth',
    genderIdentity: 'Gender Identity',
    sexualHealthConcerns: 'Sexual Health Concerns',
    hadSexPast6Months: 'Had Sex Past 6 Months',
    partnerMale: 'Partner Male',
    partnerFemale: 'Partner Female',
    partnerTGW: 'Partner TGW',
    numberOfSexualPartners: 'Number of Sexual Partners',
    past6MonthsPractices: 'Past 6 Months Practices',
    hivTestPast6Months: 'HIV Test Past 6 Months',
    hivTestResult: 'HIV Test Result',
    riskScreeningResult: 'Risk Screening Result',
    sexWithHIVPartner: 'Sex with HIV Partner',
    sexWithoutCondom: 'Sex without Condom',
    stiSymptoms: 'STI Symptoms',
    syphilisPositive: 'Syphilis Positive',
    receiveMoneyForSex: 'Receive Money for Sex',
    paidForSex: 'Paid for Sex',
    injectedDrugSharedNeedle: 'Injected Drug Shared Needle',
    alcoholDrugBeforeSex: 'Alcohol/Drug Before Sex',
    groupSexChemsex: 'Group Sex / Chemsex',
    currentlyOnPrep: 'Currently on PrEP',
    lastHivTestDate: 'Last HIV Test Date',
    abortion: 'Abortion',
    forcedSex: 'Forced Sex',
    riskScreeningScore: 'Risk Screening Score',
    noneOfAbove: 'None of Above',
    everOnPrep: 'Ever on PrEP',
    riskLevel: 'Risk Level'
}

export const FORM_FIELD_LABELS_KH = {
    systemId: 'លេខសម្គាល់ប្រព័ន្ធ',
    uuic: 'លេខកូដអតិថិជន (UUIC)',
    donor: 'អ្នកឧបត្ថម្ភ',
    ngo: 'អង្គការ (NGO)',
    familyName: 'ឈ្មោះ (នាមខ្លួន)',
    lastName: 'នាមត្រកូល',
    sex: 'ភេទ',
    dateOfBirth: 'ថ្ងៃខែឆ្នាំកំណើត',
    province: 'ខេត្ត',
    od: 'ស្រុកសុខាភិបាល (OD)',
    district: 'ស្រុក/ក្រុង',
    commune: 'ឃុំ/សង្កាត់',
    sexAtBirth: '១. តើភេទពីកំណើតរបស់អ្នកជាអ្វី?',
    genderIdentity: '២. តើអ្នកកំណត់អត្តសញ្ញាណភេទរបស់អ្នកយ៉ាងដូចម្តេច?',
    sexualHealthConcerns: '៣. តើអ្នកធ្លាប់ព្រួយបារម្ភអំពីសុខភាពផ្លូវភេទដែរឬទេ?',
    hadSexPast6Months: '៤. តើអ្នកធ្លាប់រួមភេទក្នុង៦ខែចុងក្រោយដែរឬទេ?',
    partnerMale: '៤.១ ដៃគូរបស់អ្នកមានអត្តសញ្ញាណជា ប្រុស',
    partnerFemale: '៤.២ ដៃគូរបស់អ្នកមានអត្តសញ្ញាណជា ស្រី',
    partnerTGW: '៤.៣ ដៃគូរបស់អ្នកមានអត្តសញ្ញាណជា TGW',
    numberOfSexualPartners: '៥. តើអ្នកមានដៃគូរួមភេទប៉ុន្មាននាក់?',
    past6MonthsPractices: '៦. ក្នុង៦ខែចុងក្រោយ តើអ្នកធ្លាប់មានអាកប្បកិរិយាខាងក្រោមដែរឬទេ?',
    hivTestPast6Months: '៧. តើអ្នកធ្លាប់ធ្វើតេស្ត HIV ក្នុង៦ខែចុងក្រោយដែរឬទេ?',
    hivTestResult: '៨. លទ្ធផលតេស្ត HIV របស់អ្នកជាអ្វី?',
    riskScreeningResult: 'លទ្ធផលវាស់វែងហានិភ័យ',
    sexWithHIVPartner: 'តើអ្នកធ្លាប់រួមភេទជាមួយដៃគូដែលដឹងថាមានមេរោគ HIV ដែរឬទេ?',
    sexWithoutCondom: 'តើអ្នកធ្លាប់រួមភេទដោយគ្មានកុងដុំដែរឬទេ?',
    stiSymptoms: 'តើអ្នកមានរោគសញ្ញាជំងឺឆ្លងតាមផ្លូវភេទដែរឬទេ?',
    syphilisPositive: 'តើអ្នកធ្លាប់តេស្តស៊ីភីលីសវិជ្ជមានដែរឬទេ?',
    receiveMoneyForSex: 'តើអ្នកធ្លាប់ទទួលប្រាក់ ឬទំនិញសម្រាប់រួមភេទដែរឬទេ?',
    paidForSex: 'តើអ្នកធ្លាប់បង់ប្រាក់ដើម្បីរួមភេទដែរឬទេ?',
    injectedDrugSharedNeedle: 'តើអ្នកធ្លាប់ចាក់ថ្នាំដោយប្រើម្ជុលរួមដែរឬទេ?',
    alcoholDrugBeforeSex: 'តើអ្នកធ្លាប់ប្រើស្រា ឬគ្រឿងញៀនមុនរួមភេទដែរឬទេ?',
    groupSexChemsex: 'តើអ្នកធ្លាប់រួមភេទជាក្រុម ឬ chemsex ដែរឬទេ?',
    currentlyOnPrep: 'តើអ្នកកំពុងប្រើប្រាស់ PrEP ដែរឬទេ?',
    lastHivTestDate: 'ថ្ងៃធ្វើតេស្ត HIV ចុងក្រោយ',
    abortion: 'តើអ្នកធ្លាប់រំលូតកូនដែរឬទេ?',
    forcedSex: 'តើអ្នកធ្លាប់ត្រូវបង្ខំឱ្យរួមភេទទាស់នឹងឆន្ទៈក្នុង៦ខែចុងក្រោយដែរឬទេ?',
    riskScreeningScore: 'ពិន្ទុវាស់វែងហានិភ័យ',
    noneOfAbove: 'គ្មានអ្វីខាងលើ',
    everOnPrep: 'តើអ្នកធ្លាប់ប្រើប្រាស់ PrEP ដែរឬទេ?',
    riskLevel: 'កម្រិតហានិភ័យ'
}

export const TEMPLATE_COLUMNS = [
    { key: 'systemId', dataKey: 'systemId', labelEn: 'System ID', labelKh: 'System ID' },
    { key: 'displayNo', dataKey: null, labelEn: 'No', labelKh: 'ល.រ' },
    { key: 'displayMonth', dataKey: null, labelEn: 'Month', labelKh: 'ខែ' },
    { key: 'displayYear', dataKey: null, labelEn: 'Year', labelKh: 'ឆ្នាំ' },
    { key: 'donor', dataKey: 'donor', labelEn: 'Donor', labelKh: 'ម្ចាស់ជំនួយ' },
    { key: 'ngo', dataKey: 'ngo', labelEn: 'NGO', labelKh: 'អង្គការ' },
    { key: 'province', dataKey: 'province', labelEn: 'Province', labelKh: 'ខេត្ត' },
    { key: 'od', dataKey: 'od', labelEn: 'Operational District', labelKh: 'ស្រុកប្រតិបត្តិ' },
    { key: 'district', dataKey: 'district', labelEn: 'District', labelKh: 'ស្រុក/ខណ្ឌ' },
    { key: 'lastHivTestDate', dataKey: 'lastHivTestDate', labelEn: 'Event Date', labelKh: 'កាលបរិច្ឆេទ (ថ្ងៃ ខែ ឆ្នាំ)' },
    { key: 'commune', dataKey: 'commune', labelEn: 'Commune', labelKh: 'ឃុំ/សង្កាត់' },
    { key: 'uuic', dataKey: 'uuic', labelEn: 'UUIC', labelKh: 'UUIC' },
    { key: 'lastName', dataKey: 'lastName', labelEn: 'Last Name', labelKh: 'នាមត្រកូល' },
    { key: 'familyName', dataKey: 'familyName', labelEn: 'Family Name', labelKh: 'នាមខ្លួន' },
    { key: 'sex', dataKey: 'sex', labelEn: 'Sex', labelKh: 'ភេទ' },
    { key: 'dateOfBirth', dataKey: 'dateOfBirth', labelEn: 'Date of Birth', labelKh: 'ថ្ងៃ ខែ ឆ្នាំកំណើត' },
    { key: 'genderIdentity', dataKey: 'genderIdentity', labelEn: 'Gender Identity', labelKh: 'អត្តសញ្ញាណភេទ' },
    { key: 'sexualHealthConcerns', dataKey: 'sexualHealthConcerns', labelEn: 'Sexual Health Concerns', labelKh: 'ក្នុងរយៈពេល ៦ខែចុងក្រោយនេះ តើអ្នកធ្លាប់បារម្ភអំពីសុខភាពផ្លូវភេទរបស់អ្នកដែរឬទេ?' },
    { key: 'hadSexPast6Months', dataKey: 'hadSexPast6Months', labelEn: 'Had Sex Past 6 Months', labelKh: 'ក្នុងរយៈពេល ៦ខែចុងក្រោយនេះ តើអ្នកធ្លាប់បានរួមភេទ (តាមមាត់ ទ្វារមាស ឬតាមរុន្ធគូទ) ដែរឬទេ?' },
    { key: 'partnerMale', dataKey: 'partnerMale', labelEn: 'Partner Male', labelKh: '១. ប្រុស' },
    { key: 'partnerFemale', dataKey: 'partnerFemale', labelEn: 'Partner Female', labelKh: '២. ស្រី' },
    { key: 'partnerTGW', dataKey: 'partnerTGW', labelEn: 'Partner TGW', labelKh: '៣. អ្នកប្លែងភេទ​ស្រី' },
    { key: 'numberOfSexualPartners', dataKey: 'numberOfSexualPartners', labelEn: 'Number of Sexual Partners', labelKh: 'ជាមធ្យម តើអ្នកមានដៃគូរួមភេទផ្សេងគ្នាចំនួនប៉ុន្មាននាក់?' },
    { key: 'sexWithHIVPartner', dataKey: 'sexWithHIVPartner', labelEn: 'Sex with HIV Partner', labelKh: '១. ដៃគូរួមភេទមានផ្ទុកមេរោគអេដស៍' },
    { key: 'sexWithoutCondom', dataKey: 'sexWithoutCondom', labelEn: 'Sex without Condom', labelKh: '២. រួមភេទដោយមិនបានប្រើស្រោមអនាម័យ' },
    { key: 'stiSymptoms', dataKey: 'stiSymptoms', labelEn: 'STI Symptoms', labelKh: '៣. ធ្លាប់មាន/កំពុងមានជំងឺកាមរោគ' },
    { key: 'syphilisPositive', dataKey: 'syphilisPositive', labelEn: 'Syphilis Positive', labelKh: '៤. មានលទ្ធផលតេស្តមេរោគស្វាយវិជ្ជមាន' },
    { key: 'receiveMoneyForSex', dataKey: 'receiveMoneyForSex', labelEn: 'Receive Money for Sex', labelKh: '៥. ធ្លាប់លក់ ឬដូរយកទំនិញក្នុងសេវាផ្លូវភេទ' },
    { key: 'paidForSex', dataKey: 'paidForSex', labelEn: 'Paid for Sex', labelKh: '៦. ធ្លាប់ទិញសេវាផ្លូវភេទ' },
    { key: 'injectedDrugSharedNeedle', dataKey: 'injectedDrugSharedNeedle', labelEn: 'Injected Drug Shared Needle', labelKh: '៧. ធ្លាប់ចាក់សារធាតុញៀន ឬប្រើម្ជុលរួមគ្នា' },
    { key: 'alcoholDrugBeforeSex', dataKey: 'alcoholDrugBeforeSex', labelEn: 'Alcohol/Drug Before Sex', labelKh: '៨. ធ្លាប់ប្រើគ្រឿងស្រវឹង ឬសារធាតុញៀនមុនពេលរួមភេទ' },
    { key: 'groupSexChemsex', dataKey: 'groupSexChemsex', labelEn: 'Group Sex/Chemsex', labelKh: '១០. ចូលរួមសកម្មភាពរួមភេទជាក្រុម ឬប្រើប្រាស់ថ្នាំជម្រុញចំណង់ផ្លូវភេទ' },
    { key: 'noneOfAbove', dataKey: 'noneOfAbove', labelEn: 'None of Above', labelKh: '១១. មិនមានចំណុចទាំងអស់ខាងលើទេ' },
    { key: 'forcedSex', dataKey: 'forcedSex', labelEn: 'Forced Sex', labelKh: 'ក្នុងរយៈពេល ៦ខែ ចុងក្រោយ តើអ្នកធ្លាប់ត្រូវបានគេបង្ខំដើម្បីការរួមភេទ​ដែរឬទេ?' },
    { key: 'everOnPrep', dataKey: 'everOnPrep', labelEn: 'Ever on PrEP', labelKh: 'តើអ្នកធ្លាប់ប្រើប្រាស់ PrEP ដែរឬទេ?' },
    { key: 'currentlyOnPrep', dataKey: 'currentlyOnPrep', labelEn: 'Currently on PrEP', labelKh: 'តើអ្នកកំពុងប្រើប្រាស់ PrEP ដែរឬទេ?' },
    { key: 'hivTestPast6Months', dataKey: 'hivTestPast6Months', labelEn: 'HIV Test Past 6 Months', labelKh: 'តើអ្នកធ្លាប់ធ្វើតេស្តរកមេរោគអេដស៍ដែរឬទេក្នុងរយៈពេល ៦ខែ ចុងក្រោយ?' },
    { key: 'hivTestResult', dataKey: 'hivTestResult', labelEn: 'HIV Test Result', labelKh: 'តើលទ្ធផលនៃការធ្វើតេស្តដូចម្តេចដែរ ប្រសិនបើអ្នកអាចប្រាប់បាន?' }
]

// Toggle verbose import logging here
const IS_DEBUG = false

/**
 * Fetch option sets from DHIS2
 */
export const fetchOptionSets = async (engine) => {
    try {
        const response = await engine.query({
            optionSets: {
                resource: 'optionSets',
                params: {
                    fields: 'id,name,options[id,name,code]',
                    paging: false
                }
            }
        })
        
        const optionSets = response.optionSets.optionSets || []
        console.log('Fetched option sets:', optionSets.length)
        
        // Create a map for easy lookup
        const optionSetMap = {}
        optionSets.forEach(optionSet => {
            optionSetMap[optionSet.id] = {
                id: optionSet.id,
                name: optionSet.name,
                options: optionSet.options || []
            }
        })
        
        return optionSetMap
    } catch (error) {
        console.error('Error fetching option sets:', error)
        return {}
    }
}

/**
 * Fetch data elements with their option sets
 */
export const fetchDataElementsWithOptions = async (engine) => {
    try {
        const response = await engine.query({
            dataElements: {
                resource: 'dataElements',
                params: {
                    fields: 'id,name,shortName,valueType,optionSet[id,name],categoryCombo[id,name]',
                    paging: false
                }
            }
        })
        
        const dataElements = response.dataElements.dataElements || []
        console.log('Fetched data elements:', dataElements.length)
        
        return dataElements
    } catch (error) {
        console.error('Error fetching data elements:', error)
        return []
    }
}

/**
 * Get options for a specific data element
 */
export const getOptionsForDataElement = async (engine, dataElementId) => {
    try {
        const response = await engine.query({
            dataElement: {
                resource: 'dataElements',
                id: dataElementId,
                params: {
                    fields: 'id,name,optionSet[id,name,options[id,name,code]]'
                }
            }
        })
        
        const dataElement = response.dataElement
        if (dataElement.optionSet) {
            return dataElement.optionSet.options || []
        }
        
        return []
    } catch (error) {
        console.error('Error fetching options for data element:', error)
        return []
    }
}

/**
 * Fetch program stage data elements with their option sets
 */
export const fetchProgramStageDataElementsWithOptions = async (engine, programStageId) => {
    try {
        const response = await engine.query({
            programStage: {
                resource: 'programStages',
                id: programStageId,
                params: {
                    fields: 'id,name,programStageDataElements[dataElement[id,name,shortName,valueType,optionSet[id,name,options[id,name,code]]]]'
                }
            }
        })
        
        const stageData = response.programStage
        const dataElements = stageData?.programStageDataElements || []
        
        // Create a map of data element ID to options
        const dataElementOptions = {}
        
        for (const psde of dataElements) {
            const dataElement = psde.dataElement
            if (dataElement.optionSet) {
                dataElementOptions[dataElement.id] = dataElement.optionSet.options || []
            }
        }
        
        console.log('Fetched program stage data elements with options:', dataElements.length)
        return {
            dataElements,
            dataElementOptions
        }
    } catch (error) {
        console.error('Error fetching program stage data elements:', error)
        return { dataElements: [], dataElementOptions: {} }
    }
}

/**
 * Get form field options based on data element mapping
 */
export const getFormFieldOptions = async (engine, fieldName, dataElementMapping) => {
    try {
        // Find the data element ID for this field
        const dataElementId = dataElementMapping[fieldName]
        if (!dataElementId) {
            console.warn(`No data element mapping found for field: ${fieldName}`)
            return []
        }
        
        // Fetch options for this data element
        const options = await getOptionsForDataElement(engine, dataElementId)
        return options
    } catch (error) {
        console.error(`Error getting options for field ${fieldName}:`, error)
        return []
    }
}

/**
 * Find existing TEI by System ID or UUIC to avoid duplicate conflicts
 */
const findExistingTei = async (engine, orgUnitId, config, data) => {
    try {
        const systemIdAttr = config.mapping.trackedEntityAttributes.System_ID
        const uuicAttr = config.mapping.trackedEntityAttributes.UUIC
        const programId = config.program.id
        
        console.log('📁 [IMPORT] Looking for existing TEI with:', {
            systemId: data.systemId,
            uuic: data.uuic,
            systemIdAttr,
            uuicAttr,
            orgUnitId,
            programId
        })
        
        // Try System ID first
        if (data.systemId && systemIdAttr) {
            try {
                const resp = await engine.query({
                    teis: {
                        resource: 'trackedEntityInstances',
                        params: {
                            ou: orgUnitId,
                            program: programId,
                            filter: `${systemIdAttr}:EQ:${data.systemId}`,
                            fields: 'trackedEntityInstance',
                            paging: false
                        }
                    }
                })
                const rows = resp?.teis?.trackedEntityInstances || []
                if (rows.length > 0) {
                    const teiId = rows[0].trackedEntityInstance
                    console.log('📁 [IMPORT] Found existing TEI by System ID:', teiId)
                    return teiId
                }
            } catch (e) {
                console.warn('📁 [IMPORT] System ID lookup failed:', e)
            }
        }
        
        // Try UUIC if System ID not found
        if (data.uuic && uuicAttr) {
            try {
                const resp = await engine.query({
                    teis: {
                        resource: 'trackedEntityInstances',
                        params: {
                            ou: orgUnitId,
                            program: programId,
                            filter: `${uuicAttr}:EQ:${data.uuic}`,
                            fields: 'trackedEntityInstance',
                            paging: false
                        }
                    }
                })
                const rows = resp?.teis?.trackedEntityInstances || []
                if (rows.length > 0) {
                    const teiId = rows[0].trackedEntityInstance
                    console.log('📁 [IMPORT] Found existing TEI by UUIC:', teiId)
                    return teiId
                }
            } catch (e) {
                console.warn('📁 [IMPORT] UUIC lookup failed:', e)
            }
        }
        
        console.log('📁 [IMPORT] No existing TEI found')
        return null
    } catch (e) {
        console.warn('📁 [IMPORT] Failed to lookup existing TEI:', e)
        return null
    }
}

/**
 * Fetch allowed TEI attribute IDs from the program configuration
 */
const fetchProgramTeAttributeIds = async (engine, programId) => {
    try {
        const resp = await engine.query({
            program: {
                resource: 'programs',
                id: programId,
                params: {
                    fields: 'id,programTrackedEntityAttributes[trackedEntityAttribute[id]]'
                }
            }
        })
        const list = resp?.program?.programTrackedEntityAttributes || []
        const ids = new Set(list.map(p => p?.trackedEntityAttribute?.id).filter(Boolean))
        return ids
    } catch (e) {
        console.warn('📁 [IMPORT] Failed to fetch program TE attributes:', e)
        return new Set()
    }
}

/**
 * Process CSV data for import - similar to manual input workflow
 */
export const processCSVForImport = async (csvText, engine, config) => {
    try {
        const lines = csvText.trim().split(/\r?\n/)
        const headers = lines[0].split(',').map(h => h.trim())
        const data = []
        
        // Flexible header mapping: support "simple download" (DHIS2 question-style) headers and template headers
        const normalizeHeader = (s) => (s || '')
            .toLowerCase()
            .replace(/\s+/g, '')
            .replace(/[^a-z0-9]/g, '')

        const headerSynonyms = {
            systemId: [
                'System ID', 'System_ID', 'SystemID', 'System-Id'
            ],
            uuic: [
                'UUIC'
            ],
            donor: [
                'Donor'
            ],
            ngo: [
                'NGO'
            ],
            familyName: [
                'Family Name', 'Fname', 'FamilyName'
            ],
            lastName: [
                'Last Name', 'Lname', 'LastName'
            ],
            sex: [
                'Sex'
            ],
            dateOfBirth: [
                'Date of Birth', 'DOB', 'DateOfBirth'
            ],
            province: [
                'Province'
            ],
            od: [
                'OD', 'Operational District', 'OperationalDistrict'
            ],
            district: [
                'District'
            ],
            commune: [
                'Commune'
            ],
            sexAtBirth: [
                'Sex at Birth', '1. What is your sex at birth?'
            ],
            genderIdentity: [
                'Gender Identity', '2. How do you identify your gender?'
            ],
            sexualHealthConcerns: [
                'Sexual Health Concerns', '3. Have you ever concerns/worries about your sexual health?'
            ],
            hadSexPast6Months: [
                'Had Sex Past 6 Months', '3.Used to have sex in the past 6months?'
            ],
            partnerMale: [
                "Partner Male", "4.1Your partner's sexual identify is Male"
            ],
            partnerFemale: [
                "Partner Female", "4.2Your partner's sexual identify is Female"
            ],
            partnerTGW: [
                "Partner TGW", "4.3Your partner's sexual identify is TGW"
            ],
            numberOfSexualPartners: [
                'Number of Sexual Partners', '5.How many sexual partner do you have?'
            ],
            past6MonthsPractices: [
                'Past 6 Months Practices', '4.Have had the following practice in the past 6months?'
            ],
            hivTestPast6Months: [
                'HIV Test Past 6 Months', '11.Had test for HIV in past 6 months?'
            ],
            hivTestResult: [
                'HIV Test Result', '12.Result of HIV test if you can tell?'
            ],
            riskScreeningResult: [
                'Risk Screening Result', 'Risk screening result'
            ],
            sexWithHIVPartner: [
                'Sex with HIV Partner', '6.3 Sex with known HIV+ partner(s)'
            ],
            sexWithoutCondom: [
                'Sex without Condom', '6.4 Sex without a condom'
            ],
            stiSymptoms: [
                'STI Symptoms', '6.5 Have a STI symptom'
            ],
            syphilisPositive: [
                'Syphilis Positive', '4.4 Tested syphilis positive'
            ],
            receiveMoneyForSex: [
                'Receive Money for Sex', '6.1 Receive money or goods for sex'
            ],
            paidForSex: [
                'Paid for Sex', '6.2 Paid for sex'
            ],
            injectedDrugSharedNeedle: [
                'Injected Drug Shared Needle', '6.9 Injected drug/shared needle'
            ],
            alcoholDrugBeforeSex: [
                'Alcohol Drug Before Sex', '6.7 Alcohol/drug before sex'
            ],
            groupSexChemsex: [
                'Group Sex Chemsex', '6.8 Joint high fun or group sex or chemsex'
            ],
            currentlyOnPrep: [
                'Currently on PrEP', '9. Currently on PrEP'
            ],
            lastHivTestDate: [
                'Last HIV Test Date', '11. When did your last HIV test?'
            ],
            abortion: [
                'Abortion', '6.6 Abortion'
            ],
            forcedSex: [
                'Forced Sex', '7. Have you ever forced to have sex against your wishes in past 6 months'
            ],
            riskScreeningScore: [
                'Risk Screening Score', 'Risk screening score'
            ],
            noneOfAbove: [
                'None of Above', '6.10 Non-Above'
            ],
            everOnPrep: [
                'Ever on PrEP', '10.Have you ever on PrEP'
            ]
        }

        // Build normalized lookup map
        const normalizedLookup = {}
        Object.entries(headerSynonyms).forEach(([fieldKey, labels]) => {
            labels.forEach(label => {
                normalizedLookup[normalizeHeader(label)] = fieldKey
            })
        })

        const expectedTranslationRow = TEMPLATE_COLUMNS.map(col => (col.labelKh || FORM_FIELD_LABELS_KH[col.dataKey ?? col.key] || '').trim())

        // Process each row
        for (let i = 1; i < lines.length; i++) {
            const row = lines[i]
            if (!row.trim()) continue
            
            const cells = row.split(',').map(c => c.trim().replace(/^"|"$/g, ''))

            // Skip Khmer translation row if present
            if (
                cells.length === expectedTranslationRow.length &&
                cells.every((cell, idx) => cell.trim() === expectedTranslationRow[idx])
            ) {
                continue
            }
            const rowData = {}
            
            // Map headers to data (flexible, case/format-insensitive)
            headers.forEach((header, index) => {
                const norm = normalizeHeader(header)
                const fieldKey = normalizedLookup[norm]
                if (fieldKey) {
                    rowData[fieldKey] = cells[index] || ''
                }
            })
            
            // Validate and transform data (like manual input validation)
            const validatedData = await validateAndTransformRowData(rowData, i, config)
            if (validatedData) {
                data.push(validatedData)
            }
        }
        
        return {
            success: true,
            data,
            totalRows: lines.length - 1,
            processedRows: data.length
        }
    } catch (error) {
        console.error('Error processing CSV:', error)
        return {
            success: false,
            error: error.message,
            data: []
        }
    }
}

/**
 * Validate and transform row data - similar to manual input validation
 */
export const validateAndTransformRowData = async (rowData, rowNumber, config) => {
    const errors = []
    const warnings = []
    
    // Required field validation (matching manual input requirements)
    const requiredFields = config.validation.requiredFields
    const headerToFieldMapping = {
        'System ID': 'systemId',
        'UUIC': 'uuic',
        'Family Name': 'familyName',
        'Last Name': 'lastName',
        'Sex': 'sex',
        'Date of Birth': 'dateOfBirth',
        'Province': 'province',
        'OD': 'od',
        'District': 'district',
        'Commune': 'commune'
    }
    
    requiredFields.forEach(field => {
        const fieldKey = headerToFieldMapping[field]
        if (!fieldKey) {
            console.warn(`No field mapping found for required field: ${field}`)
            return
        }
        if (!rowData[fieldKey] || rowData[fieldKey].trim() === '') {
            errors.push(`Row ${rowNumber}: Missing required field "${field}"`)
        }
    })
    
    // Data type validation and transformation
    const transformedData = { ...rowData }
    
    // Date validation
    if (transformedData.dateOfBirth) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/
        if (!dateRegex.test(transformedData.dateOfBirth)) {
            errors.push(`Row ${rowNumber}: Invalid date format for Date of Birth (use YYYY-MM-DD)`)
        }
    }
    
    // Age calculation (like manual input)
    if (transformedData.dateOfBirth) {
        const age = calculateAge(transformedData.dateOfBirth)
        transformedData.age = age
    }
    
    // Number validation
    if (transformedData.numberOfSexualPartners) {
        const num = parseInt(transformedData.numberOfSexualPartners)
        if (isNaN(num) || num < 0) {
            errors.push(`Row ${rowNumber}: Invalid number of sexual partners`)
        }
    }
    
    if (transformedData.riskScreeningScore) {
        const score = parseInt(transformedData.riskScreeningScore)
        if (isNaN(score) || score < 0) {
            errors.push(`Row ${rowNumber}: Invalid risk screening score`)
        }
    }
    
    // Boolean normalization (like manual input)
    const booleanFields = [
        'sexWithHIVPartner', 'sexWithoutCondom', 'stiSymptoms', 'syphilisPositive',
        'receiveMoneyForSex', 'paidForSex', 'injectedDrugSharedNeedle', 
        'alcoholDrugBeforeSex', 'groupSexChemsex', 'currentlyOnPrep', 
        'abortion', 'forcedSex', 'noneOfAbove', 'everOnPrep'
    ]
    
    booleanFields.forEach(field => {
        if (transformedData[field]) {
            const value = transformedData[field].toLowerCase()
            
            // Special handling for everOnPrep which uses 10/11/12 codes
            if (field === 'everOnPrep') {
                if (value === 'yes' || value === 'true' || value === '10' || value === '1') {
                    transformedData[field] = '10'
                } else if (value === 'no' || value === 'false' || value === '11' || value === '0') {
                    transformedData[field] = '11'
                } else if (value === 'never know' || value === 'neverknow' || value === '12' || value === 'unknown') {
                    transformedData[field] = '12'
                } else {
                    warnings.push(`Row ${rowNumber}: Ambiguous everOnPrep value: ${transformedData[field]}`)
                }
            } else if (field === 'sexualHealthConcerns') {
                if (value === 'yes' || value === 'true' || value === '1') {
                    transformedData[field] = 'true'
                } else if (value === 'no' || value === 'false' || value === '0') {
                    transformedData[field] = 'false'
                } else {
                    warnings.push(`Row ${rowNumber}: Ambiguous sexualHealthConcerns value: ${transformedData[field]}`)
                }
            } else if (field === 'sexWithoutCondom') {
                if (value === 'yes' || value === 'true' || value === '1') {
                    transformedData[field] = 'true'
                } else if (value === 'no' || value === 'false' || value === '0') {
                    transformedData[field] = 'false'
                } else {
                    warnings.push(`Row ${rowNumber}: Ambiguous sexWithoutCondom value: ${transformedData[field]}`)
                }
            } else if (field === 'currentlyOnPrep') {
                if (value === 'yes' || value === 'true' || value === '1' || value === '10') {
                    transformedData[field] = 'true'
                } else if (value === 'no' || value === 'false' || value === '0') {
                    transformedData[field] = 'false'
                } else if (value === 'never know' || value === 'neverknow' || value === '12' || value === 'unknown') {
                    transformedData[field] = ''
                    warnings.push(`Row ${rowNumber}: currentlyOnPrep set to "Never Know" - field will be left blank`)
                } else {
                    warnings.push(`Row ${rowNumber}: Ambiguous currentlyOnPrep value: ${transformedData[field]}`)
                }
            } else {
                // Convert to numeric: true -> 1, false -> 0 (for other boolean fields with numeric option sets)
                if (value === 'yes' || value === 'true' || value === '1') {
                    transformedData[field] = '1'
                } else if (value === 'no' || value === 'false' || value === '0') {
                    transformedData[field] = '0'
                } else {
                    warnings.push(`Row ${rowNumber}: Ambiguous boolean value for "${field}": ${transformedData[field]}`)
                }
            }
        }
    })
    
    // Generate unique IDs if missing (like manual input)
    if (!transformedData.systemId) {
        const timestamp = Date.now()
        const uniqueId = Math.floor(Math.random() * 10000)
        transformedData.systemId = `SYS_${timestamp}_${uniqueId}_${rowNumber}`
    }
    // Note: Don't modify existing System ID - let findExistingTei handle duplicates
    
    // Generate UUIC only if not provided
    if (!transformedData.uuic) {
        const timestamp = Date.now()
        const uniqueId = Math.floor(Math.random() * 10000)
        transformedData.uuic = `UUIC_${timestamp}_${uniqueId}_${rowNumber}`
    }
    // Note: Don't modify existing UUIC - let findExistingTei handle duplicates
    
    // Risk calculation (like manual input)
    const riskData = calculateRiskScoreFromData(transformedData)
    Object.assign(transformedData, riskData)
    
    return {
        data: transformedData,
        errors,
        warnings,
        isValid: errors.length === 0
    }
}

/**
 * Calculate age from date of birth (like manual input)
 */
export const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return ''
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }
    return age.toString()
}

/**
 * Calculate risk score from data (like manual input calculation)
 */
export const calculateRiskScoreFromData = (data) => {
    let score = 0
    const riskFactors = []

    if (data.riskScreeningScore && data.riskScreeningScore > 0) {
        score = parseInt(data.riskScreeningScore)
    } else {
        if (data.numberOfSexualPartners && parseInt(data.numberOfSexualPartners) >= 3) {
            score += 10
            riskFactors.push('Multiple sexual partners')
        }
        if (data.sexWithoutCondom === 'true') {
            score += 15
            riskFactors.push('No condom use')
        }
        if (data.sexWithHIVPartner === 'true') {
            score += 20
            riskFactors.push('Sex with HIV+ partner')
        }
        if (data.stiSymptoms === 'true') {
            score += 15
            riskFactors.push('STI symptoms')
        }
        if (data.syphilisPositive === 'true') {
            score += 15
            riskFactors.push('Syphilis positive')
        }
        if (data.hivTestResult === 'Positive') {
            score += 25
            riskFactors.push('HIV positive')
        }
        if (data.injectedDrugSharedNeedle === 'true') {
            score += 20
            riskFactors.push('Needle sharing')
        }
        if (data.alcoholDrugBeforeSex === 'true') {
            score += 12
            riskFactors.push('Drug use before sex')
        }
        if (data.groupSexChemsex === 'true') {
            score += 15
            riskFactors.push('Chemsex')
        }
        if (data.receiveMoneyForSex === 'true') {
            score += 20
            riskFactors.push('Sex work')
        }
        if (data.paidForSex === 'true') {
            score += 12
            riskFactors.push('Paid for sex')
        }
        if (data.forcedSex === 'true') {
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
    if (data.sexWithoutCondom === 'true') recommendations.push('Condom use education needed')
    if (data.hivTestResult === 'Unknown' || !data.hivTestResult) recommendations.push('HIV testing recommended')
    if (data.injectedDrugSharedNeedle === 'true') recommendations.push('Substance use counseling recommended')
    if (score >= 35) recommendations.push('Consider PrEP for HIV prevention')
    if (data.currentlyOnPrep === 'false' && score >= 20) recommendations.push('Consider PrEP for HIV prevention')

    return { 
        riskScore: score, 
        riskLevel, 
        riskFactors, 
        recommendations,
        riskScreeningScore: score
    }
}

/**
 * Create DHIS2 payload from processed data (like manual input save)
 */
export const createDHIS2Payload = (data, orgUnitId, config) => {
    // Prepare tracked entity attributes (like manual input)
    const attributes = []
    const teiMappings = {
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

    // Include all mapped TEI attributes; ensure IDs match program/TET configuration

    Object.entries(teiMappings).forEach(([key, attrId]) => {
        // Validate attribute ID format (should be 11 characters)
        if (attrId && attrId.match(/^[a-zA-Z0-9]{11}$/) && data[key]) {
            attributes.push({ attribute: attrId, value: String(data[key]) })
            console.log(`📁 [IMPORT] Added TEI attribute: ${key} = ${data[key]} (${attrId})`)
        } else if (attrId && !attrId.match(/^[a-zA-Z0-9]{11}$/)) {
            console.log(`📁 [IMPORT] Skipping invalid TEI attribute: ${key} - invalid ID: ${attrId}`)
        } else if (attrId && !data[key]) {
            console.log(`📁 [IMPORT] Skipping empty TEI attribute: ${key} - no data`)
        }
    })

    // Create TEI payload
    const teiPayload = {
        trackedEntityInstances: [{
            trackedEntityType: config.program.trackedEntityType,
            orgUnit: orgUnitId,
            attributes
        }]
    }

    return { teiPayload, attributes }
}

/**
 * Create program stage data values (like manual input)
 */
export const createProgramStageDataValues = (data, config) => {
    const dataValues = []
    const usedDataElements = new Set() // Track used data elements to prevent duplicates
    const eventMappings = {
        sexAtBirth: config.mapping.programStageDataElements.sexAtBirth,
        genderIdentity: config.mapping.programStageDataElements.genderIdentity,
        sexualHealthConcerns: config.mapping.programStageDataElements.sexualHealthConcerns,
        hadSexPast6Months: config.mapping.programStageDataElements.hadSexPast6Months,
        partnerMale: config.mapping.programStageDataElements.partnerMale,
        partnerFemale: config.mapping.programStageDataElements.partnerFemale,
        partnerTGW: config.mapping.programStageDataElements.partnerTGW,
        numberOfSexualPartners: config.mapping.programStageDataElements.numberOfSexualPartners,
        past6MonthsPractices: config.mapping.programStageDataElements.past6MonthsPractices,
        sexWithoutCondom: config.mapping.programStageDataElements.sexWithoutCondom,
        sexWithHIVPartner: config.mapping.programStageDataElements.sexWithHIVPartner,
        stiSymptoms: config.mapping.programStageDataElements.stiSymptoms,
        hivTestPast6Months: config.mapping.programStageDataElements.hivTestPast6Months,
        hivTestResult: config.mapping.programStageDataElements.hivTestResult,
        lastHivTestDate: config.mapping.programStageDataElements.lastHivTestDate,
        currentlyOnPrep: config.mapping.programStageDataElements.currentlyOnPrep,
        everOnPrep: config.mapping.programStageDataElements.everOnPrep,
        receiveMoneyForSex: config.mapping.programStageDataElements.receiveMoneyForSex,
        paidForSex: config.mapping.programStageDataElements.paidForSex,
        injectedDrugSharedNeedle: config.mapping.programStageDataElements.injectedDrugSharedNeedle,
        alcoholDrugBeforeSex: config.mapping.programStageDataElements.alcoholDrugBeforeSex,
        groupSexChemsex: config.mapping.programStageDataElements.groupSexChemsex,
        abortion: config.mapping.programStageDataElements.abortion,
        forcedSex: config.mapping.programStageDataElements.forcedSex,
        riskScreeningResult: config.mapping.programStageDataElements.riskScreeningResult,
        riskScreeningScore: config.mapping.programStageDataElements.riskScreeningScore,
        noneOfAbove: config.mapping.programStageDataElements.noneOfAbove
    }

    // Some DHIS2 data elements are trueOnly (checkbox). They only accept 'true',
    // sending 'false' causes 409 value_not_true_only conflicts. We skip 'false' values for those IDs.
    const trueOnlyElementIds = new Set([
        config.mapping.programStageDataElements.partnerMale,
        config.mapping.programStageDataElements.partnerFemale,
        config.mapping.programStageDataElements.partnerTGW,
        config.mapping.programStageDataElements.noneOfAbove
    ])

    const booleanElementIds = new Set([
        config.mapping.programStageDataElements.sexWithHIVPartner,
        config.mapping.programStageDataElements.receiveMoneyForSex,
        config.mapping.programStageDataElements.paidForSex,
        config.mapping.programStageDataElements.injectedDrugSharedNeedle,
        config.mapping.programStageDataElements.alcoholDrugBeforeSex,
        config.mapping.programStageDataElements.groupSexChemsex,
        config.mapping.programStageDataElements.forcedSex,
        config.mapping.programStageDataElements.currentlyOnPrep,
        config.mapping.programStageDataElements.stiSymptoms,
        config.mapping.programStageDataElements.sexualHealthConcerns,
        config.mapping.programStageDataElements.sexWithoutCondom
    ].filter(Boolean))

    Object.entries(eventMappings).forEach(([key, dataElementId]) => {
        // Skip invalid placeholder IDs
        if (dataElementId && dataElementId.includes('ID') && !dataElementId.match(/^[a-zA-Z0-9]{11}$/)) {
            console.log(`📁 [IMPORT] Skipping field ${key} - invalid placeholder ID: ${dataElementId}`)
            return
        }
        
        // Skip if data element already used (prevent duplicates)
        if (usedDataElements.has(dataElementId)) {
            console.log(`📁 [IMPORT] Skipping field ${key} - data element ${dataElementId} already used`)
            return
        }
        
        if (dataElementId && data[key] && dataElementId.match(/^[a-zA-Z0-9]{11}$/)) {
            let value = data[key]
            
            // Special handling for boolean data elements that expect true/false
            if (booleanElementIds.has(dataElementId)) {
                if (typeof value === 'string') {
                    const v = value.trim().toLowerCase()
                    if (['never know', 'neverknow', '12', 'unknown', ''].includes(v)) {
                        value = ''
                    } else if (['1', 'yes', 'true'].includes(v)) {
                        value = 'true'
                    } else if (['0', 'no', 'false'].includes(v)) {
                        value = 'false'
                    }
                } else if (value === 1) {
                    value = 'true'
                } else if (value === 0) {
                    value = 'false'
                }
            }

            if (value === '' || value === null || typeof value === 'undefined') {
                console.log(`📁 [IMPORT] Skipping field ${key} - empty value after normalization`)
                return
            }

            // Special handling for PrEP fields that use specific numeric codes
            if (key === 'everOnPrep') {
                // everOnPrep uses: 10=Yes, 11=No, 12=Never Know
                if (typeof value === 'string') {
                    const v = value.toLowerCase()
                    if (v === 'yes' || v === 'true' || v === '10' || v === '1') {
                        value = '10'
                    } else if (v === 'no' || v === 'false' || v === '11' || v === '0') {
                        value = '11'
                    } else if (v === 'never know' || v === 'neverknow' || v === '12' || v === 'unknown') {
                        value = '12'
                    }
                    // Keep numeric values as-is if already 10, 11, or 12
                }
            } else if (key === 'currentlyOnPrep') {
                // currentlyOnPrep is a boolean data element (Yes/No)
                if (typeof value === 'string') {
                    const v = value.toLowerCase()
                    if (['yes', 'true', '1', '10'].includes(v)) {
                        value = 'true'
                    } else if (['no', 'false', '0'].includes(v)) {
                        value = 'false'
                    }
                }
                if (value === 1 || value === 10) {
                    value = 'true'
                } else if (value === 0) {
                    value = 'false'
                }
            } else if (!booleanElementIds.has(dataElementId)) {
                // Normalize other boolean values - convert true/false to 1/0 for numeric option sets
                if (typeof value === 'string') {
                    const v = value.toLowerCase()
                    if (v === 'yes' || v === 'true' || v === '1') {
                        value = '1'
                    } else if (v === 'no' || v === 'false' || v === '0') {
                        value = '0'
                    }
                }
            }
            
            // For trueOnly data elements, only send when value is '1' or 'true'
            if (trueOnlyElementIds.has(dataElementId)) {
                if (value !== '1' && value !== 'true') {
                    console.log(`📁 [IMPORT] Skipping field ${key} - false/0 not allowed for trueOnly (${dataElementId})`)
                    return
                }
                // Normalize trueOnly to 'true' for DHIS2
                if (value === '1') {
                    value = 'true'
                }
            }

            dataValues.push({ dataElement: dataElementId, value: String(value) })
            usedDataElements.add(dataElementId) // Mark as used
            console.log(`📁 [IMPORT] Added data value: ${key} = ${value} (${dataElementId})`)
        } else if (dataElementId && !dataElementId.match(/^[a-zA-Z0-9]{11}$/)) {
            console.log(`📁 [IMPORT] Skipping field ${key} - invalid data element ID: ${dataElementId}`)
        } else if (dataElementId && !data[key]) {
            console.log(`📁 [IMPORT] Skipping field ${key} - no data value`)
        }
    })

    return dataValues
}

/**
 * Import single record to DHIS2 (with tracked entity type)
 */
export const importRecordToDHIS2 = async (data, orgUnitId, engine, config) => {
    try {
        // 0. Upsert TEI: reuse existing when System ID or UUIC already present
        let teiId = await findExistingTei(engine, orgUnitId, config, data)
        if (!teiId) {
            // 1. Create TEI (like manual input)
            const { teiPayload, attributes } = createDHIS2Payload(data, orgUnitId, config)
            // Filter attributes to only those allowed by the program/TET
            const allowedAttrIds = await fetchProgramTeAttributeIds(engine, config.program.id)
            if (allowedAttrIds && allowedAttrIds.size > 0) {
                const filtered = (attributes || []).filter(a => allowedAttrIds.has(a.attribute))
                teiPayload.trackedEntityInstances[0].attributes = filtered
                console.log(`📁 [IMPORT] Filtered TEI attributes to program-allowed: ${filtered.length}`)
            }
            console.log('📁 [IMPORT] Creating TEI:', JSON.stringify(teiPayload, null, 2))
            const teiRes = await engine.mutate({
                resource: 'trackedEntityInstances',
                type: 'create',
                data: teiPayload
            })
            console.log('📁 [IMPORT] TEI Response:', teiRes)
            if (teiRes?.response?.status === 'ERROR' || teiRes?.response?.status === 'WARNING') {
                const importSummary = teiRes?.response?.importSummaries?.[0]
                const errorDetails = importSummary?.description || 'Unknown error'
                console.error('📁 [IMPORT] TEI full response:', JSON.stringify(teiRes?.response, null, 2))
                console.error('📁 [IMPORT] TEI creation failed details:', {
                    status: teiRes?.response?.status,
                    importSummary,
                    errorDetails
                })
                if (importSummary?.conflicts && importSummary.conflicts.length > 0) {
                    const conflictDetails = importSummary.conflicts.map(c => `${c.object || ''}: ${c.value}`).join(', ')
                    // If conflict due to unique attribute, try lookup and reuse TEI
                    const isUniqueConflict = /already exists|value_exists|duplicate|unique/i.test(conflictDetails)
                    if (isUniqueConflict) {
                        teiId = await findExistingTei(engine, orgUnitId, config, data)
                        if (!teiId) throw new Error(`Duplicate TEI but not found via lookup: ${conflictDetails}`)
                        console.warn('📁 [IMPORT] Reusing existing TEI after conflict:', teiId)
                    } else {
                        throw new Error(`Duplicate data found: ${conflictDetails}`)
                    }
                } else {
                    throw new Error(`TEI creation failed: ${errorDetails}`)
                }
            } else {
                teiId = teiRes?.response?.importSummaries?.[0]?.reference
                if (!teiId) throw new Error('TEI creation failed - no reference ID')
            }
        }

        // 2. Create enrollment (like manual input)
        const enrollmentPayload = {
            enrollments: [{
                trackedEntityInstance: teiId,
                program: config.program.id,
        orgUnit: orgUnitId,
        enrollmentDate: new Date().toISOString().split('T')[0],
        incidentDate: data.dateOfBirth || new Date().toISOString().split('T')[0]
            }]
        }

        const enrRes = await engine.mutate({
            resource: 'enrollments',
            type: 'create',
            data: enrollmentPayload
        })

        if (enrRes?.response?.status === 'ERROR' || enrRes?.response?.status === 'WARNING') {
            const importSummary = enrRes?.response?.importSummaries?.[0]
            const errorDetails = importSummary?.description || 'Unknown error'
            console.error('📁 [IMPORT] Enrollment failed:', errorDetails)
            console.error('📁 [IMPORT] Enrollment import summary:', importSummary)
            throw new Error(`Enrollment failed: ${errorDetails}`)
        }

        const enrollmentId = enrRes?.response?.importSummaries?.[0]?.reference
        console.log('📁 [IMPORT] Enrollment ID:', enrollmentId)
        if (!enrollmentId) {
            console.error('📁 [IMPORT] Enrollment response:', enrRes)
            throw new Error('Enrollment failed - no reference ID')
        }

        // 3. Create event with data values (like manual input)
        const dataValues = createProgramStageDataValues(data, config)

        console.log(`📁 [IMPORT] Created ${dataValues.length} data values for event`)
        console.log('📁 [IMPORT] Data values:', JSON.stringify(dataValues, null, 2))

        // Validate data values before sending
        const validDataValues = dataValues.filter(dv => {
            if (!dv.dataElement || !dv.value) {
                console.warn(`📁 [IMPORT] Skipping invalid data value:`, dv)
                return false
            }
            return true
        })

        console.log(`📁 [IMPORT] Valid data values: ${validDataValues.length}/${dataValues.length}`)

        if (validDataValues.length > 0) {
            // Create unique event date to prevent conflicts
            const baseDate = new Date()
            const uniqueOffset = Math.floor(Math.random() * 1000) // Add random offset
            const eventDate = new Date(baseDate.getTime() + uniqueOffset)
            
            const eventPayload = {
                events: [{
                    trackedEntityInstance: teiId,
                    program: config.program.id,
                    programStage: config.program.stageId,
                    orgUnit: orgUnitId,
                    enrollment: enrollmentId,
                    eventDate: eventDate.toISOString().split('T')[0],
                    status: 'COMPLETED',
                    dataValues: validDataValues
                }]
            }

            console.log('📁 [IMPORT] Event payload:', JSON.stringify(eventPayload, null, 2))

            let evtRes
            try {
                console.log('📁 [IMPORT] Sending event creation request...')
                evtRes = await engine.mutate({
                    resource: 'events',
                    type: 'create',
                    data: eventPayload
                })
                console.log('📁 [IMPORT] Event creation request completed')
            } catch (eventError) {
                console.error('📁 [IMPORT] Event creation API error:', eventError)
                console.error('📁 [IMPORT] Event error details:', JSON.stringify(eventError, null, 2))
                console.error('📁 [IMPORT] Event error stack:', eventError.stack)
                throw new Error(`Event creation API error: ${eventError.message}`)
            }

            console.log('📁 [IMPORT] Event Response:', evtRes)
            console.log('📁 [IMPORT] Event Response Status:', evtRes?.response?.status)
            console.log('📁 [IMPORT] Event Response Details:', JSON.stringify(evtRes?.response, null, 2))

            if (evtRes?.response?.status === 'ERROR' || evtRes?.response?.status === 'WARNING') {
                const importSummary = evtRes?.response?.importSummaries?.[0]
                const errorDetails = importSummary?.description || 'Unknown error'
                console.error('📁 [IMPORT] Event creation failed:', errorDetails)
                console.error('📁 [IMPORT] Event import summary:', importSummary)

                // Check for specific conflict errors in events
                if (importSummary?.conflicts && importSummary.conflicts.length > 0) {
                    const conflictDetails = importSummary.conflicts.map(c => c.value).join(', ')
                    console.error('📁 [IMPORT] Event conflicts found:', conflictDetails)
                    throw new Error(`Event creation failed - conflicts: ${conflictDetails}`)
                }
                
                throw new Error(`Event creation failed: ${errorDetails}`)
            } else if (evtRes?.response?.status === 'SUCCESS') {
                console.log('📁 [IMPORT] Event created successfully')
            } else {
                console.error('📁 [IMPORT] Unexpected event response status:', evtRes?.response?.status)
                console.error('📁 [IMPORT] Full event response:', evtRes)
                throw new Error(`Event creation failed - unexpected status: ${evtRes?.response?.status}`)
            }
        }

        return {
            success: true,
            teiId,
            enrollmentId,
            message: 'Record imported successfully'
        }

    } catch (error) {
        console.error('Import record error:', error)
        return {
            success: false,
            error: error.message
        }
    }
}

/**
 * Create a hook for fetching form data
 */
export const useDHIS2FormData = () => {
    const engine = useDataEngine()
    
    const fetchFormData = async (programStageId) => {
        try {
            const { dataElements, dataElementOptions } = await fetchProgramStageDataElementsWithOptions(engine, programStageId)
            
            // Create a mapping of form field names to data element options
            const formFieldOptions = {}
            
            dataElements.forEach(psde => {
                const dataElement = psde.dataElement
                const options = dataElementOptions[dataElement.id] || []
                
                // Map data element names to form field options
                const elementName = dataElement.name.toLowerCase()
                
                if (elementName.includes('sex at birth') || elementName.includes('gender')) {
                    formFieldOptions.gender = options
                }
                if (elementName.includes('hiv test') && elementName.includes('past 6 months')) {
                    formFieldOptions.hivTest = options
                }
                if (elementName.includes('hiv test') && elementName.includes('result')) {
                    formFieldOptions.hivResult = options
                }
                if (elementName.includes('sti symptom')) {
                    formFieldOptions.stiSymptoms = options
                }
                if (elementName.includes('condom')) {
                    formFieldOptions.condomUse = options
                }
                if (elementName.includes('sexual partner')) {
                    formFieldOptions.sexualPartners = options
                }
                if (elementName.includes('anal sex')) {
                    formFieldOptions.analSex = options
                }
                if (elementName.includes('oral sex')) {
                    formFieldOptions.oralSex = options
                }
                if (elementName.includes('sex work')) {
                    formFieldOptions.sexWork = options
                }
                if (elementName.includes('paid for sex')) {
                    formFieldOptions.paidForSex = options
                }
                if (elementName.includes('received money for sex')) {
                    formFieldOptions.receivedMoneyForSex = options
                }
                if (elementName.includes('forced sex')) {
                    formFieldOptions.forcedSex = options
                }
                if (elementName.includes('drug use')) {
                    formFieldOptions.drugUse = options
                }
                if (elementName.includes('alcohol use')) {
                    formFieldOptions.alcoholUse = options
                }
                if (elementName.includes('needle sharing')) {
                    formFieldOptions.needleSharing = options
                }
                if (elementName.includes('chemsex')) {
                    formFieldOptions.chemsex = options
                }
                if (elementName.includes('group sex')) {
                    formFieldOptions.groupSex = options
                }
                if (elementName.includes('prep use')) {
                    formFieldOptions.prepUse = options
                }
                if (elementName.includes('art use')) {
                    formFieldOptions.artUse = options
                }
                if (elementName.includes('pregnancy')) {
                    formFieldOptions.pregnancy = options
                }
                if (elementName.includes('contraceptive')) {
                    formFieldOptions.contraceptiveUse = options
                }
                
                // Log all data elements for debugging
                console.log(`Data Element: ${dataElement.name} (${dataElement.id}) - Options: ${options.length}`)
            })
            
            return {
                dataElements,
                dataElementOptions,
                formFieldOptions
            }
        } catch (error) {
            console.error('Error fetching form data:', error)
            return {
                dataElements: [],
                dataElementOptions: {},
                formFieldOptions: {}
            }
        }
    }
    
    return { fetchFormData }
}
