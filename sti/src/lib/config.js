/**
 * Application Configuration
 * Centralized configuration for DHIS2 import application
 */

export const config = {
  // DHIS2 Default Settings
  dhis2: {
    defaultUrl: 'http://localhost:8080',
    defaultUsername: 'admin',
    defaultPassword: 'district',
    timeout: 30000, // 30 seconds
    maxRetries: 3
  },

  // File Upload Settings
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    supportedFormats: ['.csv', '.xlsx', '.xls'],
    maxRows: 10000
  },

  // Validation Settings
  validation: {
    requiredFields: [
      'System_ID', 'No', 'Month', 'Year', 'Donor', 'NGO', 
      'Province', 'OD', 'District', 'Commune', 'Date', 
      'UUIC', 'Fname', 'Lname', 'RSQ1', 'DOB'
    ],
    optionalFields: [
      'RSQ2', 'RSQ3', 'RSQ4', 'RSQ501', 'RSQ502', 'RSQ503', 
      'RSQ504', 'RSQ505', 'RSQ6', 'RSQ701', 'RSQ702', 'RSQ703', 
      'RSQ704', 'RSQ705', 'RSQ706', 'RSQ707', 'RSQ708', 'RSQ709', 
      'RSQ710', 'RSQ711', 'RSQ712', 'RSQ713', 'RSQ714', 'RSQ8', 
      'RSQ9', 'RSQ10', 'RSQ11', 'RSQ12'
    ]
  },

  // DHIS2 Program Configuration
  program: {
    id: 'gmO3xUubvMb', // Correct program ID
    name: 'STI Risk Screening Tool',
    stageId: 'hqJKFmOU6s7', // Correct program stage ID
    trackedEntityType: 'MCPQUTHX1Ze'
  },

  // Mapping Configuration
  mapping: {
    // Tracked Entity Attributes
    trackedEntityAttributes: {
      'System_ID': 'n0KF6wMqMOP',
      'UUIC': 'dPxmpNziBD8',
      'Family_Name': 'KN6AR1YuTDn',
      'Last_Name': 'gJXkrAyY061',
      'Sex': 'BR1fUe7Nx8V',
      'DOB': 'FmWxUZurqA8',
      'Province': 'Kd68BViw8AF',
      'OD': 'YxKunRADsZs',
      'District': 'fW4E5W7ePjy',
      'Commune': 'f6ztgUdD9RV'
    },

    // Program Stage Data Elements - Actual DHIS2 IDs from the data
    programStageDataElements: {
      // Gender Identity
      'genderIdentity': 'Lbi259Segyq',
      // Sexual Health Concerns
      'sexualHealthConcerns': 'HZzeCzQOuvh',
      // Had Sex Past 6 Months
      'hadSexPast6Months': 'Q2KRbrYIKHM',
      // Partner Male
      'partnerMale': 'IjncwaiwvUv',
      // Partner Female
      'partnerFemale': 'b5Jgn263AJT',
      // Partner TGW
      'partnerTGW': 'y2jfGnMOTNH',
      // Number of Sexual Partners
      'numberOfSexualPartners': 'qa4gp2GMQUA',
      // Sex Without Condom
      'sexWithoutCondom': 'bls0dsZMoRO',
      // Sex With HIV Partner
      'sexWithHIVPartner': 'JhZONUgUE87',
      // STI Symptoms
      'stiSymptoms': 'HnK9Yh1aWn1',
      // Syphilis Positive
      'syphilisPositive': 'y2jfGnMOTNH',
      // HIV Test Past 6 Months
      'hivTestPast6Months': 'b5Jgn263AJT',
      // HIV Test Result
      'hivTestResult': 'BKILZQUFa2t',
      // Last HIV Test Date
      'lastHivTestDate': 'Mm3MCV89ukA',
      // Currently On PrEP
      'currentlyOnPrep': 'fVWjzCcSCyF',
      // Ever On PrEP
      'everOnPrep': 'LTf9Uj5JnqN',
      // Receive Money For Sex
      'receiveMoneyForSex': 'nXk4YihKCF5',
      // Paid For Sex
      'paidForSex': 'sEspagSJHg6',
      // Injected Drug Shared Needle
      'injectedDrugSharedNeedle': 'ziEaDW60taC',
      // Alcohol Drug Before Sex
      'alcoholDrugBeforeSex': 'ARFp7wrxiFV',
      // Group Sex Chemsex
      'groupSexChemsex': 'upbKDAnhG8T',
      // Abortion
      'abortion': 'yWvKnLg2VRq',
      // Forced Sex
      'forcedSex': 'MBizmGFOeZg',
      // None Of Above
      'noneOfAbove': 'eEY6HLGq5FF',
      // Additional fields from the data
      'sexAtBirth': 'Hvpk8CSzvWZ',
      'riskScreeningResult': 'MBizmGFOeZg',
      'riskScreeningScore': 'eEY6HLGq5FF',
      'past6MonthsPractices': 'd30ueni5gyM'
    }
  },

  // UI Configuration
  ui: {
    theme: 'light',
    language: 'en',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm:ss',
    pagination: {
      pageSize: 50,
      maxPages: 10
    }
  },

  // Error Messages
  messages: {
    errors: {
      fileTooLarge: 'File size exceeds maximum allowed size of 10MB',
      unsupportedFormat: 'Unsupported file format. Please use CSV, XLSX, or XLS files',
      connectionFailed: 'Failed to connect to DHIS2 server. Please check your credentials and server URL',
      authenticationFailed: 'Authentication failed. Please check your username and password',
      importFailed: 'Import failed. Please check your data and try again',
      validationFailed: 'Data validation failed. Please fix the errors and try again'
    },
    success: {
      fileUploaded: 'File uploaded successfully',
      dataValidated: 'Data validated successfully',
      dataMapped: 'Data mapped to DHIS2 format successfully',
      importCompleted: 'Import completed successfully'
    }
  },

  // Local Storage Keys
  storage: {
    dhis2Config: 'dhis2_config',
    importHistory: 'import_history',
    userPreferences: 'user_preferences'
  }
};

export default config;

