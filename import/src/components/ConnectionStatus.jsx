import React, { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react'
import { isDevelopment, getDHIS2ServerURL } from '../lib/utils'

const ConnectionStatus = ({ engine }) => {
    const [connectionStatus, setConnectionStatus] = useState('checking')
    const [serverUrl, setServerUrl] = useState('')

    useEffect(() => {
        const checkConnection = async () => {
            try {
                setServerUrl(getDHIS2ServerURL())
                
                // Try to make a simple API call to check connection
                await engine.query({
                    systemInfo: {
                        resource: 'system/info',
                        params: {
                            fields: 'version'
                        }
                    }
                })
                
                setConnectionStatus('connected')
            } catch (error) {
                console.error('Connection check failed:', error)
                setConnectionStatus('disconnected')
            }
        }

        if (engine) {
            checkConnection()
        }
    }, [engine])

    if (connectionStatus === 'checking') {
        return (
            <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                <Wifi className="w-4 h-4 animate-pulse" />
                <span className="text-sm">Checking DHIS2 connection...</span>
            </div>
        )
    }

    if (connectionStatus === 'connected') {
        return (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Connected to DHIS2 server</span>
                {isDevelopment() && (
                    <span className="text-xs text-gray-500 ml-2">({serverUrl})</span>
                )}
            </div>
        )
    }

    return (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-800 mb-2">
                        Unable to connect to DHIS2 server
                    </h3>
                    <div className="text-sm text-red-700 space-y-1">
                        <p>Please check the following:</p>
                        <ul className="list-disc list-inside ml-2 space-y-1">
                            <li>DHIS2 server is running and accessible</li>
                            <li>Your internet connection is working</li>
                            <li>You have the correct permissions to access the server</li>
                            {isDevelopment() && (
                                <>
                                    <li>Development server URL: <code className="bg-red-100 px-1 rounded">{serverUrl}</code></li>
                                    <li>Make sure DHIS2 is running on the correct port</li>
                                </>
                            )}
                        </ul>
                        {isDevelopment() && (
                            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                                <strong>Development Mode:</strong> If you're running DHIS2 locally, make sure it's started on port 8080 or update the configuration.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConnectionStatus
