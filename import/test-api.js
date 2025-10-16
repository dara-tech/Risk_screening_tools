#!/usr/bin/env node

/**
 * DHIS2 API Test Script
 * Command-line tool to test all CRUD operations
 * 
 * Usage:
 *   node test-api.js [options]
 * 
 * Options:
 *   --url <url>        DHIS2 server URL (default: http://localhost:8080)
 *   --username <user>  Username (default: admin)
 *   --password <pass>  Password (default: district)
 *   --verbose          Enable verbose logging
 *   --help             Show this help message
 */

const https = require('https')
const http = require('http')
const { URL } = require('url')

// Configuration
const DEFAULT_CONFIG = {
  url: 'http://localhost:8080',
  username: 'admin',
  password: 'district',
  timeout: 30000
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2)
  const config = { ...DEFAULT_CONFIG }
  let verbose = false

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--url':
        config.url = args[++i]
        break
      case '--username':
        config.username = args[++i]
        break
      case '--password':
        config.password = args[++i]
        break
      case '--verbose':
        verbose = true
        break
      case '--help':
        console.log(`
DHIS2 API Test Script

Usage: node test-api.js [options]

Options:
  --url <url>        DHIS2 server URL (default: ${DEFAULT_CONFIG.url})
  --username <user>  Username (default: ${DEFAULT_CONFIG.username})
  --password <pass>  Password (default: ${DEFAULT_CONFIG.password})
  --verbose          Enable verbose logging
  --help             Show this help message

Examples:
  node test-api.js
  node test-api.js --url https://play.dhis2.org --username admin --password district
  node test-api.js --verbose
        `)
        process.exit(0)
        break
      default:
        console.error(`Unknown option: ${args[i]}`)
        process.exit(1)
    }
  }

  return { config, verbose }
}

// Test logger
class TestLogger {
  constructor(verbose = false) {
    this.verbose = verbose
    this.results = []
    this.startTime = Date.now()
  }

  log(testName, status, message, data = null) {
    const result = {
      testName,
      status, // 'PASS', 'FAIL', 'SKIP'
      message,
      data,
      timestamp: new Date().toISOString(),
      duration: Date.now() - this.startTime
    }
    this.results.push(result)
    
    const statusIcon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⏭️'
    console.log(`${statusIcon} ${testName}: ${message}`)
    
    if (this.verbose && data) {
      console.log('   Data:', JSON.stringify(data, null, 2))
    }
  }

  getSummary() {
    const total = this.results.length
    const passed = this.results.filter(r => r.status === 'PASS').length
    const failed = this.results.filter(r => r.status === 'FAIL').length
    const skipped = this.results.filter(r => r.status === 'SKIP').length

    return {
      total,
      passed,
      failed,
      skipped,
      successRate: total > 0 ? (passed / total * 100).toFixed(2) : 0,
      duration: Date.now() - this.startTime
    }
  }

  printSummary() {
    const summary = this.getSummary()
    console.log('\n' + '='.repeat(50))
    console.log('TEST SUMMARY')
    console.log('='.repeat(50))
    console.log(`Total Tests: ${summary.total}`)
    console.log(`Passed: ${summary.passed}`)
    console.log(`Failed: ${summary.failed}`)
    console.log(`Skipped: ${summary.skipped}`)
    console.log(`Success Rate: ${summary.successRate}%`)
    console.log(`Duration: ${summary.duration}ms`)
    console.log('='.repeat(50))
  }
}

// HTTP client for DHIS2 API
class DHIS2Client {
  constructor(config) {
    this.config = config
    this.baseUrl = config.url.replace(/\/$/, '')
    this.auth = Buffer.from(`${config.username}:${config.password}`).toString('base64')
  }

