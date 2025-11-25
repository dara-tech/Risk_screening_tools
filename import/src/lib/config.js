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
    supportedFormats: ['.csv', '.xlsx', '.xls', '.xlsm'],
    maxRows: 10000
  },

  // Validation Settings
  validation: {
    requiredFields: [
      'System ID', 'UUIC', 'Family Name', 'Last Name', 'Sex', 'Date of Birth',
      'Province', 'OD', 'District', 'Commune'
    ],
    optionalFields: [
      'Sex at Birth', 'Gender Identity', 'Sexual Health Concerns', 'Had Sex Past 6 Months',
      'Partner Male', 'Partner Female', 'Partner TGW', 'Number of Sexual Partners', 'Donor', 'NGO',
      'Past 6 Months Practices', 'HIV Test Past 6 Months', 'HIV Test Result',
      'Risk Screening Result', 'Sex with HIV Partner', 'Sex without Condom', 'STI Symptoms',
      'Syphilis Positive', 'Receive Money for Sex', 'Paid for Sex', 'Injected Drug Shared Needle',
      'Alcohol Drug Before Sex', 'Group Sex Chemsex', 'Currently on PrEP', 'Last HIV Test Date',
      'Abortion', 'Forced Sex', 'Risk Screening Score', 'None of Above', 'Ever on PrEP'
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
      'UUIC': 'e5FXJFKQyuB',
      'Donor': 'PU5ZFhLIFA7',
      'NGO': 'LTSLftFhQoL',
      'Family_Name': 'gJXkrAyY061',
      'Last_Name': 'KN6AR1YuTDn',
      'Sex': 'BR1fUe7Nx8V',
      'sex': 'BR1fUe7Nx8V', // Add lowercase version for consistency
      'DOB': 'FmWxUZurqA8',
      'Province': 'Kd68BViw8AF',
      'OD': 'YxKunRADsZs',
      'District': 'fW4E5W7ePjy',
      'Commune': 'f6ztgUdD9RV'
    },

    // Value mappings for form fields to DHIS2 values
    valueMappings: {
      sex: {
        'Male': 'Male',
        'Female': 'Female', 
        'Intersex': 'Intersex'
      },
      Sex: {
        'Male': 'Male',
        'Female': 'Female', 
        'Intersex': 'Intersex'
      },
      genderIdentity: {
        'Male': 'Male',
        'Female': 'Female',
        'Transgender': 'Transgender',
        'Non-binary': 'Non-binary',
        'Other': 'Other'
      },
      sexualHealthConcerns: {
        'Yes': 'Yes',
        'No': 'No',
        'true': 'Yes',
        'false': 'No',
        true: 'Yes',
        false: 'No'
      },
      hadSexPast6Months: {
        'Yes': 'Yes',
        'No': 'No',
        'true': 'Yes',
        'false': 'No',
        true: 'Yes',
        false: 'No'
      },
      partnerMale: {
        'Yes': 'Yes',
        'No': 'No',
        'true': 'Yes',
        'false': 'No',
        true: 'Yes',
        false: 'No'
      },
      partnerFemale: {
        'Yes': 'Yes',
        'No': 'No',
        'true': 'Yes',
        'false': 'No',
        true: 'Yes',
        false: 'No'
      },
      partnerTGW: {
        'Yes': 'Yes',
        'No': 'No',
        'true': 'Yes',
        'false': 'No',
        true: 'Yes',
        false: 'No'
      },
      partnerTGM: {
        'Yes': 'Yes',
        'No': 'No',
        'true': 'Yes',
        'false': 'No',
        true: 'Yes',
        false: 'No'
      },
      sexWithoutCondom: {
        'Yes': 'Yes',
        'No': 'No',
        'true': 'Yes',
        'false': 'No',
        true: 'Yes',
        false: 'No'
      },
      sexWithHIVPartner: {
        'Yes': 'Yes',
        'No': 'No',
        'true': 'Yes',
        'false': 'No',
        true: 'Yes',
        false: 'No'
      },
      stiSymptoms: {
        'Yes': 'Yes',
        'No': 'No',
        'true': 'Yes',
        'false': 'No',
        true: 'Yes',
        false: 'No'
      },
      syphilisPositive: {
        'Yes': 'Yes',
        'No': 'No',
        'true': 'Yes',
        'false': 'No',
        true: 'Yes',
        false: 'No'
      },
      hivTestPast6Months: {
        'Yes': 'Yes',
        'No': 'No',
        'true': 'Yes',
        'false': 'No',
        true: 'Yes',
        false: 'No'
      },
      hivTestResult: {
        'Positive': 'Positive',
        'Negative': 'Negative',
        'Unknown': 'Unknown'
      },
      currentlyOnPrep: {
        'Yes': 'Yes',
        'No': 'No',
        'true': 'Yes',
        'false': 'No',
        true: 'Yes',
        false: 'No',
        '10': 'Yes',
        '0': 'No',
        10: 'Yes',
        0: 'No'
      },
      everOnPrep: {
        'Yes': 'Yes',
        'No': 'No',
        'Never Know': 'Never Know',
        'true': 'Yes',
        'false': 'No',
        true: 'Yes',
        false: 'No',
        '10': 'Yes',
        '11': 'No',
        '12': 'Never Know',
        10: 'Yes',
        11: 'No',
        12: 'Never Know'
      },
      receiveMoneyForSex: {
        'Yes': 'Yes',
        'No': 'No',
        'true': 'Yes',
        'false': 'No',
        true: 'Yes',
        false: 'No'
      },
      paidForSex: {
        'Yes': 'Yes',
        'No': 'No',
        'true': 'Yes',
        'false': 'No',
        true: 'Yes',
        false: 'No'
      },
      injectedDrugSharedNeedle: {
        'Yes': 'Yes',
        'No': 'No',
        'true': 'Yes',
        'false': 'No',
        true: 'Yes',
        false: 'No'
      },
      alcoholDrugBeforeSex: {
        'Yes': 'Yes',
        'No': 'No',
        'true': 'Yes',
        'false': 'No',
        true: 'Yes',
        false: 'No'
      },
      groupSexChemsex: {
        'Yes': 'Yes',
        'No': 'No',
        'true': 'Yes',
        'false': 'No',
        true: 'Yes',
        false: 'No'
      },
      abortion: {
        'Yes': 'Yes',
        'No': 'No',
        'true': 'Yes',
        'false': 'No',
        true: 'Yes',
        false: 'No'
      },
      forcedSex: {
        'Yes': 'Yes',
        'No': 'No',
        'true': 'Yes',
        'false': 'No',
        true: 'Yes',
        false: 'No'
      },
      noneOfAbove: {
        'Yes': 'Yes',
        'No': 'No',
        'true': 'Yes',
        'false': 'No',
        true: 'Yes',
        false: 'No'
      }
    },

    // Program Stage Data Elements - Actual DHIS2 IDs from the data
    programStageDataElements: {
      // Gender Identity
      'genderIdentity': 'Hvpk8CSzvWZ',
      // Sexual Health Concerns
      'sexualHealthConcerns': 'HZzeCzQOuvh',
      // Had Sex Past 6 Months
      'hadSexPast6Months': 'Q2KRbrYIKHM',
      // Partner Male
      'partnerMale': 'IjncwaiwvUv',
      // Partner Female
      'partnerFemale': 'TlXvK6qrt1b',
      // Partner TGW
      'partnerTGW': 'G4r3E6LI70l',
      // Partner TGM
      'partnerTGM': 'okL7Z9mXVnU',
      // Number of Sexual Partners
      'numberOfSexualPartners': 'qa4gp2GMQUA',
      // Average Number of Different Sexual Partners (Past 6 Months)
      'averageNumberOfSexualPartners': 'jrhBFeNLgs2',
      // Sex With HIV Partner
      'sexWithHIVPartner': 'bls0dsZMoRO',
      // Sex Without Condom
      'sexWithoutCondom': 'JhZONUgUE87',
      // STI Symptoms
      'stiSymptoms': 'HnK9Yh1aWn1',
      // Syphilis Positive
      'syphilisPositive': 'y2jfGnMOTNH',
      // HIV Test Past 6 Months
      'hivTestPast6Months': 'upbKDAnhG8T',
      // HIV Test Result
      'hivTestResult': 'yWvKnLg2VRq',
      // Last HIV Test Date
      'lastHivTestDate': 'ARFp7wrxiFV',
      // Currently On PrEP
      'currentlyOnPrep': 'LTf9Uj5JnqN',
      // Ever On PrEP
      'everOnPrep': 'ziEaDW60taC',
      // Receive Money For Sex
      'receiveMoneyForSex': 'b5Jgn263AJT',
      // Paid For Sex
      'paidForSex': 'BKILZQUFa2t',
      // Injected Drug Shared Needle
      'injectedDrugSharedNeedle': 'Mm3MCV89ukA',
      // Alcohol Drug Before Sex
      'alcoholDrugBeforeSex': 'fVWjzCcSCyF',
      // Group Sex Chemsex
      'groupSexChemsex': 'FdYD7ISx2s6',
      // Abortion
      'abortion': 'nXk4YihKCF5',
      // Forced Sex
      'forcedSex': 'sEspagSJHg6',
      // None Of Above
      'noneOfAbove': 'q4Xuew3y1c7',
      // Additional fields from the data
      'sexAtBirth': 'Lbi259Segyq',
      'sex': 'Lbi259Segyq', // Map sex to sexAtBirth data element
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
      unsupportedFormat: 'Unsupported file format. Please use CSV, XLSX, XLS, or XLSM files',
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

