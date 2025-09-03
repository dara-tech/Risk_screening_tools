# STI Risk Screening Tool - DHIS2 App

A DHIS2 application for managing STI (Sexually Transmitted Infections) risk screening data with import capabilities and record management.

## Features

- **Risk Screening Tool**: Interactive form for entering STI screening data
- **Import Tool**: Bulk import data from CSV files
- **Records List**: View, edit, and manage existing records
- **Multi-language Support**: English and Khmer (ខ្មែរ)
- **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

- Node.js (v16 or higher)
- DHIS2 instance (local or remote)
- Modern web browser

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sti
```

2. Install dependencies:
```bash
npm install
```

## Development

### Starting the Development Server

```bash
npm start
```

The app will be available at `http://localhost:3001` (or the next available port).

### Building for Production

```bash
npm run build
```

## DHIS2 Configuration

### Local Development

For local development, the app expects a DHIS2 instance running on `http://localhost:8080`. 

To set up a local DHIS2 instance:

1. Download DHIS2 from [dhis2.org](https://www.dhis2.org/download)
2. Follow the [installation guide](https://docs.dhis2.org/en/develop/getting-started/installation.html)
3. Start DHIS2 on port 8080
4. Create a user with appropriate permissions

### Remote DHIS2 Instance

To connect to a remote DHIS2 instance:

1. Deploy the built app to your DHIS2 server
2. Configure the base URL in your DHIS2 instance
3. Ensure proper CORS settings if needed

## Troubleshooting

### Connection Issues

If you see "Failed to load organisation units" or network errors:

1. **Check DHIS2 Server Status**:
   - Ensure DHIS2 is running and accessible
   - Verify the server URL (default: `http://localhost:8080`)

2. **Authentication Issues**:
   - Check your DHIS2 credentials
   - Ensure you have permission to access organization units

3. **Network Issues**:
   - Check your internet connection
   - Verify firewall settings
   - Check CORS configuration if accessing from a different domain

4. **Development Mode**:
   - The app shows connection status in development mode
   - Check the connection status banner for specific error details

### Common Error Messages

- **"Network error: Unable to connect to DHIS2 server"**: DHIS2 server is not running or not accessible
- **"Authentication error"**: Invalid credentials or session expired
- **"Access denied"**: Insufficient permissions to access the requested resource
- **"Server error: DHIS2 API endpoint not found"**: Incorrect server configuration

### Icon Errors

If you see "Can't find variable: FiRefreshCw" errors:
- This has been fixed in the latest version
- Ensure you're using the latest code

## File Structure

```
sti/
├── src/
│   ├── components/          # React components
│   ├── pages/              # Page components
│   ├── lib/                # Utilities and configuration
│   ├── locales/            # Internationalization files
│   └── App.jsx             # Main app component
├── build/                  # Production build
├── d2.config.js           # DHIS2 app configuration
└── package.json           # Dependencies and scripts
```

## Configuration

The app uses several configuration files:

- `src/lib/config.js`: Application configuration including DHIS2 program IDs
- `d2.config.js`: DHIS2 app runtime configuration
- `tailwind.config.js`: Styling configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the BSD-3-Clause License.

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the DHIS2 documentation
3. Create an issue in the repository
