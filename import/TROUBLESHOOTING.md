# API Testing Troubleshooting Guide

## Current Issue: Tests Still Failing Despite Code Fixes

### Problem Description
The API tests are still showing the same errors even after applying fixes:
- GET Tracked Entity Instances: "At least one organisation unit must be specified"
- POST Create Event: "An error occurred, please check import summary"

### Root Cause Analysis
The code changes have been applied correctly, but the web interface may be using cached JavaScript modules.

### Solutions

#### 1. Browser Cache Issue (Most Likely)
**Symptoms**: Code changes are present but tests still fail with old error messages

**Solutions**:
1. **Hard Refresh**: Press `Ctrl+F5` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. **Clear Browser Cache**: 
   - Chrome: Settings → Privacy → Clear browsing data → Cached images and files
   - Firefox: Settings → Privacy → Clear Data → Cached Web Content
3. **Disable Cache in DevTools**:
   - Open DevTools (F12)
   - Go to Network tab
   - Check "Disable cache" checkbox
   - Keep DevTools open while testing

#### 2. Module Caching Issue
**Symptoms**: JavaScript modules not reloading with latest changes

**Solutions**:
1. **Restart Development Server**:
   ```bash
   # Stop the current server (Ctrl+C)
   npm start
   ```

2. **Clear Node Modules Cache**:
   ```bash
   rm -rf node_modules/.cache
   npm start
   ```

3. **Force Module Reload**:
   - Add a timestamp to the import to force reload
   - Or restart the browser completely

#### 3. Verify Code Changes
**Check if fixes are applied**:
```bash
node debug-test.js
```

This will verify that all code changes are present.

#### 4. Debug Information
**Check browser console** for debugging messages:
- Look for `🔍 Fetching organization units for TEI query...`
- Look for `🔍 Using organization unit for TEI query: [orgUnitId]`
- Look for `🔍 Event creation response:` and `🔍 Event creation summary:`

### Expected Debug Output
If the fixes are working, you should see in the browser console:
```
🔄 Loading latest test utilities...
🔍 Fetching organization units for TEI query...
🔍 Found organization units: [number]
🔍 Using organization unit for TEI query: [orgUnitId]
🔍 Querying tracked entity instances with org unit: [orgUnitId]
🔍 Event creation response: [response object]
🔍 Event creation summary: [summary object]
```

### Alternative Testing Method
If browser caching persists, use the command-line version:
```bash
npm run test:api:verbose
```

This bypasses browser caching and uses the latest code directly.

### Verification Steps
1. Run `node debug-test.js` - should show all changes present
2. Hard refresh browser (Ctrl+F5)
3. Check browser console for debug messages
4. Run tests again
5. If still failing, try command-line version

### If All Else Fails
1. **Complete Cache Clear**:
   ```bash
   # Clear all caches
   rm -rf node_modules/.cache
   rm -rf build/
   npm start
   ```

2. **Browser Reset**:
   - Clear all browser data
   - Restart browser
   - Try in incognito/private mode

3. **Check Network Tab**:
   - Open DevTools → Network tab
   - Look for the actual API requests
   - Verify the orgUnit parameter is being sent

### Expected Results After Fix
- ✅ GET Tracked Entity Instances: Should show "Successfully fetched X tracked entity instances using org unit [ID]"
- ✅ POST Create Event: Should show "Successfully created event: [eventId]"
- ✅ POST Create Enrollment: Should show "Successfully created enrollment: [enrollmentId]"
- ✅ PUT/DELETE Operations: Should work with created records

### Contact Information
If issues persist after trying all solutions, the problem may be:
1. DHIS2 server configuration
2. User permissions
3. Program/attribute configuration
4. Network connectivity

Check the browser console and network tab for detailed error information.
