# RiskScreeningTool Verification

## Issues Found

### 1. Missing `partnerTGM` Mapping ✅ FIXED
- **Issue**: `partnerTGM` field exists in formData but was not mapped in `fetchProgramStageDetails`
- **Fix**: Added mapping for `partnerTGM` data element
- **Status**: ✅ Fixed

### 2. Risk Screening Score/Result Not Included in Save
- **Issue**: Risk screening score and result are calculated but may not be included in dataValues if field mappings don't exist
- **Current Behavior**: 
  - `calculateRiskScore()` returns `{ score, riskLevel, riskFactors, recommendations }`
  - These are merged into `finalData` but only saved if field mappings exist
  - Field mappings are dynamically created from API, so if data element names don't match, they won't be saved

### 3. Missing Risk Screening Data in Save
- **Issue**: Risk screening score and result need to be explicitly included in finalData
- **Fix Needed**: Ensure `riskScreeningScore` and `riskScreeningResult` are included in finalData before saving

## Recommendations

1. ✅ Add `partnerTGM` mapping (DONE)
2. ⚠️ Ensure risk screening score and result are always included in save
3. ⚠️ Add fallback to config.mapping if dynamic mapping fails
4. ⚠️ Add logging to show which fields are being saved

## Current Save Flow

1. Calculate risk score → `calculateRiskScore()`
2. Merge with formData → `finalData = { ...formData, ...riskData }`
3. Create TEI → `prepareTrackedEntityAttributes(finalData)`
4. Create Enrollment
5. Create Event → Uses `fieldMappings` to map form fields to data elements
6. **Issue**: If `riskScreeningScore` or `riskScreeningResult` are not in `fieldMappings`, they won't be saved

## Solution

Ensure risk screening data is explicitly included:
```javascript
const finalData = { 
    ...formData, 
    ...riskData,
    riskScreeningScore: riskData.score || formData.riskScreeningScore || 0,
    riskScreeningResult: riskData.riskLevel || formData.riskScreeningResult || 'Low'
}
```

