import React from 'react'

const Header = ({ selectedOrgUnit, orgUnits, mode = 'create' }) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#2C6693] to-[#2C6693] px-6 py-8">
                <div className="text-center">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                        STI Risk Screening Tool
                        {mode === 'edit' && <span className="block text-lg text-blue-200 mt-1">(Edit Mode)</span>}
                        {mode === 'view' && <span className="block text-lg text-blue-200 mt-1">(View Mode)</span>}
                    </h1>
                    <p className="text-blue-100 text-sm sm:text-base">
                        {mode === 'edit' ? 'Editing existing screening record' : 
                         mode === 'view' ? 'Viewing screening record details' : 
                         'Comprehensive risk assessment and screening'}
                    </p>
                    {selectedOrgUnit && (
                        <p className="text-sm text-blue-200 mt-2">
                            📍 {orgUnits.find(ou => ou.id === selectedOrgUnit)?.displayName || selectedOrgUnit}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Header
