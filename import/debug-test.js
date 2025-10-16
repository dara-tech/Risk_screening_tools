#!/usr/bin/env node

/**
 * Debug test to check if the code changes are working
 */

console.log('🔍 Debug Test - Checking Code Changes\n')

// Check if the testUtils.js file has the latest changes
const fs = require('fs')
const path = require('path')

const testUtilsPath = path.join(__dirname, 'src/lib/testUtils.js')
const testUtilsContent = fs.readFileSync(testUtilsPath, 'utf8')

console.log('📁 Checking testUtils.js for latest changes:')

// Check for the debugging console.log statements
const hasOrgUnitDebug = testUtilsContent.includes("console.log('🔍 Fetching organization units for TEI query...')")
const hasEventDebug = testUtilsContent.includes("console.log('🔍 Event creation response:', response)")

console.log(`✅ Organization unit debugging: ${hasOrgUnitDebug ? 'PRESENT' : 'MISSING'}`)
console.log(`✅ Event creation debugging: ${hasEventDebug ? 'PRESENT' : 'MISSING'}`)

// Check for the orgUnit parameter in the query
const hasOrgUnitParam = testUtilsContent.includes('orgUnit: orgUnitId')
console.log(`✅ Organization unit parameter: ${hasOrgUnitParam ? 'PRESENT' : 'MISSING'}`)

// Check for minimal event creation
const hasMinimalEvent = testUtilsContent.includes('dataValues: [] // Start with empty data values')
console.log(`✅ Minimal event creation: ${hasMinimalEvent ? 'PRESENT' : 'MISSING'}`)

console.log('\n🎯 If all checks show PRESENT, the code has been updated correctly.')
console.log('🔄 If any show MISSING, there might be a caching issue or the changes weren\'t saved.')

if (hasOrgUnitDebug && hasEventDebug && hasOrgUnitParam && hasMinimalEvent) {
  console.log('\n✅ All changes are present! The issue might be browser caching.')
  console.log('💡 Try:')
  console.log('   1. Hard refresh the browser (Ctrl+F5 or Cmd+Shift+R)')
  console.log('   2. Clear browser cache')
  console.log('   3. Check browser console for the debugging messages')
} else {
  console.log('\n❌ Some changes are missing. The code may not have been updated properly.')
}
