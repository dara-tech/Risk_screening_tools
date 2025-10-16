/**
 * Test Utilities for DHIS2 API Operations
 * Comprehensive testing suite for all CRUD operations
 */

import { useDataEngine } from '@dhis2/app-runtime'
import config from './config'

/**
 * Test Data Generator
 */
export const generateTestData = () => {
  const timestamp = Date.now()
  return {
    systemId: `TEST_${timestamp}`,
    uuic: `UUIC_${timestamp}`,
    familyName: 'Test',
    lastName: 'User',
    sex: 'Male',
    dateOfBirth: '1990-01-01',
    // Only include basic attributes that are likely to be valid
    // Remove problematic attributes that may not exist or have invalid option sets
  }
}

/**
 * Test Result Logger
 */
export class TestLogger {
  constructor() {
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
    console.log(`[${status}] ${testName}: ${message}`, data || '')
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
    console.log('\n=== TEST SUMMARY ===')
    console.log(`Total Tests: ${summary.total}`)
    console.log(`Passed: ${summary.passed}`)
    console.log(`Failed: ${summary.failed}`)
    console.log(`Skipped: ${summary.skipped}`)
    console.log(`Success Rate: ${summary.successRate}%`)
    console.log(`Duration: ${summary.duration}ms`)
    console.log('===================\n')
  }
}

/**
 * DHIS2 API Test Helper
 */
export class DHIS2APITester {
  constructor(engine) {
    this.engine = engine
    this.logger = new TestLogger()
    this.testOrgUnit = null
    this.testTeiId = null
    this.testEnrollmentId = null
    this.testEventId = null
  }

  /**
   * Test GET Operations
   */
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
    
    // Test 5: Get Option Sets
    await this.testGetOptionSets()
    
    // Test 6: Get Events
    await this.testGetEvents()
    