  async request(method, path, data = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(`${this.baseUrl}/api/${path}`)
      const options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname + url.search,
        method,
        headers: {
          'Authorization': `Basic ${this.auth}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: this.config.timeout
      }

      if (data) {
        const jsonData = JSON.stringify(data)
        options.headers['Content-Length'] = Buffer.byteLength(jsonData)
      }

      const client = url.protocol === 'https:' ? https : http
      const req = client.request(options, (res) => {
        let responseData = ''
        
        res.on('data', (chunk) => {
          responseData += chunk
        })
        
        res.on('end', () => {
          try {
            const parsedData = responseData ? JSON.parse(responseData) : {}
            resolve({
              status: res.statusCode,
              headers: res.headers,
              data: parsedData
            })
          } catch (error) {
            resolve({
              status: res.statusCode,
              headers: res.headers,
              data: responseData
            })
          }
        })
      })

      req.on('error', (error) => {
        reject(error)
      })

      req.on('timeout', () => {
        req.destroy()
        reject(new Error('Request timeout'))
      })

      if (data) {
        req.write(JSON.stringify(data))
      }
      
      req.end()
    })
  }

  async get(path) {
    return this.request('GET', path)
  }

  async post(path, data) {
    return this.request('POST', path, data)
  }

  async put(path, data) {
    return this.request('PUT', path, data)
  }

  async delete(path, data) {
    return this.request('DELETE', path, data)
  }
}

// Test data generator
function generateTestData() {
  const timestamp = Date.now()
  return {
    systemId: `TEST_${timestamp}`,
    uuic: `UUIC_${timestamp}`,
    familyName: 'Test',
    lastName: 'User',
    sex: 'Male',
    dateOfBirth: '1990-01-01'
    // Only include basic attributes that are likely to be valid
  }
}

// Test configuration (using the same IDs from config.js)
const TEST_CONFIG = {
  program: {
    id: 'gmO3xUubvMb',
    stageId: 'hqJKFmOU6s7',
    trackedEntityType: 'MCPQUTHX1Ze'
  },
  mapping: {
    trackedEntityAttributes: {
      'System_ID': 'n0KF6wMqMOP',
      'UUIC': 'e5FXJFKQyuB',
      'Donor': 'PU5ZFhLIFA7',
      'NGO': 'LTSLftFhQoL',
      'Family_Name': 'gJXkrAyY061',
      'Last_Name': 'KN6AR1YuTDn',
      'Sex': 'BR1fUe7Nx8V',
      'DOB': 'FmWxUZurqA8',
      'Province': 'Kd68BViw8AF',
      'OD': 'YxKunRADsZs',
      'District': 'fW4E5W7ePjy',
      'Commune': 'f6ztgUdD9RV'
    },
    programStageDataElements: {
      'genderIdentity': 'Hvpk8CSzvWZ',
      'sexualHealthConcerns': 'HZzeCzQOuvh',
      'hadSexPast6Months': 'Q2KRbrYIKHM',
      'riskScreeningScore': 'eEY6HLGq5FF'
    }
  }
}

// Main test runner
class APITestRunner {
  constructor(client, logger) {
    this.client = client
    this.logger = logger
    this.testOrgUnit = null
    this.testTeiId = null
    this.testEnrollmentId = null
    this.testEventId = null
  }

  async runAllTests() {
    console.log('🚀 Starting DHIS2 API Tests...\n')
    
    try {
      await this.testGetOperations()
      await this.testPostOperations()
      await this.testPutOperations()
      await this.testDeleteOperations()
    } catch (error) {
      this.logger.log('Test Suite', 'FAIL', `Test suite failed: ${error.message}`, error)
    }

    this.logger.printSummary()
    return this.logger.getSummary()
  }

  async testGetOperations() {
    console.log('\n=== TESTING GET OPERATIONS ===')
    
    // Test 1: Get Organization Units
    await this.testGetOrgUnits()
    
    // Test 2: Get Programs
    await this.testGetPrograms()
    
    // Test 3: Get Tracked Entity Types
    await this.testGetTrackedEntityTypes()
    
    // Test 4: Get Data Elements
    await this.testGetDataElements()
    
    // Test 5: Get Events
    await this.testGetEvents()
    
    // Test 6: Get Tracked Entity Instances
    await this.testGetTrackedEntityInstances()
  }

  async testGetOrgUnits() {
    try {
      const response = await this.client.get('organisationUnits?fields=id,name,level&paging=false')
      
      if (response.status === 200) {
        const orgUnits = response.data.organisationUnits || []
        this.logger.log(
          'GET Organization Units',
          'PASS',
          `Successfully fetched ${orgUnits.length} organization units`,
          { count: orgUnits.length, sample: orgUnits[0] }
        )
        
        // Store first org unit for other tests
        if (orgUnits.length > 0) {
          this.testOrgUnit = orgUnits[0].id
        }
      } else {
        this.logger.log(
          'GET Organization Units',
          'FAIL',
          `HTTP ${response.status}: ${response.data.message || 'Unknown error'}`,
          response.data
        )
      }
    } catch (error) {
      this.logger.log(
        'GET Organization Units',
        'FAIL',
        `Failed to fetch organization units: ${error.message}`,
        error
      )
    }
  }

  async testGetPrograms() {
    try {
      const response = await this.client.get('programs?fields=id,name,programType&paging=false')
      
      if (response.status === 200) {
        const programs = response.data.programs || []
        this.logger.log(
          'GET Programs',
          'PASS',
          `Successfully fetched ${programs.length} programs`,
          { count: programs.length, sample: programs[0] }
        )
      } else {
        this.logger.log(
          'GET Programs',
          'FAIL',
          `HTTP ${response.status}: ${response.data.message || 'Unknown error'}`,
          response.data
        )
      }
    } catch (error) {
      this.logger.log(
        'GET Programs',
        'FAIL',
        `Failed to fetch programs: ${error.message}`,
        error
      )
    }
  }

  async testGetTrackedEntityTypes() {
    try {
      const response = await this.client.get('trackedEntityTypes?fields=id,name,description&paging=false')
      
      if (response.status === 200) {
        const trackedEntityTypes = response.data.trackedEntityTypes || []
        this.logger.log(
          'GET Tracked Entity Types',
          'PASS',
          `Successfully fetched ${trackedEntityTypes.length} tracked entity types`,
          { count: trackedEntityTypes.length, sample: trackedEntityTypes[0] }
        )
      } else {
        this.logger.log(
          'GET Tracked Entity Types',
          'FAIL',
          `HTTP ${response.status}: ${response.data.message || 'Unknown error'}`,
          response.data
        )
      }
    } catch (error) {
      this.logger.log(
        'GET Tracked Entity Types',
        'FAIL',
        `Failed to fetch tracked entity types: ${error.message}`,
        error
      )
    }
  }

  async testGetDataElements() {
    try {
      const response = await this.client.get('dataElements?fields=id,name,valueType&paging=false')
      
      if (response.status === 200) {
        const dataElements = response.data.dataElements || []
        this.logger.log(
          'GET Data Elements',
          'PASS',
          `Successfully fetched ${dataElements.length} data elements`,
          { count: dataElements.length, sample: dataElements[0] }
        )
      } else {
        this.logger.log(
          'GET Data Elements',
          'FAIL',
          `HTTP ${response.status}: ${response.data.message || 'Unknown error'}`,
          response.data
        )
      }
    } catch (error) {
      this.logger.log(
        'GET Data Elements',
        'FAIL',
        `Failed to fetch data elements: ${error.message}`,
        error
      )
    }
  }

  async testGetEvents() {
    try {
      const response = await this.client.get(`events?program=${TEST_CONFIG.program.id}&fields=event,eventDate,orgUnit&pageSize=10`)
      
      if (response.status === 200) {
        const events = response.data.events || []
        this.logger.log(
          'GET Events',
          'PASS',
          `Successfully fetched ${events.length} events`,
          { count: events.length, sample: events[0] }
        )
      } else {
        this.logger.log(
          'GET Events',
          'FAIL',
          `HTTP ${response.status}: ${response.data.message || 'Unknown error'}`,
          response.data
        )
      }
    } catch (error) {
      this.logger.log(
        'GET Events',
        'FAIL',
        `Failed to fetch events: ${error.message}`,
        error
      )
    }
  }

  async testGetTrackedEntityInstances() {
    try {
      // First get an organization unit to use in the query
      const orgUnitResponse = await this.client.get('organisationUnits?fields=id,name&paging=false')
      
      if (orgUnitResponse.status !== 200) {
        this.logger.log(
          'GET Tracked Entity Instances',
          'SKIP',
          'Could not fetch organization units for query'
        )
        return
      }

      const orgUnits = orgUnitResponse.data.organisationUnits || []
      if (orgUnits.length === 0) {
        this.logger.log(
          'GET Tracked Entity Instances',
          'SKIP',
          'No organization units available for query'
        )
        return
      }

      const orgUnitId = orgUnits[0].id
      const response = await this.client.get(`trackedEntityInstances?fields=trackedEntityInstance,attributes[attribute,value]&trackedEntityType=${TEST_CONFIG.program.trackedEntityType}&orgUnit=${orgUnitId}&pageSize=10`)
      
      if (response.status === 200) {
        const trackedEntityInstances = response.data.trackedEntityInstances || []
        this.logger.log(
          'GET Tracked Entity Instances',
          'PASS',
          `Successfully fetched ${trackedEntityInstances.length} tracked entity instances`,
          { count: trackedEntityInstances.length, sample: trackedEntityInstances[0] }
        )
      } else {
        this.logger.log(
          'GET Tracked Entity Instances',
          'FAIL',
          `HTTP ${response.status}: ${response.data.message || 'Unknown error'}`,
          response.data
        )
      }
    } catch (error) {
      this.logger.log(
        'GET Tracked Entity Instances',
        'FAIL',
        `Failed to fetch tracked entity instances: ${error.message}`,
        error
      )
    }
  }

  async testPostOperations() {
    console.log('\n=== TESTING POST OPERATIONS ===')
    
    if (!this.testOrgUnit) {
      this.logger.log('POST Operations Setup', 'SKIP', 'No test organization unit available')
      return
    }

    // Test 1: Create Tracked Entity Instance
    await this.testCreateTrackedEntityInstance()
    
    // Test 2: Create Enrollment (must be done before events)
    await this.testCreateEnrollment()
    
    // Test 3: Create Event (after enrollment)
    await this.testCreateEvent()
  }

  async testCreateTrackedEntityInstance() {
    try {
      const testData = generateTestData()
      const attributes = this.prepareTrackedEntityAttributes(testData)
      
      const payload = {
        trackedEntityInstances: [{
          trackedEntityType: TEST_CONFIG.program.trackedEntityType,
          orgUnit: this.testOrgUnit,
          attributes
        }]
      }

      const response = await this.client.post('trackedEntityInstances', payload)

      if (response.status === 200 || response.status === 201) {
        const summary = response.data?.importSummaries?.[0]
        if (summary?.reference) {
          this.testTeiId = summary.reference
          this.logger.log(
            'POST Create Tracked Entity Instance',
            'PASS',
            `Successfully created tracked entity instance: ${this.testTeiId}`,
            { teiId: this.testTeiId, summary }
          )
        } else {
          this.logger.log(
            'POST Create Tracked Entity Instance',
            'FAIL',
            `Failed to create tracked entity instance: ${summary?.description || 'Unknown error'}`,
            response.data
          )
        }
      } else {
        this.logger.log(
          'POST Create Tracked Entity Instance',
          'FAIL',
          `HTTP ${response.status}: ${response.data.message || 'Unknown error'}`,
          response.data
        )
      }
    } catch (error) {
      this.logger.log(
        'POST Create Tracked Entity Instance',
        'FAIL',
        `Error creating tracked entity instance: ${error.message}`,
        error
      )
    }
  }

  async testCreateEnrollment() {
    if (!this.testTeiId) {
      this.logger.log('POST Create Enrollment', 'SKIP', 'No test tracked entity instance available')
      return
    }

    try {
      const payload = {
        enrollments: [{
          trackedEntityInstance: this.testTeiId,
          program: TEST_CONFIG.program.id,
          orgUnit: this.testOrgUnit,
          enrollmentDate: new Date().toISOString().split('T')[0],
          incidentDate: new Date().toISOString().split('T')[0]
        }]
      }

      const response = await this.client.post('enrollments', payload)

      if (response.status === 200 || response.status === 201) {
        const summary = response.data?.importSummaries?.[0]
        if (summary?.reference) {
          this.testEnrollmentId = summary.reference
          this.logger.log(
            'POST Create Enrollment',
            'PASS',
            `Successfully created enrollment: ${summary.reference}`,
            { enrollmentId: summary.reference, summary }
          )
        } else {
          this.logger.log(
            'POST Create Enrollment',
            'FAIL',
            `Failed to create enrollment: ${summary?.description || 'Unknown error'}`,
            response.data
          )
        }
      } else {
        this.logger.log(
          'POST Create Enrollment',
          'FAIL',
          `HTTP ${response.status}: ${response.data.message || 'Unknown error'}`,
          response.data
        )
      }
    } catch (error) {
      this.logger.log(
        'POST Create Enrollment',
        'FAIL',
        `Error creating enrollment: ${error.message}`,
        error
      )
    }
  }

  async testCreateEvent() {
    if (!this.testTeiId) {
      this.logger.log('POST Create Event', 'SKIP', 'No test tracked entity instance available')
      return
    }

    if (!this.testEnrollmentId) {
      this.logger.log('POST Create Event', 'SKIP', 'No test enrollment available - enrollment must be created first')
      return
    }

    try {
      // Create a minimal event without data values to avoid validation issues
      const payload = {
        events: [{
          trackedEntityInstance: this.testTeiId,
          program: TEST_CONFIG.program.id,
          programStage: TEST_CONFIG.program.stageId,
          orgUnit: this.testOrgUnit,
          enrollment: this.testEnrollmentId, // Include enrollment ID
          eventDate: new Date().toISOString().split('T')[0],
          status: 'COMPLETED',
          dataValues: [] // Start with empty data values
        }]
      }

      const response = await this.client.post('events', payload)

      if (response.status === 200 || response.status === 201) {
        const summary = response.data?.importSummaries?.[0]
        if (summary?.reference) {
          this.testEventId = summary.reference
          this.logger.log(
            'POST Create Event',
            'PASS',
            `Successfully created event: ${this.testEventId}`,
            { eventId: this.testEventId, summary }
          )
        } else {
          this.logger.log(
            'POST Create Event',
            'FAIL',
            `Failed to create event: ${summary?.description || 'Unknown error'}`,
            response.data
          )
        }
      } else {
        this.logger.log(
          'POST Create Event',
          'FAIL',
          `HTTP ${response.status}: ${response.data.message || 'Unknown error'}`,
          response.data
        )
      }
    } catch (error) {
      this.logger.log(
        'POST Create Event',
        'FAIL',
        `Error creating event: ${error.message}`,
        error
      )
    }
  }

  async testPutOperations() {
    console.log('\n=== TESTING PUT OPERATIONS ===')
    
    if (!this.testEventId) {
      this.logger.log('PUT Operations', 'SKIP', 'No test event available for updating')
      return
    }

    // Test 1: Update Event
    await this.testUpdateEvent()
  }

  async testUpdateEvent() {
    try {
      // First get the current event
      const currentEventResponse = await this.client.get(`events/${this.testEventId}`)
      
      if (currentEventResponse.status !== 200) {
        this.logger.log('PUT Update Event', 'FAIL', 'Could not fetch current event data')
        return
      }

      const event = currentEventResponse.data
      
      // Update some data values
      const updatedDataValues = event.dataValues || []
      updatedDataValues.push({
        dataElement: TEST_CONFIG.mapping.programStageDataElements.riskScreeningScore,
        value: '10' // Updated risk score
      })

      const payload = {
        events: [{
          event: this.testEventId,
          program: event.program,
          programStage: event.programStage,
          orgUnit: event.orgUnit,
          eventDate: event.eventDate,
          status: event.status || 'COMPLETED',
          dataValues: updatedDataValues
        }]
      }

      const response = await this.client.put('events', payload)

      if (response.status === 200) {
        const summary = response.data?.importSummaries?.[0]
        if (summary?.status === 'SUCCESS') {
          this.logger.log(
            'PUT Update Event',
            'PASS',
            `Successfully updated event: ${this.testEventId}`,
            { eventId: this.testEventId, summary }
          )
        } else {
          this.logger.log(
            'PUT Update Event',
            'FAIL',
            `Failed to update event: ${summary?.description || 'Unknown error'}`,
            response.data
          )
        }
      } else {
        this.logger.log(
          'PUT Update Event',
          'FAIL',
          `HTTP ${response.status}: ${response.data.message || 'Unknown error'}`,
          response.data
        )
      }
    } catch (error) {
      this.logger.log(
        'PUT Update Event',
        'FAIL',
        `Error updating event: ${error.message}`,
        error
      )
    }
  }

  async testDeleteOperations() {
    console.log('\n=== TESTING DELETE OPERATIONS ===')
    
    if (!this.testEventId) {
      this.logger.log('DELETE Operations', 'SKIP', 'No test event available for deletion')
      return
    }

    // Test 1: Delete Event
    await this.testDeleteEvent()
    
    // Test 2: Delete Tracked Entity Instance
    await this.testDeleteTrackedEntityInstance()
  }

  async testDeleteEvent() {
    try {
      const response = await this.client.delete('events', { events: [{ event: this.testEventId }] })

      if (response.status === 200) {
        const summary = response.data?.importSummaries?.[0]
        if (summary?.status === 'SUCCESS') {
          this.logger.log(
            'DELETE Event',
            'PASS',
            `Successfully deleted event: ${this.testEventId}`,
            { eventId: this.testEventId, summary }
          )
          this.testEventId = null
        } else {
          this.logger.log(
            'DELETE Event',
            'FAIL',
            `Failed to delete event: ${summary?.description || 'Unknown error'}`,
            response.data
          )
        }
      } else {
        this.logger.log(
          'DELETE Event',
          'FAIL',
          `HTTP ${response.status}: ${response.data.message || 'Unknown error'}`,
          response.data
        )
      }
    } catch (error) {
      this.logger.log(
        'DELETE Event',
        'FAIL',
        `Error deleting event: ${error.message}`,
        error
      )
    }
  }

  async testDeleteTrackedEntityInstance() {
    if (!this.testTeiId) {
      this.logger.log('DELETE Tracked Entity Instance', 'SKIP', 'No test tracked entity instance available')
      return
    }

    try {
      const response = await this.client.delete('trackedEntityInstances', { 
        trackedEntityInstances: [{ trackedEntityInstance: this.testTeiId }] 
      })

      if (response.status === 200) {
        const summary = response.data?.importSummaries?.[0]
        if (summary?.status === 'SUCCESS') {
          this.logger.log(
            'DELETE Tracked Entity Instance',
            'PASS',
            `Successfully deleted tracked entity instance: ${this.testTeiId}`,
            { teiId: this.testTeiId, summary }
          )
          this.testTeiId = null
        } else {
          this.logger.log(
            'DELETE Tracked Entity Instance',
            'FAIL',
            `Failed to delete tracked entity instance: ${summary?.description || 'Unknown error'}`,
            response.data
          )
        }
      } else {
        this.logger.log(
          'DELETE Tracked Entity Instance',
          'FAIL',
          `HTTP ${response.status}: ${response.data.message || 'Unknown error'}`,
          response.data
        )
      }
    } catch (error) {
      this.logger.log(
        'DELETE Tracked Entity Instance',
        'FAIL',
        `Error deleting tracked entity instance: ${error.message}`,
        error
      )
    }
  }

  // Helper methods
  prepareTrackedEntityAttributes(data) {
    const attributes = []
    // Only use basic attributes that are most likely to be valid
    const basicMappings = {
      'System_ID': TEST_CONFIG.mapping.trackedEntityAttributes['System_ID'],
      'UUIC': TEST_CONFIG.mapping.trackedEntityAttributes['UUIC'],
      'Family_Name': TEST_CONFIG.mapping.trackedEntityAttributes['Family_Name'],
      'Last_Name': TEST_CONFIG.mapping.trackedEntityAttributes['Last_Name'],
      'Sex': TEST_CONFIG.mapping.trackedEntityAttributes['Sex'],
      'DOB': TEST_CONFIG.mapping.trackedEntityAttributes['DOB']
    }

    Object.entries(basicMappings).forEach(([key, attrId]) => {
      if (attrId && attrId.match(/^[a-zA-Z0-9]{11}$/) && data[key]) {
        attributes.push({ attribute: attrId, value: String(data[key]) })
      }
    })

    return attributes
  }

  prepareEventDataValues(data) {
    const dataValues = []
    const mappings = TEST_CONFIG.mapping.programStageDataElements

    Object.entries(mappings).forEach(([key, dataElementId]) => {
      if (dataElementId && data[key] !== undefined && data[key] !== '') {
        dataValues.push({
          dataElement: dataElementId,
          value: String(data[key])
        })
      }
    })

    return dataValues
  }
}

// Main execution
async function main() {
  const { config, verbose } = parseArgs()
  const logger = new TestLogger(verbose)
  const client = new DHIS2Client(config)
  const runner = new APITestRunner(client, logger)

  try {
    const results = await runner.runAllTests()
    
    // Exit with appropriate code
    process.exit(results.failed > 0 ? 1 : 0)
  } catch (error) {
    console.error('Fatal error:', error.message)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

module.exports = { APITestRunner, DHIS2Client, TestLogger }
