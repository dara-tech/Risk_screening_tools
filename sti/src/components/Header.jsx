import React from 'react'

const Header = ({ selectedOrgUnit, orgUnits }) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8">
                <div className="text-center">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                        STI Risk Screening Tool
                    </h1>
                    <p className="text-blue-100 text-sm sm:text-base">
                        Comprehensive risk assessment and screening
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
