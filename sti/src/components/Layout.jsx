import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, Outlet, Link } from 'react-router-dom'

import { LuActivity } from 'react-icons/lu'
import { Badge } from './ui/badge'
import { Shield, Upload, ChevronDown, User, Bell, Settings, Search, FileText } from 'lucide-react'

// Add logo fallback to prevent 404 errors
const addLogoFallback = () => {
    // Create a fallback for any missing logo images
    const style = document.createElement('style')
    style.textContent = `
        img[src*="logo"], img[src*="banner"] {
            display: none !important;
        }
        img[src*="logo"]::before, img[src*="banner"]::before {
            content: "🏥";
            font-size: 24px;
            display: inline-block;
        }
    `
    document.head.appendChild(style)
}

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

    // Add logo fallback on component mount
    useEffect(() => {
        addLogoFallback()
    }, [])

    if (error) {
        return <span>{i18n.t('ERROR')}</span>
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-400 rounded-full animate-spin animate-reverse"></div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-semibold text-slate-800 mb-1">{i18n.t('Loading STI Platform')}</div>
                        <div className="text-sm text-slate-500">Preparing your workspace...</div>
                    </div>
                </div>
            </div>
        )
    }

    const menuItems = [
        { 
            id: 'risk-screening', 
            label: i18n.t('Risk Screening'), 
            icon: <Shield className="w-4 h-4" />, 
            path: '/',
            description: i18n.t('Comprehensive STI risk assessment and data entry'),
            gradient: 'from-emerald-500 to-teal-600'
        },
        { 
            id: 'import-tool', 
            label: i18n.t('Data Import'), 
            icon: <Upload className="w-4 h-4" />, 
            path: '/import-tool',
            description: i18n.t('Import STI screening data from CSV files'),
            gradient: 'from-blue-500 to-indigo-600'
        },
        { 
            id: 'records-list', 
            label: i18n.t('Records List'), 
            icon: <FileText className="w-4 h-4" />, 
            path: '/records-list',
            description: i18n.t('View and manage all screening records'),
            gradient: 'from-purple-500 to-pink-600'
        }

    ]

    const currentMenuItem = menuItems.find(item => 
        location.pathname === item.path || location.pathname.startsWith(item.path + '/')
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            {/* Custom navbar positioned below DHIS2 header */}
            <nav className={`fixed top-[48px] left-0 right-0 z-40 transition-all duration-300 ease-out ${
                scrolled 
                    ? 'bg-white/70 backdrop-blur-xl border-b border-slate-200/60 shadow-lg shadow-slate-900/5' 
                    : 'bg-white/90 backdrop-blur-md border-b border-slate-200/40'
            }`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                                                 {/* Logo Section with Enhanced Styling */}
                         <div className="flex items-center space-x-4">
                             <Link className="flex items-center space-x-3 group" to="/">
                                 <div className="relative">
                                     <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-110">
                                         <Shield className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
                                     </div>
                                     <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform duration-300"></div>
                                 </div>
                                 <div className="hidden sm:block">
                                     <div className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent group-hover:from-slate-900 group-hover:to-slate-700 transition-all duration-300">
                                         STI Health Platform
                                     </div>
                                     <div className="text-xs text-slate-500 font-medium -mt-1 group-hover:text-slate-600 transition-colors duration-300">
                                         Advanced Screening System
                                     </div>
                                 </div>
                             </Link>
                         </div>

                                                 {/* Enhanced Navigation */}
                         <div className="hidden md:flex items-center space-x-2">
                             {menuItems.map((item) => {
                                 const isActive = location.pathname === item.path
                                 return (
                                     <Link
                                         key={item.id}
                                         to={item.path}
                                         className={`relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group overflow-hidden ${
                                             isActive 
                                                 ? 'text-white shadow-lg shadow-blue-500/25 scale-105' 
                                                 : 'text-slate-600 hover:text-slate-800 hover:scale-105'
                                         }`}
                                     >
                                         {/* Active State Background */}
                                         {isActive && (
                                             <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-xl shadow-lg`}></div>
                                         )}
                                         
                                         {/* Hover Background */}
                                         {!isActive && (
                                             <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:scale-100"></div>
                                         )}
                                         
                                         {/* Content */}
                                         <div className="relative flex items-center space-x-2.5">
                                             <div className={`transition-all duration-300 ${
                                                 isActive 
                                                     ? 'transform scale-110' 
                                                     : 'group-hover:transform group-hover:scale-110'
                                             }`}>
                                                 {item.icon}
                                             </div>
                                             <span className="font-semibold">{item.label}</span>
                                         </div>
                                         
                                         {/* Hover Border Effect */}
                                         {!isActive && (
                                             <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-slate-200/60 transition-all duration-300"></div>
                                         )}
                                         
                                         {/* Active Indicator */}
                                         {isActive && (
                                             <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-sm"></div>
                                         )}
                                     </Link>
                                 )
                             })}
                         </div>

                        {/* Enhanced User Section */}
                        <div className="flex items-center space-x-3">
                            {/* Search Button */}
                            <button className="p-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-md hover:shadow-slate-200/50 group">
                                <Search className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                            </button>

                         

                                                         {/* User Menu */}
                             <div className="relative">
                                 <button 
                                     onClick={() => setUserMenuOpen(!userMenuOpen)}
                                     className="flex items-center space-x-3 p-2.5 pr-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 border border-slate-200/60 transition-all duration-300 group hover:scale-105 hover:shadow-lg hover:shadow-slate-200/50"
                                 >
                                     <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110">
                                         <User className="w-4 h-4 text-white" />
                                     </div>
                                     <div className="hidden sm:block text-left">
                                         <div className="text-sm font-semibold text-slate-800 leading-tight group-hover:text-slate-900 transition-colors duration-300">
                                             {data?.me?.name || 'User'}
                                         </div>
                                         <div className="text-xs text-slate-500 leading-tight group-hover:text-slate-600 transition-colors duration-300">
                                             {data?.me?.userGroups?.[0]?.name || 'Healthcare Professional'}
                                         </div>
                                     </div>
                                     <ChevronDown className={`w-4 h-4 text-slate-400 transition-all duration-300 ${userMenuOpen ? 'rotate-180 scale-110' : 'group-hover:scale-110'}`} />
                                 </button>

                                {/* User Dropdown Menu */}
                                {userMenuOpen && (
                                    <div className="absolute right-0 top-12 w-72 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-900/10 py-2 z-50">
                                        <div className="px-4 py-3 border-b border-slate-100">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                                    <User className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-800">{data?.me?.name || 'User'}</div>
                                                    <div className="text-sm text-slate-500">{data?.me?.email || 'user@healthplatform.com'}</div>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        
                                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                        <span className="text-xs text-slate-500">Online</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="py-2">
                                            <button className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors duration-150 flex items-center space-x-3">
                                                <Settings className="w-4 h-4" />
                                                <span>Settings</span>
                                            </button>
                                            <button className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors duration-150 flex items-center space-x-3">
                                                <User className="w-4 h-4" />
                                                <span>Profile</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content with Advanced Styling - adjusted for DHIS2 nav + custom nav */}
            <main className="pt-[112px]">
                <div className="min-h-screen">
                    <Outlet />
                </div>
            </main>

            {/* Background Effects */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-0 right-0 w-72 h-72 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>
        </div>
    )
}

export default Layout 