    // Test 7: Get Tracked Entity Instances
    await this.testGetTrackedEntityInstances()
  }

  async testGetOrgUnits() {
    try {
      const response = await this.engine.query({
        orgUnits: {
          resource: 'organisationUnits',
          params: {
            fields: 'id,name,level,path',
            paging: false
          }
        }
      })
      
      const orgUnits = response.orgUnits.organisationUnits || []
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
      const response = await this.engine.query({
        programs: {
          resource: 'programs',
          params: {
            fields: 'id,name,programType',
            paging: false
          }
        }
      })
      
      const programs = response.programs.programs || []
      this.logger.log(
        'GET Programs',
        'PASS',
        `Successfully fetched ${programs.length} programs`,
        { count: programs.length, sample: programs[0] }
      )
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
      const response = await this.engine.query({
        trackedEntityTypes: {
          resource: 'trackedEntityTypes',
          params: {
            fields: 'id,name,description',
            paging: false
          }
        }
      })
      
      const trackedEntityTypes = response.trackedEntityTypes.trackedEntityTypes || []
      this.logger.log(
        'GET Tracked Entity Types',
        'PASS',
        `Successfully fetched ${trackedEntityTypes.length} tracked entity types`,
        { count: trackedEntityTypes.length, sample: trackedEntityTypes[0] }
      )
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
      const response = await this.engine.query({
        dataElements: {
          resource: 'dataElements',
          params: {
            fields: 'id,name,valueType,optionSet',
            paging: false
          }
        }
      })
      
      const dataElements = response.dataElements.dataElements || []
      this.logger.log(
        'GET Data Elements',
        'PASS',
        `Successfully fetched ${dataElements.length} data elements`,
        { count: dataElements.length, sample: dataElements[0] }
      )
    } catch (error) {
      this.logger.log(
        'GET Data Elements',
        'FAIL',
        `Failed to fetch data elements: ${error.message}`,
        error
      )
    }
  }

  async testGetOptionSets() {
    try {
      const response = await this.engine.query({
        optionSets: {
          resource: 'optionSets',
          params: {
            fields: 'id,name,options[id,name,code]',
            paging: false
          }
        }
      })
      
      const optionSets = response.optionSets.optionSets || []
      this.logger.log(
        'GET Option Sets',
        'PASS',
        `Successfully fetched ${optionSets.length} option sets`,
        { count: optionSets.length, sample: optionSets[0] }
      )
    } catch (error) {
      this.logger.log(
        'GET Option Sets',
        'FAIL',
        `Failed to fetch option sets: ${error.message}`,
        error
      )
    }
  }

  async testGetEvents() {
    try {
      const response = await this.engine.query({
        events: {
          resource: 'events',
          params: {
            fields: 'event,eventDate,orgUnit,program,programStage,dataValues',
            program: config.program.id,
            pageSize: 10
          }
        }
      })
      
      const events = response.events.events || []
      this.logger.log(
        'GET Events',
        'PASS',
        `Successfully fetched ${events.length} events`,
        { count: events.length, sample: events[0] }
      )
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
      console.log('🔍 Fetching organization units for TEI query...')
      const orgUnitResponse = await this.engine.query({
        orgUnits: {
          resource: 'organisationUnits',
          params: {
            fields: 'id,name',
            paging: false
          }
        }
      })
      
      const orgUnits = orgUnitResponse.orgUnits.organisationUnits || []
      console.log('🔍 Found organization units:', orgUnits.length)
      
      if (orgUnits.length === 0) {
        this.logger.log(
          'GET Tracked Entity Instances',
          'SKIP',
          'No organization units available for query'
        )
        return
      }

      const orgUnitId = orgUnits[0].id
      console.log('🔍 Using organization unit for TEI query:', orgUnitId)
      console.log('🔍 Querying tracked entity instances with org unit:', orgUnitId)
      
      const response = await this.engine.query({
        trackedEntityInstances: {
          resource: 'trackedEntityInstances',
          params: {
            fields: 'trackedEntityInstance,attributes[attribute,value]',
            trackedEntityType: config.program.trackedEntityType,
            orgUnit: orgUnitId,
            pageSize: 10
          }
        }
      })
      
      const trackedEntityInstances = response.trackedEntityInstances.trackedEntityInstances || []
      this.logger.log(
        'GET Tracked Entity Instances',
        'PASS',
        `Successfully fetched ${trackedEntityInstances.length} tracked entity instances using org unit ${orgUnitId}`,
        { count: trackedEntityInstances.length, orgUnitId, sample: trackedEntityInstances[0] }
      )
    } catch (error) {
      console.error('🔍 Error in testGetTrackedEntityInstances:', error)
      this.logger.log(
        'GET Tracked Entity Instances',
        'FAIL',
        `Failed to fetch tracked entity instances: ${error.message}. Check console for details.`,
        error
      )
    }
  }

  /**
   * Test POST Operations
   */
  async testPostOperations() {
    console.log('\n=== TESTING POST OPERATIONS ===')
    
    if (!this.testOrgUnit) {
      this.logger.log(
        'POST Operations Setup',
        'SKIP',
        'No test organization unit available'
      )
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
          trackedEntityType: config.program.trackedEntityType,
          orgUnit: this.testOrgUnit,
          attributes
        }]
      }

      const response = await this.engine.mutate({
        resource: 'trackedEntityInstances',
        type: 'create',
        data: payload
      })

      const summary = response?.response?.importSummaries?.[0]
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
          response
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
      this.logger.log(
        'POST Create Enrollment',
        'SKIP',
        'No test tracked entity instance available'
      )
      return
    }

    try {
      const payload = {
        enrollments: [{
          trackedEntityInstance: this.testTeiId,
          program: config.program.id,
          orgUnit: this.testOrgUnit,
          enrollmentDate: new Date().toISOString().split('T')[0],
          incidentDate: new Date().toISOString().split('T')[0]
        }]
      }

      console.log('🔍 Creating enrollment with payload:', payload)
      const response = await this.engine.mutate({
        resource: 'enrollments',
        type: 'create',
        data: payload
      })

      console.log('🔍 Enrollment creation response:', response)
      const summary = response?.response?.importSummaries?.[0]
      console.log('🔍 Enrollment creation summary:', summary)

      if (summary?.reference) {
        this.testEnrollmentId = summary.reference
        this.logger.log(
          'POST Create Enrollment',
          'PASS',
          `Successfully created enrollment: ${summary.reference}`,
          { enrollmentId: summary.reference, summary }
        )
      } else {
        const errorDetails = summary?.conflicts || summary?.description || 'Unknown error'
        console.error('🔍 Enrollment creation failed:', errorDetails)
        this.logger.log(
          'POST Create Enrollment',
          'FAIL',
          `Failed to create enrollment: ${errorDetails}`,
          { summary, response }
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
      this.logger.log(
        'POST Create Event',
        'SKIP',
        'No test tracked entity instance available'
      )
      return
    }

    if (!this.testEnrollmentId) {
      this.logger.log(
        'POST Create Event',
        'SKIP',
        'No test enrollment available - enrollment must be created first'
      )
      return
    }

    try {
      // Create a minimal event without data values to avoid validation issues
      const payload = {
        events: [{
          trackedEntityInstance: this.testTeiId,
          program: config.program.id,
          programStage: config.program.stageId,
          orgUnit: this.testOrgUnit,
          enrollment: this.testEnrollmentId, // Include enrollment ID
          eventDate: new Date().toISOString().split('T')[0],
          status: 'COMPLETED',
          dataValues: [] // Start with empty data values
        }]
      }

      const response = await this.engine.mutate({
        resource: 'events',
        type: 'create',
        data: payload
      })

      console.log('🔍 Event creation response:', response)
      const summary = response?.response?.importSummaries?.[0]
      console.log('🔍 Event creation summary:', summary)
      
      if (summary?.reference) {
        this.testEventId = summary.reference
        this.logger.log(
          'POST Create Event',
          'PASS',
          `Successfully created event: ${this.testEventId}`,
          { eventId: this.testEventId, summary }
        )
      } else {
        const errorDetails = summary?.conflicts || summary?.description || 'Unknown error'
        console.error('🔍 Event creation failed:', errorDetails)
        this.logger.log(
          'POST Create Event',
          'FAIL',
          `Failed to create event: ${errorDetails}`,
          { summary, response }
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

  /**
   * Test PUT Operations
   */
  async testPutOperations() {
    console.log('\n=== TESTING PUT OPERATIONS ===')
    
    if (!this.testEventId) {
      this.logger.log(
        'PUT Operations',
        'SKIP',
        'No test event available for updating'
      )
      return
    }

    // Test 1: Update Event
    await this.testUpdateEvent()
    
    // Test 2: Update Tracked Entity Instance
    await this.testUpdateTrackedEntityInstance()
  }

  async testUpdateEvent() {
    try {
      // First get the current event
      const currentEvent = await this.engine.query({
        event: {
          resource: `events/${this.testEventId}`,
          params: {
            fields: 'event,eventDate,orgUnit,dataValues,program,programStage'
          }
        }
      })

      const event = currentEvent.event
      if (!event) {
        this.logger.log(
          'PUT Update Event',
          'FAIL',
          'Could not fetch current event data'
        )
        return
      }

      // Update some data values
      const updatedDataValues = event.dataValues || []
      updatedDataValues.push({
        dataElement: config.mapping.programStageDataElements.riskScreeningScore,
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

      const response = await this.engine.mutate({
        resource: 'events',
        type: 'update',
        data: payload
      })

      const summary = response?.response?.importSummaries?.[0]
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
          response
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

  async testUpdateTrackedEntityInstance() {
    if (!this.testTeiId) {
      this.logger.log(
        'PUT Update Tracked Entity Instance',
        'SKIP',
        'No test tracked entity instance available'
      )
      return
    }

    try {
      // First get the current TEI
      const currentTei = await this.engine.query({
        trackedEntityInstance: {
          resource: `trackedEntityInstances/${this.testTeiId}`,
          params: {
            fields: 'trackedEntityInstance,attributes[attribute,value]'
          }
        }
      })

      const tei = currentTei.trackedEntityInstance
      if (!tei) {
        this.logger.log(
          'PUT Update Tracked Entity Instance',
          'FAIL',
          'Could not fetch current tracked entity instance data'
        )
        return
      }

      // Update attributes
      const updatedAttributes = tei.attributes || []
      const testData = generateTestData()
      updatedAttributes.push({
        attribute: config.mapping.trackedEntityAttributes.Donor,
        value: 'Updated Test Donor'
      })

      const payload = {
        trackedEntityInstances: [{
          trackedEntityInstance: this.testTeiId,
          trackedEntityType: config.program.trackedEntityType,
          orgUnit: this.testOrgUnit,
          attributes: updatedAttributes
        }]
      }

      const response = await this.engine.mutate({
        resource: 'trackedEntityInstances',
        type: 'update',
        data: payload
      })

      const summary = response?.response?.importSummaries?.[0]
      if (summary?.status === 'SUCCESS') {
        this.logger.log(
          'PUT Update Tracked Entity Instance',
          'PASS',
          `Successfully updated tracked entity instance: ${this.testTeiId}`,
          { teiId: this.testTeiId, summary }
        )
      } else {
        this.logger.log(
          'PUT Update Tracked Entity Instance',
          'FAIL',
          `Failed to update tracked entity instance: ${summary?.description || 'Unknown error'}`,
          response
        )
      }
    } catch (error) {
      this.logger.log(
        'PUT Update Tracked Entity Instance',
        'FAIL',
        `Error updating tracked entity instance: ${error.message}`,
        error
      )
    }
  }

  /**
   * Test DELETE Operations
   */
  async testDeleteOperations() {
    console.log('\n=== TESTING DELETE OPERATIONS ===')
    
    if (!this.testEventId) {
      this.logger.log(
        'DELETE Operations',
        'SKIP',
        'No test event available for deletion'
      )
      return
    }

    // Test 1: Delete Event
    await this.testDeleteEvent()
    
    // Test 2: Delete Tracked Entity Instance
    await this.testDeleteTrackedEntityInstance()
  }

  async testDeleteEvent() {
    try {
      const response = await this.engine.mutate({
        resource: 'events',
        type: 'delete',
        data: { events: [{ event: this.testEventId }] }
      })

      const summary = response?.response?.importSummaries?.[0]
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
          response
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
      this.logger.log(
        'DELETE Tracked Entity Instance',
        'SKIP',
        'No test tracked entity instance available'
      )
      return
    }

    try {
      const response = await this.engine.mutate({
        resource: 'trackedEntityInstances',
        type: 'delete',
        data: { trackedEntityInstances: [{ trackedEntityInstance: this.testTeiId }] }
      })

      const summary = response?.response?.importSummaries?.[0]
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
          response
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

  /**
   * Helper Methods
   */
  prepareTrackedEntityAttributes(data) {
    const attributes = []
    // Only use basic attributes that are most likely to be valid
    const basicMappings = {
      systemId: config.mapping.trackedEntityAttributes.System_ID,
      uuic: config.mapping.trackedEntityAttributes.UUIC,
      familyName: config.mapping.trackedEntityAttributes.Family_Name,
      lastName: config.mapping.trackedEntityAttributes.Last_Name,
      sex: config.mapping.trackedEntityAttributes.Sex,
      dateOfBirth: config.mapping.trackedEntityAttributes.DOB
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
    const mappings = config.mapping.programStageDataElements

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

  /**
   * Run All Tests
   */
  async runAllTests() {
    console.log('🚀 Starting DHIS2 API Tests...\n')
    
    try {
      await this.testGetOperations()
      await this.testPostOperations()
      await this.testPutOperations()
      await this.testDeleteOperations()
    } catch (error) {
      this.logger.log(
        'Test Suite',
        'FAIL',
        `Test suite failed: ${error.message}`,
        error
      )
    }

    this.logger.printSummary()
    return this.logger.getSummary()
  }
}

export default DHIS2APITester
