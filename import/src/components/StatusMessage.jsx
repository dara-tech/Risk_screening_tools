import React from 'react'
import { Button } from './ui/button'
import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi'

const StatusMessage = ({ status, onClose }) => {
    if (!status) return null

    return (
        <div className={`p-4 sm:p-6 rounded-xl border-2 ${
            status.type === 'success' 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
        }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3">
                    {status.type === 'success' ? (
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <FiCheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                    ) : (
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <FiAlertCircle className="w-5 h-5 text-red-600" />
                        </div>
                    )}
                    <span className={`font-semibold text-sm sm:text-base ${status.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                        {status.message}
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="w-8 h-8 hover:bg-gray-100 rounded-full"
                >
                    <FiX className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}

export default StatusMessage
