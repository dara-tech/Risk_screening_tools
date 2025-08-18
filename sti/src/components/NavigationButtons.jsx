import React from 'react'
import { Button } from './ui/button'
import { FiSave } from 'react-icons/fi'

const NavigationButtons = ({ 
    currentStep, 
    loading, 
    onPrevious, 
    onNext, 
    onSave,
    onViewRecords
}) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-2">
                    <Button
                        onClick={onPrevious}
                        disabled={currentStep === 1}
                        variant="outline"
                        className="w-full sm:w-auto px-6 py-3 text-sm sm:text-base"
                    >
                        ← Previous
                    </Button>
                    
                    {onViewRecords && (
                        <Button
                            onClick={onViewRecords}
                            variant="outline"
                            className="w-full sm:w-auto px-6 py-3 text-sm sm:text-base"
                        >
                            View All Records
                        </Button>
                    )}
                </div>
                
                <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
                    {currentStep < 5 ? (
                        <Button
                            onClick={onNext}
                            className="w-full sm:w-auto px-6 py-3 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                        >
                            Next →
                        </Button>
                    ) : (
                        <Button
                            onClick={onSave}
                            disabled={loading}
                            className="w-full sm:w-auto px-6 py-3 text-sm sm:text-base bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                        >
                            {loading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Saving...</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <FiSave className="w-4 h-4" />
                                    <span>Save Screening</span>
                                </div>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default NavigationButtons
