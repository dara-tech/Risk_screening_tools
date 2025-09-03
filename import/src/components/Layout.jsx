import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, Outlet, Link } from 'react-router-dom'

import { LuActivity } from 'react-icons/lu'
import { Badge } from './ui/badge'
import { Shield, Upload, ChevronDown, User, Bell, Settings, Search, FileText } from 'lucide-react'
import logoImage from '../assets/logo.png'

// Logo fallback removed - now using proper logo import

const query = {
    me: {
        resource: 'me'
    },
}

const Layout = () => {
    const { error, loading, data } = useDataQuery(query)
    const location = useLocation()
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10
            setScrolled(isScrolled)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Logo fallback removed - now using proper logo import

    // Force Khmer font stack inside our app root only
    useEffect(() => {
        const style = document.createElement('style')
        style.setAttribute('data-khmer-font', 'true')
        style.textContent = `
            [data-app-root], [data-app-root] * {
                font-family: 'Kantumruy Pro', 'Noto Sans Khmer', 'Khmer OS', 'Hanuman', 'Noto Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol' !important;
            }
        `
        document.head.appendChild(style)
        return () => {
            try { document.head.removeChild(style) } catch {}
        }
    }, [])

    if (error) {
        return <span>{i18n.t('ERROR')}</span>
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
                    <div className="text-sm text-gray-600">{i18n.t('Loading')}</div>
                </div>
            </div>
        )
    }

    const menuItems = [
        // { 
        //     id: 'risk-screening', 
        //     label: i18n.t('Risk Screening'), 
        //     icon: <Shield className="w-4 h-4" />, 
        //     path: '/',
        //     description: i18n.t('Comprehensive STI risk assessment and data entry'),
        // },
        { 
            id: 'import-tool', 
            label: i18n.t('Data Import'), 
            icon: <Upload className="w-4 h-4" />, 
            path: '/import-tool',
            description: i18n.t('Import STI screening data from CSV files'),
        },
        { 
            id: 'records-list', 
            label: i18n.t('Records List'), 
            icon: <FileText className="w-4 h-4" />, 
            path: '/records-list',
            description: i18n.t('View and manage all screening records'),
        }
    ]

    const currentMenuItem = menuItems.find(item => 
        location.pathname === item.path || location.pathname.startsWith(item.path + '/')
    )

    return (
        <div
            className="min-h-screen bg-gray-50 font-kh"
            style={{
                fontFamily: "'Kantumruy Pro', 'Hanuman', 'Noto Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
            }}
            data-app-root
        >
            {/* Minimal navbar positioned below DHIS2 header */}
            <nav className={`fixed top-[48px] left-0 right-0 z-40 transition-all duration-200 ${
                scrolled 
                    ? 'bg-white border-b border-gray-200 shadow-sm' 
                    : 'bg-white/95 backdrop-blur-sm border-b border-gray-100'
            }`}>
                <div className="container mx-auto px-6">
                    <div className="flex h-14 items-center justify-between">
                        {/* Logo Section */}
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center space-x-2 group">
                                <img 
                                    src={logoImage} 
                                    alt="Risk Screening Tool Logo" 
                                    className="h-8 w-8 object-contain"
                                />
                                <span className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                                   Risk Screening Tool
                                </span>
                            </Link>
                        </div>

                        {/* Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path
                                return (
                                    <Link
                                        key={item.id}
                                        to={item.path}
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                            isActive 
                                                ? 'text-gray-900 bg-gray-100' 
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-1.5">
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>

                        {/* User Section */}
                        
                       
                    </div>
                </div>
            </nav>

            {/* Main Content - adjusted for DHIS2 nav + custom nav */}
            <main className="pt-[57px]">
                <div className="">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default Layout