# DHIS2 Tracker Structure - Where Data Goes

## Answer: We Submit Data to **EVENTS**, Not Enrollments

## DHIS2 Tracker Hierarchy

```
Tracked Entity Instance (TEI)
    └── Person/Entity (e.g., a patient)
        ├── Attributes (Personal Info)
        │   ├── System ID
        │   ├── UUIC
        │   ├── Family Name
        │   ├── Last Name
        │   ├── Sex
        │   ├── Date of Birth
        │   └── Location (Province, District, etc.)
        │
        └── Enrollment (Links TEI to Program)
            └── Links person to a specific program
                └── Event (Contains Form Data)
                    └── Data Values (Form Answers)
                        ├── Risk Screening Score
                        ├── Risk Screening Result
                        ├── Sexual Health Concerns
                        ├── Partner Information
                        └── All other form fields
```

## What Goes Where?

### 1. **Tracked Entity Instance (TEI)**
- **Contains**: Personal attributes (System ID, UUIC, Name, Sex, DOB, Location)
- **Purpose**: Represents the person/entity
- **API**: `POST /api/trackedEntityInstances`
- **Example**:
```json
{
  "trackedEntityInstances": [{
    "trackedEntityType": "MCPQUTHX1Ze",
    "orgUnit": "nfydoYGorfL",
    "attributes": [
      { "attribute": "n0KF6wMqMOP", "value": "SYS001" },
      { "attribute": "e5FXJFKQyuB", "value": "កយសត1150690" }
    ]
  }]
}
```

### 2. **Enrollment**
- **Contains**: Links TEI to Program (enrollmentDate, incidentDate)
- **Purpose**: Connects person to a program
- **API**: `POST /api/enrollments`
- **Does NOT contain form data**
- **Example**:
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

### 3. **Event** ⭐ **THIS IS WHERE FORM DATA GOES**
- **Contains**: Data Values (all form answers)
- **Purpose**: Stores the actual screening data
- **API**: `POST /api/events`
- **Example**:
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
      { "dataElement": "MBizmGFOeZg", "value": "High" },
      { "dataElement": "eEY6HLGq5FF", "value": "35" },
      { "dataElement": "HZzeCzQOuvh", "value": "Yes" }
    ]
  }]
}
```

## Our Implementation Flow

### Step 1: Create/Find TEI
```javascript
// Personal information (attributes)
POST /api/trackedEntityInstances
```

### Step 2: Create/Find Enrollment
```javascript
// Link TEI to Program (no form data here)
POST /api/enrollments
```

### Step 3: Create Event ⭐ **FORM DATA GOES HERE**
```javascript
// All form answers (data values) go here
POST /api/events
{
  dataValues: [
    { dataElement: "...", value: "..." },
    { dataElement: "...", value: "..." }
  ]
}
```

## Key Points

1. ✅ **Form Data → Events**: All form answers (data values) are submitted to Events
2. ✅ **Enrollment is Just a Link**: Enrollment only connects TEI to Program, no form data
3. ✅ **TEI Has Attributes**: Personal info (name, ID, location) goes to TEI attributes
4. ✅ **One Enrollment, Multiple Events**: A person can have one enrollment but multiple events (different dates/stages)

## Why the 409 Error on Enrollment?

The 409 error you see is **normal and expected** when:
- The TEI already has an enrollment in the program
- DHIS2 returns 409 (Conflict) but the enrollment exists
- Our code handles this by finding the existing enrollment

This is **not an error** - it's DHIS2's way of saying "enrollment already exists, use the existing one."

## Summary

**Question**: Do we submit to event or enrollment?

**Answer**: **EVENTS** - All form data (data values) are submitted to Events. Enrollment is just a link between the person (TEI) and the program.

