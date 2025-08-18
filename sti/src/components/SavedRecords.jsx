import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { FiCheckCircle, FiUser } from 'react-icons/fi'

const SavedRecords = ({ savedRecords, getRiskLevelColor }) => {
    if (savedRecords.length === 0) return null

    return (
        <Card className="bg-white rounded-2xl border border-gray-100">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                    <FiCheckCircle className="w-5 h-5 text-green-600" />
                    <span>Recent Screenings ({savedRecords.length})</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {savedRecords.slice(0, 5).map((record, index) => (
                        <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200">
                            <div className="flex items-center space-x-3 mb-3 sm:mb-0">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                                    <FiUser className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm sm:text-base">
                                        {record.firstName} {record.lastName}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500">
                                        ID: {record.systemId} • {new Date(record.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                <Badge 
                                    variant="outline" 
                                    className={getRiskLevelColor(record.riskLevel)}
                                >
                                    {record.riskLevel} Risk
                                </Badge>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    Score: {record.riskScore}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default SavedRecords
