import i18n from '@dhis2/d2-i18n'

// English translations (fallback)
const englishTranslations = {
    'ERROR': 'ERROR',
    'Loading...': 'Loading...',
    'STI Risk Screening': 'STI Risk Screening',
    'Comprehensive STI risk assessment and data entry': 'Comprehensive STI risk assessment and data entry',
    'Screening Records': 'Screening Records',
    'View and manage all screening records': 'View and manage all screening records',
    'Basic Information': 'Basic Information',
    'Risk Assessment': 'Risk Assessment',
    'Clinical Data': 'Clinical Data',
    'Risk Calculation': 'Risk Calculation',
    'Summary': 'Summary',
    'No Access': 'No Access',
    'You do not have access to any organization units': 'You do not have access to any organization units',
    'Error': 'Error',
    'Failed to load organization units': 'Failed to load organization units',
    'No Data': 'No Data',
    'No screening records found': 'No screening records found',
    'Data Loaded': 'Data Loaded',
    'No screening events found in the system': 'No screening events found in the system',
    'Access Error': 'Access Error',
    'Unable to access screening data. Please check your permissions or contact your administrator.': 'Unable to access screening data. Please check your permissions or contact your administrator.',
    'Failed to load screening data': 'Failed to load screening data',
    'Success': 'Success',
    'Screening record updated successfully': 'Screening record updated successfully',
    'Failed to update screening record': 'Failed to update screening record',
    'Test Success': 'Test Success',
    'Test update completed successfully': 'Test update completed successfully',
    'Test Failed': 'Test Failed',
    'Test update failed': 'Test update failed',
    'ID': 'ID',
    'Sex': 'Sex',
    'Date of Birth': 'Date of Birth',
    'Province': 'Province',
    'Risk Level': 'Risk Level',
    'Risk Score': 'Risk Score',
    'Export Successful': 'Export Successful',
    'Screening data exported to CSV': 'Screening data exported to CSV',
    'View and manage all saved risk screening data': 'View and manage all saved risk screening data',
    'Total Screenings': 'Total Screenings',
    'High Risk': 'High Risk',
    'This Month': 'This Month',
    'Organizations': 'Organizations',
    'Search by name, ID...': 'Search by name, ID...',
    'All Risk Levels': 'All Risk Levels',
    'Low Risk': 'Low Risk',
    'Medium Risk': 'Medium Risk',
    'Very High Risk': 'Very High Risk',
    'Newest First': 'Newest First',
    'Oldest First': 'Oldest First',
    'Name A-Z': 'Name A-Z',
    'Name Z-A': 'Name Z-A',
    'Highest Risk': 'Highest Risk',
    'Lowest Risk': 'Lowest Risk',
    'Test Access': 'Test Access',
    'Refresh': 'Refresh',
    'Export': 'Export',
    'Loading organization units...': 'Loading organization units...',
    'Loading screenings...': 'Loading screenings...',
    'No screening data found': 'No screening data found',
    'No screenings match your filters': 'No screenings match your filters',
    'No screening records have been saved yet. Start by creating a new screening.': 'No screening records have been saved yet. Start by creating a new screening.',
    'Try adjusting your search or filters to see more results.': 'Try adjusting your search or filters to see more results.',
    'Create New Screening': 'Create New Screening',
    'N/A': 'N/A',
    'Unknown': 'Unknown',
    'Risk': 'Risk',
    'Score': 'Score',
    'View Details': 'View Details',
    'Edit Screening Record': 'Edit Screening Record',
    'System ID': 'System ID',
    'First Name': 'First Name',
    'Last Name': 'Last Name',
    'Select sex': 'Select sex',
    'Male': 'Male',
    'Female': 'Female',
    'Other': 'Other',
    'Save Changes': 'Save Changes',
    'Test Update': 'Test Update',
    'Cancel': 'Cancel'
}

