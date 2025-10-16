# DHIS2 API Testing Guide

This document describes how to test all CRUD operations (GET, POST, PUT, DELETE) for the DHIS2 Risk Screening Tool.

## Overview

The testing suite includes:
- **GET Operations**: Fetching organization units, programs, tracked entity types, data elements, events, and tracked entity instances
- **POST Operations**: Creating tracked entity instances, enrollments, and events
- **PUT Operations**: Updating events and tracked entity instances
- **DELETE Operations**: Removing events and tracked entity instances

## Testing Methods

### 1. Web Interface Testing

Access the API test runner through the web interface:

1. Start the application: `npm start`
2. Navigate to `/api-tests` in your browser
3. Click "Run All Tests" to execute the complete test suite
4. View detailed results and logs

### 2. Command Line Testing

Run tests from the command line using Node.js:

```bash
# Basic test run
npm run test:api

# Verbose output with detailed logs
npm run test:api:verbose

# Show help and available options
npm run test:api:help

# Custom DHIS2 server configuration
node test-api.js --url https://your-dhis2-server.com --username admin --password yourpassword
```

### 3. Programmatic Testing

Use the test utilities in your own code:

```javascript
import { useDataEngine } from '@dhis2/app-runtime'
import DHIS2APITester from './lib/testUtils'

const MyComponent = () => {
  const engine = useDataEngine()
  
  const runTests = async () => {
    const tester = new DHIS2APITester(engine)
    const results = await tester.runAllTests()
    console.log('Test results:', results)
  }
  
  return <button onClick={runTests}>Run Tests</button>
}
```

## Test Configuration

The tests use the configuration from `src/lib/config.js`:

- **Program ID**: `gmO3xUubvMb` (STI Risk Screening Tool)
- **Program Stage ID**: `hqJKFmOU6s7`
- **Tracked Entity Type**: `MCPQUTHX1Ze`

## Test Data

Tests generate unique test data for each run:
- System ID: `TEST_{timestamp}`
- UUIC: `UUIC_{timestamp}`
- Other fields use predefined test values

## Test Results

### Success Indicators
- ✅ **PASS**: Operation completed successfully
- ❌ **FAIL**: Operation failed with error details
- ⏭️ **SKIP**: Test skipped due to missing prerequisites

### Metrics Tracked
- Total number of tests
- Passed/Failed/Skipped counts
- Success rate percentage
- Execution duration

## Command Line Options

| Option | Description | Default |
|--------|-------------|---------|
| `--url` | DHIS2 server URL | `http://localhost:8080` |
| `--username` | Username | `admin` |
| `--password` | Password | `district` |
| `--verbose` | Enable detailed logging | `false` |
| `--help` | Show help message | - |

## Example Output

```
🚀 Starting DHIS2 API Tests...

=== TESTING GET OPERATIONS ===
✅ GET Organization Units: Successfully fetched 5 organization units
✅ GET Programs: Successfully fetched 3 programs
✅ GET Tracked Entity Types: Successfully fetched 2 tracked entity types
✅ GET Data Elements: Successfully fetched 150 data elements
✅ GET Events: Successfully fetched 10 events

=== TESTING POST OPERATIONS ===
✅ POST Create Tracked Entity Instance: Successfully created tracked entity instance: ABC123
✅ POST Create Event: Successfully created event: DEF456

=== TESTING PUT OPERATIONS ===
✅ PUT Update Event: Successfully updated event: DEF456

=== TESTING DELETE OPERATIONS ===
✅ DELETE Event: Successfully deleted event: DEF456
✅ DELETE Tracked Entity Instance: Successfully deleted tracked entity instance: ABC123

==================================================
TEST SUMMARY
==================================================
Total Tests: 10
Passed: 10
Failed: 0
Skipped: 0
Success Rate: 100.00%
Duration: 2500ms
==================================================
```

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check DHIS2 server URL and credentials
   - Verify network connectivity
   - Ensure DHIS2 server is running

2. **Authentication Failed**
   - Verify username and password
   - Check user permissions in DHIS2
   - Ensure user has access to required programs

3. **Permission Denied**
   - Check user roles and permissions
   - Verify access to organization units
   - Ensure user can create/update/delete data

4. **Test Data Conflicts**
   - Tests use unique timestamps to avoid conflicts
   - If conflicts occur, check for existing test data
   - Clean up test data manually if needed

5. **Organization Unit Required Error**
   - **Fixed**: GET tracked entity instances now automatically includes an organization unit parameter
   - The test will fetch available organization units and use the first one for queries

6. **Invalid Attribute Error**
   - **Fixed**: Tests now use only basic, validated attributes (System ID, UUIC, Family Name, Last Name, Sex, Date of Birth)
   - Problematic attributes with invalid option sets have been removed from test data

7. **Option Set Validation Error**
   - **Fixed**: Test data now uses only basic values that are likely to be valid
   - Complex attributes with specific option set requirements are excluded from tests

### Debug Mode

Enable verbose logging to see detailed request/response data:

```bash
npm run test:api:verbose
```

This will show:
- Full API request payloads
- Complete response data
- Error details and stack traces
- Timing information

## Cleanup

The test suite automatically cleans up test data it creates:
- Events are deleted after testing
- Tracked entity instances are removed
- No permanent test data is left behind

If cleanup fails, you may need to manually remove test data from DHIS2.

## Integration with CI/CD

The command-line test script returns appropriate exit codes:
- `0`: All tests passed
- `1`: One or more tests failed

This makes it suitable for integration with CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Test DHIS2 API
  run: |
    npm run test:api
    if [ $? -ne 0 ]; then
      echo "API tests failed"
      exit 1
    fi
```

## Security Notes

- Test credentials should use a dedicated test user account
- Test user should have minimal required permissions
- Consider using a separate DHIS2 instance for testing
- Never use production credentials for testing

## Support

For issues with the testing suite:
1. Check the troubleshooting section above
2. Review the verbose logs for detailed error information
3. Verify your DHIS2 configuration and permissions
4. Check the application logs for additional context
