# DHIS2 Tracker Capture Analysis

## Overview
This document analyzes how DHIS2 Tracker Capture works and compares it with our current implementation in the QuestionForm and ImportTool components.

## Tracker Capture URL Structure

The DHIS2 Tracker Capture URL format:
```
http://localhost:8080/dhis-web-tracker-capture/index.html#/dashboard?tei=eYCn62HtBcE&program=gmO3xUubvMb&ou=nfydoYGorfL
```

**URL Parameters:**
- `tei` - Tracked Entity Instance ID (e.g., `eYCn62HtBcE`)
- `program` - Program ID (e.g., `gmO3xUubvMb`)
- `ou` - Organization Unit ID (e.g., `nfydoYGorfL`)

## DHIS2 Tracker Capture Flow

### 1. Tracked Entity Instance (TEI) Creation/Retrieval
**Purpose:** Create or find an existing person/entity in the system

**API Endpoint:** `POST /api/trackedEntityInstances`

**Payload Structure:**
```json
{
  "trackedEntityInstances": [{
    "trackedEntityType": "MCPQUTHX1Ze",
    "orgUnit": "nfydoYGorfL",
    "attributes": [
      { "attribute": "n0KF6wMqMOP", "value": "SYS001" },  // System ID
      { "attribute": "e5FXJFKQyuB", "value": "កយសត1150690" },  // UUIC
      { "attribute": "gJXkrAyY061", "value": "John" },  // Family Name
      { "attribute": "KN6AR1YuTDn", "value": "Doe" },  // Last Name
      // ... other attributes
    ]
  }]
}
```

**Key Points:**
- TEI represents a person/entity
- Attributes are stored at the TEI level (not program-specific)
- System ID and UUIC are unique identifiers used for lookup
- TEI can be enrolled in multiple programs

### 2. Enrollment Creation
**Purpose:** Enroll the TEI into a specific program

**API Endpoint:** `POST /api/enrollments`

**Payload Structure:**
```json
{
  "enrollments": [{
    "trackedEntityInstance": "eYCn62HtBcE",
    "program": "gmO3xUubvMb",
    "orgUnit": "nfydoYGorfL",
    "enrollmentDate": "2026-01-15",
    "incidentDate": "1990-01-15"
  }]
}
```

**Key Points:**
- One TEI can have multiple enrollments (different programs or re-enrollments)
- `enrollmentDate` - when the enrollment occurred
- `incidentDate` - typically the date of birth or incident date
- Enrollment links TEI to a program

### 3. Program Stage Event Creation
**Purpose:** Create an event (data entry) for a specific program stage

**API Endpoint:** `POST /api/events`

**Payload Structure:**
```json
{
  "events": [{
    "trackedEntityInstance": "eYCn62HtBcE",
    "program": "gmO3xUubvMb",
    "programStage": "hqJKFmOU6s7",
    "orgUnit": "nfydoYGorfL",
    "enrollment": "enrollmentId123",
    "eventDate": "2026-01-15",
    "status": "COMPLETED",
    "dataValues": [
      { "dataElement": "MBizmGFOeZg", "value": "High" },  // Risk Screening Result
      { "dataElement": "abc123xyz", "value": "25" },  // Risk Screening Score
      // ... other data elements
    ]
  }]
}
```

**Key Points:**
- Events belong to a specific program stage
- `dataValues` contain the actual form data
- `status` can be: `ACTIVE`, `COMPLETED`, `SCHEDULED`, `SKIPPED`, `OVERDUE`, `VISITED`
- `eventDate` is the date when the event occurred
- Multiple events can exist for the same enrollment (different program stages or dates)

## Our Implementation Analysis

### Current Flow in `importRecordToDHIS2` (dhis2FormData.js)

Our implementation follows the same 3-step process:

#### Step 1: TEI Creation/Lookup ✅
```javascript
// 1. Find existing TEI by System ID or UUIC
let teiId = await findExistingTei(engine, orgUnitId, config, data)

// 2. If not found, create new TEI
if (!teiId) {
    const { teiPayload, attributes } = createDHIS2Payload(data, orgUnitId, config)
    const teiRes = await engine.mutate({
        resource: 'trackedEntityInstances',
        type: 'create',
        data: teiPayload
    })
    teiId = teiRes?.response?.importSummaries?.[0]?.reference
}
```

**✅ Alignment:** Correct - We check for existing TEI first, then create if needed.

**⚠️ Potential Issues:**
- We filter attributes by `allowedAttrIds` - this is good for security but may cause issues if program configuration changes
- We handle 409 conflicts well with multiple lookup strategies

#### Step 2: Enrollment Creation/Lookup ✅
```javascript
// 1. Find existing enrollment
let enrollmentId = await findExistingEnrollment(engine, teiId, config.program.id)

// 2. If not found, create new enrollment
if (!enrollmentId) {
    const enrollmentPayload = {
        enrollments: [{
            trackedEntityInstance: teiId,
            program: config.program.id,
            orgUnit: orgUnitId,
            enrollmentDate: new Date().toISOString().split('T')[0],
            incidentDate: data.dateOfBirth || new Date().toISOString().split('T')[0]
        }]
    }
    const enrRes = await engine.mutate({
        resource: 'enrollments',
        type: 'create',
        data: enrollmentPayload
    })
    enrollmentId = enrRes?.response?.importSummaries?.[0]?.reference
}
```