// Khmer translations
const khmerTranslations = {
    'ERROR': 'កំហុស',
    'Loading...': 'កំពុងផ្ទុក...',
    'STI Risk Screening': 'ការត្រួតពិនិត្យហានិភ័យ STI',
    'Comprehensive STI risk assessment and data entry': 'ការវាយតម្លៃហានិភ័យ STI និងការបញ្ចូលទិន្នន័យគ្រប់ជ្រុងជ្រោយ',
    'Screening Records': 'កំណត់ត្រាការត្រួតពិនិត្យ',
    'View and manage all screening records': 'មើល និងគ្រប់គ្រងកំណត់ត្រាការត្រួតពិនិត្យទាំងអស់',
    'Basic Information': 'ព័ត៌មានមូលដ្ឋាន',
    'Risk Assessment': 'ការវាយតម្លៃហានិភ័យ',
    'Clinical Data': 'ទិន្នន័យគ្លីនិក',
    'Risk Calculation': 'ការគណនាហានិភ័យ',
    'Summary': 'សេចក្តីសង្ខេប',
    'No Access': 'គ្មានការចូល',
    'You do not have access to any organization units': 'អ្នកគ្មានការចូលទៅកាន់ឯកតាអង្គការណាមួយទេ',
    'Error': 'កំហុស',
    'Failed to load organization units': 'បរាជ័យក្នុងការផ្ទុកឯកតាអង្គការ',
    'No Data': 'គ្មានទិន្នន័យ',
    'No screening records found': 'រកមិនឃើញកំណត់ត្រាការត្រួតពិនិត្យ',
    'Data Loaded': 'ទិន្នន័យត្រូវបានផ្ទុក',
    'No screening events found in the system': 'រកមិនឃើញព្រឹត្តិការណ៍ការត្រួតពិនិត្យក្នុងប្រព័ន្ធ',
    'Access Error': 'កំហុសការចូល',
    'Unable to access screening data. Please check your permissions or contact your administrator.': 'មិនអាចចូលទៅកាន់ទិន្នន័យការត្រួតពិនិត្យបានទេ។ សូមពិនិត្យការអនុញ្ញាតរបស់អ្នក ឬទាក់ទងអ្នកគ្រប់គ្រង។',
    'Failed to load screening data': 'បរាជ័យក្នុងការផ្ទុកទិន្នន័យការត្រួតពិនិត្យ',
    'Success': 'ជោគជ័យ',
    'Screening record updated successfully': 'កំណត់ត្រាការត្រួតពិនិត្យត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ',
    'Failed to update screening record': 'បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពកំណត់ត្រាការត្រួតពិនិត្យ',
    'Test Success': 'តេស្តជោគជ័យ',
    'Test update completed successfully': 'ការធ្វើតេស្តការធ្វើបច្ចុប្បន្នភាពបានបញ្ចប់ដោយជោគជ័យ',
    'Test Failed': 'តេស្តបរាជ័យ',
    'Test update failed': 'ការធ្វើតេស្តការធ្វើបច្ចុប្បន្នភាពបរាជ័យ',
    'ID': 'លេខសម្គាល់',
    'Sex': 'ភេទ',
    'Date of Birth': 'ថ្ងៃខែឆ្នាំកំណើត',
    'Province': 'ខេត្ត',
    'Risk Level': 'កម្រិតហានិភ័យ',
    'Risk Score': 'ពិន្ទុហានិភ័យ',
    'Export Successful': 'ការនាំចេញជោគជ័យ',
    'Screening data exported to CSV': 'ទិន្នន័យការត្រួតពិនិត្យត្រូវបាននាំចេញទៅ CSV',
    'View and manage all saved risk screening data': 'មើល និងគ្រប់គ្រងទិន្នន័យការត្រួតពិនិត្យហានិភ័យទាំងអស់ដែលបានរក្សាទុក',
    'Total Screenings': 'ការត្រួតពិនិត្យសរុប',
    'High Risk': 'ហានិភ័យខ្ពស់',
    'This Month': 'ខែនេះ',
    'Organizations': 'អង្គការ',
    'Search by name, ID...': 'ស្វែងរកតាមឈ្មោះ លេខសម្គាល់...',
    'All Risk Levels': 'កម្រិតហានិភ័យទាំងអស់',
    'Low Risk': 'ហានិភ័យទាប',
    'Medium Risk': 'ហានិភ័យមធ្យម',
    'Very High Risk': 'ហានិភ័យខ្ពស់ណាស់',
    'Newest First': 'ថ្មីជាងគេមុន',
    'Oldest First': 'ចាស់ជាងគេមុន',
    'Name A-Z': 'ឈ្មោះ A-Z',
    'Name Z-A': 'ឈ្មោះ Z-A',
    'Highest Risk': 'ហានិភ័យខ្ពស់ជាងគេ',
    'Lowest Risk': 'ហានិភ័យទាបជាងគេ',
    'Test Access': 'ធ្វើតេស្តការចូល',
    'Refresh': 'ធ្វើឱ្យថ្មី',
    'Export': 'នាំចេញ',
    'Loading organization units...': 'កំពុងផ្ទុកឯកតាអង្គការ...',
    'Loading screenings...': 'កំពុងផ្ទុកការត្រួតពិនិត្យ...',
    'No screening data found': 'រកមិនឃើញទិន្នន័យការត្រួតពិនិត្យ',
    'No screenings match your filters': 'គ្មានការត្រួតពិនិត្យដែលត្រូវគ្នានឹងតម្រងរបស់អ្នក',
    'No screening records have been saved yet. Start by creating a new screening.': 'គ្មានកំណត់ត្រាការត្រួតពិនិត្យដែលត្រូវបានរក្សាទុកនៅឡើយទេ។ ចាប់ផ្តើមដោយការបង្កើតការត្រួតពិនិត្យថ្មី។',
    'Try adjusting your search or filters to see more results.': 'ព្យាយាមកែតម្រូវការស្វែងរក ឬតម្រងរបស់អ្នកដើម្បីមើលលទ្ធផលបន្ថែម។',
    'Create New Screening': 'បង្កើតការត្រួតពិនិត្យថ្មី',
    'N/A': 'មិនមាន',
    'Unknown': 'មិនដឹង',
    'Risk': 'ហានិភ័យ',
    'Score': 'ពិន្ទុ',
    'View Details': 'មើលព័ត៌មានលម្អិត',
    'Edit Screening Record': 'កែសម្រួលកំណត់ត្រាការត្រួតពិនិត្យ',
    'System ID': 'លេខសម្គាល់ប្រព័ន្ធ',
    'First Name': 'ឈ្មោះ',
    'Last Name': 'ឈ្មោះគ្រួសារ',
    'Select sex': 'ជ្រើសរើសភេទ',
    'Male': 'ប្រុស',
    'Female': 'ស្រី',
    'Other': 'ផ្សេងទៀត',
    'Save Changes': 'រក្សាទុកការផ្លាស់ប្តូរ',
    'Test Update': 'ធ្វើតេស្តការធ្វើបច្ចុប្បន្នភាព',
    'Cancel': 'បោះបង់'
}

// Initialize i18n with translations
export const initializeI18n = () => {
    console.log('Starting i18n initialization...')
    
    // Add English resource bundle
    i18n.addResourceBundle('en', 'translation', englishTranslations, true, true)
    console.log('English translations added')
    
    // Add Khmer resource bundle
    i18n.addResourceBundle('km', 'translation', khmerTranslations, true, true)
    console.log('Khmer translations added')
    
    // Get saved language preference
    const savedLanguage = localStorage.getItem('dhis2-locale') || 'km'
    console.log('Saved language from localStorage:', savedLanguage)
    
    // Set the current language for the i18n instance
    i18n.language = savedLanguage
    console.log('Language set to:', savedLanguage)
    
    console.log('i18n initialized with translations')
    console.log('Current language:', i18n.language)
    console.log('Test translation:', i18n.t('Screening Records'))
    console.log('Test Khmer translation:', i18n.t('Screening Records', { lng: 'km' }))
}

// Helper function to get current language
export const getCurrentLanguage = () => {
    return localStorage.getItem('dhis2-locale') || 'km'
}

// Helper function to translate with current language
export const t = (key, options = {}) => {
    const currentLang = getCurrentLanguage()
    return i18n.t(key, { lng: currentLang, ...options })
}

export default i18n
