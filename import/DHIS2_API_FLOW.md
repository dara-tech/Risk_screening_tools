# DHIS2 API Flow - Where Data Goes

## Answer: YES, We POST to Events API! ✅

## Complete Flow

### Step 1: Create/Find TEI (Person)
```
POST /api/trackedEntityInstances
```
- **Purpose**: Create or find the person
- **Contains**: Personal attributes (System ID, UUIC, Name, etc.)
- **Result**: TEI ID

### Step 2: Create/Find Enrollment (Link Person to Program)
```
POST /api/enrollments
```
- **Purpose**: Link TEI to Program
- **Contains**: Only enrollment metadata (dates)
- **Does NOT contain form data**
- **409 Error**: Expected if enrollment already exists (handled automatically)
- **Result**: Enrollment ID

### Step 3: Create Event ⭐ **THIS IS WHERE FORM DATA GOES**
```
POST /api/events  ← FORM DATA POSTED HERE!
```
- **Purpose**: Store form answers (data values)
- **Contains**: All form data in `dataValues` array
- **Result**: Event ID

## Event API Payload Structure

```javascript
POST /api/events
{
  "events": [{
    "trackedEntityInstance": "eYCn62HtBcE",  // Person ID
    "program": "gmO3xUubvMb",                // Program ID
    "programStage": "hqJKFmOU6s7",          // Program Stage ID
    "orgUnit": "nfydoYGorfL",                // Organization Unit
    "enrollment": "enrollmentId123",         // Enrollment ID (from step 2)
    "eventDate": "2026-01-15",
    "status": "COMPLETED",
    "dataValues": [                          // ⭐ FORM DATA GOES HERE
      { "dataElement": "MBizmGFOeZg", "value": "High" },
      { "dataElement": "eEY6HLGq5FF", "value": "35" },
      { "dataElement": "HZzeCzQOuvh", "value": "Yes" },
      // ... all other form answers
    ]
  }]
}
```

## Why We Need Enrollment First

In DHIS2 Tracker, you **MUST** have an enrollment before creating an event:
- Event requires `enrollment` field
- Enrollment links person (TEI) to program
- Without enrollment, event creation will fail

## About the 409 Error

The 409 on enrollments is:
- ✅ **Expected** - happens when enrollment already exists
- ✅ **Handled** - code finds existing enrollment automatically
- ✅ **Not a problem** - doesn't prevent event creation
- ⚠️ **Browser logs it** - but it's handled, so submission continues

## Our Implementation

```javascript
// Step 1: Create/Find TEI
const teiId = await createOrFindTEI(...)

// Step 2: Create/Find Enrollment (409 may occur here - that's OK!)
const enrollmentId = await createOrFindEnrollment(teiId, ...)
// If 409: code finds existing enrollment automatically

// Step 3: POST to Events API ⭐ FORM DATA GOES HERE
await engine.mutate({
    resource: 'events',  // ← POST /api/events
    type: 'create',
    data: {
        events: [{
            trackedEntityInstance: teiId,
            program: config.program.id,
            programStage: config.program.stageId,
            enrollment: enrollmentId,
            dataValues: validDataValues  // ← ALL FORM DATA HERE
        }]
    }
})
```

## Summary

1. ✅ **We DO post to Events API** - that's where form data goes
2. ✅ **Enrollment is required first** - DHIS2 requires it
3. ✅ **409 on enrollment is expected** - handled automatically
4. ✅ **Event creation is separate** - happens after enrollment

The form data (dataValues) is posted to `/api/events`, not to enrollments!

