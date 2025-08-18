# STI Risk Screening Application

A comprehensive STI (Sexually Transmitted Infections) risk screening and data management application built for DHIS2.

## Features

- **Risk Assessment**: Comprehensive STI risk evaluation
- **Data Management**: View and manage screening records
- **Multi-language Support**: English and Khmer (ខ្មែរ) localization
- **Export Functionality**: Export data to CSV format
- **User-friendly Interface**: Modern, responsive design

## Localization

This application supports multiple languages:

- **English (en)**: Default language
- **Khmer (km)**: ភាសាខ្មែរ - Full Khmer translation available

### How to Switch Languages

The application will automatically detect the user's locale from DHIS2 settings. To change the language:

1. Go to your DHIS2 user profile
2. Set your locale to "km" for Khmer or "en" for English
3. Refresh the application

### Translation Files

- `i18n/en.pot`: English translation template
- `i18n/km.po`: Khmer translations

## Development

### Prerequisites

- Node.js (v16 or higher)
- DHIS2 instance

### Installation

```bash
npm install
```

### Development Server

```bash
npm start
```

### Building for Production

```bash
npm run build
```

### Adding New Translations

1. Add new strings using `i18n.t('Your String')` in the code
2. Run `npm run build` to extract new strings to `i18n/en.pot`
3. Update `i18n/km.po` with Khmer translations
4. Rebuild the application

## Project Structure

```
src/
├── components/          # React components
│   ├── forms/          # Form components
│   ├── ui/             # UI components
│   └── Layout.jsx      # Main layout
├── pages/              # Page components
│   └── ScreeningList.jsx
├── lib/                # Utility libraries
└── App.jsx             # Main application
```

## DHIS2 Integration

This application integrates with DHIS2 using:
- Tracked Entity Instances for person data
- Program Stages for screening events
- Organization Units for data access control

## License

BSD-3-Clause
