import React from 'react'
import { Button } from './ui/button'
import { getCurrentLanguage } from '../lib/i18n'

const LanguageSwitcher = () => {
    const currentLanguage = getCurrentLanguage()
    
    const switchLanguage = (lang) => {
        // Save language preference to localStorage
        localStorage.setItem('dhis2-locale', lang)
        // Force a re-render by reloading the page
        window.location.reload()
    }
    
    return (
        <div className="fixed top-4 right-4 z-50 flex space-x-2">
            <Button
                variant={currentLanguage === 'en' ? 'default' : 'outline'}
                size="sm"
                onClick={() => switchLanguage('en')}
                className="text-xs"
            >
                English
            </Button>
            <Button
                variant={currentLanguage === 'km' ? 'default' : 'outline'}
                size="sm"
                onClick={() => switchLanguage('km')}
                className="text-xs"
            >
                ខ្មែរ
            </Button>
        </div>
    )
}

export default LanguageSwitcher
