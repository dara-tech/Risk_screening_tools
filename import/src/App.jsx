import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './components/ui/ui/toast'
import Layout from './components/Layout'
import ImportTool from './components/ImportTool'
import RecordsList from './pages/RecordsList'
import OptionSetChecker from './components/OptionSetChecker'
import APITestRunner from './components/APITestRunner'
import RiskScreeningTool from './components/RiskScreeningTool'
import { initializeI18n } from './lib/i18n'

import './index.css'
// Local Khmer fonts (bundled)
import '@fontsource/kantumruy-pro/400.css'
import '@fontsource/kantumruy-pro/700.css'
import '@fontsource/hanuman/400.css'
import '@fontsource/hanuman/700.css'
import '@fontsource/noto-sans/400.css'
import '@fontsource/noto-sans-khmer/400.css'

const MyApp = () => {
    useEffect(() => {
        // Initialize i18n with Khmer translations
        initializeI18n()
    }, [])

    return (
        <ToastProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<ImportTool />} />
                        {/* <Route path="risk-screening" element={<RiskScreeningTool />} /> */}
                        <Route path="import-tool" element={<ImportTool />} />
                        <Route path="records-list" element={<RecordsList />} />
                        <Route path="option-sets" element={<OptionSetChecker />} />
                        <Route path= "risk-screening-tool" element={<RiskScreeningTool />} />
                        <Route path="api-tests" element={<APITestRunner />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ToastProvider>
    )
}

export default MyApp
