# RecordsList Data Source and Update Verification

## Data Fetching Analysis

### ✅ Data Sources (Correct)

1. **Events API** (`/api/events`)
   - **Program**: `gmO3xUubvMb` ✅
   - **Program Stage**: `hqJKFmOU6s7` ✅
   - **Fields Fetched**: `event`, `eventDate`, `orgUnit`, `trackedEntityInstance`, `enrollment`, `dataValues[dataElement,value]` ✅
   - **Filtering**: By orgUnit, startDate, endDate ✅
   - **Pagination**: Page-based with pageSize ✅

2. **Tracked Entity Instances API** (`/api/trackedEntityInstances`)
   - **Tracked Entity Type**: `MCPQUTHX1Ze` ✅
   - **Fields Fetched**: `trackedEntityInstance`, `attributes[attribute,value]` ✅
   - **Batching**: Max 50 per request ✅

### ✅ Field Mappings (Verified)

**Tracked Entity Attributes:**
- System_ID: `n0KF6wMqMOP` ✅
- UUIC: `e5FXJFKQyuB` ✅
- Family_Name: `gJXkrAyY061` ✅
- Last_Name: `KN6AR1YuTDn` ✅
- Sex: `BR1fUe7Nx8V` ✅
- DOB: `FmWxUZurqA8` ✅
- Province: `Kd68BViw8AF` ✅
- OD: `YxKunRADsZs` ✅
- District: `fW4E5W7ePjy` ✅
- Commune: `f6ztgUdD9RV` ✅

**Program Stage Data Elements:**
All mappings verified against config ✅

## Update Logic Analysis

### ✅ TEI Attribute Updates (Correct)

**Endpoint**: `PUT /api/trackedEntityInstances/{teiId}`
**Payload**: 
```json
{
  "attributes": [{
    "attribute": "attributeId",
    "value": "normalizedValue"
  }]
}
```

**Fields Supported:**
- systemId, uuic, familyName, lastName, sex, dateOfBirth ✅
- province, od, district, commune ✅
- donor, ngo ✅

### ✅ Event Data Element Updates (Correct)

**Endpoint**: `PUT /api/events/{eventId}`
**Process**:
1. Fetch current event ✅
2. Update/add data value in dataValues array ✅
3. Submit full event update ✅

**Fields Supported:**
All program stage data elements ✅

### ⚠️ Issues Found

1. **Missing `partnerTGM` in boolean fields list** (line 930)
   - Currently missing from `booleanFields` array
   - Should be included for proper normalization

2. **Option Set Mapping**
   - Update logic maps display values to option codes ✅
   - But needs to verify all option sets are loaded correctly

3. **Risk Screening Result Update**
   - Currently updates as text value ✅
   - Should verify if it has option set and map accordingly

## Recommendations

1. ✅ Add `partnerTGM` to boolean fields list
2. ✅ Verify option set loading for all data elements
3. ✅ Add better error handling for option set mapping failures
4. ✅ Consider caching option sets to reduce API calls

