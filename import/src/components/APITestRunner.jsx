import React, { useState, useEffect } from 'react'
import { useDataEngine } from '@dhis2/app-runtime'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { FiPlay, FiCheck, FiX, FiClock, FiRefreshCw } from 'react-icons/fi'
import { useToast } from './ui/ui/toast'
import DHIS2APITester from '../lib/testUtils'

const APITestRunner = () => {
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState(null)
  const [progress, setProgress] = useState(0)
  const [currentTest, setCurrentTest] = useState('')
  const [logs, setLogs] = useState([])
  const [showDetails, setShowDetails] = useState(false)

  const engine = useDataEngine()
  const { showToast } = useToast()

  const runTests = async () => {
    setIsRunning(true)
    setProgress(0)
    setTestResults(null)
    setLogs([])
    setCurrentTest('Initializing tests...')

    try {
      // Force reload the test utilities to ensure latest code is used
      console.log('🔄 Loading latest test utilities...')
      const tester = new DHIS2APITester(engine)
      
      // Override the logger to capture logs for UI
      const originalLog = tester.logger.log.bind(tester.logger)
      tester.logger.log = (testName, status, message, data) => {
        originalLog(testName, status, message, data)
        setLogs(prev => [...prev, { testName, status, message, data, timestamp: new Date() }])
        setCurrentTest(testName)
      }

      // Run tests with progress updates
      const testSteps = [
        { name: 'Testing GET Operations', progress: 20 },
        { name: 'Testing POST Operations', progress: 40 },
        { name: 'Testing PUT Operations', progress: 60 },
        { name: 'Testing DELETE Operations', progress: 80 },
        { name: 'Generating Report', progress: 100 }
      ]

      let stepIndex = 0
      const updateProgress = () => {
        if (stepIndex < testSteps.length) {
          setCurrentTest(testSteps[stepIndex].name)
          setProgress(testSteps[stepIndex].progress)
          stepIndex++
          setTimeout(updateProgress, 1000)
        }
      }

      updateProgress()

      const results = await tester.runAllTests()
      setTestResults(results)
      setProgress(100)
      setCurrentTest('Tests completed!')

      showToast({
        title: 'Tests Completed',
        description: `Success rate: ${results.successRate}% (${results.passed}/${results.total} passed)`,
        variant: results.failed === 0 ? 'success' : 'warning'
      })

    } catch (error) {
      console.error('Test execution failed:', error)
      showToast({
        title: 'Test Failed',
        description: `Error running tests: ${error.message}`,
        variant: 'error'
      })
      setCurrentTest('Test execution failed')
    } finally {
      setIsRunning(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PASS': return <FiCheck className="w-4 h-4 text-green-500" />
      case 'FAIL': return <FiX className="w-4 h-4 text-red-500" />
      case 'SKIP': return <FiClock className="w-4 h-4 text-yellow-500" />
      default: return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PASS': return 'bg-green-100 text-green-800'
      case 'FAIL': return 'bg-red-100 text-red-800'
      case 'SKIP': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FiRefreshCw className="w-5 h-5" />
            DHIS2 API Test Runner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Test all CRUD operations (GET, POST, PUT, DELETE) against your DHIS2 instance.
            This will create, update, and delete test data.
          </p>

          <div className="flex gap-2">
            <Button
              onClick={runTests}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <FiPlay className="w-4 h-4" />
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </Button>

            {testResults && (
              <Button
                variant="outline"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
              </Button>
            )}
          </div>

          {isRunning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{currentTest}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {testResults && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{testResults.total}</div>
                <div className="text-sm text-gray-600">Total Tests</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{testResults.passed}</div>
                <div className="text-sm text-green-600">Passed</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{testResults.failed}</div>
                <div className="text-sm text-red-600">Failed</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{testResults.skipped}</div>
                <div className="text-sm text-yellow-600">Skipped</div>
              </div>
            </div>
          )}

          {testResults && (
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{testResults.successRate}%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
              <div className="text-xs text-gray-500 mt-1">
                Completed in {testResults.duration}ms
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {showDetails && logs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {logs.map((log, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  {getStatusIcon(log.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{log.testName}</span>
                      <Badge className={`text-xs ${getStatusColor(log.status)}`}>
                        {log.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">{log.message}</div>
                    {log.data && (
                      <details className="mt-2">
                        <summary className="text-xs text-gray-500 cursor-pointer">
                          View Data
                        </summary>
                        <pre className="text-xs bg-gray-50 p-2 mt-1 rounded overflow-x-auto">
                          {JSON.stringify(log.data, null, 2)}
                        </pre>
                      </details>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      {log.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default APITestRunner
