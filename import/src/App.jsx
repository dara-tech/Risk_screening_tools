import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './components/ui/ui/toast'
import Layout from './components/Layout'
import ImportTool from './components/ImportTool'
import RecordsList from './pages/RecordsList'
import OptionSetChecker from './components/OptionSetChecker'
import APITestRunner from './components/APITestRunner'
import RiskScreeningTool from './components/RiskScreeningTool'
import DataElementsList from './components/DataElementsList'
import QuestionForm from './components/QuestionForm'
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
        
        // Suppress known non-critical errors
        const originalErrorHandler = window.onerror
        window.onerror = (message, source, lineno, colno, error) => {
            // Suppress logo_banner 404 errors (non-critical DHIS2 resource)
            if (typeof message === 'string' && message.includes('logo_banner')) {
                return true // Suppress the error
            }
            // Call original error handler if provided
            if (originalErrorHandler) {
                return originalErrorHandler(message, source, lineno, colno, error)
            }
            return false
        }
        
        // Also handle unhandled promise rejections for 404s
        const originalRejectionHandler = window.onunhandledrejection
        window.onunhandledrejection = (event) => {
            // Suppress logo_banner 404 errors
            if (event?.reason?.message?.includes('logo_banner') || 
                event?.reason?.includes('logo_banner') ||
                (event?.reason?.response?.status === 404 && event?.reason?.response?.url?.includes('logo_banner'))) {
                event.preventDefault() // Suppress the error
                return
            }
            // Call original handler if provided
            if (originalRejectionHandler) {
                originalRejectionHandler(event)
            }
        }
        
        return () => {
            window.onerror = originalErrorHandler
            window.onunhandledrejection = originalRejectionHandler
        }
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
                        <Route path="data-elements" element={<DataElementsList />} />
                        <Route path="question-form" element={<QuestionForm />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ToastProvider>
    )
}

export default MyApp