**✅ Alignment:** Correct - We check for existing enrollment, then create if needed.

**⚠️ Potential Issues:**
- We use current date for `enrollmentDate` - this is correct for new enrollments
- We use `dateOfBirth` for `incidentDate` - this is correct
- We handle 409 conflicts well

#### Step 3: Event Creation ✅
```javascript
// Create data values from form data
const dataValues = createProgramStageDataValues(data, config)

// Create event
const eventPayload = {
    events: [{
        trackedEntityInstance: teiId,
        program: config.program.id,
        programStage: config.program.stageId,
        orgUnit: orgUnitId,
        enrollment: enrollmentId,
        eventDate: eventDate.toISOString().split('T')[0],
        status: 'COMPLETED',
        dataValues: validDataValues
    }]
}

const evtRes = await engine.mutate({
    resource: 'events',
    type: 'create',
    data: eventPayload
})
```

**✅ Alignment:** Correct - We create events with all required fields.

**⚠️ Potential Issues:**
- We add a random offset to `eventDate` to prevent conflicts - this is a workaround but may not be ideal
- We set `status: 'COMPLETED'` - this is correct for submitted forms
- We validate data values before sending - this is good

## Key Differences from Tracker Capture

### 1. Event Date Handling
**Tracker Capture:** Uses the actual event date from the form
**Our Implementation:** Uses current date with random offset to prevent conflicts

**Recommendation:** 
- For QuestionForm: Use current date (or allow user to select date)
- For ImportTool: Use date from CSV if provided, otherwise current date
- Remove random offset - it's not necessary if we handle conflicts properly

### 2. Status Handling
**Tracker Capture:** Allows different statuses (ACTIVE, COMPLETED, etc.)
**Our Implementation:** Always uses 'COMPLETED'

**Recommendation:** 
- Keep 'COMPLETED' for submitted forms - this is correct
- Consider allowing 'ACTIVE' for draft saves in the future

### 3. Data Value Validation
**Tracker Capture:** Validates data values on the server
**Our Implementation:** Validates on client before sending

**Recommendation:** 
- Keep client-side validation - it provides better UX
- Ensure server-side validation errors are properly handled

### 4. Conflict Handling
**Tracker Capture:** Shows conflicts in UI
**Our Implementation:** Handles conflicts programmatically with retries

**Recommendation:** 
- Our conflict handling is good - we retry lookups and extract IDs from error responses
- Consider showing conflicts to users in a more user-friendly way

## Recommendations for Improvement

### 1. Event Date
```javascript
// Current (with random offset)
const eventDate = new Date(baseDate.getTime() + uniqueOffset)

// Recommended (use actual date or current date)
const eventDate = data.eventDate || new Date().toISOString().split('T')[0]
```

### 2. Better Error Messages
Show more detailed error messages to users when conflicts occur, including:
- Which field caused the conflict
- What the existing value is
- Option to view the existing record

### 3. Draft Saving
Consider implementing draft saving with `status: 'ACTIVE'` for incomplete forms.

### 4. Event Updates
Currently, we only create new events. Consider:
- Checking for existing events on the same date
- Updating existing events instead of creating duplicates
- Showing a warning if an event already exists

### 5. Tracker Capture URL Generation
After successful submission, generate a Tracker Capture URL:
```javascript
const trackerCaptureUrl = `${dhis2BaseUrl}/dhis-web-tracker-capture/index.html#/dashboard?tei=${teiId}&program=${config.program.id}&ou=${orgUnitId}`
```

This would allow users to view/edit the record in Tracker Capture directly.

## Testing Checklist

To verify our implementation matches Tracker Capture behavior:

1. ✅ **TEI Creation**
   - [x] Creates new TEI when System ID/UUIC don't exist
   - [x] Finds existing TEI when System ID/UUIC exist
   - [x] Handles 409 conflicts correctly

2. ✅ **Enrollment Creation**
   - [x] Creates new enrollment when TEI not enrolled
   - [x] Finds existing enrollment when TEI already enrolled
   - [x] Handles 409 conflicts correctly

3. ✅ **Event Creation**
   - [x] Creates event with correct program stage
   - [x] Includes all data values
   - [x] Sets status to COMPLETED
   - [x] Links to correct enrollment

4. ⚠️ **Data Values**
   - [x] Maps form fields to data elements correctly
   - [x] Handles option sets correctly
   - [x] Handles boolean values correctly
   - [x] Includes risk screening result and score
   - [ ] Verify all data values appear in Tracker Capture

5. ⚠️ **Risk Screening Result**
   - [x] Calculates risk score correctly
   - [x] Determines risk level correctly
   - [x] Maps to option set code if applicable
   - [ ] Verify risk result appears in Tracker Capture

## Conclusion

Our implementation **correctly follows the DHIS2 Tracker Capture flow**:
1. ✅ Create/Find TEI
2. ✅ Create/Find Enrollment
3. ✅ Create Event with Data Values

The main areas for improvement are:
1. Event date handling (remove random offset)
2. Better error messages for conflicts
3. Generate Tracker Capture URLs after submission
4. Consider event updates instead of always creating new events

Overall, our implementation is **well-aligned with DHIS2 Tracker Capture** and should work correctly when viewing records in the Tracker Capture app.

