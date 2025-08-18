import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './components/ui/ui/toast'
import Layout from './components/Layout'
import RiskScreeningTool from './components/RiskScreeningTool'
import ImportTool from './components/ImportTool'
import RecordsList from './pages/RecordsList'
import { initializeI18n } from './lib/i18n'
import './index.css'

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
                        <Route index element={<RiskScreeningTool />} />
                        <Route path="risk-screening" element={<RiskScreeningTool />} />
                        <Route path="import-tool" element={<ImportTool />} />
                        <Route path="records-list" element={<RecordsList />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ToastProvider>
    )
}

export default MyApp
